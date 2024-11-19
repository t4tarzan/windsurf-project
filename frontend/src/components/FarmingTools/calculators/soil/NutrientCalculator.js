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

const educationalContent = {
  introduction: {
    title: "Understanding Soil Nutrients and Plant Health",
    content: `Proper nutrient management is fundamental to successful farming and gardening. The three primary macronutrients - Nitrogen (N), Phosphorus (P), and Potassium (K) - play crucial roles in plant growth and development. This calculator helps you optimize your soil's nutrient levels for maximum crop yield and sustainability.`,
  },
  nutrients: {
    nitrogen: {
      title: "Nitrogen (N)",
      role: "Essential for leaf and stem growth, chlorophyll production, and protein synthesis",
      deficiency: "Yellowing of older leaves (chlorosis), stunted growth, reduced yield",
      excess: "Excessive vegetative growth, delayed flowering, increased susceptibility to diseases",
      sources: "Compost, manure, blood meal, urea, ammonium nitrate",
    },
    phosphorus: {
      title: "Phosphorus (P)",
      role: "Critical for root development, flowering, fruiting, and energy transfer",
      deficiency: "Purple-tinted leaves, stunted root systems, delayed maturity",
      excess: "Can interfere with micronutrient absorption, particularly zinc and iron",
      sources: "Rock phosphate, bone meal, superphosphate, fish meal",
    },
    potassium: {
      title: "Potassium (K)",
      role: "Regulates water usage, disease resistance, and overall plant strength",
      deficiency: "Scorched leaf edges, weak stems, poor fruit quality",
      excess: "Can cause salt stress and interfere with calcium and magnesium uptake",
      sources: "Wood ash, kelp meal, potassium sulfate, greensand",
    },
  },
  bestPractices: [
    "Regular soil testing (at least annually)",
    "Apply nutrients based on crop requirements and soil test results",
    "Consider using cover crops to improve soil nutrient content naturally",
    "Rotate crops to optimize nutrient usage",
    "Time applications according to crop growth stages",
    "Monitor plant health for signs of deficiency or excess",
  ],
  sustainablePractices: [
    "Use organic nutrient sources when possible",
    "Implement precision application methods",
    "Practice nutrient cycling through crop residue management",
    "Consider slow-release fertilizers to reduce leaching",
    "Maintain soil organic matter for better nutrient retention",
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

  const calculateRecommendations = () => {
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
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Soil Nutrient Management Calculator
      </Typography>
      
      {/* Educational Content Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {educationalContent.introduction.title}
          </Typography>
          <Typography paragraph>
            {educationalContent.introduction.content}
          </Typography>
          
          {/* Nutrient Information Tabs */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {Object.entries(educationalContent.nutrients).map(([nutrient, info]) => (
              <Grid item xs={12} md={4} key={nutrient}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {info.title}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>Role:</Typography>
                    <Typography paragraph variant="body2">{info.role}</Typography>
                    <Typography variant="subtitle2" gutterBottom>Deficiency Signs:</Typography>
                    <Typography paragraph variant="body2">{info.deficiency}</Typography>
                    <Typography variant="subtitle2" gutterBottom>Common Sources:</Typography>
                    <Typography variant="body2">{info.sources}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Calculator Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Calculate Your Nutrient Requirements
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Crop Type</InputLabel>
                <Select
                  name="cropType"
                  value={inputs.cropType}
                  onChange={handleInputChange}
                  label="Crop Type"
                >
                  {Object.keys(nutrientDatabase).map(crop => (
                    <MenuItem key={crop} value={crop}>
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Area (square meters)"
                name="area"
                type="number"
                value={inputs.area}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Enter the total area you plan to fertilize">
                      <IconButton size="small">
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Soil Test N (ppm)"
                name="soilTestN"
                type="number"
                value={inputs.soilTestN}
                onChange={handleInputChange}
                helperText="Current nitrogen level from soil test"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Soil Test P (ppm)"
                name="soilTestP"
                type="number"
                value={inputs.soilTestP}
                onChange={handleInputChange}
                helperText="Current phosphorus level from soil test"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Soil Test K (ppm)"
                name="soilTestK"
                type="number"
                value={inputs.soilTestK}
                onChange={handleInputChange}
                helperText="Current potassium level from soil test"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Fertilizer Preference</InputLabel>
                <Select
                  name="organicPreference"
                  value={inputs.organicPreference}
                  onChange={handleInputChange}
                  label="Fertilizer Preference"
                >
                  <MenuItem value="organic">Organic Only</MenuItem>
                  <MenuItem value="conventional">Conventional Only</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateRecommendations}
              startIcon={<ScienceIcon />}
            >
              Calculate Recommendations
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Best Practices Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Best Practices for Nutrient Management
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                General Guidelines:
              </Typography>
              <ul>
                {educationalContent.bestPractices.map((practice, index) => (
                  <li key={index}>
                    <Typography variant="body2">{practice}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Sustainable Practices:
              </Typography>
              <ul>
                {educationalContent.sustainablePractices.map((practice, index) => (
                  <li key={index}>
                    <Typography variant="body2">{practice}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {recommendations && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default NutrientCalculator;
