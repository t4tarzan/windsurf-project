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
  IconButton,
  Divider
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const MulchCalculator = () => {
  const [inputs, setInputs] = useState({
    length: '',
    width: '',
    depth: '',
    mulchType: '',
    shape: 'rectangle',
    irregularArea: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const mulchTypes = [
    { name: 'Wood Chips', density: 800, coverage: 2.0 }, // lbs per cubic yard
    { name: 'Bark Mulch', density: 500, coverage: 1.8 },
    { name: 'Straw', density: 300, coverage: 1.5 },
    { name: 'Pine Needles', density: 400, coverage: 1.7 },
    { name: 'Cocoa Hulls', density: 600, coverage: 1.6 },
    { name: 'Compost', density: 1000, coverage: 2.2 },
    { name: 'Gravel', density: 2700, coverage: 1.0 },
    { name: 'Rubber Mulch', density: 600, coverage: 1.9 }
  ];

  const shapes = [
    { name: 'Rectangle/Square', value: 'rectangle' },
    { name: 'Circle', value: 'circle' },
    { name: 'Irregular', value: 'irregular' }
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateMulch = () => {
    try {
      // Validate inputs based on shape
      if (inputs.shape === 'irregular') {
        if (!inputs.irregularArea || isNaN(inputs.irregularArea) || Number(inputs.irregularArea) <= 0) {
          throw new Error('Please enter a valid area measurement');
        }
      } else {
        if (!inputs.length || !inputs.width || isNaN(inputs.length) || isNaN(inputs.width)) {
          throw new Error('Please enter valid dimensions');
        }
      }

      if (!inputs.depth || isNaN(inputs.depth) || Number(inputs.depth) <= 0) {
        throw new Error('Please enter a valid depth');
      }

      if (!inputs.mulchType) {
        throw new Error('Please select a mulch type');
      }

      // Calculate area based on shape
      let area;
      if (inputs.shape === 'rectangle') {
        area = Number(inputs.length) * Number(inputs.width);
      } else if (inputs.shape === 'circle') {
        area = Math.PI * Math.pow(Number(inputs.length) / 2, 2);
      } else {
        area = Number(inputs.irregularArea);
      }

      const depth = Number(inputs.depth);
      const selectedMulch = mulchTypes.find(m => m.name === inputs.mulchType);

      // Calculate volume in cubic feet
      const volumeCubicFeet = (area * depth) / 12; // Convert depth from inches to feet
      const volumeCubicYards = volumeCubicFeet / 27; // Convert to cubic yards

      // Calculate weight
      const weightPounds = volumeCubicYards * selectedMulch.density;
      
      // Calculate bags needed (assuming standard 2 cubic feet bags)
      const bagsNeeded = Math.ceil(volumeCubicFeet / 2);

      // Calculate coverage factor
      const actualCoverage = area * selectedMulch.coverage;

      setResults({
        area: area.toFixed(2),
        volumeCubicFeet: volumeCubicFeet.toFixed(2),
        volumeCubicYards: volumeCubicYards.toFixed(2),
        weightPounds: weightPounds.toFixed(2),
        bagsNeeded,
        coverage: actualCoverage.toFixed(2),
        recommendations: [
          `Apply mulch ${depth} inches deep for optimal coverage`,
          'Keep mulch 2-3 inches away from plant stems and tree trunks',
          'Water the area thoroughly after mulching',
          'Replace mulch when decomposed (typically annually)',
          `For ${selectedMulch.name}, expect ${selectedMulch.coverage}x area coverage due to settling`
        ]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Mulch Coverage Calculator
        <Tooltip title="Calculate mulch needed based on area and desired depth">
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
                <InputLabel>Area Shape</InputLabel>
                <Select
                  name="shape"
                  value={inputs.shape}
                  onChange={handleInputChange}
                  label="Area Shape"
                >
                  {shapes.map(shape => (
                    <MenuItem key={shape.value} value={shape.value}>
                      {shape.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {inputs.shape !== 'irregular' ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label={inputs.shape === 'circle' ? "Diameter" : "Length"}
                    name="length"
                    value={inputs.length}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">feet</InputAdornment>
                    }}
                  />
                </Grid>
                {inputs.shape === 'rectangle' && (
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Width"
                      name="width"
                      value={inputs.width}
                      onChange={handleInputChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">feet</InputAdornment>
                      }}
                    />
                  </Grid>
                )}
              </>
            ) : (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Area"
                  name="irregularArea"
                  value={inputs.irregularArea}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">sq ft</InputAdornment>
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Desired Depth"
                name="depth"
                value={inputs.depth}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">inches</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Mulch Type</InputLabel>
                <Select
                  name="mulchType"
                  value={inputs.mulchType}
                  onChange={handleInputChange}
                  label="Mulch Type"
                >
                  {mulchTypes.map(type => (
                    <MenuItem key={type.name} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={calculateMulch} sx={{ mt: 2 }}>
                Calculate Mulch Needs
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
                <Typography variant="h6" gutterBottom>Coverage Summary</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Area to Cover</TableCell>
                        <TableCell>{results.area} sq ft</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Volume Needed</TableCell>
                        <TableCell>{results.volumeCubicFeet} cu ft ({results.volumeCubicYards} cu yd)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weight</TableCell>
                        <TableCell>{results.weightPounds} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Standard Bags Needed (2 cu ft)</TableCell>
                        <TableCell>{results.bagsNeeded} bags</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Actual Coverage Area</TableCell>
                        <TableCell>{results.coverage} sq ft (with settling)</TableCell>
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

export default MulchCalculator;
