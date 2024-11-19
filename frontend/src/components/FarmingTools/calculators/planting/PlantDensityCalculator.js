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
  IconButton,
  Divider
} from '@mui/material';
import { LocalFlorist as PlantIcon, ExpandMore as ExpandMoreIcon, Info as InfoIcon } from '@mui/icons-material';

const PlantDensityCalculator = () => {
  const [inputs, setInputs] = useState({
    plotLength: '',
    plotWidth: '',
    plantSpacing: '',
    rowSpacing: '',
    unit: 'meters',
    cropType: 'custom'
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const educationalContent = {
    introduction: {
      title: "Understanding Plant Density",
      content: [
        "Plant density is crucial for optimal crop yield and resource utilization.",
        "Proper spacing ensures adequate light, water, and nutrient availability for each plant.",
        "Different crops require different spacing based on their growth habits and resource needs."
      ]
    },
    commonSpacing: [
      {
        crop: "Tomatoes",
        inRowSpacing: "45-60 cm",
        betweenRowSpacing: "90-120 cm",
        notes: "Indeterminate varieties need more space"
      },
      {
        crop: "Lettuce",
        inRowSpacing: "20-30 cm",
        betweenRowSpacing: "30-45 cm",
        notes: "Heading varieties need more space than leaf lettuce"
      },
      {
        crop: "Carrots",
        inRowSpacing: "5-7 cm",
        betweenRowSpacing: "30-45 cm",
        notes: "Thin seedlings to prevent overcrowding"
      },
      {
        crop: "Sweet Corn",
        inRowSpacing: "20-30 cm",
        betweenRowSpacing: "75-90 cm",
        notes: "Plant in blocks for better pollination"
      },
      {
        crop: "Bush Beans",
        inRowSpacing: "7-10 cm",
        betweenRowSpacing: "45-60 cm",
        notes: "Closer spacing for green beans, wider for dry beans"
      }
    ],
    bestPractices: [
      {
        title: "Light Management",
        content: "Ensure proper spacing to maximize light penetration to all plant parts"
      },
      {
        title: "Air Circulation",
        content: "Adequate spacing reduces disease risk by improving air flow"
      },
      {
        title: "Resource Competition",
        content: "Proper density prevents competition for water and nutrients"
      },
      {
        title: "Maintenance Access",
        content: "Include paths for easy maintenance and harvesting"
      }
    ],
    factors: [
      {
        factor: "Growth Habit",
        description: "Consider final plant size and growth pattern"
      },
      {
        factor: "Climate",
        description: "Adjust spacing based on local growing conditions"
      },
      {
        factor: "Soil Fertility",
        description: "Rich soils can support slightly higher density"
      },
      {
        factor: "Irrigation Method",
        description: "Consider access for irrigation equipment"
      }
    ]
  };

  const cropPresets = [
    { value: 'custom', label: 'Custom Spacing' },
    { value: 'tomatoes', label: 'Tomatoes', plantSpace: 0.5, rowSpace: 1.0 },
    { value: 'lettuce', label: 'Lettuce', plantSpace: 0.25, rowSpace: 0.4 },
    { value: 'carrots', label: 'Carrots', plantSpace: 0.06, rowSpace: 0.35 },
    { value: 'corn', label: 'Sweet Corn', plantSpace: 0.25, rowSpace: 0.8 },
    { value: 'beans', label: 'Bush Beans', plantSpace: 0.08, rowSpace: 0.5 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => {
      const newInputs = {
        ...prev,
        [name]: value
      };

      // If selecting a preset crop, update spacing values
      if (name === 'cropType' && value !== 'custom') {
        const preset = cropPresets.find(crop => crop.value === value);
        if (preset) {
          newInputs.plantSpacing = preset.plantSpace.toString();
          newInputs.rowSpacing = preset.rowSpace.toString();
        }
      }

      return newInputs;
    });
    setError('');
  };

  const calculateDensity = () => {
    const { plotLength, plotWidth, plantSpacing, rowSpacing, unit } = inputs;
    
    if (!plotLength || !plotWidth || !plantSpacing || !rowSpacing) {
      setError('Please fill in all fields');
      return;
    }

    const values = [plotLength, plotWidth, plantSpacing, rowSpacing].map(Number);
    if (values.some(isNaN)) {
      setError('All inputs must be valid numbers');
      return;
    }

    const conversionFactor = unit === 'feet' ? 0.3048 : 1;
    const length = values[0] * conversionFactor;
    const width = values[1] * conversionFactor;
    const pSpacing = values[2] * conversionFactor;
    const rSpacing = values[3] * conversionFactor;

    const plotArea = length * width;
    const plantsPerRow = Math.floor(length / pSpacing);
    const numberOfRows = Math.floor(width / rSpacing);
    const totalPlants = plantsPerRow * numberOfRows;
    const density = totalPlants / plotArea;

    setResults({
      plotArea: plotArea.toFixed(2),
      plantsPerRow,
      numberOfRows,
      totalPlants,
      density: density.toFixed(2)
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Plant Density Calculator
        <Tooltip title="Calculate optimal plant spacing and density">
          <IconButton size="small" sx={{ ml: 1 }}>
            <PlantIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Understanding Plant Density</Typography>
              {educationalContent.introduction.content.map((text, index) => (
                <Typography key={index} paragraph>{text}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Calculate Plant Density</Typography>
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
                      {cropPresets.map(crop => (
                        <MenuItem key={crop.value} value={crop.value}>
                          {crop.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Plot Length (${inputs.unit})`}
                    name="plotLength"
                    type="number"
                    value={inputs.plotLength}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Plot Width (${inputs.unit})`}
                    name="plotWidth"
                    type="number"
                    value={inputs.plotWidth}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Plant Spacing (${inputs.unit})`}
                    name="plantSpacing"
                    type="number"
                    value={inputs.plantSpacing}
                    onChange={handleInputChange}
                    helperText="Distance between plants in a row"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Row Spacing (${inputs.unit})`}
                    name="rowSpacing"
                    type="number"
                    value={inputs.rowSpacing}
                    onChange={handleInputChange}
                    helperText="Distance between rows"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={calculateDensity}
                    startIcon={<PlantIcon />}
                    sx={{ mt: 2 }}
                  >
                    Calculate Density
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Grid>
        )}

        {results && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Calculation Results</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Plot Area</TableCell>
                        <TableCell>{results.plotArea} square meters</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Plants per Row</TableCell>
                        <TableCell>{results.plantsPerRow}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number of Rows</TableCell>
                        <TableCell>{results.numberOfRows}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Plants</TableCell>
                        <TableCell>{results.totalPlants}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Plant Density</TableCell>
                        <TableCell>{results.density} plants per square meter</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Planting Guide</Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Common Crop Spacing Guide</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Crop</TableCell>
                      <TableCell>In-Row Spacing</TableCell>
                      <TableCell>Between-Row Spacing</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {educationalContent.commonSpacing.map((crop, index) => (
                      <TableRow key={index}>
                        <TableCell>{crop.crop}</TableCell>
                        <TableCell>{crop.inRowSpacing}</TableCell>
                        <TableCell>{crop.betweenRowSpacing}</TableCell>
                        <TableCell>{crop.notes}</TableCell>
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
              <Typography variant="h6">Factors Affecting Plant Density</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {educationalContent.factors.map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          {item.factor}
                        </Typography>
                        <Typography variant="body2">{item.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlantDensityCalculator;
