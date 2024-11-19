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
  Rating,
  Slider,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  BugReport as BugIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Pest threshold levels and control methods database
const pestDatabase = {
  aphids: {
    thresholds: {
      low: 'Less than 10 per leaf',
      moderate: '10-25 per leaf',
      high: 'More than 25 per leaf',
    },
    controls: {
      biological: ['Ladybugs', 'Lacewings', 'Parasitic wasps'],
      cultural: ['Remove affected leaves', 'Increase plant spacing', 'Use reflective mulch'],
      chemical: ['Insecticidal soap', 'Neem oil', 'Pyrethrin (as last resort)'],
    },
  },
  caterpillars: {
    thresholds: {
      low: '1-2 per plant',
      moderate: '3-5 per plant',
      high: 'More than 5 per plant',
    },
    controls: {
      biological: ['Bacillus thuringiensis (Bt)', 'Parasitic wasps', 'Birds'],
      cultural: ['Hand picking', 'Row covers', 'Companion planting'],
      chemical: ['Spinosad', 'Neem oil', 'Pyrethrin (as last resort)'],
    },
  },
  mites: {
    thresholds: {
      low: 'Occasional speckling on leaves',
      moderate: 'Visible webbing, yellowing leaves',
      high: 'Heavy webbing, leaf death',
    },
    controls: {
      biological: ['Predatory mites', 'Ladybugs', 'Minute pirate bugs'],
      cultural: ['Increase humidity', 'Strong water spray', 'Remove affected leaves'],
      chemical: ['Insecticidal soap', 'Neem oil', 'Sulfur sprays'],
    },
  },
};

const IPMCalculator = () => {
  const [inputs, setInputs] = useState({
    cropType: '',
    pestType: '',
    infestationLevel: '',
    cropStage: '',
    weatherConditions: '',
    previousControls: '',
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

  const calculateRisk = () => {
    const { cropType, pestType, infestationLevel, cropStage, weatherConditions } = inputs;
    
    if (!cropType || !pestType || !infestationLevel || !cropStage || !weatherConditions) {
      setError('Please fill in all required fields');
      return;
    }

    const pestInfo = pestDatabase[pestType.toLowerCase()];
    if (!pestInfo) {
      setError('Pest type not found in database');
      return;
    }

    // Calculate risk factors
    const infestationRisk = calculateInfestationRisk(infestationLevel, pestInfo.thresholds);
    const cropStageRisk = calculateCropStageRisk(cropStage);
    const weatherRisk = calculateWeatherRisk(weatherConditions);

    // Generate recommendations
    const recommendations = generateRecommendations(
      pestInfo,
      infestationRisk,
      cropStageRisk,
      weatherRisk
    );

    setAssessment({
      riskLevel: (infestationRisk + cropStageRisk + weatherRisk) / 3,
      recommendations,
      controlMethods: pestInfo.controls,
    });
  };

  const calculateInfestationRisk = (level, thresholds) => {
    switch (level) {
      case 'low':
        return 1;
      case 'moderate':
        return 2;
      case 'high':
        return 3;
      default:
        return 0;
    }
  };

  const calculateCropStageRisk = (stage) => {
    switch (stage) {
      case 'seedling':
        return 3;
      case 'vegetative':
        return 2;
      case 'mature':
        return 1;
      default:
        return 0;
    }
  };

  const calculateWeatherRisk = (conditions) => {
    switch (conditions) {
      case 'favorable':
        return 3;
      case 'moderate':
        return 2;
      case 'unfavorable':
        return 1;
      default:
        return 0;
    }
  };

  const generateRecommendations = (pestInfo, infestationRisk, cropStageRisk, weatherRisk) => {
    const totalRisk = (infestationRisk + cropStageRisk + weatherRisk) / 3;
    
    if (totalRisk <= 1.5) {
      return {
        priority: 'Low',
        actions: [
          'Monitor pest populations regularly',
          'Continue preventive cultural practices',
          'Consider biological controls as preventive measure',
        ],
        methods: pestInfo.controls.cultural.concat(pestInfo.controls.biological.slice(0, 2)),
      };
    } else if (totalRisk <= 2.5) {
      return {
        priority: 'Moderate',
        actions: [
          'Implement biological controls',
          'Strengthen cultural control measures',
          'Prepare chemical controls as backup',
        ],
        methods: pestInfo.controls.biological.concat(pestInfo.controls.cultural),
      };
    } else {
      return {
        priority: 'High',
        actions: [
          'Immediate intervention required',
          'Integrate multiple control methods',
          'Consider chemical controls if other methods fail',
        ],
        methods: [
          ...pestInfo.controls.biological,
          ...pestInfo.controls.cultural,
          ...pestInfo.controls.chemical,
        ],
      };
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        IPM Decision Tool
        <Tooltip title="Integrated Pest Management helps make informed decisions about pest control">
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
            <InputLabel>Pest Type</InputLabel>
            <Select
              name="pestType"
              value={inputs.pestType}
              onChange={handleInputChange}
              label="Pest Type"
            >
              <MenuItem value="aphids">Aphids</MenuItem>
              <MenuItem value="caterpillars">Caterpillars</MenuItem>
              <MenuItem value="mites">Mites</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Infestation Level</InputLabel>
            <Select
              name="infestationLevel"
              value={inputs.infestationLevel}
              onChange={handleInputChange}
              label="Infestation Level"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Crop Stage</InputLabel>
            <Select
              name="cropStage"
              value={inputs.cropStage}
              onChange={handleInputChange}
              label="Crop Stage"
            >
              <MenuItem value="seedling">Seedling</MenuItem>
              <MenuItem value="vegetative">Vegetative</MenuItem>
              <MenuItem value="mature">Mature</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Weather Conditions</InputLabel>
            <Select
              name="weatherConditions"
              value={inputs.weatherConditions}
              onChange={handleInputChange}
              label="Weather Conditions"
            >
              <MenuItem value="favorable">Favorable for Pests</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="unfavorable">Unfavorable for Pests</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Previous Control Methods"
            name="previousControls"
            value={inputs.previousControls}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={calculateRisk}
          fullWidth
          startIcon={<BugIcon />}
        >
          Analyze and Generate Recommendations
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
            IPM Assessment Results
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Risk Assessment
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography component="legend">Overall Risk Level:</Typography>
                    <Rating
                      value={Math.round(assessment.riskLevel)}
                      readOnly
                      icon={<WarningIcon color="warning" />}
                      emptyIcon={<WarningIcon color="disabled" />}
                    />
                  </Box>
                  <Typography variant="body1" color="error" gutterBottom>
                    Priority: {assessment.recommendations.priority}
                  </Typography>
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
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Control Methods
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Biological Controls
                      </Typography>
                      <List>
                        {assessment.controlMethods.biological.map((method, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={method} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Cultural Controls
                      </Typography>
                      <List>
                        {assessment.controlMethods.cultural.map((method, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={method} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Chemical Controls (Last Resort)
                      </Typography>
                      <List>
                        {assessment.controlMethods.chemical.map((method, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={method} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default IPMCalculator;
