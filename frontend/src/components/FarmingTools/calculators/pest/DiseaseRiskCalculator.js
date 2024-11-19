import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Slider,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  Coronavirus as VirusIcon,
  Info as InfoIcon,
  WaterDrop as WaterIcon,
  Thermostat as TempIcon,
} from '@mui/icons-material';

// Disease risk factors database
const diseaseDatabase = {
  'powdery mildew': {
    optimalConditions: {
      temperature: { min: 15, max: 27 },
      humidity: { min: 50, max: 90 },
      leafWetness: 'moderate',
    },
    preventiveMeasures: [
      'Improve air circulation',
      'Avoid overhead watering',
      'Space plants adequately',
      'Remove infected leaves',
      'Use resistant varieties',
    ],
    treatments: [
      'Sulfur-based fungicides',
      'Potassium bicarbonate',
      'Neem oil',
      'Biological fungicides',
    ],
  },
  'late blight': {
    optimalConditions: {
      temperature: { min: 10, max: 24 },
      humidity: { min: 80, max: 100 },
      leafWetness: 'high',
    },
    preventiveMeasures: [
      'Use disease-free seeds',
      'Improve drainage',
      'Rotate crops',
      'Remove volunteer plants',
      'Monitor weather conditions',
    ],
    treatments: [
      'Copper-based fungicides',
      'Chlorothalonil',
      'Remove infected plants',
      'Increase plant spacing',
    ],
  },
  'fusarium wilt': {
    optimalConditions: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 60, max: 80 },
      leafWetness: 'low',
    },
    preventiveMeasures: [
      'Use resistant varieties',
      'Sterilize soil',
      'Improve drainage',
      'Crop rotation',
      'Maintain soil pH',
    ],
    treatments: [
      'Remove infected plants',
      'Solarize soil',
      'Apply beneficial microorganisms',
      'Adjust soil pH',
    ],
  },
};

