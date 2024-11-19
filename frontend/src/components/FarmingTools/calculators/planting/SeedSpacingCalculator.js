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
  Divider
} from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';

const SeedSpacingCalculator = () => {
  const [inputs, setInputs] = useState({
    plantType: '',
    rowLength: '',
    rowSpacing: '',
    plantSpacing: '',
    unit: 'inches'
  });

  const [result, setResult] = useState(null);

  const plantTypes = [
    { value: 'tomato', label: 'Tomatoes', spacing: 24 },
    { value: 'carrot', label: 'Carrots', spacing: 3 },
    { value: 'lettuce', label: 'Lettuce', spacing: 6 },
    { value: 'pepper', label: 'Peppers', spacing: 18 },
    { value: 'cucumber', label: 'Cucumbers', spacing: 12 }
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'plantType') {
      const plant = plantTypes.find(p => p.value === value);
      if (plant) {
        setInputs(prev => ({
          ...prev,
          plantSpacing: plant.spacing
        }));
      }
    }
  };

  const calculateSpacing = () => {
    const rowLength = parseFloat(inputs.rowLength);
    const rowSpacing = parseFloat(inputs.rowSpacing);
    const plantSpacing = parseFloat(inputs.plantSpacing);

    if (rowLength && rowSpacing && plantSpacing) {
      const plantsPerRow = Math.floor(rowLength / plantSpacing);
      const totalRows = Math.floor(rowSpacing);
      const totalPlants = plantsPerRow * totalRows;
      const area = rowLength * rowSpacing;

      setResult({
        plantsPerRow,
        totalRows,
        totalPlants,
        area: area.toFixed(2)
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Seed Spacing Calculator
      </Typography>
      <Typography color="text.secondary" paragraph>
        Calculate optimal plant spacing and estimate the number of plants for your garden area.
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Plant Type"
            name="plantType"
            value={inputs.plantType}
            onChange={handleInputChange}
            helperText="Select a common plant or enter custom spacing"
          >
            {plantTypes.map((option) => (
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
            label="Unit"
            name="unit"
            value={inputs.unit}
            onChange={handleInputChange}
          >
            <MenuItem value="inches">Inches</MenuItem>
            <MenuItem value="cm">Centimeters</MenuItem>
            <MenuItem value="feet">Feet</MenuItem>
            <MenuItem value="meters">Meters</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Row Length"
            name="rowLength"
            type="number"
            value={inputs.rowLength}
            onChange={handleInputChange}
            helperText={`Length in ${inputs.unit}`}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Row Spacing"
            name="rowSpacing"
            type="number"
            value={inputs.rowSpacing}
            onChange={handleInputChange}
            helperText={`Space between rows in ${inputs.unit}`}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Plant Spacing"
            name="plantSpacing"
            type="number"
            value={inputs.plantSpacing}
            onChange={handleInputChange}
            helperText={`Space between plants in ${inputs.unit}`}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateSpacing}
              startIcon={<CalculateIcon />}
              size="large"
            >
              Calculate
            </Button>
          </Box>
        </Grid>
      </Grid>

      {result && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Calculation Results:
            </Typography>
            <Typography variant="body2">
              • Plants per row: {result.plantsPerRow}<br />
              • Number of rows: {result.totalRows}<br />
              • Total plants needed: {result.totalPlants}<br />
              • Total area: {result.area} square {inputs.unit}
            </Typography>
          </Alert>
        </Box>
      )}
    </Paper>
  );
};

export default SeedSpacingCalculator;
