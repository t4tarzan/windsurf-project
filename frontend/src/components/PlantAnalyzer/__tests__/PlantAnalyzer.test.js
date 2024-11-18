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
const mockFileReader = {
  readAsDataURL: jest.fn(),
  onloadend: null,
  result: 'data:image/png;base64,mockImageData'
};

window.FileReader = jest.fn().mockImplementation(() => mockFileReader);

// Mock Image
const mockImage = {
  src: '',
  onload: null,
};

window.Image = jest.fn().mockImplementation(() => mockImage);

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
      mockFileReader.onloadend();
      // Simulate image load
      mockImage.onload();
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
      mockImage.onload();
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
      mockFileReader.onloadend();
      mockImage.onload();
    });

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to analyze image/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('resets analyzer state', async () => {
    render(<PlantAnalyzer />);

    // Wait for model to initialize
    await waitFor(() => {
      expect(screen.getByText(/Upload a photo or use your camera/i)).toBeInTheDocument();
    });

    // Upload a file and get analysis result
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, file);
      mockFileReader.onloadend();
      mockImage.onload();
    });

    // Wait for result
    await waitFor(() => {
      expect(screen.getByText(mockAnalysisResult.plantType)).toBeInTheDocument();
    });

    // Click reset button
    const resetButton = screen.getByTestId('reset-button');
    await act(async () => {
      await userEvent.click(resetButton);
    });

    // Verify reset
    await waitFor(() => {
      expect(screen.queryByText(mockAnalysisResult.plantType)).not.toBeInTheDocument();
      expect(screen.getByText(/Upload a photo or use your camera/i)).toBeInTheDocument();
    });
  });
});
