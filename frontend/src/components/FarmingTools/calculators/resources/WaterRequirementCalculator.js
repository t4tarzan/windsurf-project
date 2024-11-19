import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  Alert,
  MenuItem,
  Divider,
  Slider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton
} from '@mui/material';
import { WaterDrop as WaterIcon, ExpandMore as ExpandMoreIcon, Info as InfoIcon } from '@mui/icons-material';

const WaterRequirementCalculator = () => {
  const [inputs, setInputs] = useState({
    cropType: '',
    areaSize: '',
    areaUnit: 'sqft',
    soilType: '',
    rainfall: '',
    temperature: '',
    humidity: 50
  });

  const [result, setResult] = useState(null);

  const educationalContent = {
    introduction: {
      title: "Understanding Crop Water Requirements",
      content: [
        "Water management is crucial for optimal crop growth and sustainable farming practices.",
        "Proper irrigation helps prevent water stress, nutrient deficiencies, and crop diseases.",
        "Factors affecting water needs include crop type, growth stage, soil conditions, and climate."
      ]
    },
    cropWaterNeeds: {
      low: ['Drought-resistant herbs', 'Root vegetables', 'Some legumes'],
      moderate: ['Leafy greens', 'Brassicas', 'Bush beans'],
      high: ['Tomatoes', 'Cucumbers', 'Sweet corn']
    },
    soilConsiderations: [
      {
        type: "Sandy",
        characteristics: "Fast draining, low water retention",
        management: "Frequent light irrigation, mulching recommended"
      },
      {
        type: "Loamy",
        characteristics: "Balanced drainage and retention",
        management: "Moderate irrigation frequency, ideal for most crops"
      },
      {
        type: "Clay",
        characteristics: "Slow draining, high water retention",
        management: "Less frequent deep irrigation, avoid waterlogging"
      },
      {
        type: "Silty",
        characteristics: "Good water retention, moderate drainage",
        management: "Regular moderate irrigation, monitor moisture levels"
      }
    ],
    bestPractices: [
      {
        title: "Irrigation Timing",
        content: "Water early morning or late evening to minimize evaporation"
      },
      {
        title: "Soil Moisture Monitoring",
        content: "Use moisture meters or manual checks to optimize irrigation"
      },
      {
        title: "Mulching",
        content: "Apply organic mulch to reduce evaporation and maintain soil moisture"
      },
      {
        title: "Weather Considerations",
        content: "Adjust irrigation based on rainfall and temperature forecasts"
      }
    ]
  };

  const cropTypes = [
    { value: 'tomato', label: 'Tomatoes', waterNeed: 1, tips: 'Regular, consistent moisture needed, especially during fruit development' },
    { value: 'corn', label: 'Corn', waterNeed: 1.5, tips: 'Critical water needs during silking and tasseling stages' },
    { value: 'lettuce', label: 'Lettuce', waterNeed: 0.8, tips: 'Shallow roots require frequent light watering' },
    { value: 'potato', label: 'Potatoes', waterNeed: 1.2, tips: 'Consistent moisture needed during tuber formation' },
    { value: 'beans', label: 'Beans', waterNeed: 0.9, tips: 'Moderate water needs, avoid wetting foliage' }
  ];

  const soilTypes = [
    { value: 'sandy', label: 'Sandy', retentionFactor: 0.7, description: 'Fast draining, requires more frequent watering' },
    { value: 'loamy', label: 'Loamy', retentionFactor: 1, description: 'Ideal water retention and drainage' },
    { value: 'clay', label: 'Clay', retentionFactor: 1.3, description: 'High water retention, drainage may be poor' },
    { value: 'silty', label: 'Silty', retentionFactor: 1.1, description: 'Good water retention, moderate drainage' }
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (event, newValue) => {
    setInputs(prev => ({
      ...prev,
      humidity: newValue
    }));
  };

  const calculateWaterRequirement = () => {
    const area = parseFloat(inputs.areaSize);
    const rainfall = parseFloat(inputs.rainfall);
    const temperature = parseFloat(inputs.temperature);
    
    if (area && rainfall && temperature) {
      const crop = cropTypes.find(c => c.value === inputs.cropType);
      const soil = soilTypes.find(s => s.value === inputs.soilType);
      
      // Basic calculation formula
      const baseWaterNeed = crop.waterNeed * area;
      const temperatureFactor = 1 + (temperature - 20) * 0.03;
      const humidityFactor = 1 - (inputs.humidity / 100) * 0.3;
      const soilFactor = soil.retentionFactor;
      
      const waterNeeded = baseWaterNeed * temperatureFactor * humidityFactor * soilFactor;
      const effectiveRainfall = rainfall * 0.8; // Assuming 80% rainfall effectiveness
      const additionalWater = Math.max(0, waterNeeded - effectiveRainfall);

      setResult({
        dailyWater: waterNeeded.toFixed(2),
        weeklyWater: (waterNeeded * 7).toFixed(2),
        monthlyWater: (waterNeeded * 30).toFixed(2),
        additionalWater: additionalWater.toFixed(2)
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Water Requirement Calculator
        <Tooltip title="Calculate precise water requirements for your crops">
          <IconButton size="small" sx={{ ml: 1 }}>
            <WaterIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Understanding Irrigation Needs</Typography>
              {educationalContent.introduction.content.map((text, index) => (
                <Typography key={index} paragraph>{text}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Calculate Water Requirements</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Crop Type"
                    name="cropType"
                    value={inputs.cropType}
                    onChange={handleInputChange}
                    helperText="Select your crop type"
                  >
                    {cropTypes.map((crop) => (
                      <MenuItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Soil Type"
                    name="soilType"
                    value={inputs.soilType}
                    onChange={handleInputChange}
                    helperText="Select your soil type"
                  >
                    {soilTypes.map((soil) => (
                      <MenuItem key={soil.value} value={soil.value}>
                        {soil.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Area Size"
                    name="areaSize"
                    type="number"
                    value={inputs.areaSize}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <TextField
                          select
                          value={inputs.areaUnit}
                          name="areaUnit"
                          onChange={handleInputChange}
                          sx={{ width: '80px' }}
                        >
                          <MenuItem value="sqft">sq ft</MenuItem>
                          <MenuItem value="sqm">sq m</MenuItem>
                          <MenuItem value="acre">acre</MenuItem>
                        </TextField>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Average Rainfall"
                    name="rainfall"
                    type="number"
                    value={inputs.rainfall}
                    onChange={handleInputChange}
                    helperText="Average daily rainfall in mm"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Average Temperature"
                    name="temperature"
                    type="number"
                    value={inputs.temperature}
                    onChange={handleInputChange}
                    helperText="Average temperature in °C"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>Relative Humidity (%)</Typography>
                  <Slider
                    value={inputs.humidity}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={calculateWaterRequirement}
                    startIcon={<WaterIcon />}
                    sx={{ mt: 2 }}
                  >
                    Calculate Water Requirements
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {result && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Water Requirement Results</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Daily Water Requirement</TableCell>
                        <TableCell>{result.dailyWater} liters</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weekly Water Requirement</TableCell>
                        <TableCell>{result.weeklyWater} liters</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Monthly Water Requirement</TableCell>
                        <TableCell>{result.monthlyWater} liters</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Additional Water Needed (accounting for rainfall)</TableCell>
                        <TableCell>{result.additionalWater} liters</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Irrigation Guide</Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Soil Type Considerations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Soil Type</TableCell>
                      <TableCell>Characteristics</TableCell>
                      <TableCell>Management</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {educationalContent.soilConsiderations.map((soil, index) => (
                      <TableRow key={index}>
                        <TableCell>{soil.type}</TableCell>
                        <TableCell>{soil.characteristics}</TableCell>
                        <TableCell>{soil.management}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Best Practices</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {educationalContent.bestPractices.map((practice, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          {practice.title}
                        </Typography>
                        <Typography variant="body2">{practice.content}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Crop Water Requirements Guide</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Low Water Needs
                  </Typography>
                  <ul>
                    {educationalContent.cropWaterNeeds.low.map((crop, index) => (
                      <li key={index}><Typography variant="body2">{crop}</Typography></li>
                    ))}
                  </ul>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Moderate Water Needs
                  </Typography>
                  <ul>
                    {educationalContent.cropWaterNeeds.moderate.map((crop, index) => (
                      <li key={index}><Typography variant="body2">{crop}</Typography></li>
                    ))}
                  </ul>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    High Water Needs
                  </Typography>
                  <ul>
                    {educationalContent.cropWaterNeeds.high.map((crop, index) => (
                      <li key={index}><Typography variant="body2">{crop}</Typography></li>
                    ))}
                  </ul>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WaterRequirementCalculator;
