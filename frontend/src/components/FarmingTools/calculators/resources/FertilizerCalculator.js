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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  Info as InfoIcon,
  Science as ScienceIcon,
  Nature as NatureIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const educationalContent = {
  introduction: {
    title: "Understanding Fertilizers and Plant Nutrition",
    content: "Proper fertilization is crucial for optimal plant growth and crop yields. This calculator helps determine the right amount and type of fertilizer based on soil tests and crop requirements."
  },
  nutrients: {
    nitrogen: {
      symbol: "N",
      role: "Essential for leaf and stem growth, chlorophyll production",
      deficiency: "Yellowing of older leaves, stunted growth",
      excess: "Excessive vegetative growth, delayed flowering",
      sources: "Urea, ammonium nitrate, blood meal"
    },
    phosphorus: {
      symbol: "P",
      role: "Root development, flowering, seed formation",
      deficiency: "Purple-tinted leaves, poor root growth",
      excess: "Can interfere with micronutrient uptake",
      sources: "Rock phosphate, bone meal, superphosphate"
    },
    potassium: {
      symbol: "K",
      role: "Disease resistance, water regulation, fruit quality",
      deficiency: "Leaf edge browning, weak stems",
      excess: "May cause salt stress in plants",
      sources: "Potash, wood ash, kelp meal"
    }
  },
  applicationTips: [
    {
      title: "Timing",
      points: [
        "Apply in early morning or late evening",
        "Avoid application before heavy rain",
        "Consider split applications for better absorption",
        "Time according to crop growth stages"
      ]
    },
    {
      title: "Method",
      points: [
        "Incorporate into soil when possible",
        "Avoid contact with plant leaves",
        "Water thoroughly after application",
        "Follow recommended application rates"
      ]
    },
    {
      title: "Safety",
      points: [
        "Wear protective gear when handling",
        "Store in cool, dry place",
        "Keep away from children and pets",
        "Follow local regulations"
      ]
    }
  ],
  soilTypeInfo: {
    Sandy: {
      characteristics: "Fast draining, low nutrient retention",
      strategy: "Frequent, light applications",
      considerations: "Use slow-release fertilizers when possible"
    },
    Loamy: {
      characteristics: "Well-balanced, good nutrient retention",
      strategy: "Standard application rates",
      considerations: "Maintain organic matter levels"
    },
    Clay: {
      characteristics: "Slow draining, high nutrient retention",
      strategy: "Less frequent, measured applications",
      considerations: "Avoid over-application"
    },
    Silt: {
      characteristics: "Good water retention, moderate nutrients",
      strategy: "Regular, moderate applications",
      considerations: "Monitor drainage"
    },
    Peat: {
      characteristics: "High organic matter, acidic",
      strategy: "Adjust for pH, moderate applications",
      considerations: "May need less nitrogen"
    },
    Chalky: {
      characteristics: "High pH, low iron availability",
      strategy: "Focus on micronutrients",
      considerations: "May need iron supplements"
    }
  }
};

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
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Smart Fertilizer Calculator
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

          <Grid container spacing={3}>
            {/* Nutrient Information */}
            {Object.entries(educationalContent.nutrients).map(([nutrient, info]) => (
              <Grid item xs={12} md={4} key={nutrient}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} ({info.symbol})
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><NatureIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Role"
                          secondary={info.role}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><WarningIcon color="error" /></ListItemIcon>
                        <ListItemText 
                          primary="Deficiency Signs"
                          secondary={info.deficiency}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><InfoIcon color="warning" /></ListItemIcon>
                        <ListItemText 
                          primary="Common Sources"
                          secondary={info.sources}
                        />
                      </ListItem>
                    </List>
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
            Calculate Fertilizer Requirements
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Area"
                name="area"
                type="number"
                value={inputs.area}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">m²</InputAdornment>
                }}
                helperText="Enter the area to be fertilized"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Soil Type</InputLabel>
                <Select
                  name="soilType"
                  value={inputs.soilType}
                  onChange={handleInputChange}
                  label="Soil Type"
                >
                  {soilTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NatureIcon sx={{ mr: 1 }} />
                        {type}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {inputs.soilType && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Strategy: {educationalContent.soilTypeInfo[inputs.soilType]?.strategy}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Crop Type</InputLabel>
                <Select
                  name="cropType"
                  value={inputs.cropType}
                  onChange={handleInputChange}
                  label="Crop Type"
                >
                  {cropTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NatureIcon sx={{ mr: 1 }} />
                        {type}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                Current Soil Levels (from soil test)
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Current Nitrogen (N)"
                name="currentN"
                type="number"
                value={inputs.currentN}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Current Phosphorus (P)"
                name="currentP"
                type="number"
                value={inputs.currentP}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Current Potassium (K)"
                name="currentK"
                type="number"
                value={inputs.currentK}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                Target Levels
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Target Nitrogen (N)"
                name="targetN"
                type="number"
                value={inputs.targetN}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Target Phosphorus (P)"
                name="targetP"
                type="number"
                value={inputs.targetP}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ppm</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Target Potassium (K)"
                name="targetK"
                type="number"
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
                      {type.name} (N-P-K: {type.N}-{type.P}-{type.K})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={calculateFertilizer}
                startIcon={<ScienceIcon />}
                size="large"
              >
                Calculate Fertilizer Needs
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Fertilizer Recommendations
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Measurement</TableCell>
                        <TableCell align="right">Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Fertilizer Required</TableCell>
                        <TableCell align="right">{results.fertilizerAmount} kg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Application Rate</TableCell>
                        <TableCell align="right">{results.amountPerSqFt} kg/m²</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Nitrogen (N) Provided</TableCell>
                        <TableCell align="right">{results.nutrientsProvided.N.toFixed(2)} kg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Phosphorus (P) Provided</TableCell>
                        <TableCell align="right">{results.nutrientsProvided.P.toFixed(2)} kg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Potassium (K) Provided</TableCell>
                        <TableCell align="right">{results.nutrientsProvided.K.toFixed(2)} kg</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Application Guidelines
                </Typography>
                {educationalContent.applicationTips.map((section, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {section.title}
                    </Typography>
                    <List dense>
                      {section.points.map((point, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <CheckIcon color="success" />
                          </ListItemIcon>
                          <ListItemText primary={point} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FertilizerCalculator;
