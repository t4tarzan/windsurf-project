import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Info as InfoIcon,
  WaterDrop as WaterIcon,
  Calculate as CalculateIcon,
  ExpandMore as ExpandMoreIcon,
  Nature as NatureIcon,
  Engineering as EngineeringIcon,
  Architecture as ArchitectureIcon
} from '@mui/icons-material';

const RainWaterHarvesting = () => {
  const [inputs, setInputs] = useState({
    roofArea: '',
    roofType: '',
    annualRainfall: '',
    storageCapacity: '',
    unit: 'metric'
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const roofTypes = [
    { value: 'metal', label: 'Metal Roof', efficiency: 0.95 },
    { value: 'tile', label: 'Tile Roof', efficiency: 0.90 },
    { value: 'asphalt', label: 'Asphalt Shingles', efficiency: 0.85 },
    { value: 'concrete', label: 'Concrete', efficiency: 0.80 },
    { value: 'gravel', label: 'Gravel', efficiency: 0.70 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateHarvesting = () => {
    try {
      // Validate inputs
      if (!inputs.roofArea || !inputs.roofType || !inputs.annualRainfall) {
        throw new Error('Please fill in all required fields');
      }

      const values = [inputs.roofArea, inputs.annualRainfall, inputs.storageCapacity].map(Number);
      if (values.some(isNaN)) {
        throw new Error('Please enter valid numbers');
      }

      // Convert inputs to metric if needed
      const conversionFactor = inputs.unit === 'imperial' ? 0.092903 : 1; // sq ft to sq m
      const rainfallFactor = inputs.unit === 'imperial' ? 25.4 : 1; // inches to mm

      const area = values[0] * conversionFactor;
      const rainfall = values[1] * rainfallFactor;
      const roofEfficiency = roofTypes.find(type => type.value === inputs.roofType).efficiency;

      // Calculate potential harvest
      const annualHarvest = area * (rainfall / 1000) * roofEfficiency; // in cubic meters
      const monthlyAverage = annualHarvest / 12;
      const dailyAverage = annualHarvest / 365;

      // Calculate storage recommendations
      const recommendedStorage = monthlyAverage * 1.5; // 1.5 months of storage
      const storageCapacity = values[2] || recommendedStorage;
      const storageEfficiency = (storageCapacity / recommendedStorage) * 100;

      // Convert results back to imperial if needed
      const unitConverter = inputs.unit === 'imperial' ? 264.172 : 1; // cubic meters to gallons
      const displayUnit = inputs.unit === 'imperial' ? 'gallons' : 'cubic meters';

      setResults({
        annualHarvest: (annualHarvest * unitConverter).toFixed(2),
        monthlyAverage: (monthlyAverage * unitConverter).toFixed(2),
        dailyAverage: (dailyAverage * unitConverter).toFixed(2),
        recommendedStorage: (recommendedStorage * unitConverter).toFixed(2),
        storageEfficiency: Math.min(storageEfficiency, 100).toFixed(1),
        displayUnit,
        recommendations: [
          'Install first-flush diverters to improve water quality',
          'Use debris screens on gutters and downspouts',
          'Regular maintenance of gutters and filters is essential',
          'Consider installing overflow mechanisms',
          'Monitor water quality periodically',
          `Your current storage capacity is ${storageEfficiency > 100 ? 'adequate' : 'below recommended'}`
        ]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Educational content for SEO and user guidance
  const educationalContent = {
    introduction: `Rainwater harvesting is the collection and storage of rain from roofs or other surfaces for future use. It is an ancient practice that has been modernized to help address water scarcity and promote sustainable water management.`,
    
    benefits: [
      {
        title: 'Water Conservation',
        description: 'Reduces dependence on municipal water supply and groundwater',
        impact: 'Lower water bills and reduced environmental impact'
      },
      {
        title: 'Flood Control',
        description: 'Reduces stormwater runoff and local flooding risks',
        impact: 'Improved community resilience and infrastructure protection'
      },
      {
        title: 'Sustainable Agriculture',
        description: 'Provides reliable water source for irrigation',
        impact: 'Enhanced crop yields and reduced water stress'
      },
      {
        title: 'Environmental Protection',
        description: 'Reduces erosion and water pollution',
        impact: 'Improved water quality and ecosystem health'
      }
    ],

    systemComponents: [
      {
        component: 'Catchment Area',
        description: 'Usually the roof surface where rainfall is collected',
        considerations: 'Material type affects collection efficiency'
      },
      {
        component: 'Gutters and Downspouts',
        description: 'Channel water from the catchment area to storage',
        considerations: 'Proper sizing and maintenance is crucial'
      },
      {
        component: 'First Flush Diverter',
        description: 'Removes initial rainfall containing debris',
        considerations: 'Improves water quality and system longevity'
      },
      {
        component: 'Storage Tank',
        description: 'Holds collected rainwater for future use',
        considerations: 'Size based on rainfall patterns and water needs'
      }
    ],

    bestPractices: [
      'Regular system maintenance and cleaning',
      'Install debris screens and first-flush diverters',
      'Ensure proper overflow mechanisms',
      'Consider local rainfall patterns when sizing system',
      'Implement water quality treatment if needed',
      'Follow local building codes and regulations'
    ]
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Rainwater Harvesting Calculator
      </Typography>

      {/* Educational Content Section */}
      <Box mb={4}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} /> About Rainwater Harvesting
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <NatureIcon sx={{ mr: 1 }} /> Benefits
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{benefit.title}</Typography>
                      <Typography paragraph>{benefit.description}</Typography>
                      <Typography variant="body2" color="textSecondary">{benefit.impact}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <EngineeringIcon sx={{ mr: 1 }} /> System Components
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.systemComponents.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{item.component}</Typography>
                      <Typography paragraph>{item.description}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Note: {item.considerations}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <ArchitectureIcon sx={{ mr: 1 }} /> Best Practices
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.bestPractices.map((practice, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <NatureIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={practice} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Calculator Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Unit System</InputLabel>
                <Select
                  name="unit"
                  value={inputs.unit}
                  onChange={handleInputChange}
                  label="Unit System"
                >
                  <MenuItem value="metric">Metric (m², mm)</MenuItem>
                  <MenuItem value="imperial">Imperial (sq ft, inches)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Roof Area (${inputs.unit === 'metric' ? 'm²' : 'sq ft'})`}
                name="roofArea"
                value={inputs.roofArea}
                onChange={handleInputChange}
                type="number"
                inputProps={{ min: 0, step: "0.1" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Roof Type</InputLabel>
                <Select
                  name="roofType"
                  value={inputs.roofType}
                  onChange={handleInputChange}
                  label="Roof Type"
                >
                  {roofTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label} ({(type.efficiency * 100)}% efficiency)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Annual Rainfall (${inputs.unit === 'metric' ? 'mm' : 'inches'})`}
                name="annualRainfall"
                value={inputs.annualRainfall}
                onChange={handleInputChange}
                type="number"
                inputProps={{ min: 0, step: "0.1" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Storage Capacity (${inputs.unit === 'metric' ? 'm³' : 'gallons'})`}
                name="storageCapacity"
                value={inputs.storageCapacity}
                onChange={handleInputChange}
                type="number"
                inputProps={{ min: 0, step: "0.1" }}
                helperText="Optional - leave blank for recommended size"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={calculateHarvesting}
                startIcon={<CalculateIcon />}
                fullWidth
              >
                Calculate Harvesting Potential
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Results</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  Annual Potential Harvest: {results.annualHarvest} {results.displayUnit}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  Monthly Average: {results.monthlyAverage} {results.displayUnit}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  Daily Average: {results.dailyAverage} {results.displayUnit}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  Recommended Storage: {results.recommendedStorage} {results.displayUnit}
                </Typography>
              </Grid>
              {inputs.storageCapacity && (
                <Grid item xs={12}>
                  <Typography>
                    Storage Efficiency: {results.storageEfficiency}%
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Recommendations</Typography>
            <List>
              {results.recommendations.map((recommendation, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WaterIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={recommendation} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Paper>
  );
};

export default RainWaterHarvesting;
