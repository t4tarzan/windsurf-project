import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const IrrigationScheduler = () => {
  const [inputs, setInputs] = useState({
    cropType: '',
    soilType: '',
    area: '',
    rainfall: '',
    temperature: '',
    season: ''
  });
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState('');

  const cropTypes = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Root Crops',
    'Legumes',
    'Herbs'
  ];

  const soilTypes = [
    'Sandy',
    'Loamy',
    'Clay',
    'Silt',
    'Peat',
    'Chalky'
  ];

  const seasons = [
    'Spring',
    'Summer',
    'Fall',
    'Winter'
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateSchedule = () => {
    try {
      // Validate inputs
      if (Object.values(inputs).some(val => val === '')) {
        throw new Error('Please fill in all fields');
      }

      const area = Number(inputs.area);
      const rainfall = Number(inputs.rainfall);
      const temperature = Number(inputs.temperature);

      if (isNaN(area) || isNaN(rainfall) || isNaN(temperature)) {
        throw new Error('Please enter valid numbers for area, rainfall, and temperature');
      }

      // Calculate water requirements based on inputs
      let baseWaterNeed = 0;
      switch (inputs.cropType) {
        case 'Vegetables':
          baseWaterNeed = 1.2;
          break;
        case 'Fruits':
          baseWaterNeed = 1.5;
          break;
        case 'Grains':
          baseWaterNeed = 1.0;
          break;
        case 'Root Crops':
          baseWaterNeed = 0.8;
          break;
        case 'Legumes':
          baseWaterNeed = 0.9;
          break;
        case 'Herbs':
          baseWaterNeed = 0.7;
          break;
        default:
          baseWaterNeed = 1.0;
      }

      // Adjust for soil type
      let soilFactor = 1.0;
      switch (inputs.soilType) {
        case 'Sandy':
          soilFactor = 1.3;
          break;
        case 'Loamy':
          soilFactor = 1.0;
          break;
        case 'Clay':
          soilFactor = 0.8;
          break;
        case 'Silt':
          soilFactor = 0.9;
          break;
        case 'Peat':
          soilFactor = 1.2;
          break;
        case 'Chalky':
          soilFactor = 1.1;
          break;
        default:
          soilFactor = 1.0;
      }

      // Adjust for temperature
      const tempFactor = Math.max(1, temperature / 75);

      // Calculate daily water requirement
      const dailyWater = (baseWaterNeed * soilFactor * tempFactor * area) - (rainfall / 7);

      // Generate weekly schedule
      const weeklySchedule = [
        'Monday',
        'Wednesday',
        'Friday',
        'Sunday'
      ].map(day => ({
        day,
        amount: (dailyWater * 1.75).toFixed(2), // Multiply by 1.75 to account for non-watering days
        duration: Math.ceil((dailyWater * 1.75) / 0.5) // Assuming 0.5 gallons per minute flow rate
      }));

      setSchedule({
        weeklySchedule,
        totalWeeklyWater: (dailyWater * 7).toFixed(2),
        recommendations: [
          'Water early morning or late evening to minimize evaporation',
          'Adjust schedule based on actual rainfall',
          'Monitor soil moisture regularly',
          'Consider using mulch to retain moisture'
        ]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Irrigation Scheduler
        <Tooltip title="Calculate optimal irrigation schedules based on crop type, soil conditions, and weather">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Crop Type</InputLabel>
                <Select
                  name="cropType"
                  value={inputs.cropType}
                  onChange={handleInputChange}
                  label="Crop Type"
                >
                  {cropTypes.map(crop => (
                    <MenuItem key={crop} value={crop}>{crop}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Soil Type</InputLabel>
                <Select
                  name="soilType"
                  value={inputs.soilType}
                  onChange={handleInputChange}
                  label="Soil Type"
                >
                  {soilTypes.map(soil => (
                    <MenuItem key={soil} value={soil}>{soil}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Area"
                name="area"
                value={inputs.area}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">sq ft</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Weekly Rainfall"
                name="rainfall"
                value={inputs.rainfall}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">inches</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Average Temperature"
                name="temperature"
                value={inputs.temperature}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">°F</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Season</InputLabel>
                <Select
                  name="season"
                  value={inputs.season}
                  onChange={handleInputChange}
                  label="Season"
                >
                  {seasons.map(season => (
                    <MenuItem key={season} value={season}>{season}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={calculateSchedule} sx={{ mt: 2 }}>
                Generate Schedule
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {schedule && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Water Amount (gallons)</TableCell>
                    <TableCell>Duration (minutes)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedule.weeklySchedule.map((day) => (
                    <TableRow key={day.day}>
                      <TableCell>{day.day}</TableCell>
                      <TableCell>{day.amount}</TableCell>
                      <TableCell>{day.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Weekly Summary</Typography>
                <Typography>Total Weekly Water Requirement: {schedule.totalWeeklyWater} gallons</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Recommendations</Typography>
                <ul>
                  {schedule.recommendations.map((rec, index) => (
                    <li key={index}><Typography>{rec}</Typography></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default IrrigationScheduler;
