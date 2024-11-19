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

// Animal Unit Equivalents (AUE) for different livestock types
const livestockTypes = {
  'Beef Cow (1000 lbs with calf)': 1.0,
  'Bull (mature)': 1.3,
  'Yearling Cattle (600-800 lbs)': 0.7,
  'Sheep (mature)': 0.2,
  'Goat (mature)': 0.15,
  'Horse (mature)': 1.25,
  'Alpaca': 0.3,
  'Llama': 0.4
};

// Pasture quality ratings and their carrying capacity (AUM/acre/year)
const pastureQuality = {
  'Excellent': 1.0,
  'Good': 0.75,
  'Fair': 0.5,
  'Poor': 0.25
};

const StockingRateCalculator = () => {
  const [formData, setFormData] = useState({
    pastureAcres: '',
    pastureQuality: 'Good',
    livestockType: 'Beef Cow (1000 lbs with calf)',
    grazingMonths: ''
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

  const calculateStockingRate = () => {
    if (!formData.pastureAcres || !formData.grazingMonths) {
      setError('Please fill in all required fields');
      return;
    }

    const acres = parseFloat(formData.pastureAcres);
    const months = parseFloat(formData.grazingMonths);
    const aue = livestockTypes[formData.livestockType];
    const qualityFactor = pastureQuality[formData.pastureQuality];

    // Calculate Animal Unit Months (AUM) available
    const totalAUM = acres * qualityFactor * months;
    
    // Calculate recommended number of animals
    const recommendedAnimals = Math.floor(totalAUM / (aue * months));
    
    // Calculate actual stocking rate (AUM/acre)
    const actualStockingRate = (recommendedAnimals * aue * months) / acres;

    setResults({
      recommendedAnimals,
      totalAUM,
      actualStockingRate,
      aue
    });
    setError('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Stocking Rate Calculator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pasture Size (acres)"
              name="pastureAcres"
              type="number"
              value={formData.pastureAcres}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Pasture Quality"
              name="pastureQuality"
              value={formData.pastureQuality}
              onChange={handleInputChange}
            >
              {Object.keys(pastureQuality).map(quality => (
                <MenuItem key={quality} value={quality}>
                  {quality}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Livestock Type"
              name="livestockType"
              value={formData.livestockType}
              onChange={handleInputChange}
            >
              {Object.keys(livestockTypes).map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Grazing Period (months)"
              name="grazingMonths"
              type="number"
              value={formData.grazingMonths}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1, max: 12 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateStockingRate}
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
            Results
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Recommended Number of Animals</TableCell>
                  <TableCell align="right">{results.recommendedAnimals}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Animal Unit Months (AUM)</TableCell>
                  <TableCell align="right">{results.totalAUM.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Actual Stocking Rate (AUM/acre)</TableCell>
                  <TableCell align="right">{results.actualStockingRate.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Animal Unit Equivalent (AUE)</TableCell>
                  <TableCell align="right">{results.aue}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default StockingRateCalculator;
