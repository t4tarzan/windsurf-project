import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  Alert,
  MenuItem,
  Divider,
  Slider
} from '@mui/material';
import { WaterDrop as WaterIcon } from '@mui/icons-material';

const WaterRequirementCalculator = () => {
  const [inputs, setInputs] = useState({
    cropType: '',
    areaSize: '',
    areaUnit: 'sqft',
    soilType: '',
    rainfall: '',
    temperature: '',
    humidity: 50
  });

  const [result, setResult] = useState(null);

  const cropTypes = [
    { value: 'tomato', label: 'Tomatoes', waterNeed: 1 },
    { value: 'corn', label: 'Corn', waterNeed: 1.5 },
    { value: 'lettuce', label: 'Lettuce', waterNeed: 0.8 },
    { value: 'potato', label: 'Potatoes', waterNeed: 1.2 },
    { value: 'beans', label: 'Beans', waterNeed: 0.9 }
  ];

  const soilTypes = [
    { value: 'sandy', label: 'Sandy', retentionFactor: 0.7 },
    { value: 'loamy', label: 'Loamy', retentionFactor: 1 },
    { value: 'clay', label: 'Clay', retentionFactor: 1.3 },
    { value: 'silty', label: 'Silty', retentionFactor: 1.1 }
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (event, newValue) => {
    setInputs(prev => ({
      ...prev,
      humidity: newValue
    }));
  };

  const calculateWaterRequirement = () => {
    const area = parseFloat(inputs.areaSize);
    const rainfall = parseFloat(inputs.rainfall);
    const temperature = parseFloat(inputs.temperature);
    
    if (area && rainfall && temperature) {
      const crop = cropTypes.find(c => c.value === inputs.cropType);
      const soil = soilTypes.find(s => s.value === inputs.soilType);
      
      // Basic calculation formula
      const baseWaterNeed = crop.waterNeed * area;
      const temperatureFactor = 1 + (temperature - 20) * 0.03;
      const humidityFactor = 1 - (inputs.humidity / 100) * 0.3;
      const soilFactor = soil.retentionFactor;
      
      const waterNeeded = baseWaterNeed * temperatureFactor * humidityFactor * soilFactor;
      const effectiveRainfall = rainfall * 0.8; // Assuming 80% rainfall effectiveness
      const additionalWater = Math.max(0, waterNeeded - effectiveRainfall);

      setResult({
        dailyWater: waterNeeded.toFixed(2),
        weeklyWater: (waterNeeded * 7).toFixed(2),
        monthlyWater: (waterNeeded * 30).toFixed(2),
        additionalWater: additionalWater.toFixed(2)
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Water Requirement Calculator
      </Typography>
      <Typography color="text.secondary" paragraph>
        Calculate daily, weekly, and monthly water requirements for your crops based on environmental conditions.
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Crop Type"
            name="cropType"
            value={inputs.cropType}
            onChange={handleInputChange}
            helperText="Select your crop type"
          >
            {cropTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Soil Type"
            name="soilType"
            value={inputs.soilType}
            onChange={handleInputChange}
            helperText="Select your soil type"
          >
            {soilTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Area Size"
            name="areaSize"
            type="number"
            value={inputs.areaSize}
            onChange={handleInputChange}
            helperText="Enter the area size"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Area Unit"
            name="areaUnit"
            value={inputs.areaUnit}
            onChange={handleInputChange}
          >
            <MenuItem value="sqft">Square Feet</MenuItem>
            <MenuItem value="sqm">Square Meters</MenuItem>
            <MenuItem value="acre">Acres</MenuItem>
            <MenuItem value="hectare">Hectares</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Average Rainfall"
            name="rainfall"
            type="number"
            value={inputs.rainfall}
            onChange={handleInputChange}
            helperText="mm per day"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Average Temperature"
            name="temperature"
            type="number"
            value={inputs.temperature}
            onChange={handleInputChange}
            helperText="°C"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>Relative Humidity (%)</Typography>
          <Slider
            value={inputs.humidity}
            onChange={handleSliderChange}
            aria-labelledby="humidity-slider"
            valueLabelDisplay="auto"
            step={5}
            marks
            min={0}
            max={100}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateWaterRequirement}
              startIcon={<WaterIcon />}
              size="large"
            >
              Calculate Water Needs
            </Button>
          </Box>
        </Grid>
      </Grid>

      {result && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Water Requirements:
            </Typography>
            <Typography variant="body2">
              • Daily water need: {result.dailyWater} liters<br />
              • Weekly water need: {result.weeklyWater} liters<br />
              • Monthly water need: {result.monthlyWater} liters<br />
              • Additional water needed (accounting for rainfall): {result.additionalWater} liters
            </Typography>
          </Alert>
        </Box>
      )}
    </Paper>
  );
};

export default WaterRequirementCalculator;
