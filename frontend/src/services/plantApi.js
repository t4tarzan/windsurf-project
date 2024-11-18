import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// For demo purposes, this function returns dummy data
// In production, this would make a real API call to the backend
export const analyzeImage = async (imageData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Dummy response data
  const dummyResponse = {
    plantName: 'Tomato Plant',
    healthScore: 75,
    issues: ['Leaf spots detected', 'Minor nutrient deficiency'],
    recommendations: [
      'Water every 2-3 days',
      'Increase sunlight exposure',
      'Apply organic fertilizer',
    ],
    conditions: {
      water: 'Moderate watering needed',
      sunlight: '6-8 hours daily',
      soil: 'Well-draining soil required',
    },
  };

  return dummyResponse;

  // Real API implementation would look like this:
  /*
  try {
    const formData = new FormData();
    formData.append('image', imageData);

    const response = await axios.post(`${API_URL}/api/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
  */
};
