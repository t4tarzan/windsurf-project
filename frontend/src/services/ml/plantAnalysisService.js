import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

class PlantAnalysisService {
  constructor() {
    this.plantnetApiKey = process.env.REACT_APP_PLANTNET_API_KEY;
    this.trefleApiKey = process.env.REACT_APP_TREFLE_API_KEY;
    this.model = null;
    
    // Add rate limiting
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000; // 1 second between requests
    
    // Common plant issues database
    this.issuesDatabase = {
      yellowLeaves: {
        name: 'Yellow Leaves',
        description: 'Leaves are turning yellow',
        severity: 'moderate',
        causes: [
          'Overwatering',
          'Nutrient deficiency',
          'Poor lighting'
        ],
        solutions: [
          'Adjust watering schedule',
          'Check soil nutrients',
          'Ensure proper lighting'
        ]
      },
      brownSpots: {
        name: 'Brown Spots',
        description: 'Brown spots appearing on leaves',
        severity: 'moderate',
        causes: [
          'Fungal infection',
          'Sunburn',
          'Mineral buildup'
        ],
        solutions: [
          'Treat with fungicide',
          'Adjust sun exposure',
          'Flush soil to remove mineral buildup'
        ]
      },
      wilting: {
        name: 'Wilting',
        description: 'Plant appears droopy or wilted',
        severity: 'severe',
        causes: [
          'Underwatering',
          'Root damage',
          'Temperature stress'
        ],
        solutions: [
          'Water immediately',
          'Check root health',
          'Adjust environmental conditions'
        ]
      }
    };

    // Initialize the model when service is created
    this.initialize();
  }

  async initialize() {
    if (!this.model) {
      console.log('Initializing TensorFlow model...');
      try {
        this.model = await mobilenet.load();
        console.log('TensorFlow model loaded successfully');
      } catch (error) {
        console.error('Failed to load TensorFlow model:', error);
        throw error;
      }
    }
    return this.model;
  }

  processResults(predictions) {
    const topPrediction = predictions[0];
    return {
      plantName: topPrediction.className,
      confidence: topPrediction.probability
    };
  }

  async analyzeImage(file) {
    try {
      // Ensure model is initialized
      if (!this.model) {
        await this.initialize();
      }

      // Create an image element from the file
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            // Create a tensor from the image
            const tensor = tf.browser.fromPixels(img);
            const predictions = await this.model.classify(tensor);
            tensor.dispose();

            const { plantName, confidence } = this.processResults(predictions);
            const { healthScore, issues, recommendations } = await this.analyzeHealth(img);

            URL.revokeObjectURL(imageUrl);
            
            resolve({
              plantName,
              confidence,
              healthScore,
              issues,
              recommendations,
              optimalConditions: this.determineOptimalConditions(plantName)
            });
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          reject(new Error('Failed to load image'));
        };

        img.src = imageUrl;
      });
    } catch (error) {
      throw new Error('Failed to analyze plant image: ' + error.message);
    }
  }

  async analyzeHealth(imageElement) {
    try {
      const tensor = tf.browser.fromPixels(imageElement);
      const rgbData = await tensor.data();
      tensor.dispose();

      // Calculate average RGB values
      const pixelCount = rgbData.length / 3;
      const avgRed = rgbData.slice(0, pixelCount).reduce((a, b) => a + b, 0) / pixelCount;
      const avgGreen = rgbData.slice(pixelCount, 2 * pixelCount).reduce((a, b) => a + b, 0) / pixelCount;
      const avgBlue = rgbData.slice(2 * pixelCount).reduce((a, b) => a + b, 0) / pixelCount;

      // Calculate health metrics
      const greenness = avgGreen / (avgRed + avgGreen + avgBlue);
      const healthScore = Math.round(greenness * 100);

      // Determine issues based on color analysis
      const issues = this.determineIssues(avgRed, avgGreen, avgBlue);
      const recommendations = this.generateRecommendations(issues);

      return {
        healthScore,
        issues,
        recommendations
      };
    } catch (error) {
      console.error('Health analysis error:', error);
      return {
        healthScore: 0,
        issues: ['Unable to analyze plant health'],
        recommendations: ['Please try again with a clearer image']
      };
    }
  }

  determineIssues(red, green, blue) {
    const issues = [];
    const yellowThreshold = 200;
    const brownThreshold = 150;

    if (red > yellowThreshold && green > yellowThreshold && blue < yellowThreshold) {
      issues.push(this.issuesDatabase.yellowLeaves);
    }

    if (red > brownThreshold && green < brownThreshold && blue < brownThreshold) {
      issues.push(this.issuesDatabase.brownSpots);
    }

    if (green < 100) {
      issues.push(this.issuesDatabase.wilting);
    }

    return issues;
  }

  generateRecommendations(issues) {
    const recommendations = [];
    issues.forEach(issue => {
      recommendations.push(...issue.solutions);
    });
    return recommendations;
  }

  determineOptimalConditions(plantName) {
    // Default conditions if specific plant not found
    return {
      water: 'Regular watering, keep soil moist but not waterlogged',
      sunlight: 'Moderate to bright indirect light',
      temperature: '65-80°F (18-27°C)',
      humidity: '40-60%',
      soil: 'Well-draining potting mix',
      fertilizer: 'Balanced fertilizer every 2-4 weeks during growing season'
    };
  }
}

// Create singleton instance
const plantAnalysisService = new PlantAnalysisService();

export const analyzeImage = async (image) => {
  return await plantAnalysisService.analyzeImage(image);
};

export default plantAnalysisService;
