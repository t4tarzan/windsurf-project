import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Paper,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  SoilIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Soil type characteristics
const soilTypes = {
  'sandy': {
    name: 'Sandy Soil',
    description: 'Light, well-draining soil with large particles',
    idealPenetration: {
      min: 15,
      max: 20,
    },
    compactionRisk: 'Low',
  },
  'loamy': {
    name: 'Loamy Soil',
    description: 'Medium-textured soil with good structure',
    idealPenetration: {
      min: 12,
      max: 18,
    },
    compactionRisk: 'Medium',
  },
  'clay': {
    name: 'Clay Soil',
    description: 'Heavy soil with small particles',
    idealPenetration: {
      min: 10,
      max: 15,
    },
    compactionRisk: 'High',
  },
};

// Remediation methods based on severity
const remediationMethods = {
  low: [
    {
      method: 'Cover Cropping',
      description: 'Plant cover crops with deep roots like radishes or alfalfa',
      timing: 'Plant in fall or early spring',
      benefits: [
        'Improves soil structure',
        'Adds organic matter',
        'Prevents future compaction'
      ],
    },
    {
      method: 'Mulching',
      description: 'Apply organic mulch to soil surface',
      timing: 'Any time during growing season',
      benefits: [
        'Protects soil structure',
        'Retains moisture',
        'Encourages earthworm activity'
      ],
    },
  ],
  moderate: [
    {
      method: 'Shallow Tillage',
      description: 'Light cultivation of top soil layer',
      timing: 'When soil is moderately moist',
      benefits: [
        'Breaks up surface compaction',
        'Improves water infiltration',
        'Preserves soil structure'
      ],
    },
    {
      method: 'Organic Matter Addition',
      description: 'Incorporate compost or other organic materials',
      timing: 'Before planting season',
      benefits: [
        'Improves soil structure',
        'Enhances drainage',
        'Increases biological activity'
      ],
    },
  ],
  severe: [
    {
      method: 'Deep Tillage',
      description: 'Mechanical breaking of compacted layers',
      timing: 'When soil is dry enough',
      benefits: [
        'Breaks up hardpan',
        'Improves root penetration',
        'Enhances drainage'
      ],
    },
    {
      method: 'Subsoiling',
      description: 'Deep soil loosening without inversion',
      timing: 'Late summer or early fall',
      benefits: [
        'Breaks deep compaction',
        'Minimal soil disturbance',
        'Improves water movement'
      ],
    },
  ],
};

// Prevention methods
const preventionMethods = [
  {
    title: 'Traffic Management',
    practices: [
      'Establish permanent traffic lanes',
      'Avoid working wet soil',
      'Use controlled traffic farming',
    ],
  },
  {
    title: 'Equipment Modifications',
    practices: [
      'Use low-pressure tires',
      'Reduce equipment weight',
      'Install dual wheels when possible',
    ],
  },
  {
    title: 'Soil Management',
    practices: [
      'Maintain organic matter levels',
      'Practice crop rotation',
      'Use cover crops during off-season',
    ],
  },
];

