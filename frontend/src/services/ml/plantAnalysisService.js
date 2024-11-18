import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import axios from 'axios';

class PlantAnalysisService {
  constructor() {
    this.model = null;
    this.plantDatabase = {
      'pot plant': { name: 'House Plant', confidence: 0.8 },
      'flower': { name: 'Flowering Plant', confidence: 0.8 },
      'vegetable': { name: 'Vegetable Plant', confidence: 0.8 },
      'herb': { name: 'Herb', confidence: 0.8 },
      'succulent': { name: 'Succulent', confidence: 0.8 },
      'garden': { name: 'Garden Plant', confidence: 0.7 },
    };

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

    // Pl@ntNet API for plant identification
    this.PLANTNET_API_KEY = process.env.REACT_APP_PLANTNET_API_KEY;
    this.PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';

    // Trefle API for detailed plant information
    this.TREFLE_API_KEY = process.env.REACT_APP_TREFLE_API_KEY;
    this.TREFLE_API_URL = 'https://trefle.io/api/v1';
  }

  async initialize() {
    if (!this.model) {
      console.log('Loading MobileNet model...');
      this.model = await mobilenet.load();
      console.log('MobileNet model loaded');
    }
  }

  async analyzeImage(imageElement) {
    if (!this.model) {
      await this.initialize();
    }

    // Get the base classification
    const predictions = await this.model.classify(imageElement);
    
    // Process the predictions
    const processedResults = this.processResults(predictions);
    
    // Analyze health based on image characteristics
    const healthAnalysis = await this.analyzeHealth(imageElement);
    
    // Combine results
    return {
      ...processedResults,
      ...healthAnalysis
    };
  }

  processResults(predictions) {
    // Find the most relevant plant prediction
    let bestMatch = { confidence: 0 };
    
    for (const prediction of predictions) {
      const lowerClassName = prediction.className.toLowerCase();
      
      // Check if the prediction matches any known plant types
      for (const [key, value] of Object.entries(this.plantDatabase)) {
        if (lowerClassName.includes(key) && prediction.probability > bestMatch.confidence) {
          bestMatch = {
            name: value.name,
            confidence: prediction.probability,
            originalClass: prediction.className
          };
        }
      }
    }

    // If no good match found, use the highest confidence prediction
    if (bestMatch.confidence === 0) {
      bestMatch = {
        name: 'Unknown Plant',
        confidence: predictions[0].probability,
        originalClass: predictions[0].className
      };
    }

    return {
      plantName: bestMatch.name,
      confidence: Math.round(bestMatch.confidence * 100),
      originalClassification: bestMatch.originalClass
    };
  }

