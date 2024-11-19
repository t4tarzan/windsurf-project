import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';

// Recovery periods (days) for different pasture types
const pastureTypes = {
  'Tall Fescue': { min: 21, max: 35 },
  'Orchardgrass': { min: 14, max: 28 },
  'Perennial Ryegrass': { min: 14, max: 25 },
  'Kentucky Bluegrass': { min: 21, max: 35 },
  'Alfalfa': { min: 28, max: 42 },
  'Mixed Grass': { min: 21, max: 35 },
  'Native Warm Season': { min: 35, max: 45 }
};

// Seasonal adjustments for growth rates
const seasonalAdjustments = {
  'Spring': 1.2,
  'Summer': 1.0,
  'Fall': 0.8,
  'Winter': 0.6
};

const GrazingRotationPlanner = () => {
  const [formData, setFormData] = useState({
    pastureType: 'Mixed Grass',
    totalAcres: '',
    numberOfPaddocks: '',
    season: 'Spring',
    grazingDays: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRotation = () => {
    if (!formData.totalAcres || !formData.numberOfPaddocks || !formData.grazingDays) {
      setError('Please fill in all required fields');
      return;
    }

    const acres = parseFloat(formData.totalAcres);
    const paddocks = parseInt(formData.numberOfPaddocks);
    const grazingDays = parseInt(formData.grazingDays);
    
    // Get recovery period for selected pasture type
    const recoveryPeriod = {
      min: pastureTypes[formData.pastureType].min,
      max: pastureTypes[formData.pastureType].max
    };

    // Adjust recovery period based on season
    const seasonalFactor = seasonalAdjustments[formData.season];
    recoveryPeriod.min = Math.ceil(recoveryPeriod.min / seasonalFactor);
    recoveryPeriod.max = Math.ceil(recoveryPeriod.max / seasonalFactor);

    // Calculate paddock sizes
    const paddockSize = acres / paddocks;
    
    // Calculate rest period provided
    const restPeriod = grazingDays * (paddocks - 1);
    
    // Calculate total rotation length
    const rotationLength = grazingDays * paddocks;
    
    // Determine if rest period is adequate
    const restAdequacy = restPeriod >= recoveryPeriod.min ? 
      (restPeriod <= recoveryPeriod.max ? 'Optimal' : 'Too Long') : 
      'Too Short';

    setResults({
      paddockSize,
      restPeriod,
      rotationLength,
      recoveryPeriod,
      restAdequacy
    });
    setError('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Grazing Rotation Planner
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Pasture Type"
              name="pastureType"
              value={formData.pastureType}
              onChange={handleInputChange}
            >
              {Object.keys(pastureTypes).map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Season"
              name="season"
              value={formData.season}
              onChange={handleInputChange}
            >
              {Object.keys(seasonalAdjustments).map(season => (
                <MenuItem key={season} value={season}>
                  {season}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Total Pasture Area (acres)"
              name="totalAcres"
              type="number"
              value={formData.totalAcres}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Number of Paddocks"
              name="numberOfPaddocks"
              type="number"
              value={formData.numberOfPaddocks}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Days per Paddock"
              name="grazingDays"
              type="number"
              value={formData.grazingDays}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateRotation}
              fullWidth
            >
              Calculate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Rotation Plan
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Paddock Size</TableCell>
                  <TableCell align="right">{results.paddockSize.toFixed(2)} acres</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rest Period</TableCell>
                  <TableCell align="right">{results.restPeriod} days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Rotation Length</TableCell>
                  <TableCell align="right">{results.rotationLength} days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recommended Recovery Period</TableCell>
                  <TableCell align="right">{results.recoveryPeriod.min}-{results.recoveryPeriod.max} days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rest Period Adequacy</TableCell>
                  <TableCell align="right">{results.restAdequacy}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default GrazingRotationPlanner;
