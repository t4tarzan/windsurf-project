import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Straighten as MeasureIcon,
  Agriculture as CropIcon,
  GridOn as RowIcon
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `The Row Spacing Optimizer helps farmers maximize crop yield by calculating optimal spacing between rows and plants. Proper spacing ensures efficient use of resources, reduces competition, and promotes healthy plant growth.`,
  
  spacingFactors: [
    {
      factor: 'Plant Size at Maturity',
      description: 'Consider the full-grown size of plants',
      importance: 'Prevents overcrowding and competition for resources'
    },
    {
      factor: 'Root System',
      description: 'Account for root spread and depth',
      importance: 'Ensures adequate nutrient access and stability'
    },
    {
      factor: 'Growing Method',
      description: 'Different techniques require different spacing',
      importance: 'Accommodates equipment and cultivation practices'
    },
    {
      factor: 'Climate Conditions',
      description: 'Spacing affects airflow and humidity',
      importance: 'Helps prevent disease and optimize growth'
    }
  ],

  spacingBenefits: {
    yield: {
      description: 'Impact on crop production',
      benefits: [
        'Maximizes yield per area',
        'Optimizes resource utilization',
        'Reduces plant competition',
        'Improves crop quality'
      ]
    },
    management: {
      description: 'Operational advantages',
      benefits: [
        'Easier harvesting access',
        'Efficient equipment use',
        'Better pest monitoring',
        'Simplified maintenance'
      ]
    }
  },

  cropSpecificGuidelines: {
    description: 'Spacing recommendations by crop type',
    notes: [
      'Leafy greens need less space but frequent access',
      'Root vegetables require soil volume consideration',
      'Climbing plants need support structure spacing',
      'Fruit-bearing crops need air circulation'
    ]
  },

  bestPractices: [
    'Consider companion planting arrangements',
    'Plan for irrigation system access',
    'Account for equipment width requirements',
    'Allow space for maintenance activities',
    'Consider succession planting needs',
    'Factor in local climate conditions'
  ]
};

const cropTypes = {
  'leafy-greens': {
    name: 'Leafy Greens',
    minRowSpacing: 0.3,
    maxRowSpacing: 0.45,
    minPlantSpacing: 0.15,
    maxPlantSpacing: 0.3,
  },
  'root-vegetables': {
    name: 'Root Vegetables',
    minRowSpacing: 0.4,
    maxRowSpacing: 0.6,
    minPlantSpacing: 0.1,
    maxPlantSpacing: 0.2,
  },
  'brassicas': {
    name: 'Brassicas',
    minRowSpacing: 0.6,
    maxRowSpacing: 0.9,
    minPlantSpacing: 0.3,
    maxPlantSpacing: 0.5,
  },
  'tomatoes': {
    name: 'Tomatoes',
    minRowSpacing: 0.9,
    maxRowSpacing: 1.2,
    minPlantSpacing: 0.45,
    maxPlantSpacing: 0.6,
  },
  'corn': {
    name: 'Corn',
    minRowSpacing: 0.75,
    maxRowSpacing: 1.0,
    minPlantSpacing: 0.2,
    maxPlantSpacing: 0.3,
  },
  'beans': {
    name: 'Beans',
    minRowSpacing: 0.45,
    maxRowSpacing: 0.6,
    minPlantSpacing: 0.1,
    maxPlantSpacing: 0.15,
  }
};

