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

const RaisedBedPlanner = () => {
  const [inputs, setInputs] = useState({
    bedLength: '',
    bedWidth: '',
    plantSpacing: '',
    rowSpacing: '',
    pathWidth: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateLayout = () => {
    try {
      // Validate inputs
      if (Object.values(inputs).some(val => val === '')) {
        throw new Error('Please fill in all fields');
      }

      const length = Number(inputs.bedLength);
      const width = Number(inputs.bedWidth);
      const plantSpacing = Number(inputs.plantSpacing);
      const rowSpacing = Number(inputs.rowSpacing);
      const pathWidth = Number(inputs.pathWidth);

      if ([length, width, plantSpacing, rowSpacing, pathWidth].some(val => isNaN(val) || val <= 0)) {
        throw new Error('Please enter valid positive numbers for all measurements');
      }

      // Calculate number of plants and rows
      const numRows = Math.floor((width - pathWidth) / rowSpacing);
      const plantsPerRow = Math.floor(length / plantSpacing);
      const totalPlants = numRows * plantsPerRow;

      // Calculate area utilization
      const totalArea = length * width;
      const pathArea = length * pathWidth;
      const plantingArea = totalArea - pathArea;
      const utilizationRate = (plantingArea / totalArea) * 100;

      // Generate planting grid visualization data
      const grid = Array(numRows).fill().map(() => Array(plantsPerRow).fill('🌱'));

      setResults({
        numRows,
        plantsPerRow,
        totalPlants,
        totalArea,
        plantingArea,
        pathArea,
        utilizationRate: utilizationRate.toFixed(1),
        grid,
        recommendations: [
          'Consider companion planting to maximize space efficiency',
          'Add vertical growing supports for climbing plants',
          'Use succession planting to maintain continuous harvests',
          'Install drip irrigation along plant rows',
          `Leave ${pathWidth}" paths for easy access and maintenance`
        ]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Raised Bed Planner
        <Tooltip title="Plan optimal plant spacing and layout for your raised bed garden">
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
                label="Bed Length"
                name="bedLength"
                value={inputs.bedLength}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">inches</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Bed Width"
                name="bedWidth"
                value={inputs.bedWidth}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">inches</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Plant Spacing"
                name="plantSpacing"
                value={inputs.plantSpacing}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">inches</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Row Spacing"
                name="rowSpacing"
                value={inputs.rowSpacing}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">inches</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Path Width"
                name="pathWidth"
                value={inputs.pathWidth}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">inches</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={calculateLayout} sx={{ mt: 2 }}>
                Calculate Layout
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
                <Typography variant="h6" gutterBottom>Layout Summary</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Number of Rows</TableCell>
                        <TableCell>{results.numRows}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Plants per Row</TableCell>
                        <TableCell>{results.plantsPerRow}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Plants</TableCell>
                        <TableCell>{results.totalPlants}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Area</TableCell>
                        <TableCell>{results.totalArea} sq inches</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Planting Area</TableCell>
                        <TableCell>{results.plantingArea} sq inches</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Path Area</TableCell>
                        <TableCell>{results.pathArea} sq inches</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Space Utilization</TableCell>
                        <TableCell>{results.utilizationRate}%</TableCell>
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
                <Typography variant="h6" gutterBottom>Planting Grid</Typography>
                <Box sx={{ 
                  overflowX: 'auto', 
                  fontFamily: 'monospace',
                  whiteSpace: 'pre',
                  backgroundColor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1
                }}>
                  {results.grid.map((row, i) => (
                    <div key={i}>{row.join(' ')}</div>
                  ))}
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>Recommendations</Typography>
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

export default RaisedBedPlanner;
