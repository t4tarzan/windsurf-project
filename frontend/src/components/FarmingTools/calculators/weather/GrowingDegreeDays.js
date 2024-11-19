import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Agriculture as AgricultureIcon,
  Science as ScienceIcon,
  WbSunny as WbSunnyIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `Growing Degree Days (GDD) is a weather-based indicator for assessing crop development. It is a calculation used to estimate the growth and development of plants and insects during the growing season.`,
  
  importance: [
    {
      aspect: 'Crop Development',
      description: 'Predicts plant growth stages and maturity dates',
      impact: 'Helps plan harvesting and crop management activities'
    },
    {
      aspect: 'Pest Management',
      description: 'Forecasts insect development and population levels',
      impact: 'Enables timely pest control interventions'
    },
    {
      aspect: 'Resource Planning',
      description: 'Estimates irrigation and fertilizer timing',
      impact: 'Optimizes resource utilization and crop yields'
    },
    {
      aspect: 'Risk Management',
      description: 'Identifies potential weather-related risks',
      impact: 'Helps in making informed crop protection decisions'
    }
  ],

  calculation: {
    method: 'GDD = [(Daily Max Temp + Daily Min Temp)/2] - Base Temperature',
    notes: [
      'If maximum temperature exceeds upper threshold, it is set to the threshold',
      'If minimum temperature falls below base temperature, it is set to base temperature',
      'Negative daily GDD values are set to zero'
    ]
  },
};

const cropBaseTemps = {
  'corn': { name: 'Corn', base: 10 },
  'wheat': { name: 'Wheat', base: 4.4 },
  'soybeans': { name: 'Soybeans', base: 10 },
  'tomatoes': { name: 'Tomatoes', base: 10 },
  'potatoes': { name: 'Potatoes', base: 7 },
  'cotton': { name: 'Cotton', base: 15.6 },
};

const GrowingDegreeDays = () => {
  const [inputs, setInputs] = useState({
    maxTemp: '',
    minTemp: '',
    cropType: '',
    days: '',
    unit: 'celsius'
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const convertToMetric = (temp) => {
    return inputs.unit === 'fahrenheit' ? (temp - 32) * 5/9 : temp;
  };

  const calculateGDD = () => {
    const { maxTemp, minTemp, cropType, days } = inputs;
    
    if (!maxTemp || !minTemp || !cropType || !days) {
      setError('Please fill in all fields');
      return;
    }

    const values = [maxTemp, minTemp, days].map(Number);
    if (values.some(isNaN)) {
      setError('All numeric inputs must be valid numbers');
      return;
    }

    const maxTempC = convertToMetric(values[0]);
    const minTempC = convertToMetric(values[1]);
    const numDays = values[2];
    const baseTemp = cropBaseTemps[cropType].base;

    // Calculate average daily temperature
    const avgTemp = (maxTempC + minTempC) / 2;

    // Calculate GDD
    let gdd = Math.max(0, avgTemp - baseTemp);
    const totalGDD = gdd * numDays;

    // Calculate maturity estimates
    const maturityDays = {
      'corn': 2700,
      'wheat': 2000,
      'soybeans': 2500,
      'tomatoes': 1700,
      'potatoes': 1800,
      'cotton': 2200,
    };

    const daysToMaturity = Math.ceil(maturityDays[cropType] / gdd);

    setResults({
      dailyGDD: gdd.toFixed(2),
      totalGDD: totalGDD.toFixed(2),
      estimatedDaysToMaturity: daysToMaturity,
      baseTemp: baseTemp
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Growing Degree Days Calculator
      </Typography>

      {/* Educational Content Section */}
      <Box mb={4}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} /> What are Growing Degree Days?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <AgricultureIcon sx={{ mr: 1 }} /> Importance in Agriculture
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.importance.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{item.aspect}</Typography>
                      <Typography paragraph>{item.description}</Typography>
                      <Typography variant="body2" color="textSecondary">{item.impact}</Typography>
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
              <ScienceIcon sx={{ mr: 1 }} /> Calculation Method
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" gutterBottom>Formula:</Typography>
            <Typography paragraph sx={{ fontWeight: 'bold' }}>{educationalContent.calculation.method}</Typography>
            <Typography variant="subtitle1" gutterBottom>Important Notes:</Typography>
            <ul>
              {educationalContent.calculation.notes.map((note, index) => (
                <li key={index}>
                  <Typography paragraph>{note}</Typography>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <WbSunnyIcon sx={{ mr: 1 }} /> Crop-Specific Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {Object.entries(cropBaseTemps).map(([key, value], index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{value.name}</Typography>
                      <Typography paragraph>Base temperature: {value.base}°C</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Calculator Form */}
      <Typography variant="h5" gutterBottom>
        Growing Degree Days Calculator
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Calculate growing degree days (GDD) and estimate crop maturity based on temperature data.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Temperature Unit</InputLabel>
            <Select
              name="unit"
              value={inputs.unit}
              label="Temperature Unit"
              onChange={handleInputChange}
            >
              <MenuItem value="celsius">Celsius</MenuItem>
              <MenuItem value="fahrenheit">Fahrenheit</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Crop Type</InputLabel>
            <Select
              name="cropType"
              value={inputs.cropType}
              label="Crop Type"
              onChange={handleInputChange}
            >
              {Object.entries(cropBaseTemps).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={`Maximum Temperature (°${inputs.unit === 'celsius' ? 'C' : 'F'})`}
            name="maxTemp"
            value={inputs.maxTemp}
            onChange={handleInputChange}
            type="number"
            inputProps={{ step: "0.1" }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={`Minimum Temperature (°${inputs.unit === 'celsius' ? 'C' : 'F'})`}
            name="minTemp"
            value={inputs.minTemp}
            onChange={handleInputChange}
            type="number"
            inputProps={{ step: "0.1" }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Number of Days"
            name="days"
            value={inputs.days}
            onChange={handleInputChange}
            type="number"
            inputProps={{ min: 1, step: 1 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateGDD}
            fullWidth
          >
            Calculate GDD
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {results && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Base Temperature: {results.baseTemp}°C
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Daily GDD: {results.dailyGDD}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Total GDD: {results.totalGDD}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                Estimated Days to Maturity: {results.estimatedDaysToMaturity} days
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default GrowingDegreeDays;