  async analyzeHealth(imageElement) {
    // Convert image to tensor
    const imageTensor = tf.browser.fromPixels(imageElement);
    
    // Calculate color statistics
    const normalizedImage = tf.div(imageTensor, 255);
    const meanColor = tf.mean(normalizedImage, [0, 1]);
    const colorStats = await meanColor.data();
    
    // Clean up tensors
    imageTensor.dispose();
    normalizedImage.dispose();
    meanColor.dispose();

    // Analysis based on color distribution
    const [r, g, b] = colorStats;
    const greenness = g - (r + b) / 2; // Measure of how green the plant is
    
    // Calculate health score (simplified version)
    const healthScore = Math.min(100, Math.max(0, Math.round((greenness + 0.5) * 100)));
    
    // Determine issues based on color analysis
    const issues = this.determineIssues(r, g, b);
    
    // Generate recommendations based on issues
    const recommendations = this.generateRecommendations(issues);

    // Identify the plant using Pl@ntNet API
    const base64Image = await this.getBase64FromImage(imageElement);
    const identificationResult = await this.identifyPlant(base64Image);

    // Get detailed information using Trefle API
    const detailedInfo = await this.getDetailedPlantInfo(identificationResult.plant_name);

    // Combine results
    return {
      healthScore,
      issues: issues.map(issue => issue.name),
      recommendations,
      conditions: this.determineOptimalConditions(healthScore),
      plantType: identificationResult.plant_name,
      commonNames: identificationResult.plant_details.common_names,
      confidence: identificationResult.probability,
      family: identificationResult.plant_details.family,
      genus: identificationResult.plant_details.genus,
      species: identificationResult.plant_details.scientific_name,
      description: identificationResult.plant_details.wiki_description?.value,
      detailedInfo: {
        nativeTo: detailedInfo?.distributions?.native || [],
        growthHabits: detailedInfo?.specifications?.growth_habit || [],
        edible: detailedInfo?.edible || false,
        edibleParts: detailedInfo?.edible_parts || [],
        flowerColor: detailedInfo?.flower?.color || [],
        floweringSeason: detailedInfo?.flowering_months || [],
        harvestSeason: detailedInfo?.harvest_months || [],
        growthMonths: detailedInfo?.growth_months || [],
        minimumPrecipitation: detailedInfo?.growth.minimum_precipitation?.mm,
        maximumPrecipitation: detailedInfo?.growth.maximum_precipitation?.mm,
        minimumTemperature: detailedInfo?.growth.minimum_temperature?.deg_c,
        maximumTemperature: detailedInfo?.growth.maximum_temperature?.deg_c,
        soilTexture: detailedInfo?.growth.soil_texture || [],
        soilPh: detailedInfo?.growth.ph_minimum,
        lightRequirements: detailedInfo?.growth.light || [],
        atmosphericHumidity: detailedInfo?.growth.atmospheric_humidity || [],
      },
      careInfo: {
        watering: detailedInfo?.growth?.watering || "Regular watering needed",
        sunlight: detailedInfo?.growth?.light || "Moderate sunlight",
        soil: detailedInfo?.growth?.soil_nutriments || "Well-draining soil",
        temperature: `${detailedInfo?.growth?.minimum_temperature?.deg_c || 15}°C - ${detailedInfo?.growth?.maximum_temperature?.deg_c || 25}°C`,
        humidity: detailedInfo?.growth?.atmospheric_humidity || "Moderate humidity"
      },
      uses: {
        medicinal: detailedInfo?.medicinal || false,
        medicinalUses: detailedInfo?.medicinal_uses || [],
        edibleUses: detailedInfo?.edible_uses || [],
        otherUses: detailedInfo?.other_uses || []
      },
      trivia: [
        detailedInfo?.observations || "",
        detailedInfo?.interesting_facts || ""
      ].filter(Boolean)
    };
  }

  determineIssues(r, g, b) {
    const issues = [];
    
    // Yellow leaves detection
    if (r > 0.5 && g > 0.5 && b < 0.3) {
      issues.push(this.issuesDatabase.yellowLeaves);
    }
    
    // Brown spots detection
    if (r > 0.4 && g < 0.4 && b < 0.4) {
      issues.push(this.issuesDatabase.brownSpots);
    }
    
    // Wilting detection
    if (r + g + b < 0.6) {
      issues.push(this.issuesDatabase.wilting);
    }
    
    return issues;
  }

  generateRecommendations(issues) {
    const recommendations = new Set();
    
    issues.forEach(issue => {
      issue.solutions.forEach(solution => recommendations.add(solution));
    });
    
    return Array.from(recommendations);
  }

  determineOptimalConditions(healthScore) {
    // Adjust conditions based on health score
    return {
      water: healthScore < 60 ? 'Increase watering frequency' : 'Maintain current watering schedule',
      sunlight: healthScore < 70 ? 'Adjust light exposure' : '6-8 hours of indirect sunlight',
      soil: 'Well-draining soil with organic matter'
    };
  }