const CompactionTest = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [soilType, setSoilType] = useState('');
  const [moistureLevel, setMoistureLevel] = useState('');
  const [penetrationDepth, setPenetrationDepth] = useState('');
  const [results, setResults] = useState(null);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
    if (activeStep === 2) {
      analyzeCompaction();
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSoilType('');
    setMoistureLevel('');
    setPenetrationDepth('');
    setResults(null);
  };

  const analyzeCompaction = () => {
    const soilInfo = soilTypes[soilType];
    const depth = Number(penetrationDepth);
    let severity = 'low';
    let status = '';

    if (depth < soilInfo.idealPenetration.min * 0.5) {
      severity = 'severe';
      status = 'Severe Compaction';
    } else if (depth < soilInfo.idealPenetration.min * 0.75) {
      severity = 'moderate';
      status = 'Moderate Compaction';
    } else if (depth >= soilInfo.idealPenetration.min) {
      severity = 'low';
      status = 'Good Condition';
    }

    setResults({
      severity,
      status,
      soilInfo,
      recommendations: remediationMethods[severity],
    });
  };

  const steps = [
    {
      label: 'Soil Type',
      content: (
        <FormControl fullWidth>
          <InputLabel>Select Soil Type</InputLabel>
          <Select
            value={soilType}
            label="Select Soil Type"
            onChange={(e) => setSoilType(e.target.value)}
          >
            {Object.entries(soilTypes).map(([key, type]) => (
              <MenuItem key={key} value={key}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      label: 'Soil Moisture',
      content: (
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom>
            Current Soil Moisture Level
          </Typography>
          <RadioGroup
            value={moistureLevel}
            onChange={(e) => setMoistureLevel(e.target.value)}
          >
            <FormControlLabel value="dry" control={<Radio />} label="Dry (soil crumbles easily)" />
            <FormControlLabel value="moist" control={<Radio />} label="Moist (forms ball when squeezed)" />
            <FormControlLabel value="wet" control={<Radio />} label="Wet (water can be squeezed out)" />
          </RadioGroup>
        </FormControl>
      ),
    },
    {
      label: 'Penetration Test',
      content: (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Measure Penetration Depth
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Push a soil probe or penetrometer into the soil with steady pressure.
            Record the depth at which significant resistance is felt.
          </Typography>
          <TextField
            fullWidth
            label="Penetration Depth (inches)"
            type="number"
            value={penetrationDepth}
            onChange={(e) => setPenetrationDepth(e.target.value)}
            InputProps={{
              inputProps: { min: 0, max: 36 },
            }}
          />
        </Box>
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Soil Compaction Test
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Assess soil compaction levels and get recommendations for improvement.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      {step.content}
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mr: 1 }}
                          disabled={
                            (index === 0 && !soilType) ||
                            (index === 1 && !moistureLevel) ||
                            (index === 2 && !penetrationDepth)
                          }
                        >
                          {index === steps.length - 1 ? 'Analyze' : 'Continue'}
                        </Button>
                        {index > 0 && (
                          <Button onClick={handleBack} sx={{ mr: 1 }}>
                            Back
                          </Button>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>

          {results && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Analysis Results
                  </Typography>
                  <Chip
                    icon={results.severity === 'low' ? <CheckIcon /> : <WarningIcon />}
                    label={results.status}
                    color={results.severity === 'low' ? 'success' : results.severity === 'moderate' ? 'warning' : 'error'}
                    sx={{ ml: 2 }}
                  />
                </Box>

                <Alert 
                  severity={results.severity === 'low' ? 'success' : results.severity === 'moderate' ? 'warning' : 'error'}
                  sx={{ mb: 2 }}
                >
                  {`Penetration depth (${penetrationDepth}") indicates ${results.status.toLowerCase()} for ${results.soilInfo.name}.`}
                </Alert>

                <Typography variant="subtitle1" gutterBottom>
                  Recommended Remediation Methods
                </Typography>
                <List>
                  {results.recommendations.map((method, index) => (
                    <React.Fragment key={method.method}>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={method.method}
                          secondary={
                            <>
                              <Typography variant="body2">
                                {method.description}
                              </Typography>
                              <Typography variant="body2">
                                Timing: {method.timing}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                {method.benefits.map((benefit, i) => (
                                  <Chip
                                    key={i}
                                    label={benefit}
                                    size="small"
                                    variant="outlined"
                                    sx={{ mr: 1, mb: 1 }}
                                  />
                                ))}
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                      {index < results.recommendations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Prevention Methods
                </Typography>
                {preventionMethods.map((category, index) => (
                  <Box key={category.title} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {category.title}
                    </Typography>
                    <List dense>
                      {category.practices.map((practice, i) => (
                        <ListItem key={i}>
                          <ListItemIcon>
                            <CheckIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={practice} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}

                <Box sx={{ mt: 2 }}>
                  <Button onClick={handleReset} variant="outlined">
                    Start New Test
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompactionTest;
