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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  AcUnit as FrostIcon,
  CalendarMonth as CalendarIcon,
  Agriculture as AgricultureIcon,
  WbSunny as SunIcon
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `Frost dates are critical for agricultural planning, determining both the start and end of the growing season. Understanding your local frost dates helps optimize planting and harvesting schedules while protecting crops from frost damage.`,
  
  importance: [
    {
      aspect: 'Growing Season Planning',
      description: 'Determines safe planting and harvesting windows',
      impact: 'Optimizes crop timing and yield potential'
    },
    {
      aspect: 'Crop Protection',
      description: 'Helps anticipate and prepare for frost risks',
      impact: 'Reduces crop loss from frost damage'
    },
    {
      aspect: 'Variety Selection',
      description: 'Guides choice of crop varieties based on season length',
      impact: 'Ensures crops can mature within frost-free period'
    },
    {
      aspect: 'Succession Planning',
      description: 'Enables strategic planning of multiple crop cycles',
      impact: 'Maximizes land use and harvest periods'
    }
  ],

  hardinessZones: {
    description: 'USDA Plant Hardiness Zones are based on average annual minimum winter temperatures',
    importance: 'Help determine which perennial plants are most likely to thrive at a location',
    usage: 'Used alongside frost dates for comprehensive growing season planning'
  },

  bestPractices: [
    'Monitor local weather forecasts during critical periods',
    'Have frost protection materials ready (row covers, cold frames)',
    'Consider microclimate effects in your specific location',
    'Use raised beds or south-facing slopes for early/late season growing',
    'Implement frost protection strategies when temperatures approach freezing',
    'Keep records of actual frost dates for future planning'
  ]
};

// Hardiness zones data
const hardinessZones = {
  '1a': { min: -60, max: -55, lastFrost: '6/1', firstFrost: '8/1', growingDays: 60 },
  '1b': { min: -55, max: -50, lastFrost: '5/25', firstFrost: '8/15', growingDays: 80 },
  '2a': { min: -50, max: -45, lastFrost: '5/20', firstFrost: '8/30', growingDays: 100 },
  '2b': { min: -45, max: -40, lastFrost: '5/15', firstFrost: '9/15', growingDays: 120 },
  '3a': { min: -40, max: -35, lastFrost: '5/15', firstFrost: '9/15', growingDays: 120 },
  '3b': { min: -35, max: -30, lastFrost: '5/10', firstFrost: '9/25', growingDays: 135 },
  '4a': { min: -30, max: -25, lastFrost: '5/5', firstFrost: '10/1', growingDays: 145 },
  '4b': { min: -25, max: -20, lastFrost: '5/1', firstFrost: '10/5', growingDays: 155 },
  '5a': { min: -20, max: -15, lastFrost: '4/25', firstFrost: '10/10', growingDays: 165 },
  '5b': { min: -15, max: -10, lastFrost: '4/20', firstFrost: '10/15', growingDays: 175 },
  '6a': { min: -10, max: -5, lastFrost: '4/15', firstFrost: '10/20', growingDays: 185 },
  '6b': { min: -5, max: 0, lastFrost: '4/10', firstFrost: '10/25', growingDays: 195 },
  '7a': { min: 0, max: 5, lastFrost: '4/5', firstFrost: '10/30', growingDays: 205 },
  '7b': { min: 5, max: 10, lastFrost: '3/30', firstFrost: '11/1', growingDays: 215 },
  '8a': { min: 10, max: 15, lastFrost: '3/15', firstFrost: '11/15', growingDays: 240 },
  '8b': { min: 15, max: 20, lastFrost: '3/1', firstFrost: '11/25', growingDays: 265 },
  '9a': { min: 20, max: 25, lastFrost: '2/15', firstFrost: '12/1', growingDays: 285 },
  '9b': { min: 25, max: 30, lastFrost: '2/1', firstFrost: '12/15', growingDays: 315 },
  '10a': { min: 30, max: 35, lastFrost: 'N/A', firstFrost: 'N/A', growingDays: 365 },
  '10b': { min: 35, max: 40, lastFrost: 'N/A', firstFrost: 'N/A', growingDays: 365 },
};

const commonCrops = {
  'tomatoes': { frostTolerant: false, daysToMaturity: 75, plantingTemp: 15 },
  'peppers': { frostTolerant: false, daysToMaturity: 70, plantingTemp: 15 },
  'lettuce': { frostTolerant: true, daysToMaturity: 45, plantingTemp: 5 },
  'peas': { frostTolerant: true, daysToMaturity: 60, plantingTemp: 10 },
  'beans': { frostTolerant: false, daysToMaturity: 55, plantingTemp: 15 },
  'carrots': { frostTolerant: true, daysToMaturity: 70, plantingTemp: 7 },
  'spinach': { frostTolerant: true, daysToMaturity: 40, plantingTemp: 5 },
  'corn': { frostTolerant: false, daysToMaturity: 65, plantingTemp: 15 },
};

