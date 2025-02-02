import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Box,
  Alert,
  Slider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { 
  Air, 
  ForestOutlined, 
  Speed, 
  Height,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Science as ScienceIcon,
  Nature as NatureIcon 
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `Windbreaks are essential agricultural features that protect crops, soil, and livestock from wind damage. Understanding windbreak effectiveness helps optimize their design and placement for maximum benefit.`,
  
  keyComponents: [
    {
      component: 'Height',
      description: 'Determines the protected area downwind',
      impact: 'Protection extends 10-30 times the windbreak height'
    },
    {
      component: 'Porosity',
      description: 'The amount of open space in the windbreak',
      impact: 'Affects wind speed reduction and turbulence'
    },
    {
      component: 'Orientation',
      description: 'Alignment relative to prevailing winds',
      impact: 'Determines effectiveness in blocking problematic winds'
    },
    {
      component: 'Length',
      description: 'Total linear distance of the windbreak',
      impact: 'Prevents wind from wrapping around the ends'
    }
  ],

  speciesGuide: {
    conifer: {
      type: 'Conifer Trees',
      characteristics: [
        'Year-round protection',
        'Dense foliage',
        'Slow growth rate',
        'Long lifespan'
      ]
    },
    deciduous: {
      type: 'Deciduous Trees',
      characteristics: [
        'Seasonal protection',
        'Variable density',
        'Fast growth rate',
        'Deep root systems'
      ]
    },
    shrub: {
      type: 'Dense Shrubs',
      characteristics: [
        'Low-level protection',
        'High density',
        'Easy maintenance',
        'Quick establishment'
      ]
    },
    mixed: {
      type: 'Mixed Planting',
      characteristics: [
        'Multi-level protection',
        'Biodiversity benefits',
        'Adaptable design',
        'Enhanced wildlife habitat'
      ]
    }
  },

  benefits: [
    {
      benefit: 'Crop Protection',
      description: 'Reduces physical damage and moisture stress',
      impact: 'Improved yield and quality'
    },
    {
      benefit: 'Soil Conservation',
      description: 'Prevents wind erosion and soil loss',
      impact: 'Maintains topsoil and fertility'
    },
    {
      benefit: 'Microclimate Control',
      description: 'Moderates temperature and humidity',
      impact: 'Better growing conditions'
    },
    {
      benefit: 'Snow Management',
      description: 'Controls snow distribution and drifting',
      impact: 'Better moisture distribution and access'
    }
  ]
};

const speciesOptions = [
  { value: 'conifer', label: 'Conifer Trees', density: 0.5 },
  { value: 'deciduous', label: 'Deciduous Trees', density: 0.6 },
  { value: 'shrub', label: 'Dense Shrubs', density: 0.7 },
  { value: 'mixed', label: 'Mixed Planting', density: 0.55 },
];

