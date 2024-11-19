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
  ListItemIcon
} from '@mui/material';
import {
  Info as InfoIcon,
  WaterDrop as WaterIcon,
  Calculate as CalculateIcon
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Rain Water Harvesting Calculator
        <Tooltip title="Calculate potential rainwater collection based on roof area and rainfall">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>

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
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Results</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <WaterIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Annual Harvest: ${results.annualHarvest} ${results.displayUnit}`}
                      secondary="Total water collection potential per year"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WaterIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Monthly Average: ${results.monthlyAverage} ${results.displayUnit}`}
                      secondary="Average monthly collection potential"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WaterIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Daily Average: ${results.dailyAverage} ${results.displayUnit}`}
                      secondary="Average daily collection potential"
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <WaterIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Recommended Storage: ${results.recommendedStorage} ${results.displayUnit}`}
                      secondary="Suggested storage capacity (1.5 months of average rainfall)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WaterIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Storage Efficiency: ${results.storageEfficiency}%`}
                      secondary="Current storage capacity vs. recommended"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Recommendations
            </Typography>
            <List>
              {results.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <InfoIcon color="info" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default RainWaterHarvesting;
