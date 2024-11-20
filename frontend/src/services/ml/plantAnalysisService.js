import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

class PlantAnalysisService {
  constructor() {
    this.model = null;
    this.modelLoading = null;
    this.plantnetApiKey = process.env.REACT_APP_PLANTNET_API_KEY;
    this.trefleApiKey = process.env.REACT_APP_TREFLE_API_KEY;
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000;
    
    // Initialize the model
    this.initModel();
  }

  async initModel() {
    if (!this.model && !this.modelLoading) {
      this.modelLoading = mobilenet.load();
      try {
        this.model = await this.modelLoading;
        console.log('MobileNet model loaded successfully');
      } catch (error) {
        console.error('Error loading MobileNet model:', error);
        this.model = null;
      }
      this.modelLoading = null;
    }
    return this.model;
  }

  async analyzeImage(imageFile) {
    try {
      // Ensure model is loaded
      if (!this.model) {
        await this.initModel();
        if (!this.model) {
          throw new Error('Failed to initialize image analysis model');
        }
      }

      // Create an HTML image element from the file
      const img = new Image();
      const imageUrl = URL.createObjectURL(imageFile);
      
      const predictions = await new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            // Convert image to tensor
            const tfImg = tf.browser.fromPixels(img);
            // Ensure the image tensor is valid
            if (!tfImg || tfImg.shape.length !== 3) {
              throw new Error('Invalid image format');
            }
            
            // Make predictions using MobileNet
            const predictions = await this.model.classify(tfImg);
            tfImg.dispose(); // Clean up tensor
            resolve(predictions);
          } catch (error) {
            console.error('Error during image classification:', error);
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
      const healthAssessment = await this.assessPlantHealth(img);
      
      return {
        name: plantName,
        scientificName: this.generateScientificName(plantName),
        confidence: Math.round(topPrediction.probability * 100),
        healthAssessment,
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
    try {
      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;
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

        // Improved color detection thresholds
        if (g > Math.max(r, b) && g > 100) {
          greenPixels++;
        }
        else if (r > 150 && g > 150 && b < 100) {
          yellowPixels++;
        }
        else if (r > 100 && g < 150 && b < 100) {
          brownPixels++;
        }
      }

      const greenPercentage = (greenPixels / totalPixels) * 100;
      const yellowPercentage = (yellowPixels / totalPixels) * 100;
      const brownPercentage = (brownPixels / totalPixels) * 100;

      const overallHealth = Math.round(
        Math.min(100, Math.max(0, 
          greenPercentage - (yellowPercentage * 0.5 + brownPercentage)
        ))
      );

      return {
        overallHealth,
        details: {
          healthyTissue: Math.round(greenPercentage) + '%',
          stressedTissue: Math.round(yellowPercentage) + '%',
          damagedTissue: Math.round(brownPercentage) + '%'
        },
        issues: this.identifyHealthIssues(yellowPercentage, brownPercentage)
      };
    } catch (error) {
      console.error('Error assessing plant health:', error);
      return {
        overallHealth: 0,
        details: {
          healthyTissue: '0%',
          stressedTissue: '0%',
          damagedTissue: '0%'
        },
        issues: []
      };
    }
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
    const generalTips = {
      watering: 'Water when top inch of soil feels dry',
      sunlight: 'Moderate to bright indirect light',
      soil: 'Well-draining potting mix',
      temperature: '65-80°F (18-27°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Monthly during growing season'
    };

    const plantType = plantName.toLowerCase();
    if (plantType.includes('succulent') || plantType.includes('cactus')) {
      return {
        ...generalTips,
        watering: 'Water sparingly, allow soil to dry completely',
        humidity: 'Low humidity preferred',
        soil: 'Fast-draining cactus/succulent mix'
      };
    }

    if (plantType.includes('fern')) {
      return {
        ...generalTips,
        watering: 'Keep soil consistently moist',
        humidity: 'High humidity required (60-80%)',
        sunlight: 'Indirect light to partial shade',
        soil: 'Rich, moisture-retaining potting mix'
      };
    }

    if (plantType.includes('orchid')) {
      return {
        ...generalTips,
        watering: 'Water thoroughly then allow to slightly dry',
        humidity: 'High humidity (50-70%)',
        soil: 'Specialized orchid mix',
        fertilizer: 'Weak orchid fertilizer every 2-4 weeks'
      };
    }

    return generalTips;
  }

  getSeasonalInfo(plantName) {
    const plantType = plantName.toLowerCase();
    const defaultInfo = {
      growingSeason: ['Spring', 'Summer'],
      floweringSeason: ['Summer'],
      dormancyPeriod: ['Winter'],
      pruningTime: ['Early Spring'],
      fertilizingSchedule: ['Spring', 'Summer']
    };

    if (plantType.includes('succulent') || plantType.includes('cactus')) {
      return {
        ...defaultInfo,
        growingSeason: ['Spring', 'Summer', 'Fall'],
        floweringSeason: ['Late Spring', 'Summer'],
        dormancyPeriod: ['Winter'],
        pruningTime: ['Spring'],
        fertilizingSchedule: ['Growing Season Only']
      };
    }

    return defaultInfo;
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
      },
      {
        name: 'Wilting',
        causes: ['Underwatering', 'Root problems', 'Temperature stress'],
        solutions: ['Check soil moisture', 'Inspect roots', 'Adjust environment']
      }
    ];
  }

  getRecommendations(plantName) {
    const plantType = plantName.toLowerCase();
    const baseRecommendations = [
      'Monitor soil moisture regularly',
      'Rotate plant periodically for even growth',
      'Clean leaves monthly to remove dust',
      'Watch for signs of pest infestation'
    ];

    if (plantType.includes('succulent') || plantType.includes('cactus')) {
      return [
        'Ensure excellent drainage',
        'Protect from frost',
        'Provide bright, direct sunlight',
        'Water only when soil is completely dry'
      ];
    }

    if (plantType.includes('tropical')) {
      return [
        ...baseRecommendations,
        'Maintain high humidity',
        'Keep away from cold drafts',
        'Consider using a humidity tray'
      ];
    }

    return baseRecommendations;
  }

  generateScientificName(commonName) {
    // This is a placeholder. In a real application, you would use a plant database API
    const words = commonName.toLowerCase().split(' ');
    if (words.length >= 2) {
      return words
        .slice(0, 2)
        .map((word, index) => 
          index === 0 
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word
        )
        .join(' ');
    }
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
