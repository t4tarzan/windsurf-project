import React, { useState } from 'react';
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
  Slider,
} from '@mui/material';
import { WbSunny, LocationOn, Terrain, NorthWest } from '@mui/icons-material';

const SunExposure = () => {
  const [inputs, setInputs] = useState({
    latitude: '',
    longitude: '',
    date: new Date().toISOString().split('T')[0],
    slope: 0,
    aspect: 0,
    obstructions: [],
    season: 'summer',
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const seasons = [
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' },
  ];

  const obstructionTypes = [
    { value: 'building', label: 'Building', defaultHeight: 30 },
    { value: 'tree', label: 'Tree', defaultHeight: 20 },
    { value: 'hill', label: 'Hill', defaultHeight: 50 },
    { value: 'wall', label: 'Wall', defaultHeight: 10 },
  ];

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

  const addObstruction = () => {
    setInputs(prev => ({
      ...prev,
      obstructions: [
        ...prev.obstructions,
        {
          type: 'building',
          distance: 0,
          height: 30,
          azimuth: 0
        }
      ]
    }));
  };

  const updateObstruction = (index, field, value) => {
    const newObstructions = [...inputs.obstructions];
    newObstructions[index] = {
      ...newObstructions[index],
      [field]: value
    };
    setInputs(prev => ({
      ...prev,
      obstructions: newObstructions
    }));
  };

  const removeObstruction = (index) => {
    setInputs(prev => ({
      ...prev,
      obstructions: prev.obstructions.filter((_, i) => i !== index)
    }));
  };

  const validateInputs = () => {
    if (!inputs.latitude || !inputs.longitude) {
      setError('Please enter latitude and longitude');
      return false;
    }

    const lat = parseFloat(inputs.latitude);
    const lon = parseFloat(inputs.longitude);

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90 degrees');
      return false;
    }

    if (lon < -180 || lon > 180) {
      setError('Longitude must be between -180 and 180 degrees');
      return false;
    }

    return true;
  };

  const calculateSunExposure = () => {
    if (!validateInputs()) return;

    const lat = parseFloat(inputs.latitude);
    const slope = inputs.slope;
    const aspect = inputs.aspect;

    // Calculate solar declination based on season
    let declination;
    switch (inputs.season) {
      case 'summer':
        declination = 23.45;
        break;
      case 'winter':
        declination = -23.45;
        break;
      default:
        declination = 0;
    }

    // Calculate maximum solar elevation angle
    const solarElevation = 90 - Math.abs(lat - declination);

    // Calculate effective surface angle relative to sun
    const effectiveAngle = calculateEffectiveSurfaceAngle(slope, aspect, solarElevation);

    // Calculate base sun hours (without obstructions)
    let baseSunHours = calculateBaseSunHours(lat, inputs.season);

    // Adjust for slope and aspect
    const slopeAspectFactor = Math.cos(effectiveAngle * Math.PI / 180);
    baseSunHours *= Math.max(0.5, slopeAspectFactor);

    // Calculate obstruction impact
    const obstructionFactor = calculateObstructionFactor(inputs.obstructions, solarElevation);

    // Final sun hours accounting for all factors
    const actualSunHours = baseSunHours * obstructionFactor;

    // Calculate light intensity categories
    const intensity = calculateLightIntensity(actualSunHours);

    setResults({
      dailySunHours: actualSunHours.toFixed(1),
      intensity: intensity,
      maxSolarElevation: solarElevation.toFixed(1),
      recommendations: generateRecommendations(intensity)
    });
  };

  const calculateEffectiveSurfaceAngle = (slope, aspect, solarElevation) => {
    // Convert angles to radians
    const slopeRad = slope * Math.PI / 180;
    const aspectRad = aspect * Math.PI / 180;
    const elevationRad = solarElevation * Math.PI / 180;

    // Calculate effective angle using spherical trigonometry
    const effectiveAngle = Math.acos(
      Math.cos(slopeRad) * Math.cos(elevationRad) +
      Math.sin(slopeRad) * Math.sin(elevationRad) * Math.cos(aspectRad)
    );

    return effectiveAngle * 180 / Math.PI;
  };

  const calculateBaseSunHours = (latitude, season) => {
    // Approximate base sun hours based on latitude and season
    const absLat = Math.abs(latitude);
    let baseHours;

    switch (season) {
      case 'summer':
        baseHours = 14 - (absLat / 15);
        break;
      case 'winter':
        baseHours = 9 - (absLat / 10);
        break;
      default: // spring/fall
        baseHours = 12 - (absLat / 12);
    }

    return Math.max(0, Math.min(24, baseHours));
  };

  const calculateObstructionFactor = (obstructions, solarElevation) => {
    if (obstructions.length === 0) return 1.0;

    let totalImpact = 0;
    obstructions.forEach(obs => {
      const distance = parseFloat(obs.distance);
      const height = parseFloat(obs.height);
      
      if (distance > 0) {
        // Calculate the angle of obstruction
        const obstructionAngle = Math.atan(height / distance) * 180 / Math.PI;
        // Impact is based on how much of the sky is blocked
        totalImpact += Math.max(0, Math.min(1, obstructionAngle / solarElevation));
      }
    });

    // Return factor between 0.5 and 1.0
    return Math.max(0.5, 1 - (totalImpact / obstructions.length) * 0.5);
  };

  const calculateLightIntensity = (sunHours) => {
    if (sunHours >= 6) return 'Full Sun';
    if (sunHours >= 4) return 'Partial Sun';
    if (sunHours >= 2) return 'Partial Shade';
    return 'Full Shade';
  };

  const generateRecommendations = (intensity) => {
    switch (intensity) {
      case 'Full Sun':
        return [
          'Ideal for sun-loving crops like tomatoes, peppers, and squash',
          'Consider shade cloth during peak summer hours',
          'Ensure adequate irrigation to prevent water stress'
        ];
      case 'Partial Sun':
        return [
          'Good for leafy greens, herbs, and root vegetables',
          'Monitor soil moisture as partial sun areas may dry unevenly',
          'Consider extending growing season with cold frames'
        ];
      case 'Partial Shade':
        return [
          'Suitable for shade-tolerant crops like lettuce and spinach',
          'Focus on early spring and fall crops',
          'Consider using reflective mulch to maximize available light'
        ];
      case 'Full Shade':
        return [
          'Best for mushrooms and some herbs',
          'Consider container gardening to maximize mobility',
          'Install light-colored surfaces to reflect available light'
        ];
      default:
        return [];
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Sun Exposure Calculator
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Calculate the amount of sunlight your growing area receives based on location, terrain, and obstacles.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Latitude"
              name="latitude"
              value={inputs.latitude}
              onChange={handleInputChange}
              type="number"
              InputProps={{
                startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Longitude"
              name="longitude"
              value={inputs.longitude}
              onChange={handleInputChange}
              type="number"
              InputProps={{
                startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Season</InputLabel>
              <Select
                name="season"
                value={inputs.season}
                onChange={handleInputChange}
                label="Season"
              >
                {seasons.map(season => (
                  <MenuItem key={season.value} value={season.value}>
                    {season.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              value={inputs.date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Slope (degrees)
            </Typography>
            <Slider
              value={inputs.slope}
              onChange={handleSliderChange('slope')}
              valueLabelDisplay="auto"
              min={0}
              max={45}
              marks={[
                { value: 0, label: '0°' },
                { value: 45, label: '45°' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Aspect (degrees from North)
            </Typography>
            <Slider
              value={inputs.aspect}
              onChange={handleSliderChange('aspect')}
              valueLabelDisplay="auto"
              min={0}
              max={360}
              marks={[
                { value: 0, label: 'N' },
                { value: 90, label: 'E' },
                { value: 180, label: 'S' },
                { value: 270, label: 'W' },
                { value: 360, label: 'N' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Obstructions
            </Typography>
            {inputs.obstructions.map((obstruction, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={obstruction.type}
                        onChange={(e) => updateObstruction(index, 'type', e.target.value)}
                        label="Type"
                      >
                        {obstructionTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Distance (m)"
                      type="number"
                      value={obstruction.distance}
                      onChange={(e) => updateObstruction(index, 'distance', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Height (m)"
                      type="number"
                      value={obstruction.height}
                      onChange={(e) => updateObstruction(index, 'height', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Azimuth (°)"
                      type="number"
                      value={obstruction.azimuth}
                      onChange={(e) => updateObstruction(index, 'azimuth', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeObstruction(index)}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={addObstruction}
              startIcon={<Terrain />}
            >
              Add Obstruction
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateSunExposure}
              fullWidth
              startIcon={<WbSunny />}
            >
              Calculate Sun Exposure
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
                  Daily Sun Hours: {results.dailySunHours} hours
                </Typography>
                <Typography variant="body1">
                  Light Intensity Category: {results.intensity}
                </Typography>
                <Typography variant="body1">
                  Maximum Solar Elevation: {results.maxSolarElevation}°
                </Typography>
                
                <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                  Recommendations
                </Typography>
                <ul>
                  {results.recommendations.map((rec, index) => (
                    <li key={index}>
                      <Typography variant="body1">{rec}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SunExposure;
