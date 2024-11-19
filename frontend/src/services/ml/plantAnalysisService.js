import axios from 'axios';

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
        description: 'Leaves turning yellow',
        causes: ['Overwatering', 'Nutrient deficiency', 'Poor lighting'],
        solutions: [
          'Reduce watering frequency',
          'Check soil nutrients',
          'Adjust light exposure'
        ]
      },
      brownSpots: {
        name: 'Brown Spots',
        description: 'Brown spots on leaves',
        causes: ['Fungal infection', 'Sunburn', 'Mineral buildup'],
        solutions: [
          'Treat with fungicide',
          'Provide shade',
          'Flush soil with clean water'
        ]
      },
      wilting: {
        name: 'Wilting',
        description: 'Plant appears droopy',
        causes: ['Underwatering', 'Root problems', 'Temperature stress'],
        solutions: [
          'Increase watering',
          'Check root health',
          'Adjust environment temperature'
        ]
      }
    };
  }

  async analyzeImage(imageData) {
    try {
      // For development, return mock data
      const mockData = {
        name: 'Snake Plant',
        scientificName: 'Sansevieria trifasciata',
        confidence: 0.95,
        family: 'Asparagaceae',
        genus: 'Sansevieria',
        images: [
          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg/1200px-Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg'
        ],
        additionalInfo: {
          common_name: 'Snake Plant',
          scientific_name: 'Sansevieria trifasciata',
          family_common_name: 'Asparagus family',
          observations: 'Common houseplant known for air purification'
        },
        detailedInfo: {
          nativeTo: ['West Africa', 'Nigeria', 'Congo'],
          growthHabit: 'Evergreen perennial',
          lightRequirements: 'Low to bright indirect light',
          wateringNeeds: 'Low, drought tolerant',
          soilPreference: 'Well-draining potting mix',
          idealTemperature: '70-90°F (21-32°C)',
          propagationMethods: ['Division', 'Leaf cuttings'],
          toxicity: 'Mildly toxic to pets if ingested',
          edible: false,
          uses: [
            'Air purification',
            'Indoor decoration',
            'Low-maintenance houseplant'
          ]
        },
        uses: {
          medicinal: true,
          medicinalUses: [
            'Traditional medicine for treating coughs',
            'Used in treatments for snake bites',
            'Has antimicrobial properties'
          ],
          edibleUses: [],
          otherUses: [
            'Fiber production',
            'Natural air purifier',
            'Ornamental purposes'
          ]
        },
        trivia: [
          'Snake plants were named for the snake-like patterns on their leaves',
          'NASA has studied snake plants for their air-purifying abilities',
          'In some cultures, these plants are believed to bring good luck',
          'They can survive in very low light conditions for weeks',
          'The plant produces oxygen mainly at night, unlike most other plants'
        ],
        seasonalInfo: {
          growingSeason: ['Spring', 'Summer'],
          dormancyPeriod: ['Winter'],
          floweringSeason: ['Late Spring', 'Early Summer'],
          pruningTime: ['Spring'],
          fertilizingSchedule: ['Spring', 'Summer'],
          commonIssues: {
            spring: ['New growth may be pale', 'Watch for increased watering needs'],
            summer: ['Protect from direct sun', 'Monitor for pests'],
            fall: ['Reduce watering', 'Prepare for dormancy'],
            winter: ['Minimal watering needed', 'Protect from cold drafts']
          }
        },
        healthAssessment: {
          overallHealth: 85,
          issues: [],
          recommendations: [
            'Consider fertilizing during the growing season',
            'Maintain current watering schedule',
            'Plant is thriving in current light conditions'
          ],
          vitalSigns: {
            leafColor: 'Healthy deep green',
            soilMoisture: 'Optimal',
            pestStatus: 'No signs of pests',
            diseaseStatus: 'No visible diseases'
          }
        },
        careInfo: {
          watering: 'Water every 2-3 weeks, allowing soil to dry between waterings',
          sunlight: 'Tolerates low light to bright indirect light',
          soil: 'Well-draining potting mix',
          temperature: '70-90°F (21-32°C)',
          humidity: 'Tolerates low humidity',
          fertilizer: 'Feed with balanced fertilizer every 6 months',
          pruning: 'Remove damaged leaves at base',
          repotting: 'Repot every 2-3 years or when root-bound'
        }
      };

      return mockData;
    } catch (error) {
      console.error('Error in analyzeImage:', error);
      throw error;
    }
  }
}

// Create singleton instance
const plantAnalysisService = new PlantAnalysisService();

export const analyzeImage = async (image) => {
  return await plantAnalysisService.analyzeImage(image);
};

export default plantAnalysisService;
