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
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Grass as MulchIcon,
  Calculate as CalculateIcon,
  Layers as LayersIcon
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `The Mulch Calculator helps farmers and gardeners determine the right amount of mulch needed for their growing areas. Proper mulching improves soil health, conserves water, suppresses weeds, and regulates soil temperature.`,
  
  mulchBenefits: [
    {
      benefit: 'Moisture Conservation',
      description: 'Reduces water evaporation by 25-50%, decreasing irrigation needs',
      impact: 'Lower water bills and reduced plant stress'
    },
    {
      benefit: 'Weed Suppression',
      description: 'Creates a barrier that prevents weed seed germination',
      impact: 'Reduced labor and herbicide costs'
    },
    {
      benefit: 'Temperature Regulation',
      description: 'Moderates soil temperature fluctuations',
      impact: 'Extended growing season and improved root health'
    },
    {
      benefit: 'Soil Health',
      description: 'Adds organic matter as it decomposes',
      impact: 'Enhanced soil structure and fertility'
    }
  ],

  applicationGuidelines: {
    depth: {
      description: 'Recommended mulch depths by type',
      guidelines: {
        'Straw': '4-6 inches (10-15 cm)',
        'Wood Chips': '2-4 inches (5-10 cm)',
        'Compost': '1-2 inches (2.5-5 cm)',
        'Leaves': '3-4 inches (7.5-10 cm)'
      }
    },
    timing: {
      description: 'Optimal mulching periods',
      recommendations: [
        'Apply after soil has warmed in spring',
        'Reapply when mulch has decomposed',
        'Add before winter for cold protection',
        'Avoid mulching against plant stems'
      ]
    }
  },

  mulchTypes: {
    organic: {
      description: 'Materials that decompose over time',
      examples: [
        'Straw and hay',
        'Wood chips and bark',
        'Grass clippings',
        'Composted materials'
      ],
      benefits: 'Improves soil as it breaks down'
    },
    inorganic: {
      description: 'Non-decomposing materials',
      examples: [
        'Landscape fabric',
        'Plastic sheeting',
        'Rubber mulch',
        'Gravel'
      ],
      benefits: 'Long-lasting weed suppression'
    }
  },

  maintenanceTips: [
    'Monitor mulch depth and replenish as needed',
    'Keep mulch away from plant stems to prevent rot',
    'Remove any diseased mulch promptly',
    'Fluff compacted mulch periodically',
    'Check moisture levels beneath mulch',
    'Consider pH effects of mulch type'
  ]
};

