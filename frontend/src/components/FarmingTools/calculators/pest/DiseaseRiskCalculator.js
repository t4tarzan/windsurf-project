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
  Divider
} from '@mui/material';
import {
  Coronavirus as VirusIcon,
  Info as InfoIcon,
  WaterDrop as WaterIcon,
  Thermostat as TempIcon,
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import DiseaseInfoCard from '../../components/pest/DiseaseInfoCard';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `The Disease Risk Calculator helps farmers predict and manage plant disease risks based on environmental conditions, crop susceptibility, and historical disease pressure. Understanding these factors enables proactive disease management strategies.`,
  
  diseaseTriangle: [
    {
      component: 'Host Plant',
      description: 'Susceptibility of the crop variety to specific diseases.',
      factors: ['Plant genetics', 'Growth stage', 'Plant stress', 'Previous damage']
    },
    {
      component: 'Pathogen',
      description: 'The disease-causing organism and its characteristics.',
      factors: ['Inoculum level', 'Virulence', 'Survival ability', 'Dispersal mechanism']
    },
    {
      component: 'Environment',
      description: 'Weather conditions that influence disease development.',
      factors: ['Temperature', 'Humidity', 'Leaf wetness', 'Wind patterns']
    }
  ],

  preventiveStrategies: {
    cultural: {
      description: 'Management practices that reduce disease risk',
      methods: [
        'Crop rotation',
        'Plant spacing',
        'Field sanitation',
        'Proper irrigation timing'
      ]
    },
    genetic: {
      description: 'Use of resistant varieties',
      methods: [
        'Disease-resistant cultivars',
        'Certified disease-free seeds',
        'Rootstock selection',
        'Variety diversification'
      ]
    },
    environmental: {
      description: 'Modifying conditions to discourage disease',
      methods: [
        'Ventilation improvement',
        'Humidity management',
        'Soil drainage',
        'Row orientation'
      ]
    }
  },

  monitoringGuidelines: [
    'Regular scouting for early symptoms',
    'Weather condition tracking',
    'Record keeping of disease occurrence',
    'Tissue testing when needed',
    'Consultation with extension services',
    'Use of disease forecasting models'
  ]
};

// Disease database with common crop diseases
const diseaseDatabase = {
  'late_blight': {
    name: 'Late Blight',
    type: 'Fungal',
    description: 'A devastating disease affecting tomatoes and potatoes, caused by Phytophthora infestans.',
    symptoms: [
      'Dark brown spots on leaves',
      'White fuzzy growth on undersides',
      'Rapid wilting and death',
      'Brown lesions on stems'
    ],
    susceptibleCrops: ['tomatoes', 'potatoes', 'eggplants'],
    conditions: {
      temperature: { min: 10, max: 20 },
      humidity: { min: 90, max: 100 }
    },
    preventionMethods: [
      'Use resistant varieties',
      'Improve air circulation',
      'Avoid overhead irrigation',
      'Practice crop rotation'
    ],
    treatments: [
      'Remove infected plant material',
      'Apply copper-based fungicides',
      'Increase plant spacing',
      'Adjust irrigation timing'
    ]
  },
  'powdery_mildew': {
    name: 'Powdery Mildew',
    type: 'Fungal',
    description: 'A common fungal disease affecting many crops, especially in warm, dry conditions.',
    symptoms: [
      'White powdery coating on leaves',
      'Yellowing of affected areas',
      'Stunted growth',
      'Leaf curling'
    ],
    susceptibleCrops: ['cucumbers', 'squash', 'melons', 'grapes'],
    conditions: {
      temperature: { min: 20, max: 28 },
      humidity: { min: 50, max: 70 }
    },
    preventionMethods: [
      'Plant resistant varieties',
      'Maintain proper spacing',
      'Remove infected plant parts',
      'Apply preventive fungicides'
    ],
    treatments: [
      'Apply sulfur-based fungicides',
      'Use biological fungicides',
      'Prune for better air circulation',
      'Adjust watering schedule'
    ]
  },
  'fusarium_wilt': {
    name: 'Fusarium Wilt',
    type: 'Fungal',
    description: 'A soil-borne fungal disease that affects many crops by blocking water-conducting vessels.',
    symptoms: [
      'Yellowing of lower leaves',
      'Wilting despite adequate moisture',
      'Brown vascular tissue',
      'Plant death'
    ],
    susceptibleCrops: ['tomatoes', 'bananas', 'cotton', 'melons'],
    conditions: {
      temperature: { min: 25, max: 32 },
      humidity: { min: 60, max: 80 }
    },
    preventionMethods: [
      'Use resistant cultivars',
      'Practice long crop rotations',
      'Maintain soil pH above 6.5',
      'Improve soil drainage'
    ],
    treatments: [
      'Remove infected plants',
      'Solarize soil',
      'Apply beneficial microorganisms',
      'Adjust soil pH'
    ]
  }
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

    const diseaseInfo = diseaseDatabase[diseaseType];
    if (!diseaseInfo) {
      setError('Disease type not found in database');
      return;
    }

    // Calculate risk factors
    const tempRisk = calculateTemperatureRisk(temperature, diseaseInfo.conditions.temperature);
    const humidityRisk = calculateHumidityRisk(humidity, diseaseInfo.conditions.humidity);
    const moistureRisk = calculateMoistureRisk(leafWetness, soilMoisture);

    const totalRisk = (tempRisk + humidityRisk + moistureRisk) / 3;
    
    // Generate recommendations based on risk level
    const recommendations = {
      riskLevel: totalRisk <= 1.5 ? 'Low' : totalRisk <= 2.5 ? 'Moderate' : 'High',
      actions: generateRecommendations(diseaseInfo, tempRisk, humidityRisk, moistureRisk).actions
    };

    setAssessment({
      riskLevel: totalRisk,
      recommendations,
      preventiveMeasures: diseaseInfo.preventionMethods,
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

  const calculateMoistureRisk = (leafWet, soilMoist) => {
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

      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About Plant Disease Management
            </Typography>
            <Typography paragraph>
              {educationalContent.introduction}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              The Disease Triangle
            </Typography>
            <Grid container spacing={3}>
              {educationalContent.diseaseTriangle.map((component) => (
                <Grid item xs={12} md={4} key={component.component}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {component.component}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {component.description}
                      </Typography>
                      <List dense>
                        {component.factors.map((factor, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={factor} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Prevention Strategies
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(educationalContent.preventiveStrategies).map(([key, strategy]) => (
                <Grid item xs={12} md={4} key={key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {key.charAt(0).toUpperCase() + key.slice(1)} Control
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {strategy.description}
                      </Typography>
                      <List dense>
                        {strategy.methods.map((method, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={method} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Monitoring Guidelines
            </Typography>
            <List>
              {educationalContent.monitoringGuidelines.map((guideline, index) => (
                <ListItem key={index}>
                  <ListItemText primary={guideline} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Calculate Disease Risk
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
              {Object.entries(diseaseDatabase).map(([key, disease]) => (
                <MenuItem value={key} key={key}>
                  {disease.name}
                </MenuItem>
              ))}
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
      {inputs.diseaseType && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Disease Information
          </Typography>
          <DiseaseInfoCard disease={diseaseDatabase[inputs.diseaseType]} />
        </Box>
      )}
    </Paper>
  );
};

export default DiseaseRiskCalculator;
