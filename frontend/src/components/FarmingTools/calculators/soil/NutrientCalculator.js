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
  Slider,
} from '@mui/material';
import {
  Science as ScienceIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Nutrient requirements database
const nutrientDatabase = {
  'tomatoes': {
    N: { low: 100, optimal: 175, high: 225 },
    P: { low: 50, optimal: 100, high: 150 },
    K: { low: 150, optimal: 200, high: 300 },
    requirements: {
      nitrogen: 'High feeder, especially during vegetative growth and fruit development',
      phosphorus: 'Moderate needs, important for root development and fruit set',
      potassium: 'High needs, essential for fruit quality and disease resistance',
    },
  },
  'lettuce': {
    N: { low: 50, optimal: 100, high: 150 },
    P: { low: 30, optimal: 60, high: 90 },
    K: { low: 75, optimal: 125, high: 175 },
    requirements: {
      nitrogen: 'Moderate feeder, crucial for leaf development',
      phosphorus: 'Low to moderate needs',
      potassium: 'Moderate needs, helps with disease resistance',
    },
  },
  'corn': {
    N: { low: 125, optimal: 200, high: 275 },
    P: { low: 60, optimal: 100, high: 140 },
    K: { low: 100, optimal: 175, high: 250 },
    requirements: {
      nitrogen: 'Heavy feeder, especially during vegetative growth',
      phosphorus: 'Moderate needs, important for root and ear development',
      potassium: 'High needs, essential for stalk strength and disease resistance',
    },
  },
};

// Fertilizer sources database
const fertilizerDatabase = {
  nitrogen: [
    { name: 'Urea', npk: '46-0-0', organic: false, rate: 2.2 },
    { name: 'Blood Meal', npk: '12-0-0', organic: true, rate: 8.3 },
    { name: 'Fish Emulsion', npk: '5-1-1', organic: true, rate: 20 },
  ],
  phosphorus: [
    { name: 'Triple Superphosphate', npk: '0-45-0', organic: false, rate: 2.2 },
    { name: 'Rock Phosphate', npk: '0-20-0', organic: true, rate: 5 },
    { name: 'Bone Meal', npk: '3-15-0', organic: true, rate: 6.7 },
  ],
  potassium: [
    { name: 'Potassium Chloride', npk: '0-0-60', organic: false, rate: 1.7 },
    { name: 'Potassium Sulfate', npk: '0-0-50', organic: false, rate: 2 },
    { name: 'Greensand', npk: '0-0-7', organic: true, rate: 14.3 },
  ],
};

const NutrientCalculator = () => {
  const [inputs, setInputs] = useState({
    cropType: '',
    area: '',
    soilTestN: '',
    soilTestP: '',
    soilTestK: '',
    organicPreference: 'both',
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

  const calculateNutrients = () => {
    const { cropType, area, soilTestN, soilTestP, soilTestK } = inputs;
    
    if (!cropType || !area || !soilTestN || !soilTestP || !soilTestK) {
      setError('Please fill in all required fields');
      return;
    }

    const cropInfo = nutrientDatabase[cropType.toLowerCase()];
    if (!cropInfo) {
      setError('Crop type not found in database');
      return;
    }

    // Calculate nutrient needs
    const needs = {
      N: calculateNutrientNeed(cropInfo.N, parseFloat(soilTestN)),
      P: calculateNutrientNeed(cropInfo.P, parseFloat(soilTestP)),
      K: calculateNutrientNeed(cropInfo.K, parseFloat(soilTestK)),
    };

    // Generate fertilizer recommendations
    const fertilizers = generateFertilizerRecommendations(needs, parseFloat(area));

    setRecommendations({
      needs,
      fertilizers,
      requirements: cropInfo.requirements,
    });
  };

  const calculateNutrientNeed = (optimal, current) => {
    const deficit = optimal.optimal - current;
    return {
      amount: Math.max(0, deficit),
      status: current < optimal.low ? 'Deficient' :
              current > optimal.high ? 'Excessive' : 'Adequate',
    };
  };

  const generateFertilizerRecommendations = (needs, area) => {
    const recommendations = {};
    const sqFt = area * 10.764; // Convert m² to sq ft

    ['nitrogen', 'phosphorus', 'potassium'].forEach(nutrient => {
      const need = needs[nutrient.charAt(0)].amount;
      if (need > 0) {
        recommendations[nutrient] = fertilizerDatabase[nutrient]
          .filter(f => inputs.organicPreference === 'both' || 
                      f.organic === (inputs.organicPreference === 'organic'))
          .map(fertilizer => ({
            ...fertilizer,
            amount: (need * sqFt / 1000 * fertilizer.rate).toFixed(2),
          }));
      }
    });

    return recommendations;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Nutrient Calculator
        <Tooltip title="Calculate nutrient requirements and fertilizer recommendations">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Crop Type</InputLabel>
            <Select
              name="cropType"
              value={inputs.cropType}
              onChange={handleInputChange}
              label="Crop Type"
            >
              <MenuItem value="tomatoes">Tomatoes</MenuItem>
              <MenuItem value="lettuce">Lettuce</MenuItem>
              <MenuItem value="corn">Corn</MenuItem>
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
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Soil Test N (ppm)"
            name="soilTestN"
            type="number"
            value={inputs.soilTestN}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: "1" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Soil Test P (ppm)"
            name="soilTestP"
            type="number"
            value={inputs.soilTestP}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: "1" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Soil Test K (ppm)"
            name="soilTestK"
            type="number"
            value={inputs.soilTestK}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: "1" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Fertilizer Preference</InputLabel>
            <Select
              name="organicPreference"
              value={inputs.organicPreference}
              onChange={handleInputChange}
              label="Fertilizer Preference"
            >
              <MenuItem value="both">Both Organic and Conventional</MenuItem>
              <MenuItem value="organic">Organic Only</MenuItem>
              <MenuItem value="conventional">Conventional Only</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={calculateNutrients}
          fullWidth
          startIcon={<ScienceIcon />}
        >
          Calculate Nutrient Needs
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
            Nutrient Recommendations
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Nutrient Status
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nutrient</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Required Amount (lbs/1000 sq ft)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(recommendations.needs).map(([nutrient, info]) => (
                          <TableRow key={nutrient}>
                            <TableCell>{nutrient}</TableCell>
                            <TableCell>{info.status}</TableCell>
                            <TableCell>{info.amount.toFixed(2)}</TableCell>
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
                    Crop Requirements
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {Object.entries(recommendations.requirements).map(([nutrient, requirement]) => (
                          <TableRow key={nutrient}>
                            <TableCell component="th" scope="row">
                              {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                            </TableCell>
                            <TableCell>{requirement}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            {Object.entries(recommendations.fertilizers).map(([nutrient, options]) => (
              <Grid item xs={12} key={nutrient}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} Sources
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Fertilizer</TableCell>
                            <TableCell>N-P-K</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Amount Needed (lbs)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {options.map((fertilizer, index) => (
                            <TableRow key={index}>
                              <TableCell>{fertilizer.name}</TableCell>
                              <TableCell>{fertilizer.npk}</TableCell>
                              <TableCell>{fertilizer.organic ? 'Organic' : 'Conventional'}</TableCell>
                              <TableCell>{fertilizer.amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default NutrientCalculator;