const WindBreakEffectiveness = () => {
  const [inputs, setInputs] = useState({
    windbreakHeight: '',
    windbreakLength: '',
    porosity: 50,
    windSpeed: '',
    windDirection: 0,
    orientation: 0,
    rows: 1,
    species: 'conifer',
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

  const handleSliderChange = (name) => (event, newValue) => {
    setInputs(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const validateInputs = () => {
    if (!inputs.windbreakHeight || !inputs.windbreakLength || !inputs.windSpeed) {
      setError('Please fill in all required fields');
      return false;
    }

    if (parseFloat(inputs.windbreakHeight) <= 0) {
      setError('Windbreak height must be greater than 0');
      return false;
    }

    if (parseFloat(inputs.windbreakLength) <= 0) {
      setError('Windbreak length must be greater than 0');
      return false;
    }

    if (parseFloat(inputs.windSpeed) <= 0) {
      setError('Wind speed must be greater than 0');
      return false;
    }

    return true;
  };

  const calculateWindbreakEffectiveness = () => {
    if (!validateInputs()) return;

    const height = parseFloat(inputs.windbreakHeight);
    const length = parseFloat(inputs.windbreakLength);
    const windSpeed = parseFloat(inputs.windSpeed);
    const porosity = inputs.porosity / 100;
    
    // Calculate wind angle relative to windbreak
    const relativeAngle = Math.abs((inputs.windDirection - inputs.orientation) % 180);
    const angleEffect = Math.cos(relativeAngle * Math.PI / 180);

    // Calculate protected zone dimensions
    const maxProtectionDistance = height * (15 - 10 * porosity); // Maximum protection distance (in multiples of height)
    const protectedWidth = length * angleEffect;
    
    // Calculate wind speed reduction at different distances
    const reductions = calculateWindReductions(height, porosity, windSpeed);
    
    // Calculate effectiveness score (0-100)
    const effectivenessScore = calculateEffectivenessScore(
      height,
      length,
      porosity,
      inputs.rows,
      angleEffect
    );

    // Generate recommendations based on the analysis
    const recommendations = generateRecommendations(
      effectivenessScore,
      porosity,
      inputs.rows,
      relativeAngle
    );

    setResults({
      protectedArea: (protectedWidth * maxProtectionDistance).toFixed(1),
      maxDistance: maxProtectionDistance.toFixed(1),
      effectivenessScore: effectivenessScore.toFixed(0),
      windReductions: reductions,
      recommendations: recommendations
    });
  };

  const calculateWindReductions = (height, porosity, windSpeed) => {
    const distances = [2, 5, 10, 15, 20]; // Distances in multiples of height
    return distances.map(distance => {
      // Wind reduction formula based on distance and porosity
      const reduction = Math.min(
        0.9,
        (1 - porosity) * Math.exp(-0.1 * distance) * (1 + Math.log(height) / 5)
      );
      return {
        distance: distance * height,
        reduction: (reduction * 100).toFixed(0),
        resultingSpeed: (windSpeed * (1 - reduction)).toFixed(1)
      };
    });
  };

  const calculateEffectivenessScore = (height, length, porosity, rows, angleEffect) => {
    let score = 0;
    
    // Height contribution (0-25 points)
    score += Math.min(25, height * 2);
    
    // Length-to-height ratio contribution (0-20 points)
    const lengthRatio = length / height;
    score += Math.min(20, lengthRatio * 2);
    
    // Porosity contribution (0-20 points)
    const optimalPorosity = 0.3; // 30% is generally considered optimal
    score += 20 * (1 - Math.abs(porosity - optimalPorosity) / 0.7);
    
    // Multiple rows contribution (0-15 points)
    score += Math.min(15, rows * 5);
    
    // Orientation effectiveness (0-20 points)
    score += 20 * angleEffect;
    
    return Math.min(100, score);
  };

  const generateRecommendations = (score, porosity, rows, angle) => {
    const recommendations = [];

    if (score < 60) {
      recommendations.push('Consider increasing the height or length of your windbreak for better protection');
    }

    if (porosity > 0.5) {
      recommendations.push('The windbreak is too porous. Consider adding more plants or choosing denser species');
    } else if (porosity < 0.2) {
      recommendations.push('The windbreak might be too dense, which could create turbulence. Consider thinning or pruning');
    }

    if (rows < 2) {
      recommendations.push('Adding multiple rows would improve effectiveness and provide backup protection');
    }

    if (angle > 30) {
      recommendations.push('The windbreak is not optimally oriented to the prevailing wind. Consider adjusting the orientation or adding additional sections');
    }

    if (recommendations.length === 0) {
      recommendations.push('Your windbreak design appears to be well-optimized!');
    }

    return recommendations;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Windbreak Effectiveness Calculator
      </Typography>

      {/* Educational Content Section */}
      <Box sx={{ mb: 4 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <Air sx={{ mr: 1 }} /> About Windbreaks
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <ScienceIcon sx={{ mr: 1 }} /> Key Components
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.keyComponents.map((component, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{component.component}</Typography>
                      <Typography paragraph>{component.description}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Impact: {component.impact}
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
              <ForestOutlined sx={{ mr: 1 }} /> Species Guide
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {Object.entries(educationalContent.speciesGuide).map(([key, species]) => (
                <Grid item xs={12} md={6} key={key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{species.type}</Typography>
                      <ul>
                        {species.characteristics.map((characteristic, index) => (
                          <li key={index}>
                            <Typography variant="body2">{characteristic}</Typography>
                          </li>
                        ))}
                      </ul>
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
              <NatureIcon sx={{ mr: 1 }} /> Benefits
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.benefits.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{item.benefit}</Typography>
                      <Typography paragraph>{item.description}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Impact: {item.impact}
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
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Wind Break Effectiveness Calculator
          </Typography>
          
          <Typography variant="body2" color="textSecondary" paragraph>
            Calculate the effectiveness of your windbreak based on its dimensions, design, and local wind conditions.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Windbreak Height (m)"
                name="windbreakHeight"
                value={inputs.windbreakHeight}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <Height color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Windbreak Length (m)"
                name="windbreakLength"
                value={inputs.windbreakLength}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <ForestOutlined color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Wind Speed (m/s)"
                name="windSpeed"
                value={inputs.windSpeed}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <Speed color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Species Type</InputLabel>
                <Select
                  name="species"
                  value={inputs.species}
                  onChange={handleInputChange}
                  label="Species Type"
                >
                  {speciesOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Rows"
                name="rows"
                value={inputs.rows}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <ForestOutlined color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>
                Porosity (%)
              </Typography>
              <Slider
                value={inputs.porosity}
                onChange={handleSliderChange('porosity')}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                marks={[
                  { value: 0, label: 'Solid' },
                  { value: 50, label: 'Medium' },
                  { value: 100, label: 'Open' },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>
                Wind Direction (degrees)
              </Typography>
              <Slider
                value={inputs.windDirection}
                onChange={handleSliderChange('windDirection')}
                valueLabelDisplay="auto"
                min={0}
                max={360}
                marks={[
                  { value: 0, label: 'N' },
                  { value: 90, label: 'E' },
                  { value: 180, label: 'S' },
                  { value: 270, label: 'W' },
                  { value: 360, label: 'N' },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>
                Windbreak Orientation (degrees)
              </Typography>
              <Slider
                value={inputs.orientation}
                onChange={handleSliderChange('orientation')}
                valueLabelDisplay="auto"
                min={0}
                max={360}
                marks={[
                  { value: 0, label: 'N-S' },
                  { value: 90, label: 'E-W' },
                  { value: 180, label: 'N-S' },
                  { value: 270, label: 'E-W' },
                  { value: 360, label: 'N-S' },
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={calculateWindbreakEffectiveness}
                fullWidth
                startIcon={<Air />}
              >
                Calculate Effectiveness
              </Button>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            {results && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Results
                  </Typography>
                  
                  <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      Effectiveness Score: {results.effectivenessScore}%
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Protected Area: {results.protectedArea} m²
                    </Typography>
                    <Typography variant="body1">
                      Maximum Protection Distance: {results.maxDistance} × height
                    </Typography>
                  </Paper>

                  <Typography variant="h6" gutterBottom>
                    Wind Speed Reduction
                  </Typography>
                  <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    {results.windReductions.map((reduction, index) => (
                      <Typography key={index} variant="body1" gutterBottom>
                        At {reduction.distance}m: {reduction.reduction}% reduction
                        (Wind speed: {reduction.resultingSpeed} m/s)
                      </Typography>
                    ))}
                  </Paper>

                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <ul style={{ marginTop: 0 }}>
                      {results.recommendations.map((rec, index) => (
                        <li key={index}>
                          <Typography variant="body1">{rec}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Paper>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WindBreakEffectiveness;
