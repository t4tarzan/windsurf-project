import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import storageService from '../firebase/storageService';

class PlantAnalysisService {
  constructor() {
    this.model = null;
    this.modelLoading = null;
    this.plantIdApiKey = process.env.REACT_APP_PLANTID_API_KEY;
    this.plantnetApiKey = process.env.REACT_APP_PLANTNET_API_KEY;
    this.trefleApiKey = process.env.REACT_APP_TREFLE_API_KEY;
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000;
    this.baseUrl = 'https://api.plant.id/v2';
    
    // Initialize the model
    this.initModel();

    // Enhanced logging for debugging
    console.log('Environment Variables Status:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- Plant.id API key:', this.plantIdApiKey ? '✓ Set' : '✗ Missing');
    console.log('- PlantNet API key:', this.plantnetApiKey ? '✓ Set' : '✗ Missing');
    console.log('- Trefle API key:', this.trefleApiKey ? '✓ Set' : '✗ Missing');

    // Log API key status
    console.log('Plant.id API key status:', this.plantIdApiKey ? 'Set' : 'Not set');
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

  async identifyWithPlantId(imageFile) {
    try {
      // First, try to get cached results from Firebase
      const imageInfo = await storageService.uploadImage(imageFile);
      const existingAnalysis = await storageService.getExistingAnalysis(imageInfo.url);

      if (existingAnalysis) {
        console.log('Found cached analysis results');
        return existingAnalysis.results;
      }

      console.log('Starting Plant.id identification process...', { imageFile });

      // Convert image to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      console.log('Image converted to base64');

      const data = {
        api_key: this.plantIdApiKey,
        images: [base64Image],
        modifiers: ["crops_fast", "similar_images", "health_all"],
        plant_language: "en",
        plant_details: [
          "common_names",
          "url",
          "wiki_description",
          "taxonomy",
          "rank",
          "gbif_id",
          "inaturalist_id",
          "image",
          "synonyms",
          "edible_parts",
          "watering",
          "propagation_methods",
          "growth_rate",
          "toxicity",
          "scientific_name",
          "structured_name",
          "care_difficulty"
        ],
        disease_details: [
          "common_names",
          "url",
          "description",
          "treatment",
          "classification",
          "cause",
          "symptoms"
        ]
      };

      console.log('Making identification request to Plant.id API...');
      
      const response = await axios.post(
        `${this.baseUrl}/identify`,
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Plant.id API response:', response.data);

      if (!response.data.suggestions || response.data.suggestions.length === 0) {
        console.error('No suggestions returned from Plant.id');
        throw new Error('No plants identified by Plant.id');
      }

      const bestMatch = response.data.suggestions[0];
      const healthAssessment = response.data.health_assessment || {};
      
      // Process plant details
      const plantDetails = bestMatch.plant_details || {};
      const careInfo = {
        watering: plantDetails.watering?.value,
        propagation: plantDetails.propagation_methods,
        growthRate: plantDetails.growth_rate,
        toxicity: plantDetails.toxicity,
        difficulty: plantDetails.care_difficulty
      };

      // Process health assessment
      const diseases = healthAssessment.diseases || [];
      const processedDiseases = diseases.map(disease => ({
        name: disease.name,
        probability: disease.probability,
        details: disease.disease_details ? {
          commonNames: disease.disease_details.common_names,
          description: disease.disease_details.description,
          treatment: disease.disease_details.treatment,
          cause: disease.disease_details.cause,
          symptoms: disease.disease_details.symptoms
        } : null
      }));

      const result = {
        name: bestMatch.plant_name,
        scientificName: plantDetails.scientific_name,
        confidence: Math.round(bestMatch.probability * 100),
        description: plantDetails.wiki_description?.value,
        taxonomy: plantDetails.taxonomy,
        structuredName: plantDetails.structured_name,
        commonNames: plantDetails.common_names,
        synonyms: plantDetails.synonyms,
        gbifId: plantDetails.gbif_id,
        inaturalistId: plantDetails.inaturalist_id,
        imageUrl: plantDetails.image?.value,
        careInfo: this.cleanObject(careInfo),
        health: this.cleanObject({
          isHealthy: healthAssessment.is_healthy,
          isHealthyProbability: healthAssessment.is_healthy_probability,
          diseases: processedDiseases,
          diseases_simple: diseases.map(d => d.name)
        }),
        edibleParts: plantDetails.edible_parts,
        wikiUrl: plantDetails.url,
        similarImages: bestMatch.similar_images || []
      };

      // Clean the entire result object
      const cleanedResult = this.cleanObject(result);
      console.log('Cleaned result:', cleanedResult);
      
      // Cache the results in Firebase
      await storageService.saveAnalysisResult(imageInfo, cleanedResult);

      return cleanedResult;

    } catch (error) {
      console.error('Error in Plant.id API:', error);
      if (error.response) {
        console.error('API error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  }

  async identifyWithPlantNet(imageFile) {
    try {
      // Log API key (only first few characters for security)
      const apiKeyPreview = this.plantnetApiKey ? `${this.plantnetApiKey.substring(0, 5)}...` : 'not set';
      console.log('Using Pl@ntNet API key:', apiKeyPreview);

      const formData = new FormData();
      formData.append('images', imageFile);
      
      const response = await axios.post(
        'https://my-api.plantnet.org/v2/identify/all',
        formData,
        {
          params: {
            'api-key': this.plantnetApiKey,
            'include-related-images': true
          }
        }
      );

      if (!response.data?.results?.length) {
        throw new Error('No plants identified by Pl@ntNet');
      }

      const bestMatch = response.data.results[0];
      return {
        name: bestMatch.species.commonNames?.[0] || bestMatch.species.scientificNameWithoutAuthor,
        scientificName: bestMatch.species.scientificNameWithoutAuthor,
        confidence: Math.round(bestMatch.score * 100),
        taxonomy: {
          family: bestMatch.species.family.scientificNameWithoutAuthor,
          genus: bestMatch.species.genus.scientificNameWithoutAuthor
        },
        similarImages: bestMatch.images?.slice(0, 3).map(img => img.url) || []
      };
    } catch (error) {
      // Enhanced error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Pl@ntNet API error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Pl@ntNet API no response:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Pl@ntNet API error setup:', error.message);
      }
      throw error;
    }
  }

  async analyzeImage(image) {
    try {
      console.log('Starting plant analysis...');
      
      // First, try to get cached results
      const imageInfo = await storageService.uploadImage(image);
      const existingAnalysis = await storageService.getExistingAnalysis(imageInfo.url);

      if (existingAnalysis) {
        console.log('Found cached analysis results');
        return existingAnalysis;
      }

      const results = {
        imageUrl: imageInfo.url,
        timestamp: new Date().toISOString(),
        methods: []
      };

      // Try Plant.id API first
      try {
        console.log('Attempting Plant.id identification...');
        const plantIdResult = await this.identifyWithPlantId(image);
        if (plantIdResult) {
          results.plantId = plantIdResult;
          results.methods.push('plantId');
          console.log('Plant.id identification successful');
          // If Plant.id succeeds, we can return early as it's our most reliable source
          const cleanedResults = this.cleanObject(results);
          await storageService.saveAnalysisResult(imageInfo, cleanedResults);
          return cleanedResults;
        }
      } catch (plantIdError) {
        console.error('Plant.id error:', plantIdError);
      }

      // Try MobileNet as fallback
      try {
        console.log('Attempting MobileNet identification...');
        if (!this.model) {
          await this.initModel();
        }
        
        const img = new Image();
        
        const predictions = await new Promise((resolve, reject) => {
          img.onload = async () => {
            try {
              const tfImg = tf.browser.fromPixels(img);
              const predictions = await this.model.classify(tfImg);
              tfImg.dispose();
              resolve(predictions);
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = URL.createObjectURL(image);
        });

        if (predictions && predictions.length > 0) {
          results.mobilenet = {
            name: this.formatPlantName(predictions[0].className),
            confidence: Math.round(predictions[0].probability * 100),
            predictions: predictions.map(p => ({
              name: this.formatPlantName(p.className),
              confidence: Math.round(p.probability * 100)
            }))
          };
          results.methods.push('mobilenet');
          console.log('MobileNet identification successful');
        }
      } catch (mobileNetError) {
        console.error('MobileNet error:', mobileNetError);
      }

      // Check if we have any results
      if (results.methods.length === 0) {
        throw new Error('Unable to identify plant with any available method');
      }

      // Clean and save results
      const cleanedResults = this.cleanObject(results);
      await storageService.saveAnalysisResult(imageInfo, cleanedResults);
      return cleanedResults;

    } catch (error) {
      console.error('Error in analyzeImage:', error);
      throw error;
    }
  }

  // Helper function to clean object of undefined values and nulls
  cleanObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanObject(item)).filter(item => item != null);
    }
    
    const cleanedObj = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value != null) {
        if (typeof value === 'object') {
          const cleaned = this.cleanObject(value);
          if (cleaned != null && Object.keys(cleaned).length > 0) {
            cleanedObj[key] = cleaned;
          }
        } else {
          cleanedObj[key] = value;
        }
      }
    });
    
    return Object.keys(cleanedObj).length > 0 ? cleanedObj : null;
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

  getPlantDescription(plantName) {
    const plantType = plantName.toLowerCase();
    
    if (plantType.includes('succulent') || plantType.includes('cactus')) {
      return 'A drought-resistant plant known for its water-storing capabilities and unique appearance.';
    }
    
    if (plantType.includes('fern')) {
      return 'A non-flowering plant that reproduces via spores and typically prefers shaded, humid environments.';
    }
    
    if (plantType.includes('orchid')) {
      return 'A diverse flowering plant family known for its beautiful and often fragrant blooms.';
    }
    
    if (plantType.includes('palm')) {
      return 'A tropical or subtropical plant characterized by its large, evergreen fronds.';
    }

    if (plantType.includes('monstera')) {
      return 'A tropical climbing plant known for its large, perforated leaves and aerial roots. Popular as a striking indoor plant.';
    }

    if (plantType.includes('pothos')) {
      return 'A versatile trailing plant with heart-shaped leaves, known for being one of the easiest houseplants to grow and maintain.';
    }

    if (plantType.includes('philodendron')) {
      return 'A diverse genus of flowering plants known for their beautiful foliage and adaptability to indoor conditions.';
    }

    if (plantType.includes('rose')) {
      return 'A woody perennial flowering plant known for its beautiful, often fragrant flowers and prickly stems.';
    }

    if (plantType.includes('lily')) {
      return 'A flowering plant admired for its large, showy blooms and often pleasant fragrance.';
    }
    
    return 'A plant species that requires proper care and attention to thrive in its environment.';
  }

  getPlantUses(plantName) {
    const plantType = plantName.toLowerCase();
    const uses = {
      medicinal: false,
      medicinalUses: [],
      otherUses: []
    };

    if (plantType.includes('aloe')) {
      uses.medicinal = true;
      uses.medicinalUses = ['Skin healing', 'Burn treatment', 'Anti-inflammatory'];
      uses.otherUses = ['Natural skincare', 'Decorative purposes'];
    } else if (plantType.includes('lavender')) {
      uses.medicinal = true;
      uses.medicinalUses = ['Aromatherapy', 'Stress relief', 'Sleep aid'];
      uses.otherUses = ['Essential oils', 'Fragrance'];
    } else if (plantType.includes('mint')) {
      uses.medicinal = true;
      uses.medicinalUses = ['Digestive aid', 'Breath freshening'];
      uses.otherUses = ['Culinary herb', 'Tea preparation'];
    } else if (plantType.includes('monstera')) {
      uses.otherUses = ['Air purification', 'Interior decoration', 'Tropical aesthetics'];
    } else if (plantType.includes('pothos')) {
      uses.otherUses = ['Air purification', 'Interior decoration', 'Low-light spaces'];
    } else if (plantType.includes('philodendron')) {
      uses.otherUses = ['Air purification', 'Interior decoration', 'Space divider'];
    } else if (plantType.includes('rose')) {
      uses.medicinal = true;
      uses.medicinalUses = ['Aromatherapy', 'Skin care'];
      uses.otherUses = ['Fragrance', 'Cut flowers', 'Garden decoration'];
    } else if (plantType.includes('lily')) {
      uses.otherUses = ['Cut flowers', 'Garden decoration', 'Fragrance'];
    } else {
      uses.otherUses = ['Decorative purposes', 'Air purification'];
    }

    return uses;
  }

  getPlantTrivia(plantName) {
    const plantType = plantName.toLowerCase();
    const trivia = [];

    if (plantType.includes('succulent') || plantType.includes('cactus')) {
      trivia.push(
        'Some succulents can survive for months without water',
        'Many species can propagate from a single leaf',
        'They are found on every continent except Antarctica'
      );
    } else if (plantType.includes('fern')) {
      trivia.push(
        'Ferns have existed for over 350 million years',
        'They reproduce through spores rather than seeds',
        'Some species can filter pollutants from the air'
      );
    } else if (plantType.includes('orchid')) {
      trivia.push(
        'Orchids are one of the largest families of flowering plants',
        'Some species can live for over 100 years',
        'Vanilla comes from a type of orchid'
      );
    }

    return trivia;
  }
}

// Create singleton instance
const plantAnalysisService = new PlantAnalysisService();

export const analyzeImage = async (image) => {
  return await plantAnalysisService.analyzeImage(image);
};

export default plantAnalysisService;
