import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Rating,
  Slider,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  BugReport as BugIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Nature as NatureIcon,
  Science as ScienceIcon
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `Integrated Pest Management (IPM) is a sustainable, science-based approach to managing pests through biological, cultural, physical, and chemical methods while minimizing environmental impact. This calculator helps farmers develop effective IPM strategies based on pest populations and crop conditions.`,
  
  ipmPrinciples: [
    {
      principle: 'Prevention',
      description: 'Use resistant varieties and cultural practices to prevent pest problems before they occur.'
    },
    {
      principle: 'Monitoring',
      description: 'Regular scouting and identification of pests to track population levels and damage.'
    },
    {
      principle: 'Threshold-Based Decisions',
      description: 'Take action only when pest populations reach economically damaging levels.'
    },
    {
      principle: 'Multiple Tactics',
      description: 'Integrate multiple control methods rather than relying on a single approach.'
    }
  ],

  controlMethods: {
    biological: {
      description: 'Using natural enemies to control pests',
      examples: ['Beneficial insects', 'Predatory mites', 'Parasitic wasps', 'Microbial controls']
    },
    cultural: {
      description: 'Modifying the growing environment to reduce pest problems',
      examples: ['Crop rotation', 'Companion planting', 'Sanitation', 'Timing of planting']
    },
    physical: {
      description: 'Using physical barriers or controls',
      examples: ['Row covers', 'Traps', 'Mulches', 'Hand removal']
    },
    chemical: {
      description: 'Using pesticides as a last resort',
      examples: ['Selective pesticides', 'Spot treatments', 'Timing applications', 'Resistance management']
    }
  },

  bestPractices: [
    'Identify pests accurately before taking action',
    'Establish monitoring and record-keeping systems',
    'Consider environmental factors affecting pest populations',
    'Preserve and encourage natural enemies',
    'Use selective pesticides only when necessary',
    'Rotate control methods to prevent resistance'
  ]
};

// Pest threshold levels and control methods database
const pestDatabase = {
  aphids: {
    name: 'Aphids',
    description: 'Small, soft-bodied insects that feed on plant sap, causing stunted growth and leaf curling.',
    thresholds: {
      low: { level: 'Less than 10 per leaf', risk: 1 },
      moderate: { level: '10-25 per leaf', risk: 2 },
      high: { level: 'More than 25 per leaf', risk: 3 },
    },
    controls: {
      biological: ['Ladybugs', 'Lacewings', 'Parasitic wasps'],
      cultural: ['Remove affected leaves', 'Increase plant spacing', 'Use reflective mulch'],
      physical: ['Strong water spray', 'Sticky traps', 'Row covers'],
      chemical: ['Insecticidal soap', 'Neem oil', 'Pyrethrin (as last resort)'],
    },
    monitoringTips: [
      'Check undersides of leaves',
      'Look for ant activity',
      'Monitor new growth',
      'Check for sticky honeydew'
    ]
  },
  caterpillars: {
    name: 'Caterpillars',
    description: 'Larvae of moths and butterflies that feed on plant foliage, fruits, and stems.',
    thresholds: {
      low: { level: '1-2 per plant', risk: 1 },
      moderate: { level: '3-5 per plant', risk: 2 },
      high: { level: 'More than 5 per plant', risk: 3 },
    },
    controls: {
      biological: ['Bacillus thuringiensis (Bt)', 'Parasitic wasps', 'Birds', 'Trichogramma wasps'],
      cultural: ['Hand picking', 'Row covers', 'Companion planting', 'Crop rotation'],
      physical: ['Pheromone traps', 'Light traps', 'Barrier methods'],
      chemical: ['Spinosad', 'Neem oil', 'Pyrethrin (as last resort)'],
    },
    monitoringTips: [
      'Check for eggs on leaf undersides',
      'Look for feeding damage',
      'Monitor with pheromone traps',
      'Check for frass (droppings)'
    ]
  },
  mites: {
    name: 'Spider Mites',
    description: 'Tiny arachnids that feed on plant cells, causing stippling and webbing on leaves.',
    thresholds: {
      low: { level: 'Occasional speckling on leaves', risk: 1 },
      moderate: { level: 'Visible webbing, yellowing leaves', risk: 2 },
      high: { level: 'Heavy webbing, leaf death', risk: 3 },
    },
    controls: {
      biological: ['Predatory mites', 'Ladybugs', 'Minute pirate bugs', 'Lacewings'],
      cultural: ['Increase humidity', 'Strong water spray', 'Remove affected leaves', 'Dust control'],
      physical: ['Pruning', 'Water sprays', 'Barriers'],
      chemical: ['Insecticidal soap', 'Neem oil', 'Sulfur sprays', 'Miticides (as last resort)'],
    },
    monitoringTips: [
      'Use magnifying glass for inspection',
      'Check leaf undersides',
      'Look for webbing',
      'Monitor during hot, dry conditions'
    ]
  },
  whiteflies: {
    name: 'Whiteflies',
    description: 'Small, winged insects that feed on plant sap and excrete honeydew.',
    thresholds: {
      low: { level: '1-2 adults per leaf', risk: 1 },
      moderate: { level: '3-5 adults per leaf', risk: 2 },
      high: { level: 'More than 5 adults per leaf', risk: 3 },
    },
    controls: {
      biological: ['Encarsia formosa', 'Delphastus catalinae', 'Lacewings', 'Parasitic wasps'],
      cultural: ['Yellow sticky traps', 'Remove infested leaves', 'Companion planting', 'Proper spacing'],
      physical: ['Vacuuming', 'Reflective mulches', 'Row covers'],
      chemical: ['Insecticidal soap', 'Neem oil', 'Horticultural oils', 'Pyrethrins (as last resort)'],
    },
    monitoringTips: [
      'Shake plants to check for flying adults',
      'Check leaf undersides for eggs/nymphs',
      'Monitor with yellow sticky traps',
      'Look for sooty mold growth'
    ]
  }
};

