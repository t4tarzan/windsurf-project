import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { 
  WaterDrop, 
  Thermostat, 
  Air, 
  WbSunny, 
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Science as ScienceIcon 
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `Evapotranspiration (ET) is the combined process of water loss through evaporation from soil and transpiration from plants. Understanding ET helps farmers optimize irrigation scheduling and water management.`,
  
  keyFactors: [
    {
      factor: 'Temperature',
      description: 'Higher temperatures increase evaporation rate',
      impact: 'Directly affects water loss rate from soil and plant surfaces'
    },
    {
      factor: 'Humidity',
      description: 'Lower humidity increases evaporation potential',
      impact: 'Influences the rate of water vapor transfer to the atmosphere'
    },
    {
      factor: 'Wind Speed',
      description: 'Higher wind speeds increase evaporation',
      impact: 'Removes humid air and accelerates water loss'
    },
    {
      factor: 'Solar Radiation',
      description: 'Primary energy source for evapotranspiration',
      impact: 'More sunlight means higher evaporation rates'
    }
  ],

  cropStages: {
    initial: {
      stage: 'Initial Growth',
      coefficient: '0.3',
      description: 'Early plant development with minimal leaf area'
    },
    midSeason: {
      stage: 'Mid-Season',
      coefficient: '1.0',
      description: 'Peak growth with maximum water use'
    },
    lateSeason: {
      stage: 'Late Season',
      coefficient: '0.7',
      description: 'Maturity and senescence phase'
    }
  },

  practicalApplications: [
    'Irrigation scheduling optimization',
    'Water conservation planning',
    'Crop water requirement estimation',
    'Drought management strategies'
  ]
};

const Evapotranspiration = () => {
  const [inputs, setInputs] = useState({
    temperature: '',
    humidity: '',
    windSpeed: '',
    solarRadiation: '',
    cropCoefficient: '1.0',
    units: 'metric'
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const cropCoefficientOptions = [
    { value: '0.3', label: 'Initial Growth Stage' },
    { value: '1.0', label: 'Mid-Season' },
    { value: '0.7', label: 'Late Season' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateInputs = () => {
    if (!inputs.temperature || !inputs.humidity || !inputs.windSpeed || !inputs.solarRadiation) {
      setError('Please fill in all required fields');
      return false;
    }
    
    const temp = parseFloat(inputs.temperature);
    const humidity = parseFloat(inputs.humidity);
    const wind = parseFloat(inputs.windSpeed);
    const radiation = parseFloat(inputs.solarRadiation);

    if (humidity < 0 || humidity > 100) {
      setError('Humidity must be between 0 and 100%');
      return false;
    }

    if (wind < 0) {
      setError('Wind speed cannot be negative');
      return false;
    }

    if (radiation < 0) {
      setError('Solar radiation cannot be negative');
      return false;
    }

    return true;
  };

  const calculateET = () => {
    if (!validateInputs()) return;

    // Convert inputs based on unit system
    let temp = parseFloat(inputs.temperature);
    let wind = parseFloat(inputs.windSpeed);
    
    if (inputs.units === 'imperial') {
      // Convert Fahrenheit to Celsius
      temp = (temp - 32) * (5/9);
      // Convert mph to m/s
      wind = wind * 0.44704;
    }

    // Simplified Penman-Monteith equation for reference evapotranspiration (ETo)
    const humidity = parseFloat(inputs.humidity) / 100;
    const radiation = parseFloat(inputs.solarRadiation);
    const cropCoef = parseFloat(inputs.cropCoefficient);

    // Calculate saturated vapor pressure
    const satVaporPressure = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
    
    // Calculate actual vapor pressure
    const actualVaporPressure = satVaporPressure * humidity;
    
    // Calculate vapor pressure deficit
    const vaporPressureDeficit = satVaporPressure - actualVaporPressure;

    // Calculate reference evapotranspiration (ETo)
    let eto = (0.408 * radiation + (900 / (temp + 273)) * wind * vaporPressureDeficit) / 
              (1 + 0.34 * wind);

    // Apply crop coefficient to get actual evapotranspiration (ETc)
    let etc = eto * cropCoef;

    // Convert results if using imperial units
    if (inputs.units === 'imperial') {
      etc = etc * 0.0393701; // Convert mm to inches
    }

    setResults({
      dailyET: etc.toFixed(2),
      weeklyET: (etc * 7).toFixed(2),
      monthlyET: (etc * 30).toFixed(2),
      unit: inputs.units === 'metric' ? 'mm' : 'inches'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Evapotranspiration Calculator
      </Typography>

      {/* Educational Content Section */}
      <Box sx={{ mb: 4 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <WaterDrop sx={{ mr: 1 }} /> About Evapotranspiration
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <ScienceIcon sx={{ mr: 1 }} /> Key Factors
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.keyFactors.map((factor, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{factor.factor}</Typography>
                      <Typography paragraph>{factor.description}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Impact: {factor.impact}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} /> Crop Growth Stages
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {Object.values(educationalContent.cropStages).map((stage, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{stage.stage}</Typography>
                      <Typography paragraph>Coefficient: {stage.coefficient}</Typography>
                      <Typography variant="body2">{stage.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <WbSunny sx={{ mr: 1 }} /> Practical Applications
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.practicalApplications.map((application, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body1">{application}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Calculator Section */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Evapotranspiration Calculator
          </Typography>
        
          <Typography variant="body2" color="textSecondary" paragraph>
            Calculate the water loss through evaporation and plant transpiration based on weather conditions.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Unit System</InputLabel>
                <Select
                  name="units"
                  value={inputs.units}
                  onChange={handleInputChange}
                  label="Unit System"
                >
                  <MenuItem value="metric">Metric (°C, mm)</MenuItem>
                  <MenuItem value="imperial">Imperial (°F, inches)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Temperature (${inputs.units === 'metric' ? '°C' : '°F'})`}
                name="temperature"
                value={inputs.temperature}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <Thermostat color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Relative Humidity (%)"
                name="humidity"
                value={inputs.humidity}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <WaterDrop color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Wind Speed (${inputs.units === 'metric' ? 'm/s' : 'mph'})`}
                name="windSpeed"
                value={inputs.windSpeed}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <Air color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Solar Radiation (MJ/m²/day)"
                name="solarRadiation"
                value={inputs.solarRadiation}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <WbSunny color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Crop Growth Stage</InputLabel>
                <Select
                  name="cropCoefficient"
                  value={inputs.cropCoefficient}
                  onChange={handleInputChange}
                  label="Crop Growth Stage"
                >
                  {cropCoefficientOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={calculateET}
                fullWidth
              >
                Calculate Evapotranspiration
              </Button>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            {results && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Results
                  </Typography>
                  <Typography variant="body1">
                    Daily Evapotranspiration: {results.dailyET} {results.unit}
                  </Typography>
                  <Typography variant="body1">
                    Weekly Evapotranspiration: {results.weeklyET} {results.unit}
                  </Typography>
                  <Typography variant="body1">
                    Monthly Evapotranspiration: {results.monthlyET} {results.unit}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Evapotranspiration;