const FrostDateCalculator = () => {
  const [inputs, setInputs] = useState({
    zone: '',
    crop: '',
    unit: 'celsius'
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
    if (name === 'zone' && value) {
      calculatePlantingDates(value, inputs.crop);
    }
  };

  const convertTemp = (temp) => {
    return inputs.unit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  };

  const calculatePlantingDates = (zone, crop) => {
    if (!zone) {
      setError('Please select a hardiness zone');
      return;
    }

    const zoneData = hardinessZones[zone];
    const cropData = crop ? commonCrops[crop] : null;

    const lastFrostDate = new Date(2024 + '/' + zoneData.lastFrost);
    const firstFrostDate = new Date(2024 + '/' + zoneData.firstFrost);

    let plantingDates = {
      zone: zone,
      minTemp: convertTemp(zoneData.min),
      maxTemp: convertTemp(zoneData.max),
      lastFrost: zoneData.lastFrost,
      firstFrost: zoneData.firstFrost,
      growingDays: zoneData.growingDays,
    };

    if (cropData) {
      plantingDates = {
        ...plantingDates,
        crop: crop,
        daysToMaturity: cropData.daysToMaturity,
        frostTolerant: cropData.frostTolerant,
        plantingTemp: convertTemp(cropData.plantingTemp),
      };
    }

    setResults(plantingDates);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Frost Date Calculator
      </Typography>

      {/* Educational Content Section */}
      <Box mb={4}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} /> About Frost Dates
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <AgricultureIcon sx={{ mr: 1 }} /> Importance in Agriculture
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.importance.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{item.aspect}</Typography>
                      <Typography paragraph>{item.description}</Typography>
                      <Typography variant="body2" color="textSecondary">{item.impact}</Typography>
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
              <SunIcon sx={{ mr: 1 }} /> Hardiness Zones
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.hardinessZones.description}</Typography>
            <Typography paragraph>
              <strong>Importance:</strong> {educationalContent.hardinessZones.importance}
            </Typography>
            <Typography>
              <strong>Usage:</strong> {educationalContent.hardinessZones.usage}
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <FrostIcon sx={{ mr: 1 }} /> Best Practices
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.bestPractices.map((practice, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={practice} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Calculator Inputs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Hardiness Zone</InputLabel>
                <Select
                  name="zone"
                  value={inputs.zone}
                  onChange={handleInputChange}
                  label="Hardiness Zone"
                >
                  {Object.keys(hardinessZones).map(zone => (
                    <MenuItem key={zone} value={zone}>
                      Zone {zone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Crop (Optional)</InputLabel>
                <Select
                  name="crop"
                  value={inputs.crop}
                  onChange={handleInputChange}
                  label="Crop (Optional)"
                >
                  {Object.keys(commonCrops).map(crop => (
                    <MenuItem key={crop} value={crop}>
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Temperature Unit</InputLabel>
                <Select
                  name="unit"
                  value={inputs.unit}
                  onChange={handleInputChange}
                  label="Temperature Unit"
                >
                  <MenuItem value="celsius">Celsius</MenuItem>
                  <MenuItem value="fahrenheit">Fahrenheit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Results Display */}
      {results && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Results for Zone {results.zone}</Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Last Frost Date</strong></TableCell>
                    <TableCell>{results.lastFrost}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>First Frost Date</strong></TableCell>
                    <TableCell>{results.firstFrost}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Growing Days</strong></TableCell>
                    <TableCell>{results.growingDays}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Temperature Range</strong></TableCell>
                    <TableCell>
                      {results.minTemp}° to {results.maxTemp}° {inputs.unit.charAt(0).toUpperCase()}
                    </TableCell>
                  </TableRow>
                  {results.crop && (
                    <>
                      <TableRow>
                        <TableCell><strong>Days to Maturity</strong></TableCell>
                        <TableCell>{results.daysToMaturity}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Frost Tolerant</strong></TableCell>
                        <TableCell>{results.frostTolerant ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Minimum Planting Temperature</strong></TableCell>
                        <TableCell>{results.plantingTemp}° {inputs.unit.charAt(0).toUpperCase()}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Planting Guide */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Crop Planting Guide</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Crop</strong></TableCell>
                  <TableCell><strong>Days to Maturity</strong></TableCell>
                  <TableCell><strong>Frost Tolerant</strong></TableCell>
                  <TableCell><strong>Min. Planting Temp (°C)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(commonCrops).map(([crop, data]) => (
                  <TableRow key={crop}>
                    <TableCell>{crop.charAt(0).toUpperCase() + crop.slice(1)}</TableCell>
                    <TableCell>{data.daysToMaturity}</TableCell>
                    <TableCell>{data.frostTolerant ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{data.plantingTemp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Educational Content */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Why Frost Dates Matter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            {educationalContent.importance.map((item, index) => (
              <div key={index}>
                <Typography variant="h6" gutterBottom>{item.aspect}</Typography>
                <Typography paragraph>{item.description}</Typography>
                <Typography paragraph>{item.impact}</Typography>
              </div>
            ))}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Educational Content */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Understanding Hardiness Zones</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            {educationalContent.hardinessZones.description}
          </Typography>
          <Typography paragraph>
            {educationalContent.hardinessZones.importance}
          </Typography>
          <Typography paragraph>
            {educationalContent.hardinessZones.usage}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Educational Content */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Best Practices for Frost Protection</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {educationalContent.bestPractices.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <FrostIcon />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default FrostDateCalculator;
