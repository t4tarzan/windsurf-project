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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Info as InfoIcon,
  WaterDrop as WaterIcon,
  Nature as NatureIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  Thermostat as ThermostatIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const educationalContent = {
  introduction: {
    title: "Smart Irrigation Management",
    content: "Effective irrigation is crucial for crop success, water conservation, and sustainable farming. This calculator helps optimize your irrigation schedule based on crop needs, soil conditions, and environmental factors."
  },
  waterManagement: {
    title: "Water Management Principles",
    points: [
      "Understanding crop water requirements throughout growth stages",
      "Monitoring soil moisture levels and water retention",
      "Implementing efficient irrigation systems and techniques",
      "Adapting to weather conditions and seasonal changes",
      "Conserving water through proper timing and application"
    ]
  },
  soilTypes: {
    sandy: {
      characteristics: "Fast draining, low water retention",
      wateringStrategy: "Frequent, light irrigation",
      challenges: "Requires more frequent watering, nutrient leaching"
    },
    loamy: {
      characteristics: "Balanced drainage and retention",
      wateringStrategy: "Moderate, regular irrigation",
      challenges: "Maintain consistent moisture levels"
    },
    clay: {
      characteristics: "Slow draining, high water retention",
      wateringStrategy: "Less frequent, deep irrigation",
      challenges: "Risk of waterlogging, careful monitoring needed"
    },
    silt: {
      characteristics: "Good water retention, moderate drainage",
      wateringStrategy: "Regular, measured irrigation",
      challenges: "Surface crusting, erosion risk"
    },
    peat: {
      characteristics: "High water retention, organic matter",
      wateringStrategy: "Careful monitoring of moisture levels",
      challenges: "Can become hydrophobic if too dry"
    },
    chalky: {
      characteristics: "Free draining, low retention",
      wateringStrategy: "Regular, moderate irrigation",
      challenges: "Nutrient deficiencies, pH management"
    }
  },
  bestPractices: [
    {
      title: "Timing Optimization",
      points: [
        "Water early morning or late evening",
        "Avoid midday irrigation to minimize evaporation",
        "Consider split applications for sandy soils",
        "Adjust timing based on season and weather"
      ]
    },
    {
      title: "Water Conservation",
      points: [
        "Use mulch to reduce evaporation",
        "Implement drip irrigation where possible",
        "Monitor soil moisture with sensors",
        "Maintain irrigation system efficiency"
      ]
    },
    {
      title: "System Maintenance",
      points: [
        "Regular inspection of irrigation equipment",
        "Clean filters and nozzles",
        "Check for leaks and damage",
        "Calibrate water flow rates"
      ]
    }
  ],
  cropWaterNeeds: {
    Vegetables: {
      needs: "Moderate to high",
      criticalStages: "Seedling establishment, flowering, fruit development",
      tips: "Consistent moisture important for quality"
    },
    Fruits: {
      needs: "High",
      criticalStages: "Flowering, fruit set, fruit development",
      tips: "Reduce irrigation before harvest"
    },
    Grains: {
      needs: "Moderate",
      criticalStages: "Tillering, heading, grain filling",
      tips: "Critical irrigation timing affects yield"
    },
    "Root Crops": {
      needs: "Low to moderate",
      criticalStages: "Root development, bulking",
      tips: "Avoid overwatering to prevent rot"
    },
    Legumes: {
      needs: "Low to moderate",
      criticalStages: "Flowering, pod development",
      tips: "Drought tolerant after establishment"
    },
    Herbs: {
      needs: "Low",
      criticalStages: "Establishment, before harvest",
      tips: "Many herbs prefer drier conditions"
    }
  }
};

