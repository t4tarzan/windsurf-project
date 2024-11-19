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
} from '@mui/material';
import { WaterDrop, Thermostat, Air, WbSunny } from '@mui/icons-material';

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
    <Card>
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
  );
};

export default Evapotranspiration;
