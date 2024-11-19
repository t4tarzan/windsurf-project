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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  LocalFlorist as CropIcon,
  WbSunny as SunIcon,
  Opacity as WaterIcon,
  Terrain as SoilIcon,
  BugReport as PestIcon,
  Calculate as CalculateIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

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

const educationalContent = {
  introduction: {
    title: "Understanding Crop Yields",
    content: "Accurate yield estimation is crucial for farm planning, resource allocation, and financial projections. This calculator considers key factors like plant spacing, growing conditions, and crop-specific characteristics to provide reliable yield estimates."
  },
  yieldFactors: [
    {
      title: "Growing Conditions",
      factors: [
        "Soil quality and fertility",
        "Water availability and irrigation",
        "Sunlight exposure",
        "Temperature range",
        "Pest and disease pressure"
      ]
    },
    {
      title: "Management Practices",
      factors: [
        "Proper plant spacing",
        "Timely fertilization",
        "Regular pest monitoring",
        "Weed control",
        "Harvest timing"
      ]
    }
  ],
  cropSpecificInfo: {
    'Tomato': {
      description: "Heavy feeder, requires consistent moisture and strong support",
      keyFactors: [
        "Proper pruning increases yield",
        "Regular fertilization essential",
        "Consistent moisture prevents splitting",
        "Temperature affects fruit set"
      ],
      seasonalTips: "Plant after last frost, maintain night temperatures above 55°F (13°C)"
    },
    'Lettuce': {
      description: "Quick-growing crop, sensitive to heat and moisture stress",
      keyFactors: [
        "Cool season crop",
        "Consistent moisture critical",
        "Harvest before bolting",
        "Succession planting recommended"
      ],
      seasonalTips: "Best grown in spring and fall, protect from extreme heat"
    },
    'Carrot': {
      description: "Root crop requiring deep, loose soil for optimal development",
      keyFactors: [
        "Soil preparation crucial",
        "Thin seedlings carefully",
        "Keep soil consistently moist",
        "Protect shoulders from sunlight"
      ],
      seasonalTips: "Can be grown year-round in mild climates, sweeter after frost"
    },
    'Potato': {
      description: "Heavy feeder, requires regular hilling and pest monitoring",
      keyFactors: [
        "Proper hilling increases yield",
        "Regular moisture important",
        "Monitor for late blight",
        "Storage conditions affect quality"
      ],
      seasonalTips: "Plant 2-4 weeks before last frost date"
    },
    'Bush Beans': {
      description: "Nitrogen-fixing crop, good for crop rotation",
      keyFactors: [
        "Direct sow recommended",
        "Avoid overwatering",
        "Pick regularly to encourage production",
        "Good air circulation prevents disease"
      ],
      seasonalTips: "Plant when soil warms to 60°F (16°C)"
    }
  }
};

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
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Crop Yield Estimator
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
            {educationalContent.yieldFactors.map((section, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Typography variant="h6" gutterBottom color="primary">
                  {section.title}
                </Typography>
                <List>
                  {section.factors.map((factor, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        {index === 0 ? <SunIcon color="primary" /> : <CropIcon color="primary" />}
                      </ListItemIcon>
                      <ListItemText primary={factor} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Calculator Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Calculate Your Expected Yield
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CropIcon sx={{ mr: 1 }} />
                      {crop}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              {selectedCrop && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Crop Information
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {educationalContent.cropSpecificInfo[selectedCrop].description}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Key Success Factors:
                  </Typography>
                  <List dense>
                    {educationalContent.cropSpecificInfo[selectedCrop].keyFactors.map((factor, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={factor} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
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
                helperText="Enter the length of your growing area"
              />
              <TextField
                fullWidth
                label="Plot Width (meters)"
                type="number"
                value={plotWidth}
                onChange={(e) => setPlotWidth(e.target.value)}
                margin="normal"
                inputProps={{ min: 0, step: 0.1 }}
                helperText="Enter the width of your growing area"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Growing Conditions</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={growingConditions}
                  onChange={(e, newValue) => setGrowingConditions(newValue)}
                  marks={growingConditionsMarks}
                  step={null}
                  min={0}
                  max={100}
                />
              </Box>
              <Typography variant="caption" color="textSecondary">
                Adjust based on your soil quality, water availability, and general growing conditions
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={calculateYield}
                startIcon={<CalculateIcon />}
                size="large"
              >
                Calculate Yield Estimate
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
              Yield Estimate Results
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Number of Rows</TableCell>
                        <TableCell align="right">{results.numberOfRows}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Plants per Row</TableCell>
                        <TableCell align="right">{results.plantsPerRow}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Plants</TableCell>
                        <TableCell align="right">{results.totalPlants}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Plant Density (plants/m²)</TableCell>
                        <TableCell align="right">{results.plantDensity}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Expected Yield Range</TableCell>
                        <TableCell align="right">
                          {results.minYield} - {results.maxYield} {results.unit}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {selectedCrop && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Seasonal Tips:
                    </Typography>
                    <Typography variant="body2">
                      {educationalContent.cropSpecificInfo[selectedCrop].seasonalTips}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default YieldEstimator;
