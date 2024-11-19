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

const FertilizerCalculator = () => {
  const [inputs, setInputs] = useState({
    area: '',
    soilType: '',
    cropType: '',
    currentN: '',
    currentP: '',
    currentK: '',
    targetN: '',
    targetP: '',
    targetK: '',
    fertilizerType: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const soilTypes = [
    'Sandy',
    'Loamy',
    'Clay',
    'Silt',
    'Peat',
    'Chalky'
  ];

  const cropTypes = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Root Crops',
    'Legumes',
    'Herbs'
  ];

  const fertilizerTypes = [
    { name: '10-10-10 (All Purpose)', N: 10, P: 10, K: 10 },
    { name: '5-10-5 (Starter)', N: 5, P: 10, K: 5 },
    { name: '3-15-3 (Super Phosphate)', N: 3, P: 15, K: 3 },
    { name: '21-0-0 (Ammonium Sulfate)', N: 21, P: 0, K: 0 },
    { name: '46-0-0 (Urea)', N: 46, P: 0, K: 0 },
    { name: '0-20-0 (Phosphate)', N: 0, P: 20, K: 0 },
    { name: '0-0-60 (Potash)', N: 0, P: 0, K: 60 },
    { name: '15-30-15 (Bloom Booster)', N: 15, P: 30, K: 15 }
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateFertilizer = () => {
    try {
      // Validate inputs
      if (Object.values(inputs).some(val => val === '')) {
        throw new Error('Please fill in all fields');
      }

      const area = Number(inputs.area);
      const currentN = Number(inputs.currentN);
      const currentP = Number(inputs.currentP);
      const currentK = Number(inputs.currentK);
      const targetN = Number(inputs.targetN);
      const targetP = Number(inputs.targetP);
      const targetK = Number(inputs.targetK);

      if ([area, currentN, currentP, currentK, targetN, targetP, targetK].some(val => isNaN(val))) {
        throw new Error('Please enter valid numbers for all measurements');
      }

      // Get selected fertilizer NPK values
      const selectedFertilizer = fertilizerTypes.find(f => f.name === inputs.fertilizerType);
      if (!selectedFertilizer) {
        throw new Error('Please select a fertilizer type');
      }

      // Calculate nutrient deficits
      const nDeficit = Math.max(0, targetN - currentN);
      const pDeficit = Math.max(0, targetP - currentP);
      const kDeficit = Math.max(0, targetK - currentK);

      // Calculate required fertilizer amounts
      const nRequired = (nDeficit * area * 100) / selectedFertilizer.N;
      const pRequired = (pDeficit * area * 100) / selectedFertilizer.P;
      const kRequired = (kDeficit * area * 100) / selectedFertilizer.K;

      // Get the limiting factor (highest amount required)
      const fertilizerNeeded = Math.max(
        selectedFertilizer.N > 0 ? nRequired : 0,
        selectedFertilizer.P > 0 ? pRequired : 0,
        selectedFertilizer.K > 0 ? kRequired : 0
      );

      // Calculate actual nutrients provided
      const nutrientsProvided = {
        N: (fertilizerNeeded * selectedFertilizer.N) / 100,
        P: (fertilizerNeeded * selectedFertilizer.P) / 100,
        K: (fertilizerNeeded * selectedFertilizer.K) / 100
      };

      setResults({
        fertilizerAmount: fertilizerNeeded.toFixed(2),
        amountPerSqFt: (fertilizerNeeded / area).toFixed(2),
        nutrientsProvided,
        recommendations: [
          'Apply fertilizer in early morning or late evening',
          'Water thoroughly after application',
          'Avoid applying before heavy rain',
          'Consider split applications for better absorption',
          'Use protective gear when handling fertilizers'
        ]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Fertilizer Calculator
        <Tooltip title="Calculate fertilizer requirements based on soil tests and crop needs">
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
              <FormControl fullWidth>
                <InputLabel>Soil Type</InputLabel>
                <Select
                  name="soilType"
                  value={inputs.soilType}
                  onChange={handleInputChange}
                  label="Soil Type"
                >
                  {soilTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Crop Type</InputLabel>
                <Select
                  name="cropType"
                  value={inputs.cropType}
                  onChange={handleInputChange}
                  label="Crop Type"
                >
                  {cropTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Current Soil Levels (ppm)</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Current Nitrogen (N)"
                name="currentN"
                value={inputs.currentN}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Current Phosphorus (P)"
                name="currentP"
                value={inputs.currentP}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Current Potassium (K)"
                name="currentK"
                value={inputs.currentK}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Target Levels (ppm)</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Target Nitrogen (N)"
                name="targetN"
                value={inputs.targetN}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Target Phosphorus (P)"
                name="targetP"
                value={inputs.targetP}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Target Potassium (K)"
                name="targetK"
                value={inputs.targetK}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Fertilizer Type</InputLabel>
                <Select
                  name="fertilizerType"
                  value={inputs.fertilizerType}
                  onChange={handleInputChange}
                  label="Fertilizer Type"
                >
                  {fertilizerTypes.map(type => (
                    <MenuItem key={type.name} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={calculateFertilizer} sx={{ mt: 2 }}>
                Calculate Fertilizer Needs
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Application Summary</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Fertilizer Needed</TableCell>
                        <TableCell>{results.fertilizerAmount} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Application Rate</TableCell>
                        <TableCell>{results.amountPerSqFt} lbs/sq ft</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Nitrogen (N) Provided</TableCell>
                        <TableCell>{results.nutrientsProvided.N.toFixed(2)} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Phosphorus (P) Provided</TableCell>
                        <TableCell>{results.nutrientsProvided.P.toFixed(2)} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Potassium (K) Provided</TableCell>
                        <TableCell>{results.nutrientsProvided.K.toFixed(2)} lbs</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Application Guidelines</Typography>
                <ul>
                  {results.recommendations.map((rec, index) => (
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

export default FertilizerCalculator;
