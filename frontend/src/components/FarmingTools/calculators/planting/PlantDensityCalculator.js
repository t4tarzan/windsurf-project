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

const PlantDensityCalculator = () => {
  const [inputs, setInputs] = useState({
    plotLength: '',
    plotWidth: '',
    plantSpacing: '',
    rowSpacing: '',
    unit: 'meters'
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

  const calculateDensity = () => {
    const { plotLength, plotWidth, plantSpacing, rowSpacing, unit } = inputs;
    
    // Validate inputs
    if (!plotLength || !plotWidth || !plantSpacing || !rowSpacing) {
      setError('Please fill in all fields');
      return;
    }

    const values = [plotLength, plotWidth, plantSpacing, rowSpacing].map(Number);
    if (values.some(isNaN)) {
      setError('All inputs must be valid numbers');
      return;
    }

    // Convert all measurements to square meters if needed
    const conversionFactor = unit === 'feet' ? 0.3048 : 1;
    const length = values[0] * conversionFactor;
    const width = values[1] * conversionFactor;
    const pSpacing = values[2] * conversionFactor;
    const rSpacing = values[3] * conversionFactor;

    // Calculate results
    const plotArea = length * width;
    const plantsPerRow = Math.floor(length / pSpacing);
    const numberOfRows = Math.floor(width / rSpacing);
    const totalPlants = plantsPerRow * numberOfRows;
    const density = totalPlants / plotArea;

    setResults({
      plotArea: plotArea.toFixed(2),
      plantsPerRow,
      numberOfRows,
      totalPlants,
      density: density.toFixed(2)
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Plant Density Calculator
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Calculate the optimal number of plants for your plot based on spacing requirements.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Unit of Measurement</InputLabel>
            <Select
              name="unit"
              value={inputs.unit}
              label="Unit of Measurement"
              onChange={handleInputChange}
            >
              <MenuItem value="meters">Meters</MenuItem>
              <MenuItem value="feet">Feet</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={`Plot Length (${inputs.unit})`}
            name="plotLength"
            value={inputs.plotLength}
            onChange={handleInputChange}
            type="number"
            inputProps={{ min: 0, step: "0.1" }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={`Plot Width (${inputs.unit})`}
            name="plotWidth"
            value={inputs.plotWidth}
            onChange={handleInputChange}
            type="number"
            inputProps={{ min: 0, step: "0.1" }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={`Plant Spacing (${inputs.unit})`}
            name="plantSpacing"
            value={inputs.plantSpacing}
            onChange={handleInputChange}
            type="number"
            inputProps={{ min: 0, step: "0.1" }}
            helperText="Distance between plants in a row"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={`Row Spacing (${inputs.unit})`}
            name="rowSpacing"
            value={inputs.rowSpacing}
            onChange={handleInputChange}
            type="number"
            inputProps={{ min: 0, step: "0.1" }}
            helperText="Distance between rows"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateDensity}
            fullWidth
          >
            Calculate Density
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
                Plot Area: {results.plotArea} m²
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Plants per Row: {results.plantsPerRow}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Number of Rows: {results.numberOfRows}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Total Plants: {results.totalPlants}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                Plant Density: {results.density} plants/m²
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default PlantDensityCalculator;