const IPMCalculator = () => {
  const [inputs, setInputs] = useState({
    cropType: '',
    pestType: '',
    infestationLevel: '',
    cropStage: '',
    weatherConditions: '',
    previousControls: '',
  });

  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateRisk = () => {
    const { cropType, pestType, infestationLevel, cropStage, weatherConditions } = inputs;
    
    if (!cropType || !pestType || !infestationLevel || !cropStage || !weatherConditions) {
      setError('Please fill in all required fields');
      return;
    }

    const pestInfo = pestDatabase[pestType];
    if (!pestInfo) {
      setError('Pest type not found in database');
      return;
    }

    // Calculate risk factors
    const infestationRisk = pestInfo.thresholds[infestationLevel].risk;
    const cropStageRisk = calculateCropStageRisk(cropStage);
    const weatherRisk = calculateWeatherRisk(weatherConditions);

    const totalRisk = (infestationRisk + cropStageRisk + weatherRisk) / 3;
    
    // Generate recommendations based on risk level
    const recommendations = generateRecommendations(pestInfo, totalRisk);

    setAssessment({
      pestInfo,
      riskLevel: totalRisk,
      recommendations,
      controlMethods: pestInfo.controls,
      monitoringTips: pestInfo.monitoringTips
    });
  };

  const calculateCropStageRisk = (stage) => {
    switch (stage) {
      case 'seedling':
        return 3;
      case 'vegetative':
        return 2;
      case 'mature':
        return 1;
      default:
        return 0;
    }
  };

  const calculateWeatherRisk = (conditions) => {
    switch (conditions) {
      case 'favorable':
        return 3;
      case 'moderate':
        return 2;
      case 'unfavorable':
        return 1;
      default:
        return 0;
    }
  };

  const generateRecommendations = (pestInfo, totalRisk) => {    
    if (totalRisk <= 1.5) {
      return {
        priority: 'Low',
        actions: [
          'Continue regular monitoring using recommended methods',
          'Maintain preventive cultural practices',
          'Consider implementing biological controls as preventive measure',
          'Document current conditions and practices',
        ],
        methods: [
          ...pestInfo.controls.cultural.slice(0, 2),
          ...pestInfo.controls.biological.slice(0, 2)
        ],
      };
    } else if (totalRisk <= 2.5) {
      return {
        priority: 'Moderate',
        actions: [
          'Increase monitoring frequency',
          'Implement biological and cultural controls',
          'Prepare additional control measures if needed',
          'Review and adjust current management practices',
        ],
        methods: [
          ...pestInfo.controls.biological,
          ...pestInfo.controls.cultural,
          ...pestInfo.controls.physical.slice(0, 2)
        ],
      };
    } else {
      return {
        priority: 'High',
        actions: [
          'Implement immediate control measures',
          'Integrate multiple control methods',
          'Monitor effectiveness of controls daily',
          'Plan long-term management strategy',
          'Consider chemical controls if other methods fail',
        ],
        methods: [
          ...pestInfo.controls.biological,
          ...pestInfo.controls.cultural,
          ...pestInfo.controls.physical,
          ...pestInfo.controls.chemical
        ],
      };
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        IPM Decision Tool
        <Tooltip title="Integrated Pest Management helps make informed decisions about pest control">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About Integrated Pest Management (IPM)
            </Typography>
            <Typography paragraph>
              {educationalContent.introduction}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              IPM Principles
            </Typography>
            <Grid container spacing={3}>
              {educationalContent.ipmPrinciples.map((principle) => (
                <Grid item xs={12} md={3} key={principle.principle}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {principle.principle}
                      </Typography>
                      <Typography variant="body2">
                        {principle.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Control Methods
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(educationalContent.controlMethods).map(([key, method]) => (
                <Grid item xs={12} md={3} key={key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {key.charAt(0).toUpperCase() + key.slice(1)} Control
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {method.description}
                      </Typography>
                      <List dense>
                        {method.examples.map((example, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={example} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Best Practices
            </Typography>
            <List>
              {educationalContent.bestPractices.map((practice, index) => (
                <ListItem key={index}>
                  <ListItemText primary={practice} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Calculate IPM Strategy
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Crop Type"
            name="cropType"
            value={inputs.cropType}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Pest Type</InputLabel>
            <Select
              name="pestType"
              value={inputs.pestType}
              onChange={handleInputChange}
              label="Pest Type"
            >
              <MenuItem value="aphids">Aphids</MenuItem>
              <MenuItem value="caterpillars">Caterpillars</MenuItem>
              <MenuItem value="mites">Mites</MenuItem>
              <MenuItem value="whiteflies">Whiteflies</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Infestation Level</InputLabel>
            <Select
              name="infestationLevel"
              value={inputs.infestationLevel}
              onChange={handleInputChange}
              label="Infestation Level"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Crop Stage</InputLabel>
            <Select
              name="cropStage"
              value={inputs.cropStage}
              onChange={handleInputChange}
              label="Crop Stage"
            >
              <MenuItem value="seedling">Seedling</MenuItem>
              <MenuItem value="vegetative">Vegetative</MenuItem>
              <MenuItem value="mature">Mature</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Weather Conditions</InputLabel>
            <Select
              name="weatherConditions"
              value={inputs.weatherConditions}
              onChange={handleInputChange}
              label="Weather Conditions"
            >
              <MenuItem value="favorable">Favorable for Pests</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="unfavorable">Unfavorable for Pests</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Previous Control Methods"
            name="previousControls"
            value={inputs.previousControls}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={calculateRisk}
          fullWidth
          startIcon={<BugIcon />}
        >
          Analyze and Generate Recommendations
        </Button>
      </Box>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {assessment && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            IPM Assessment Results
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Risk Assessment
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography component="legend">Overall Risk Level:</Typography>
                    <Rating
                      value={Math.round(assessment.riskLevel)}
                      readOnly
                      icon={<WarningIcon color="warning" />}
                      emptyIcon={<WarningIcon color="disabled" />}
                    />
                  </Box>
                  <Typography variant="body1" color="error" gutterBottom>
                    Priority: {assessment.recommendations.priority}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Recommended Actions
                  </Typography>
                  <List>
                    {assessment.recommendations.actions.map((action, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={action} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Control Methods
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Biological Controls
                      </Typography>
                      <List>
                        {assessment.controlMethods.biological.map((method, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={method} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Cultural Controls
                      </Typography>
                      <List>
                        {assessment.controlMethods.cultural.map((method, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={method} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Physical Controls
                      </Typography>
                      <List>
                        {assessment.controlMethods.physical.map((method, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={method} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Chemical Controls (Last Resort)
                      </Typography>
                      <List>
                        {assessment.controlMethods.chemical.map((method, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={method} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Monitoring Tips
                  </Typography>
                  <List>
                    {assessment.monitoringTips.map((tip, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={tip} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default IPMCalculator;
