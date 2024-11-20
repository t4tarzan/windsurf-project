import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

class PlantAnalysisService {
  constructor() {
    this.model = null;
    this.plantnetApiKey = process.env.REACT_APP_PLANTNET_API_KEY;
    this.trefleApiKey = process.env.REACT_APP_TREFLE_API_KEY;
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000;
    
    // Initialize the model
    this.initModel();
  }

  async initModel() {
    try {
      this.model = await mobilenet.load();
    } catch (error) {
      console.error('Error loading MobileNet model:', error);
    }
  }

  async analyzeImage(imageFile) {
    try {
      if (!this.model) {
        await this.initModel();
      }

      // Create an HTML image element from the file
      const img = new Image();
      const imageUrl = URL.createObjectURL(imageFile);
      
      const predictions = await new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            // Make predictions using MobileNet
            const tfImg = tf.browser.fromPixels(img);
            const predictions = await this.model.classify(tfImg);
            tfImg.dispose(); // Clean up tensor
            resolve(predictions);
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });

      // Clean up the object URL
      URL.revokeObjectURL(imageUrl);

      // Process the predictions to identify plant-related items
      const plantPredictions = predictions.filter(p => 
        p.className.toLowerCase().includes('plant') ||
        p.className.toLowerCase().includes('flower') ||
        p.className.toLowerCase().includes('tree') ||
        p.className.toLowerCase().includes('leaf')
      );

      if (plantPredictions.length === 0) {
        return {
          error: 'No plants detected in the image. Please upload a clear image of a plant.'
        };
      }

      // Get the most likely plant prediction
      const topPrediction = plantPredictions[0];
      const plantName = this.formatPlantName(topPrediction.className);

      // Generate analysis result
      return {
        name: plantName,
        scientificName: this.generateScientificName(plantName),
        confidence: topPrediction.probability,
        healthAssessment: await this.assessPlantHealth(img),
        careInfo: this.getCareTips(plantName),
        seasonalInfo: this.getSeasonalInfo(plantName),
        commonIssues: this.getCommonIssues(),
        recommendations: this.getRecommendations(plantName)
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  formatPlantName(className) {
    return className
      .split(',')[0]
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async assessPlantHealth(image) {
    // Analyze color distribution for health assessment
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let greenPixels = 0;
    let yellowPixels = 0;
    let brownPixels = 0;
    let totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Check for green pixels (healthy)
      if (g > r + 20 && g > b + 20) {
        greenPixels++;
      }
      // Check for yellow pixels (potential issues)
      else if (r > 150 && g > 150 && b < 100) {
        yellowPixels++;
      }
      // Check for brown pixels (potential disease)
      else if (r > 100 && g < 100 && b < 100) {
        brownPixels++;
      }
    }

    const greenPercentage = (greenPixels / totalPixels) * 100;
    const yellowPercentage = (yellowPixels / totalPixels) * 100;
    const brownPercentage = (brownPixels / totalPixels) * 100;

    const overallHealth = Math.min(100, Math.max(0, 
      greenPercentage - (yellowPercentage + brownPercentage)
    ));

    return {
      overallHealth,
      details: {
        healthyTissue: greenPercentage.toFixed(1) + '%',
        stressedTissue: yellowPercentage.toFixed(1) + '%',
        damagedTissue: brownPercentage.toFixed(1) + '%'
      },
      issues: this.identifyHealthIssues(yellowPercentage, brownPercentage)
    };
  }

  identifyHealthIssues(yellowPercentage, brownPercentage) {
    const issues = [];
    
    if (yellowPercentage > 20) {
      issues.push({
        type: 'Nutrient Deficiency',
        severity: 'Moderate',
        description: 'Yellowing leaves may indicate nutrient deficiencies',
        solutions: [
          'Check soil pH',
          'Apply balanced fertilizer',
          'Ensure proper watering'
        ]
      });
    }

    if (brownPercentage > 15) {
      issues.push({
        type: 'Disease/Damage',
        severity: 'High',
        description: 'Brown spots or areas may indicate disease or damage',
        solutions: [
          'Remove affected leaves',
          'Improve air circulation',
          'Consider fungicide treatment'
        ]
      });
    }

    return issues;
  }

  getCareTips(plantName) {
    // Customize care tips based on plant type
    const generalTips = {
      watering: 'Water when top inch of soil feels dry',
      sunlight: 'Moderate to bright indirect light',
      soil: 'Well-draining potting mix',
      temperature: '65-80°F (18-27°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Monthly during growing season'
    };

    // Add plant-specific modifications here
    if (plantName.toLowerCase().includes('succulent')) {
      return {
        ...generalTips,
        watering: 'Water sparingly, allow soil to dry completely',
        humidity: 'Low humidity preferred'
      };
    }

    if (plantName.toLowerCase().includes('fern')) {
      return {
        ...generalTips,
        watering: 'Keep soil consistently moist',
        humidity: 'High humidity required',
        sunlight: 'Indirect light to partial shade'
      };
    }

    return generalTips;
  }

  getSeasonalInfo(plantName) {
    return {
      growingSeason: ['Spring', 'Summer'],
      floweringSeason: ['Summer'],
      dormancyPeriod: ['Winter'],
      pruningTime: ['Early Spring'],
      fertilizingSchedule: ['Spring', 'Summer']
    };
  }

  getCommonIssues() {
    return [
      {
        name: 'Leaf Yellowing',
        causes: ['Overwatering', 'Nutrient deficiency', 'Poor lighting'],
        solutions: ['Adjust watering schedule', 'Check soil nutrients', 'Modify light exposure']
      },
      {
        name: 'Brown Leaf Tips',
        causes: ['Low humidity', 'Water quality issues', 'Over-fertilization'],
        solutions: ['Increase humidity', 'Use filtered water', 'Reduce fertilizer']
      }
    ];
  }

  getRecommendations(plantName) {
    return [
      'Monitor soil moisture regularly',
      'Rotate plant periodically for even growth',
      'Clean leaves monthly to remove dust',
      'Watch for signs of pest infestation'
    ];
  }

  generateScientificName(commonName) {
    // This is a placeholder. In a real application, you would use a plant database API
    return commonName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

// Create singleton instance
const plantAnalysisService = new PlantAnalysisService();

export const analyzeImage = async (image) => {
  return await plantAnalysisService.analyzeImage(image);
};

export default plantAnalysisService;