const RowSpacingOptimizer = () => {
  const [inputs, setInputs] = useState({
    plotLength: '',
    plotWidth: '',
    cropType: '',
    unit: 'meters',
    targetYield: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateOptimalSpacing = () => {
    const { plotLength, plotWidth, cropType, unit, targetYield } = inputs;
    
    // Validate inputs
    if (!plotLength || !plotWidth || !cropType || !targetYield) {
      setError('Please fill in all fields');
      return;
    }

    const values = [plotLength, plotWidth, targetYield].map(Number);
    if (values.some(isNaN)) {
      setError('All numeric inputs must be valid numbers');
      return;
    }

    // Convert to meters if needed
    const conversionFactor = unit === 'feet' ? 0.3048 : 1;
    const length = values[0] * conversionFactor;
    const width = values[1] * conversionFactor;
    const targetPlants = values[2];

    const crop = cropTypes[cropType];
    
    // Calculate optimal spacing
    const maxPlantsWithMinSpacing = Math.floor(length / crop.minPlantSpacing) * 
                                   Math.floor(width / crop.minRowSpacing);
    const maxPlantsWithMaxSpacing = Math.floor(length / crop.maxPlantSpacing) * 
                                   Math.floor(width / crop.maxRowSpacing);

    if (targetPlants > maxPlantsWithMinSpacing) {
      setError(`Maximum possible plants with minimum spacing is ${maxPlantsWithMinSpacing}`);
      return;
    }

    if (targetPlants < maxPlantsWithMaxSpacing) {
      setError(`Minimum possible plants with maximum spacing is ${maxPlantsWithMaxSpacing}`);
      return;
    }

    // Find optimal spacing through iteration
    let bestConfig = null;
    let minDiff = Infinity;
    
    for (let rowSpacing = crop.minRowSpacing; rowSpacing <= crop.maxRowSpacing; rowSpacing += 0.05) {
      for (let plantSpacing = crop.minPlantSpacing; plantSpacing <= crop.maxPlantSpacing; plantSpacing += 0.05) {
        const rows = Math.floor(width / rowSpacing);
        const plantsPerRow = Math.floor(length / plantSpacing);
        const totalPlants = rows * plantsPerRow;
        const diff = Math.abs(totalPlants - targetPlants);
        
        if (diff < minDiff) {
          minDiff = diff;
          bestConfig = {
            rowSpacing: rowSpacing.toFixed(2),
            plantSpacing: plantSpacing.toFixed(2),
            rows,
            plantsPerRow,
            totalPlants
          };
        }
      }
    }

    setResults(bestConfig);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Educational Content Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <RowIcon sx={{ mr: 1 }} />
            Row Spacing Optimizer
          </Typography>
          <Typography paragraph color="text.secondary">
            {educationalContent.introduction}
          </Typography>
        </CardContent>
      </Card>

      {/* Spacing Factors */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} />
            Key Spacing Factors
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {educationalContent.spacingFactors.map((factor, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={factor.factor}
                  secondary={`${factor.description} - ${factor.importance}`}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Benefits Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <MeasureIcon sx={{ mr: 1 }} />
            Benefits of Optimal Spacing
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Yield Benefits
              </Typography>
              <List>
                {educationalContent.spacingBenefits.yield.benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Management Benefits
              </Typography>
              <List>
                {educationalContent.spacingBenefits.management.benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Calculator Section */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Row Spacing Optimizer
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Optimize row and plant spacing based on your plot size and target yield.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Unit of Measurement</InputLabel>
              <Select
                name="unit"
                value={inputs.unit}
                label="Unit of Measurement"
                onChange={handleInputChange}
              >
                <MenuItem value="meters">Meters</MenuItem>
                <MenuItem value="feet">Feet</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Crop Type</InputLabel>
              <Select
                name="cropType"
                value={inputs.cropType}
                label="Crop Type"
                onChange={handleInputChange}
              >
                {Object.entries(cropTypes).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Plot Length (${inputs.unit})`}
              name="plotLength"
              value={inputs.plotLength}
              onChange={handleInputChange}
              type="number"
              inputProps={{ min: 0, step: "0.1" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Plot Width (${inputs.unit})`}
              name="plotWidth"
              value={inputs.plotWidth}
              onChange={handleInputChange}
              type="number"
              inputProps={{ min: 0, step: "0.1" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Target Number of Plants"
              name="targetYield"
              value={inputs.targetYield}
              onChange={handleInputChange}
              type="number"
              inputProps={{ min: 1, step: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateOptimalSpacing}
              fullWidth
            >
              Calculate Optimal Spacing
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {results && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Optimal Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Row Spacing: {results.rowSpacing} m
                  <Tooltip title="Distance between rows">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Plant Spacing: {results.plantSpacing} m
                  <Tooltip title="Distance between plants in a row">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Number of Rows: {results.rows}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Plants per Row: {results.plantsPerRow}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Total Plants: {results.totalPlants}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Best Practices */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <CropIcon sx={{ mr: 1 }} />
            Best Practices
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {educationalContent.bestPractices.map((practice, index) => (
              <ListItem key={index}>
                <ListItemText primary={practice} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default RowSpacingOptimizer;
