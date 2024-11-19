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
} from '@mui/material';

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
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Growing Degree Days Calculator
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
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
