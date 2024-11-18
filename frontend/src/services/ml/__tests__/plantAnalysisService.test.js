import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import plantAnalysisService from '../plantAnalysisService';

// Mock TensorFlow.js
jest.mock('@tensorflow/tfjs', () => ({
  browser: {
    fromPixels: jest.fn(),
  },
  div: jest.fn(),
  mean: jest.fn(),
}));

// Mock MobileNet
jest.mock('@tensorflow-models/mobilenet', () => ({
  load: jest.fn(),
}));

describe('Plant Analysis Service', () => {
  const mockModel = {
    classify: jest.fn(),
  };

  const mockImageElement = {
    width: 224,
    height: 224,
  };

  const mockPredictions = [
    { className: 'pot plant', probability: 0.8 },
    { className: 'flower', probability: 0.15 },
    { className: 'other', probability: 0.05 },
  ];

  const mockTensor = {
    dispose: jest.fn(),
    data: jest.fn().mockResolvedValue([0.2, 0.6, 0.3]), // RGB values
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup TensorFlow mocks
    tf.browser.fromPixels.mockReturnValue(mockTensor);
    tf.div.mockReturnValue(mockTensor);
    tf.mean.mockReturnValue(mockTensor);

    // Setup MobileNet mock
    mobilenet.load.mockResolvedValue(mockModel);
    mockModel.classify.mockResolvedValue(mockPredictions);
  });

  test('initializes successfully', async () => {
    await plantAnalysisService.initialize();
    expect(mobilenet.load).toHaveBeenCalled();
  });

  test('analyzes image correctly', async () => {
    await plantAnalysisService.initialize();
    const result = await plantAnalysisService.analyzeImage(mockImageElement);

    expect(result).toHaveProperty('plantName');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('healthScore');
    expect(result).toHaveProperty('issues');
    expect(result).toHaveProperty('recommendations');
    expect(result).toHaveProperty('conditions');
  });

  test('processes predictions correctly', () => {
    const result = plantAnalysisService.processResults(mockPredictions);
    
    expect(result).toEqual({
      plantName: 'House Plant',
      confidence: 80,
      originalClassification: 'pot plant',
    });
  });

  test('handles unknown plants', () => {
    const unknownPredictions = [
      { className: 'unknown object', probability: 0.8 },
    ];

    const result = plantAnalysisService.processResults(unknownPredictions);
    
    expect(result.plantName).toBe('Unknown Plant');
  });

  test('analyzes health correctly', async () => {
    const healthResult = await plantAnalysisService.analyzeHealth(mockImageElement);

    expect(healthResult).toHaveProperty('healthScore');
    expect(healthResult).toHaveProperty('issues');
    expect(healthResult).toHaveProperty('recommendations');
    expect(healthResult).toHaveProperty('conditions');
  });

  test('determines issues correctly', () => {
    // Test yellow leaves detection
    let issues = plantAnalysisService.determineIssues(0.6, 0.6, 0.2);
    expect(issues).toContainEqual(expect.objectContaining({ name: 'Yellow Leaves' }));

    // Test brown spots detection
    issues = plantAnalysisService.determineIssues(0.5, 0.3, 0.3);
    expect(issues).toContainEqual(expect.objectContaining({ name: 'Brown Spots' }));

    // Test wilting detection
    issues = plantAnalysisService.determineIssues(0.1, 0.1, 0.1);
    expect(issues).toContainEqual(expect.objectContaining({ name: 'Wilting' }));
  });

  test('generates recommendations correctly', () => {
    const issues = [
      plantAnalysisService.issuesDatabase.yellowLeaves,
      plantAnalysisService.issuesDatabase.brownSpots,
    ];

    const recommendations = plantAnalysisService.generateRecommendations(issues);
    
    expect(recommendations).toContain('Reduce watering frequency');
    expect(recommendations).toContain('Treat with fungicide');
  });

  test('determines optimal conditions based on health score', () => {
    // Test poor health conditions
    let conditions = plantAnalysisService.determineOptimalConditions(50);
    expect(conditions.water).toContain('Increase watering frequency');
    expect(conditions.sunlight).toContain('Adjust light exposure');

    // Test good health conditions
    conditions = plantAnalysisService.determineOptimalConditions(80);
    expect(conditions.water).toContain('Maintain current watering schedule');
    expect(conditions.sunlight).toContain('6-8 hours of indirect sunlight');
  });

  test('handles errors gracefully', async () => {
    mockModel.classify.mockRejectedValue(new Error('Classification failed'));

    await expect(plantAnalysisService.analyzeImage(mockImageElement))
      .rejects
      .toThrow('Classification failed');
  });

  test('cleans up tensors after analysis', async () => {
    await plantAnalysisService.analyzeHealth(mockImageElement);
    
    expect(mockTensor.dispose).toHaveBeenCalled();
  });
});
