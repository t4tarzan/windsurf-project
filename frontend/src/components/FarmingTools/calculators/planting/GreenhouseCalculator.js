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
  Tooltip,
  IconButton
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const GreenhouseCalculator = () => {
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    rowSpacing: '',
    plantSpacing: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDimensions(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateSpace = () => {
    try {
      // Validate inputs
      const values = Object.values(dimensions);
      if (values.some(val => val === '' || isNaN(val) || Number(val) <= 0)) {
        throw new Error('Please enter valid positive numbers for all fields');
      }

      const length = Number(dimensions.length);
      const width = Number(dimensions.width);
      const height = Number(dimensions.height);
      const rowSpacing = Number(dimensions.rowSpacing);
      const plantSpacing = Number(dimensions.plantSpacing);

      // Calculate results
      const floorArea = length * width;
      const numberOfRows = Math.floor(width / rowSpacing);
      const plantsPerRow = Math.floor(length / plantSpacing);
      const totalPlants = numberOfRows * plantsPerRow;
      const volume = length * width * height;
      const walkwaySpace = floorArea * 0.2; // Assuming 20% for walkways
      const usableSpace = floorArea - walkwaySpace;

      setResults({
        floorArea: floorArea.toFixed(2),
        volume: volume.toFixed(2),
        numberOfRows,
        plantsPerRow,
        totalPlants,
        walkwaySpace: walkwaySpace.toFixed(2),
        usableSpace: usableSpace.toFixed(2)
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Greenhouse Space Calculator
        <Tooltip title="Calculate optimal space usage in your greenhouse based on dimensions and plant spacing requirements">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Greenhouse Length"
                name="length"
                value={dimensions.length}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Greenhouse Width"
                name="width"
                value={dimensions.width}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Greenhouse Height"
                name="height"
                value={dimensions.height}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Row Spacing"
                name="rowSpacing"
                value={dimensions.rowSpacing}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Plant Spacing"
                name="plantSpacing"
                value={dimensions.plantSpacing}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={calculateSpace} sx={{ mt: 2 }}>
                Calculate Space
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

      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Results</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Floor Area</Typography>
                <Typography>{results.floorArea} sq ft</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Total Volume</Typography>
                <Typography>{results.volume} cu ft</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Number of Rows</Typography>
                <Typography>{results.numberOfRows}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Plants per Row</Typography>
                <Typography>{results.plantsPerRow}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Total Plants</Typography>
                <Typography>{results.totalPlants}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Walkway Space</Typography>
                <Typography>{results.walkwaySpace} sq ft</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Usable Growing Space</Typography>
                <Typography>{results.usableSpace} sq ft</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default GreenhouseCalculator;