  getBase64FromImage = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  identifyPlant = async (base64Image) => {
    if (!this.PLANTNET_API_KEY) {
      console.warn('Pl@ntNet API key not found. Using mock data.');
      return this.getMockIdentification();
    }

    try {
      // Convert base64 to blob for Pl@ntNet API
      const base64Data = base64Image.split(',')[1];
      const blobData = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
      
      // Create form data
      const formData = new FormData();
      formData.append('images', blobData);
      
      const response = await axios.post(`${this.PLANTNET_API_URL}?api-key=${this.PLANTNET_API_KEY}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Transform Pl@ntNet response to match our app's format
      const bestMatch = response.data.results[0];
      return {
        plant_name: bestMatch.species.scientificNameWithoutAuthor,
        probability: bestMatch.score,
        plant_details: {
          common_names: bestMatch.species.commonNames,
          scientific_name: bestMatch.species.scientificNameWithoutAuthor,
          family: bestMatch.species.family.scientificNameWithoutAuthor,
          genus: bestMatch.species.genus.scientificNameWithoutAuthor,
          images: bestMatch.images.map(img => img.url),
          gbif_id: bestMatch.gbif.id
        }
      };
    } catch (error) {
      console.error('Plant identification error:', error);
      return this.getMockIdentification();
    }
  };

  getDetailedPlantInfo = async (scientificName) => {
    if (!this.TREFLE_API_KEY) {
      console.warn('Trefle API key not found. Using mock data.');
      return this.getMockPlantDetails();
    }

    try {
      const response = await axios.get(`${this.TREFLE_API_URL}/species/search`, {
        params: {
          token: this.TREFLE_API_KEY,
          q: scientificName
        }
      });

      if (response.data.data.length > 0) {
        const detailedResponse = await axios.get(
          `${this.TREFLE_API_URL}/species/${response.data.data[0].id}`,
          {
            params: { token: this.TREFLE_API_KEY }
          }
        );
        return detailedResponse.data.data;
      }
      return this.getMockPlantDetails();
    } catch (error) {
      console.error('Plant details error:', error);
      return this.getMockPlantDetails();
    }
  };

  getMockIdentification = () => ({
    plant_name: "Monstera deliciosa",
    probability: 0.95,
    plant_details: {
      common_names: ["Swiss cheese plant", "Split-leaf philodendron"],
      wiki_description: {
        value: "Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama. It has been introduced to many tropical areas, and has become a mildly invasive species in Hawaii, Seychelles, Ascension Island and the Society Islands."
      },
      taxonomy: {
        family: "Araceae",
        genus: "Monstera",
        species: "deliciosa"
      }
    }
  });

  getMockPlantDetails = () => ({
    distributions: {
      native: ["Mexico", "Panama", "Guatemala"]
    },
    specifications: {
      growth_habit: ["Climbing", "Epiphytic"]
    },
    edible: true,
    edible_parts: ["Fruit", "Seeds"],
    flower: {
      color: ["White", "Cream"]
    },
    flowering_months: ["June", "July", "August"],
    harvest_months: ["September", "October"],
    growth_months: ["March", "April", "May", "June", "July", "August"],
    growth: {
      minimum_precipitation: { mm: 800 },
      maximum_precipitation: { mm: 2500 },
      minimum_temperature: { deg_c: 15 },
      maximum_temperature: { deg_c: 30 },
      soil_texture: ["Well-draining"],
      ph_minimum: 5.5,
      light: ["Partial shade", "Filtered sunlight"],
      atmospheric_humidity: ["High"]
    },
    medicinal: true,
    medicinal_uses: ["Traditional medicine"],
    edible_uses: ["Raw fruit when ripe"],
    other_uses: ["Ornamental", "Interior landscaping"],
    observations: "Develops unique split leaves as it matures",
    interesting_facts: "The name Monstera comes from the Latin word for 'monstrous' or 'abnormal', referring to the plant's unusual leaves"
  });
}

// Create singleton instance
const plantAnalysisService = new PlantAnalysisService();

export default plantAnalysisService;