const DiseaseRiskCalculator = () => {
  const [inputs, setInputs] = useState({
    cropType: '',
    diseaseType: '',
    temperature: 20,
    humidity: 60,
    leafWetness: '',
    soilMoisture: '',
    previousDisease: '',
  });

  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setInputs(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const calculateRisk = () => {
    const { cropType, diseaseType, temperature, humidity, leafWetness, soilMoisture } = inputs;
    
    if (!cropType || !diseaseType || !leafWetness || !soilMoisture) {
      setError('Please fill in all required fields');
      return;
    }

    const diseaseInfo = diseaseDatabase[diseaseType.toLowerCase()];
    if (!diseaseInfo) {
      setError('Disease type not found in database');
      return;
    }

    // Calculate risk factors
    const tempRisk = calculateTemperatureRisk(temperature, diseaseInfo.optimalConditions.temperature);
    const humidityRisk = calculateHumidityRisk(humidity, diseaseInfo.optimalConditions.humidity);
    const moistureRisk = calculateMoistureRisk(leafWetness, soilMoisture, diseaseInfo.optimalConditions.leafWetness);

    // Generate recommendations
    const recommendations = generateRecommendations(
      diseaseInfo,
      tempRisk,
      humidityRisk,
      moistureRisk
    );

    setAssessment({
      riskLevel: (tempRisk + humidityRisk + moistureRisk) / 3,
      recommendations,
      preventiveMeasures: diseaseInfo.preventiveMeasures,
      treatments: diseaseInfo.treatments,
    });
  };

  const calculateTemperatureRisk = (temp, optimal) => {
    if (temp >= optimal.min && temp <= optimal.max) {
      return 3; // High risk
    } else if (temp >= optimal.min - 5 && temp <= optimal.max + 5) {
      return 2; // Moderate risk
    }
    return 1; // Low risk
  };

  const calculateHumidityRisk = (hum, optimal) => {
    if (hum >= optimal.min && hum <= optimal.max) {
      return 3;
    } else if (hum >= optimal.min - 10 && hum <= optimal.max + 10) {
      return 2;
    }
    return 1;
  };

  const calculateMoistureRisk = (leafWet, soilMoist, optimal) => {
    const moistureLevel = {
      high: 3,
      moderate: 2,
      low: 1,
    };

    const leafWetRisk = moistureLevel[leafWet] || 1;
    const soilMoistRisk = moistureLevel[soilMoist] || 1;

    return (leafWetRisk + soilMoistRisk) / 2;
  };

  const generateRecommendations = (diseaseInfo, tempRisk, humidityRisk, moistureRisk) => {
    const totalRisk = (tempRisk + humidityRisk + moistureRisk) / 3;
    
    if (totalRisk <= 1.5) {
      return {
        riskLevel: 'Low',
        actions: [
          'Continue regular monitoring',
          'Maintain current preventive measures',
          'Document conditions for future reference',
        ],
      };
    } else if (totalRisk <= 2.5) {
      return {
        riskLevel: 'Moderate',
        actions: [
          'Increase monitoring frequency',
          'Implement preventive measures',
          'Prepare treatment options',
          'Adjust cultural practices',
        ],
      };
    } else {
      return {
        riskLevel: 'High',
        actions: [
          'Immediate action required',
          'Implement treatment plan',
          'Adjust environmental conditions if possible',
          'Consider protective fungicides',
          'Document outbreak for future prevention',
        ],
      };
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Disease Risk Calculator
        <Tooltip title="Assess disease risk based on environmental conditions">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Crop Type"
            name="cropType"
            value={inputs.cropType}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Disease Type</InputLabel>
            <Select
              name="diseaseType"
              value={inputs.diseaseType}
              onChange={handleInputChange}
              label="Disease Type"
            >
              <MenuItem value="powdery mildew">Powdery Mildew</MenuItem>
              <MenuItem value="late blight">Late Blight</MenuItem>
              <MenuItem value="fusarium wilt">Fusarium Wilt</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>
            Temperature (°C)
            <Tooltip title="Average daily temperature">
              <IconButton size="small">
                <TempIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Slider
            value={inputs.temperature}
            onChange={handleSliderChange('temperature')}
            valueLabelDisplay="auto"
            min={0}
            max={40}
            marks={[
              { value: 0, label: '0°C' },
              { value: 20, label: '20°C' },
              { value: 40, label: '40°C' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>
            Relative Humidity (%)
            <Tooltip title="Average relative humidity">
              <IconButton size="small">
                <WaterIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Slider
            value={inputs.humidity}
            onChange={handleSliderChange('humidity')}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            marks={[
              { value: 0, label: '0%' },
              { value: 50, label: '50%' },
              { value: 100, label: '100%' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Leaf Wetness</InputLabel>
            <Select
              name="leafWetness"
              value={inputs.leafWetness}
              onChange={handleInputChange}
              label="Leaf Wetness"
            >
              <MenuItem value="low">Low (Leaves Dry)</MenuItem>
              <MenuItem value="moderate">Moderate (Some Moisture)</MenuItem>
              <MenuItem value="high">High (Leaves Wet)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Soil Moisture</InputLabel>
            <Select
              name="soilMoisture"
              value={inputs.soilMoisture}
              onChange={handleInputChange}
              label="Soil Moisture"
            >
              <MenuItem value="low">Low (Dry)</MenuItem>
              <MenuItem value="moderate">Moderate (Moist)</MenuItem>
              <MenuItem value="high">High (Wet)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={calculateRisk}
          fullWidth
          startIcon={<VirusIcon />}
        >
          Calculate Disease Risk
        </Button>
      </Box>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {assessment && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Disease Risk Assessment
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Risk Level: {assessment.recommendations.riskLevel}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(assessment.riskLevel / 3) * 100}
                    color={
                      assessment.riskLevel <= 1.5
                        ? 'success'
                        : assessment.riskLevel <= 2.5
                        ? 'warning'
                        : 'error'
                    }
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Recommended Actions
                  </Typography>
                  <List>
                    {assessment.recommendations.actions.map((action, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={action} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Preventive Measures
                  </Typography>
                  <List>
                    {assessment.preventiveMeasures.map((measure, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={measure} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Treatment Options
                  </Typography>
                  <List>
                    {assessment.treatments.map((treatment, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={treatment} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default DiseaseRiskCalculator;