const IrrigationScheduler = () => {
  const [inputs, setInputs] = useState({
    cropType: '',
    soilType: '',
    area: '',
    rainfall: '',
    temperature: '',
    season: ''
  });
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState('');

  const cropTypes = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Root Crops',
    'Legumes',
    'Herbs'
  ];

  const soilTypes = [
    'Sandy',
    'Loamy',
    'Clay',
    'Silt',
    'Peat',
    'Chalky'
  ];

  const seasons = [
    'Spring',
    'Summer',
    'Fall',
    'Winter'
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateSchedule = () => {
    try {
      // Validate inputs
      if (Object.values(inputs).some(val => val === '')) {
        throw new Error('Please fill in all fields');
      }

      const area = Number(inputs.area);
      const rainfall = Number(inputs.rainfall);
      const temperature = Number(inputs.temperature);

      if (isNaN(area) || isNaN(rainfall) || isNaN(temperature)) {
        throw new Error('Please enter valid numbers for area, rainfall, and temperature');
      }

      // Calculate water requirements based on inputs
      let baseWaterNeed = 0;
      switch (inputs.cropType) {
        case 'Vegetables':
          baseWaterNeed = 1.2;
          break;
        case 'Fruits':
          baseWaterNeed = 1.5;
          break;
        case 'Grains':
          baseWaterNeed = 1.0;
          break;
        case 'Root Crops':
          baseWaterNeed = 0.8;
          break;
        case 'Legumes':
          baseWaterNeed = 0.9;
          break;
        case 'Herbs':
          baseWaterNeed = 0.7;
          break;
        default:
          baseWaterNeed = 1.0;
      }

      // Adjust for soil type
      let soilFactor = 1.0;
      switch (inputs.soilType) {
        case 'Sandy':
          soilFactor = 1.3;
          break;
        case 'Loamy':
          soilFactor = 1.0;
          break;
        case 'Clay':
          soilFactor = 0.8;
          break;
        case 'Silt':
          soilFactor = 0.9;
          break;
        case 'Peat':
          soilFactor = 1.2;
          break;
        case 'Chalky':
          soilFactor = 1.1;
          break;
        default:
          soilFactor = 1.0;
      }

      // Adjust for temperature
      const tempFactor = Math.max(1, temperature / 75);

      // Calculate daily water requirement
      const dailyWater = (baseWaterNeed * soilFactor * tempFactor * area) - (rainfall / 7);

      // Generate weekly schedule
      const weeklySchedule = [
        'Monday',
        'Wednesday',
        'Friday',
        'Sunday'
      ].map(day => ({
        day,
        amount: (dailyWater * 1.75).toFixed(2), // Multiply by 1.75 to account for non-watering days
        duration: Math.ceil((dailyWater * 1.75) / 0.5) // Assuming 0.5 gallons per minute flow rate
      }));

      setSchedule({
        weeklySchedule,
        totalWeeklyWater: (dailyWater * 7).toFixed(2),
        recommendations: [
          'Water early morning or late evening to minimize evaporation',
          'Adjust schedule based on actual rainfall',
          'Monitor soil moisture regularly',
          'Consider using mulch to retain moisture'
        ]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Smart Irrigation Management System
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
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Water Management Principles
              </Typography>
              <List>
                {educationalContent.waterManagement.points.map((point, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <WaterIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Best Practices
              </Typography>
              {educationalContent.bestPractices.map((practice, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {practice.title}
                  </Typography>
                  <List dense>
                    {practice.points.map((point, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckIcon color="success" fontSize="small" />
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

      {/* Calculator Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Irrigation Schedule Calculator
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Crop Type</InputLabel>
                <Select
                  name="cropType"
                  value={inputs.cropType}
                  onChange={handleInputChange}
                  label="Crop Type"
                >
                  {cropTypes.map(crop => (
                    <MenuItem key={crop} value={crop}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NatureIcon sx={{ mr: 1 }} />
                        {crop}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {inputs.cropType && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Water needs: {educationalContent.cropWaterNeeds[inputs.cropType]?.needs}
                    <br />
                    Critical stages: {educationalContent.cropWaterNeeds[inputs.cropType]?.criticalStages}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Soil Type</InputLabel>
                <Select
                  name="soilType"
                  value={inputs.soilType}
                  onChange={handleInputChange}
                  label="Soil Type"
                >
                  {soilTypes.map(soil => (
                    <MenuItem key={soil} value={soil}>{soil}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {inputs.soilType && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Strategy: {educationalContent.soilTypes[inputs.soilType.toLowerCase()]?.wateringStrategy}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Area (square meters)"
                name="area"
                type="number"
                value={inputs.area}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      m²
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Weekly Rainfall"
                name="rainfall"
                type="number"
                value={inputs.rainfall}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      mm
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Average Temperature"
                name="temperature"
                type="number"
                value={inputs.temperature}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      °C
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Season</InputLabel>
                <Select
                  name="season"
                  value={inputs.season}
                  onChange={handleInputChange}
                  label="Season"
                >
                  {seasons.map(season => (
                    <MenuItem key={season} value={season}>
                      {season}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateSchedule}
              startIcon={<ScheduleIcon />}
              size="large"
            >
              Generate Irrigation Schedule
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {schedule && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Irrigation Schedule
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>Amount (gallons)</TableCell>
                        <TableCell>Duration (minutes)</TableCell>
                        <TableCell>Best Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedule.weeklySchedule.map((day) => (
                        <TableRow key={day.day}>
                          <TableCell>{day.day}</TableCell>
                          <TableCell>{day.amount}</TableCell>
                          <TableCell>{day.duration}</TableCell>
                          <TableCell>Early morning or late evening</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Total Weekly Water Requirement: {schedule.totalWeeklyWater} gallons
                  </Typography>
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Recommendations
                </Typography>
                <List>
                  {schedule.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default IrrigationScheduler;
