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
  IconButton,
  Slider
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const CompostCalculator = () => {
  const [inputs, setInputs] = useState({
    greenWeight: '',
    brownWeight: '',
    moisture: 50,
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const materials = {
    green: [
      { name: 'Grass Clippings', carbonNitrogen: 20 },
      { name: 'Kitchen Scraps', carbonNitrogen: 15 },
      { name: 'Coffee Grounds', carbonNitrogen: 20 },
      { name: 'Fresh Manure', carbonNitrogen: 15 },
      { name: 'Garden Waste', carbonNitrogen: 25 }
    ],
    brown: [
      { name: 'Dry Leaves', carbonNitrogen: 60 },
      { name: 'Straw', carbonNitrogen: 80 },
      { name: 'Cardboard', carbonNitrogen: 350 },
      { name: 'Wood Chips', carbonNitrogen: 400 },
      { name: 'Paper', carbonNitrogen: 170 }
    ]
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateCompost = () => {
    try {
      // Validate inputs
      const greenWeight = Number(inputs.greenWeight);
      const brownWeight = Number(inputs.brownWeight);
      const moisture = Number(inputs.moisture);

      if (isNaN(greenWeight) || isNaN(brownWeight)) {
        throw new Error('Please enter valid numbers for material weights');
      }

      if (greenWeight <= 0 || brownWeight <= 0) {
        throw new Error('Material weights must be greater than zero');
      }

      // Calculate ratios
      const totalWeight = greenWeight + brownWeight;
      const greenRatio = greenWeight / totalWeight;
      const brownRatio = brownWeight / totalWeight;

      // Ideal moisture is between 40-60%
      const moistureStatus = moisture < 40 ? 'Too Dry' : moisture > 60 ? 'Too Wet' : 'Optimal';

      // Calculate approximate C:N ratio
      // Assuming average C:N ratios: Green = 20:1, Brown = 60:1
      const averageGreenCN = 20;
      const averageBrownCN = 60;
      const estimatedCNRatio = (brownWeight * averageBrownCN + greenWeight * averageGreenCN) / totalWeight;

      // Determine if adjustments are needed
      const idealCNRatio = 30; // The ideal C:N ratio is around 30:1
      let adjustment = '';
      if (estimatedCNRatio < 25) {
        adjustment = 'Add more brown materials (carbon-rich)';
      } else if (estimatedCNRatio > 35) {
        adjustment = 'Add more green materials (nitrogen-rich)';
      } else {
        adjustment = 'Ratio is optimal';
      }

      setResults({
        totalWeight,
        greenRatio: (greenRatio * 100).toFixed(1),
        brownRatio: (brownRatio * 100).toFixed(1),
        estimatedCNRatio: estimatedCNRatio.toFixed(1),
        moistureStatus,
        adjustment,
        recommendations: [
          'Turn pile every 1-2 weeks',
          'Maintain moisture like a wrung-out sponge',
          'Keep pile size between 3-5 cubic feet',
          'Chop materials for faster decomposition',
          'Monitor temperature (135-150°F ideal)'
        ],
        materials: {
          green: [
            'Fresh grass clippings',
            'Kitchen scraps',
            'Coffee grounds',
            'Fresh manure',
            'Green leaves'
          ],
          brown: [
            'Dry leaves',
            'Straw',
            'Cardboard',
            'Wood chips',
            'Newspaper'
          ]
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Compost Ratio Calculator
        <Tooltip title="Calculate optimal ratios of green and brown materials for composting">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Green Materials Weight"
                name="greenWeight"
                value={inputs.greenWeight}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">lbs</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brown Materials Weight"
                name="brownWeight"
                value={inputs.brownWeight}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">lbs</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Moisture Level</Typography>
              <Slider
                value={inputs.moisture}
                onChange={(e, newValue) => handleInputChange({ target: { name: 'moisture', value: newValue }})}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={calculateCompost} sx={{ mt: 2 }}>
                Calculate Ratios
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
                <Typography variant="h6" gutterBottom>Composition Analysis</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Weight</TableCell>
                        <TableCell>{results.totalWeight} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Green Materials Ratio</TableCell>
                        <TableCell>{results.greenRatio}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Brown Materials Ratio</TableCell>
                        <TableCell>{results.brownRatio}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Estimated C:N Ratio</TableCell>
                        <TableCell>{results.estimatedCNRatio}:1</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Moisture Status</TableCell>
                        <TableCell>{results.moistureStatus}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Recommended Adjustment</TableCell>
                        <TableCell>{results.adjustment}</TableCell>
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
                <Typography variant="h6" gutterBottom>Material Examples</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Green Materials (Nitrogen-rich)
                    </Typography>
                    <ul>
                      {results.materials.green.map((material, index) => (
                        <li key={index}><Typography>{material}</Typography></li>
                      ))}
                    </ul>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Brown Materials (Carbon-rich)
                    </Typography>
                    <ul>
                      {results.materials.brown.map((material, index) => (
                        <li key={index}><Typography>{material}</Typography></li>
                      ))}
                    </ul>
                  </Grid>
                </Grid>
                <Typography variant="h6" sx={{ mt: 2 }}>Composting Tips</Typography>
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

export default CompostCalculator;
