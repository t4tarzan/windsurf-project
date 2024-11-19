import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock Webcam component
const mockGetScreenshot = jest.fn(() => 'data:image/jpeg;base64,mockImageData');

jest.mock('react-webcam', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({
        getScreenshot: mockGetScreenshot
      }));

      // Call onUserMedia if provided
      React.useEffect(() => {
        if (props.onUserMedia) {
          props.onUserMedia();
        }
      }, [props.onUserMedia]);

      return (
        <div data-testid="mock-webcam">
          <video>Mock Webcam</video>
        </div>
      );
    })
  };
});

import PlantAnalyzer from '../PlantAnalyzer';
import * as plantAnalysisService from '../../../services/ml/plantAnalysisService';

// Mock the service
jest.mock('../../../services/ml/plantAnalysisService', () => ({
  initialize: jest.fn().mockResolvedValue(undefined),
  analyzeImage: jest.fn()
}));

// Mock FileReader
class MockFileReader {
  constructor() {
    this.result = 'data:image/png;base64,mockImageData';
    this.onloadend = null;
  }

  readAsDataURL() {
    setTimeout(() => {
      if (this.onloadend) {
        this.onloadend();
      }
    }, 0);
  }
}

window.FileReader = jest.fn().mockImplementation(() => new MockFileReader());

// Mock Image
class MockImage {
  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
}

window.Image = jest.fn().mockImplementation(() => new MockImage());

describe('PlantAnalyzer Component', () => {
  const mockAnalysisResult = {
    plantType: 'Test Plant',
    healthScore: 85,
    issues: ['Minor leaf spots'],
    recommendations: ['Water regularly']
  };

  beforeEach(() => {
    jest.clearAllMocks();
    plantAnalysisService.analyzeImage.mockResolvedValue(mockAnalysisResult);
    mockGetScreenshot.mockClear();
  });

  test('handles file upload', async () => {
    render(<PlantAnalyzer />);
    
    // Wait for model to initialize
    await waitFor(() => {
      expect(screen.getByText(/Upload a photo or use your camera/i)).toBeInTheDocument();
    });

    // Create a mock file
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input');
    
    // Upload file
    await act(async () => {
      await userEvent.upload(input, file);
      // Simulate FileReader
      const fileReader = new window.FileReader();
      fileReader.onloadend = () => {
        // Simulate image load
        const image = new window.Image();
        image.onload = () => {
          // Do nothing
        };
      };
      fileReader.readAsDataURL(file);
    });

    // Verify analysis was triggered
    await waitFor(() => {
      expect(plantAnalysisService.analyzeImage).toHaveBeenCalled();
    });

    // Check if result is displayed
    await waitFor(() => {
      expect(screen.getByText(mockAnalysisResult.plantType)).toBeInTheDocument();
    });
  });

  test('handles camera capture', async () => {
    render(<PlantAnalyzer />);

    // Wait for model to initialize
    await waitFor(() => {
      expect(screen.getByText(/Upload a photo or use your camera/i)).toBeInTheDocument();
    });

    // Click camera button to show webcam
    const showCameraButton = screen.getByText(/Take Photo/i);
    await userEvent.click(showCameraButton);

    // Find and click capture button (the camera icon)
    const captureButton = screen.getByTestId('CameraAltIcon').closest('button');
    await act(async () => {
      await userEvent.click(captureButton);
      // Simulate image load
      const image = new window.Image();
      image.onload = () => {
        // Do nothing
      };
    });

    // Verify screenshot was taken
    expect(mockGetScreenshot).toHaveBeenCalled();

    // Verify analysis was triggered
    await waitFor(() => {
      expect(plantAnalysisService.analyzeImage).toHaveBeenCalled();
    });

    // Check if result is displayed
    await waitFor(() => {
      expect(screen.getByText(mockAnalysisResult.plantType)).toBeInTheDocument();
    });
  });

  test('displays error message when analysis fails', async () => {
    const errorMessage = 'Analysis failed';
    plantAnalysisService.analyzeImage.mockRejectedValue(new Error(errorMessage));

    render(<PlantAnalyzer />);

    // Wait for model to initialize
    await waitFor(() => {
      expect(screen.getByText(/Upload a photo or use your camera/i)).toBeInTheDocument();
    });

    // Create and upload a mock file
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, file);
      const fileReader = new window.FileReader();
      fileReader.onloadend = () => {
        const image = new window.Image();
        image.onload = () => {
          // Do nothing
        };
      };
      fileReader.readAsDataURL(file);
    });

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to analyze image/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('resets analyzer state', async () => {
    // Mock successful analysis
    plantAnalysisService.analyzeImage.mockResolvedValueOnce(mockAnalysisResult);

    // Render component
    render(<PlantAnalyzer />);

    // Upload a file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    // Wait for analysis to complete
    await waitFor(() => {
      expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    });

    // Click reset button
    const resetButton = screen.getByTestId('reset-button');
    await act(async () => {
      await userEvent.click(resetButton);
    });

    // Verify state is reset
    expect(screen.queryByAltText('Uploaded plant')).not.toBeInTheDocument();
    expect(screen.queryByText(/Plant Health Status/i)).not.toBeInTheDocument();
  });
});
