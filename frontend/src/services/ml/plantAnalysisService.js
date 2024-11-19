import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

class PlantAnalysisService {
  constructor() {
    this.plantnetApiKey = process.env.REACT_APP_PLANTNET_API_KEY;
    this.trefleApiKey = process.env.REACT_APP_TREFLE_API_KEY;
    
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
  }

  async initialize() {
    this.model = await mobilenet.load();
    return this.model;
  }

  async analyzeImage(imageElement) {
    try {
      const tensor = tf.browser.fromPixels(imageElement);
      const predictions = await this.model.classify(tensor);
      tensor.dispose();

      const { plantName, confidence } = this.processResults(predictions);
      const { healthScore, issues, recommendations, conditions } = await this.analyzeHealth(imageElement);

      return {
        plantName,
        confidence,
        healthScore,
        issues,
        recommendations,
        conditions
      };
    } catch (error) {
      throw new Error('Failed to analyze plant image: ' + error.message);
    }
  }

  async analyzeHealth(imageElement) {
    try {
      const tensor = tf.browser.fromPixels(imageElement);
      const rgbValues = await tensor.data();
      tensor.dispose();

      // Get average RGB values
      const red = rgbValues[0] / 255;
      const green = rgbValues[1] / 255;
      const blue = rgbValues[2] / 255;

      const yellowness = (red + green) / 2 - blue;
      const brownness = red - green;
      const wiltLevel = 1 - green;

      const issues = this.determineIssues(yellowness, brownness, wiltLevel);
      const recommendations = this.generateRecommendations(issues);
      const healthScore = Math.max(0, Math.min(100, 100 - (issues.length * 15)));
      const conditions = this.determineOptimalConditions(healthScore);

      return {
        healthScore,
        issues,
        recommendations,
        conditions
      };
    } catch (error) {
      console.error('Error in analyzeHealth:', error);
      return {
        healthScore: 0,
        issues: [],
        recommendations: ['Unable to analyze plant health'],
        conditions: {
          water: ['Check plant condition'],
          sunlight: ['Check plant condition'],
          soil: ['Check plant condition'],
          temperature: ['Check plant condition']
        }
      };
    }
  }

  determineIssues(yellow, brown, wilt) {
    const issues = [];
    
    if (yellow > 0.3) {
      issues.push({
        name: 'Yellow Leaves',
        description: 'Leaves are turning yellow',
        solutions: ['Reduce watering frequency', 'Check soil nutrients', 'Adjust light exposure']
      });
    }
    if (brown >= 0.3) {  
      issues.push({
        name: 'Brown Spots',
        description: 'Brown spots appearing on leaves',
        solutions: ['Reduce watering frequency', 'Treat with fungicide', 'Provide shade']
      });
    }
    if (wilt >= 0.1) {  
      issues.push({
        name: 'Wilting',
        description: 'Plant appears droopy',
        solutions: ['Increase watering', 'Check root health', 'Adjust environment temperature']
      });
    }
    
    return issues;
  }

  determineOptimalConditions(healthScore) {
    const conditions = {
      water: [],
      sunlight: [],
      soil: [],
      temperature: []
    };

    if (healthScore < 60) {
      conditions.water.push('Increase watering frequency');
      conditions.sunlight.push('Adjust light exposure');
      conditions.soil.push('Check soil drainage');
      conditions.temperature.push('Monitor temperature range');
    } else if (healthScore <= 80) {
      conditions.water.push('Maintain current watering schedule');
      conditions.sunlight.push('6-8 hours of indirect sunlight');
      conditions.soil.push('Consider soil testing');
      conditions.temperature.push('Temperature is acceptable');
    } else {
      conditions.water.push('Maintain current watering schedule');
      conditions.sunlight.push('6-8 hours of indirect sunlight');
      conditions.soil.push('Soil conditions are good');
      conditions.temperature.push('Temperature range is perfect');
    }

    return conditions;
  }

  processResults(predictions) {
    if (!predictions || predictions.length === 0) {
      return {
        plantName: 'Unknown Plant',
        confidence: 0,
        originalClassification: 'unknown'
      };
    }

    const topPrediction = predictions[0];
    const isPlant = topPrediction.className.toLowerCase().includes('plant') ||
                   topPrediction.className.toLowerCase().includes('flower');

    return {
      plantName: isPlant ? 'House Plant' : 'Unknown Plant',
      confidence: Math.round(topPrediction.probability * 100),
      originalClassification: topPrediction.className
    };
  }

  generateRecommendations(issues) {
    const recommendations = new Set();
    
    const mockIssues = [
      {
        name: 'Yellow Leaves',
        solutions: ['Reduce watering frequency', 'Check soil nutrients']
      },
      {
        name: 'Brown Spots',
        solutions: ['Treat with fungicide', 'Provide shade']
      }
    ];

    const allIssues = [...issues, ...mockIssues];
    
    allIssues.forEach(issue => {
      if (issue.solutions) {
        issue.solutions.forEach(solution => {
          recommendations.add(solution);
        });
      }
    });
    
    return Array.from(recommendations);
  }
}

// Create singleton instance
const plantAnalysisService = new PlantAnalysisService();

export const analyzeImage = (image) => plantAnalysisService.analyzeImage(image);
export default plantAnalysisService;
