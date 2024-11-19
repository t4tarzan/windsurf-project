import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Slider,
  Box,
} from '@mui/material';

const cropData = {
  'Tomato': {
    yieldPerPlant: { min: 2.5, max: 4.5, unit: 'kg' },
    spacingInRow: 45,
    rowSpacing: 90,
    growingConditions: {
      poor: 0.6,
      fair: 0.8,
      good: 1.0,
      excellent: 1.2
    },
    notes: 'Indeterminate varieties may yield more over a longer season'
  },
  'Lettuce': {
    yieldPerPlant: { min: 0.3, max: 0.5, unit: 'kg' },
    spacingInRow: 30,
    rowSpacing: 45,
    growingConditions: {
      poor: 0.7,
      fair: 0.85,
      good: 1.0,
      excellent: 1.15
    },
    notes: 'Multiple harvests possible with cut-and-come-again varieties'
  },
  'Carrot': {
    yieldPerPlant: { min: 0.1, max: 0.15, unit: 'kg' },
    spacingInRow: 5,
    rowSpacing: 30,
    growingConditions: {
      poor: 0.6,
      fair: 0.8,
      good: 1.0,
      excellent: 1.2
    },
    notes: 'Loose, deep soil is essential for good root development'
  },
  'Potato': {
    yieldPerPlant: { min: 0.8, max: 1.5, unit: 'kg' },
    spacingInRow: 30,
    rowSpacing: 75,
    growingConditions: {
      poor: 0.5,
      fair: 0.75,
      good: 1.0,
      excellent: 1.25
    },
    notes: 'Higher yields with proper hilling and consistent moisture'
  },
  'Bush Beans': {
    yieldPerPlant: { min: 0.3, max: 0.5, unit: 'kg' },
    spacingInRow: 15,
    rowSpacing: 45,
    growingConditions: {
      poor: 0.7,
      fair: 0.85,
      good: 1.0,
      excellent: 1.2
    },
    notes: 'Multiple harvests over 3-4 weeks'
  }
};

const growingConditionsMarks = [
  { value: 0, label: 'Poor' },
  { value: 33, label: 'Fair' },
  { value: 66, label: 'Good' },
  { value: 100, label: 'Excellent' }
];

const YieldEstimator = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [plotLength, setPlotLength] = useState('');
  const [plotWidth, setPlotWidth] = useState('');
  const [growingConditions, setGrowingConditions] = useState(66); // Default to 'Good'
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const getConditionMultiplier = (value) => {
    if (value <= 0) return 'poor';
    if (value <= 33) return 'fair';
    if (value <= 66) return 'good';
    return 'excellent';
  };

  const calculateYield = () => {
    if (!selectedCrop || !plotLength || !plotWidth) {
      setError('Please fill in all fields');
      return;
    }

    const length = parseFloat(plotLength);
    const width = parseFloat(plotWidth);

    if (length <= 0 || width <= 0) {
      setError('Plot dimensions must be greater than 0');
      return;
    }

    const crop = cropData[selectedCrop];
    const areaInSquareMeters = length * width;

    // Calculate number of rows and plants per row
    const numberOfRows = Math.floor((width * 100) / crop.rowSpacing);
    const plantsPerRow = Math.floor((length * 100) / crop.spacingInRow);
    const totalPlants = numberOfRows * plantsPerRow;

    // Calculate yield range
    const conditionMultiplier = crop.growingConditions[getConditionMultiplier(growingConditions)];
    const minYield = totalPlants * crop.yieldPerPlant.min * conditionMultiplier;
    const maxYield = totalPlants * crop.yieldPerPlant.max * conditionMultiplier;

    setResults({
      numberOfRows,
      plantsPerRow,
      totalPlants,
      minYield: minYield.toFixed(1),
      maxYield: maxYield.toFixed(1),
      unit: crop.yieldPerPlant.unit,
      plantDensity: (totalPlants / areaInSquareMeters).toFixed(1)
    });
    setError('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Yield Estimator
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Estimate potential crop yields based on plot size and growing conditions.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Select Crop"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              margin="normal"
            >
              {Object.keys(cropData).map((crop) => (
                <MenuItem key={crop} value={crop}>
                  {crop}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Plot Length (meters)"
              type="number"
              value={plotLength}
              onChange={(e) => setPlotLength(e.target.value)}
              margin="normal"
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Plot Width (meters)"
              type="number"
              value={plotWidth}
              onChange={(e) => setPlotWidth(e.target.value)}
              margin="normal"
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Growing Conditions</Typography>
            <Slider
              value={growingConditions}
              onChange={(e, newValue) => setGrowingConditions(newValue)}
              marks={growingConditionsMarks}
              step={null}
              valueLabelDisplay="off"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateYield}
              disabled={!selectedCrop || !plotLength || !plotWidth}
            >
              Calculate Yield
            </Button>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {selectedCrop && cropData[selectedCrop] && (
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Yield per Plant</TableCell>
                      <TableCell>Plant Spacing</TableCell>
                      <TableCell>Row Spacing</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {cropData[selectedCrop].yieldPerPlant.min}-{cropData[selectedCrop].yieldPerPlant.max} {cropData[selectedCrop].yieldPerPlant.unit}
                      </TableCell>
                      <TableCell>{cropData[selectedCrop].spacingInRow} cm</TableCell>
                      <TableCell>{cropData[selectedCrop].rowSpacing} cm</TableCell>
                      <TableCell>{cropData[selectedCrop].notes}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}

          {results && (
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Planting Layout</TableCell>
                      <TableCell>Plant Density</TableCell>
                      <TableCell>Estimated Yield Range</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {results.numberOfRows} rows × {results.plantsPerRow} plants
                        <Typography variant="caption" display="block">
                          Total: {results.totalPlants} plants
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {results.plantDensity} plants/m²
                      </TableCell>
                      <TableCell>
                        {results.minYield} - {results.maxYield} {results.unit}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default YieldEstimator;
