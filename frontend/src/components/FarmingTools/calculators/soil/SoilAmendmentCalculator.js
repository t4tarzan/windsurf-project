import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Science as ScienceIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Soil amendment recommendations database
const amendmentDatabase = {
  'sandy': {
    characteristics: {
      texture: 'Coarse',
      drainage: 'Excessive',
      nutrientRetention: 'Poor',
      organicMatter: 'Low',
    },
    recommendations: {
      organic: [
        { name: 'Compost', rate: '4-6 inches', benefits: 'Improves water retention and nutrient holding' },
        { name: 'Peat Moss', rate: '2-3 inches', benefits: 'Increases water retention' },
        { name: 'Cover Crops', rate: 'As needed', benefits: 'Adds organic matter and prevents erosion' },
      ],
      mineral: [
        { name: 'Clay', rate: '3-4 inches', benefits: 'Improves water and nutrient retention' },
        { name: 'Vermiculite', rate: '1-2 inches', benefits: 'Increases water holding capacity' },
      ],
    },
  },
  'clay': {
    characteristics: {
      texture: 'Fine',
      drainage: 'Poor',
      nutrientRetention: 'High',
      organicMatter: 'Variable',
    },
    recommendations: {
      organic: [
        { name: 'Compost', rate: '4-6 inches', benefits: 'Improves drainage and soil structure' },
        { name: 'Aged Manure', rate: '2-3 inches', benefits: 'Improves soil structure and adds nutrients' },
        { name: 'Green Manure', rate: 'As needed', benefits: 'Improves soil structure and adds organic matter' },
      ],
      mineral: [
        { name: 'Gypsum', rate: '40-50 lbs/1000 sq ft', benefits: 'Improves soil structure and drainage' },
        { name: 'Sand', rate: '3-4 inches', benefits: 'Improves drainage when mixed with organic matter' },
      ],
    },
  },
  'loam': {
    characteristics: {
      texture: 'Medium',
      drainage: 'Good',
      nutrientRetention: 'Good',
      organicMatter: 'Medium',
    },
    recommendations: {
      organic: [
        { name: 'Compost', rate: '2-3 inches', benefits: 'Maintains soil structure and fertility' },
        { name: 'Cover Crops', rate: 'As needed', benefits: 'Maintains organic matter and soil health' },
      ],
      mineral: [
        { name: 'Rock Dust', rate: '5-10 lbs/100 sq ft', benefits: 'Adds trace minerals' },
        { name: 'Lime/Sulfur', rate: 'Based on pH test', benefits: 'Adjusts pH as needed' },
      ],
    },
  },
};

const SoilAmendmentCalculator = () => {
  const [inputs, setInputs] = useState({
    soilType: '',
    currentPH: '',
    targetPH: '',
    area: '',
    organicMatter: '',
    primaryNutrient: '',
  });

  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateAmendments = () => {
    const { soilType, currentPH, targetPH, area, organicMatter } = inputs;
    
    if (!soilType || !currentPH || !targetPH || !area || !organicMatter) {
      setError('Please fill in all required fields');
      return;
    }

    const soilInfo = amendmentDatabase[soilType.toLowerCase()];
    if (!soilInfo) {
      setError('Soil type not found in database');
      return;
    }

    // Calculate pH adjustment needs
    const phDifference = parseFloat(targetPH) - parseFloat(currentPH);
    const phAdjustment = calculatePHAdjustment(phDifference, parseFloat(area));

    // Generate final recommendations
    setRecommendations({
      soilCharacteristics: soilInfo.characteristics,
      amendments: {
        organic: soilInfo.recommendations.organic,
        mineral: soilInfo.recommendations.mineral,
      },
      phAdjustment,
    });
  };

  const calculatePHAdjustment = (phDiff, area) => {
    if (Math.abs(phDiff) < 0.1) {
      return { needed: false, message: 'No pH adjustment needed' };
    }

    const sqFt = area * 10.764; // Convert m² to sq ft
    let amendment;
    let rate;

    if (phDiff > 0) {
      amendment = 'Agricultural Lime';
      rate = Math.abs(phDiff) * 5 * sqFt / 1000; // 5 lbs per 1000 sq ft per pH point
    } else {
      amendment = 'Elemental Sulfur';
      rate = Math.abs(phDiff) * 2 * sqFt / 1000; // 2 lbs per 1000 sq ft per pH point
    }

    return {
      needed: true,
      amendment,
      rate: Math.round(rate * 10) / 10,
      message: `Apply ${amendment} at ${Math.round(rate * 10) / 10} lbs per 1000 sq ft`,
    };
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Soil Amendment Calculator
        <Tooltip title="Calculate soil amendments based on soil type and conditions">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Soil Type</InputLabel>
            <Select
              name="soilType"
              value={inputs.soilType}
              onChange={handleInputChange}
              label="Soil Type"
            >
              <MenuItem value="sandy">Sandy</MenuItem>
              <MenuItem value="clay">Clay</MenuItem>
              <MenuItem value="loam">Loam</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Area (m²)"
            name="area"
            type="number"
            value={inputs.area}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: "0.1" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Current pH"
            name="currentPH"
            type="number"
            value={inputs.currentPH}
            onChange={handleInputChange}
            inputProps={{ min: 0, max: 14, step: "0.1" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Target pH"
            name="targetPH"
            type="number"
            value={inputs.targetPH}
            onChange={handleInputChange}
            inputProps={{ min: 0, max: 14, step: "0.1" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Organic Matter (%)"
            name="organicMatter"
            type="number"
            value={inputs.organicMatter}
            onChange={handleInputChange}
            inputProps={{ min: 0, max: 100, step: "0.1" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Primary Nutrient Need</InputLabel>
            <Select
              name="primaryNutrient"
              value={inputs.primaryNutrient}
              onChange={handleInputChange}
              label="Primary Nutrient Need"
            >
              <MenuItem value="nitrogen">Nitrogen (N)</MenuItem>
              <MenuItem value="phosphorus">Phosphorus (P)</MenuItem>
              <MenuItem value="potassium">Potassium (K)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={calculateAmendments}
          fullWidth
          startIcon={<ScienceIcon />}
        >
          Calculate Amendments
        </Button>
      </Box>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {recommendations && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Soil Amendment Recommendations
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Soil Characteristics
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {Object.entries(recommendations.soilCharacteristics).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell component="th" scope="row">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </TableCell>
                            <TableCell>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    pH Adjustment
                  </Typography>
                  <Typography variant="body1">
                    {recommendations.phAdjustment.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Recommended Amendments
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Organic Amendments
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Amendment</TableCell>
                              <TableCell>Application Rate</TableCell>
                              <TableCell>Benefits</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {recommendations.amendments.organic.map((amendment, index) => (
                              <TableRow key={index}>
                                <TableCell>{amendment.name}</TableCell>
                                <TableCell>{amendment.rate}</TableCell>
                                <TableCell>{amendment.benefits}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Mineral Amendments
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Amendment</TableCell>
                              <TableCell>Application Rate</TableCell>
                              <TableCell>Benefits</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {recommendations.amendments.mineral.map((amendment, index) => (
                              <TableRow key={index}>
                                <TableCell>{amendment.name}</TableCell>
                                <TableCell>{amendment.rate}</TableCell>
                                <TableCell>{amendment.benefits}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default SoilAmendmentCalculator;