const MulchCalculator = () => {
  const [inputs, setInputs] = useState({
    length: '',
    width: '',
    depth: '',
    mulchType: '',
    shape: 'rectangle',
    irregularArea: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const mulchTypes = [
    { name: 'Wood Chips', density: 800, coverage: 2.0 }, // lbs per cubic yard
    { name: 'Bark Mulch', density: 500, coverage: 1.8 },
    { name: 'Straw', density: 300, coverage: 1.5 },
    { name: 'Pine Needles', density: 400, coverage: 1.7 },
    { name: 'Cocoa Hulls', density: 600, coverage: 1.6 },
    { name: 'Compost', density: 1000, coverage: 2.2 },
    { name: 'Gravel', density: 2700, coverage: 1.0 },
    { name: 'Rubber Mulch', density: 600, coverage: 1.9 }
  ];

  const shapes = [
    { name: 'Rectangle/Square', value: 'rectangle' },
    { name: 'Circle', value: 'circle' },
    { name: 'Irregular', value: 'irregular' }
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateMulch = () => {
    try {
      // Validate inputs based on shape
      if (inputs.shape === 'irregular') {
        if (!inputs.irregularArea || isNaN(inputs.irregularArea) || Number(inputs.irregularArea) <= 0) {
          throw new Error('Please enter a valid area measurement');
        }
      } else {
        if (!inputs.length || !inputs.width || isNaN(inputs.length) || isNaN(inputs.width)) {
          throw new Error('Please enter valid dimensions');
        }
      }

      if (!inputs.depth || isNaN(inputs.depth) || Number(inputs.depth) <= 0) {
        throw new Error('Please enter a valid depth');
      }

      if (!inputs.mulchType) {
        throw new Error('Please select a mulch type');
      }

      // Calculate area based on shape
      let area;
      if (inputs.shape === 'rectangle') {
        area = Number(inputs.length) * Number(inputs.width);
      } else if (inputs.shape === 'circle') {
        area = Math.PI * Math.pow(Number(inputs.length) / 2, 2);
      } else {
        area = Number(inputs.irregularArea);
      }

      const depth = Number(inputs.depth);
      const selectedMulch = mulchTypes.find(m => m.name === inputs.mulchType);

      // Calculate volume in cubic feet
      const volumeCubicFeet = (area * depth) / 12; // Convert depth from inches to feet
      const volumeCubicYards = volumeCubicFeet / 27; // Convert to cubic yards

      // Calculate weight
      const weightPounds = volumeCubicYards * selectedMulch.density;
      
      // Calculate bags needed (assuming standard 2 cubic feet bags)
      const bagsNeeded = Math.ceil(volumeCubicFeet / 2);

      // Calculate coverage factor
      const actualCoverage = area * selectedMulch.coverage;

      setResults({
        area: area.toFixed(2),
        volumeCubicFeet: volumeCubicFeet.toFixed(2),
        volumeCubicYards: volumeCubicYards.toFixed(2),
        weightPounds: weightPounds.toFixed(2),
        bagsNeeded,
        coverage: actualCoverage.toFixed(2),
        recommendations: [
          `Apply mulch ${depth} inches deep for optimal coverage`,
          'Keep mulch 2-3 inches away from plant stems and tree trunks',
          'Water the area thoroughly after mulching',
          'Replace mulch when decomposed (typically annually)',
          `For ${selectedMulch.name}, expect ${selectedMulch.coverage}x area coverage due to settling`
        ]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mulch Calculator
      </Typography>

      {/* Educational Content Section */}
      <Box sx={{ mb: 4 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <MulchIcon sx={{ mr: 1 }} /> About Mulching
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <LayersIcon sx={{ mr: 1 }} /> Benefits of Mulching
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.mulchBenefits.map((benefit, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{benefit.benefit}</Typography>
                      <Typography paragraph>{benefit.description}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Impact: {benefit.impact}
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
              <CalculateIcon sx={{ mr: 1 }} /> Application Guidelines
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Recommended Depths</Typography>
                    <Typography paragraph>{educationalContent.applicationGuidelines.depth.description}</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {Object.entries(educationalContent.applicationGuidelines.depth.guidelines).map(([type, depth]) => (
                            <TableRow key={type}>
                              <TableCell><strong>{type}</strong></TableCell>
                              <TableCell>{depth}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Timing Recommendations</Typography>
                    <Typography paragraph>{educationalContent.applicationGuidelines.timing.description}</Typography>
                    <ul>
                      {educationalContent.applicationGuidelines.timing.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} /> Types of Mulch
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {Object.entries(educationalContent.mulchTypes).map(([key, value]) => (
                <Grid item xs={12} md={6} key={key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                        {key} Mulch
                      </Typography>
                      <Typography paragraph>{value.description}</Typography>
                      <Typography variant="subtitle1" gutterBottom>Examples:</Typography>
                      <ul>
                        {value.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                      <Typography variant="body2" color="text.secondary">
                        Benefits: {value.benefits}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Calculator Section */}
      <Typography variant="h5" gutterBottom>
        Mulch Coverage Calculator
        <Tooltip title="Calculate mulch needed based on area and desired depth">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Area Shape</InputLabel>
                <Select
                  name="shape"
                  value={inputs.shape}
                  onChange={handleInputChange}
                  label="Area Shape"
                >
                  {shapes.map(shape => (
                    <MenuItem key={shape.value} value={shape.value}>
                      {shape.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {inputs.shape !== 'irregular' ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label={inputs.shape === 'circle' ? "Diameter" : "Length"}
                    name="length"
                    value={inputs.length}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">feet</InputAdornment>
                    }}
                  />
                </Grid>
                {inputs.shape === 'rectangle' && (
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Width"
                      name="width"
                      value={inputs.width}
                      onChange={handleInputChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">feet</InputAdornment>
                      }}
                    />
                  </Grid>
                )}
              </>
            ) : (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Area"
                  name="irregularArea"
                  value={inputs.irregularArea}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">sq ft</InputAdornment>
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Desired Depth"
                name="depth"
                value={inputs.depth}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">inches</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Mulch Type</InputLabel>
                <Select
                  name="mulchType"
                  value={inputs.mulchType}
                  onChange={handleInputChange}
                  label="Mulch Type"
                >
                  {mulchTypes.map(type => (
                    <MenuItem key={type.name} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={calculateMulch} sx={{ mt: 2 }}>
                Calculate Mulch Needs
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Coverage Summary</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Area to Cover</TableCell>
                        <TableCell>{results.area} sq ft</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Volume Needed</TableCell>
                        <TableCell>{results.volumeCubicFeet} cu ft ({results.volumeCubicYards} cu yd)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weight</TableCell>
                        <TableCell>{results.weightPounds} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Standard Bags Needed (2 cu ft)</TableCell>
                        <TableCell>{results.bagsNeeded} bags</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Actual Coverage Area</TableCell>
                        <TableCell>{results.coverage} sq ft (with settling)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Application Guidelines</Typography>
                <ul>
                  {results.recommendations.map((rec, index) => (
                    <li key={index}><Typography>{rec}</Typography></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MulchCalculator;
