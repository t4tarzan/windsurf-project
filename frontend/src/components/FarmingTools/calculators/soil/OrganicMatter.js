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
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Nature as OrganicIcon,
  LocalFlorist as PlantIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Organic matter targets by soil type
const soilTypeTargets = {
  'sandy': {
    name: 'Sandy Soil',
    description: 'Light soil with large particles',
    target: {
      min: 2.5,
      optimal: 3.5,
      max: 5.0,
    },
    benefits: [
      'Improves water retention',
      'Enhances nutrient holding capacity',
      'Reduces leaching',
    ],
  },
  'loamy': {
    name: 'Loamy Soil',
    description: 'Medium-textured balanced soil',
    target: {
      min: 3.0,
      optimal: 4.5,
      max: 6.0,
    },
    benefits: [
      'Maintains soil structure',
      'Supports microbial activity',
      'Improves drainage',
    ],
  },
  'clay': {
    name: 'Clay Soil',
    description: 'Heavy soil with small particles',
    target: {
      min: 3.5,
      optimal: 5.0,
      max: 7.0,
    },
    benefits: [
      'Improves soil aggregation',
      'Enhances aeration',
      'Reduces compaction',
    ],
  },
};

// Organic matter sources and their characteristics
const organicSources = {
  'compost': {
    name: 'Compost',
    omContent: '30-35%',
    applicationRate: '1-2 inches layer',
    benefits: [
      'Balanced nutrient content',
      'Improves soil structure',
      'Contains beneficial microorganisms',
    ],
    timing: 'Spring or Fall',
    notes: 'Well-decomposed compost is best. Incorporate into top 6 inches of soil.',
  },
  'manure': {
    name: 'Animal Manure',
    omContent: '20-30%',
    applicationRate: '10-20 tons/acre',
    benefits: [
      'High in nutrients',
      'Improves soil biology',
      'Long-lasting effects',
    ],
    timing: 'Fall application preferred',
    notes: 'Age or compost before use. Follow food safety guidelines.',
  },
  'cover_crops': {
    name: 'Cover Crops',
    omContent: 'Varies',
    applicationRate: 'Seasonal planting',
    benefits: [
      'Prevents soil erosion',
      'Adds fresh organic matter',
      'Improves soil biology',
    ],
    timing: 'Plant in fall or early spring',
    notes: 'Choose appropriate species for your climate and goals.',
  },
  'mulch': {
    name: 'Organic Mulch',
    omContent: '20-25%',
    applicationRate: '2-3 inches layer',
    benefits: [
      'Conserves moisture',
      'Suppresses weeds',
      'Moderates soil temperature',
    ],
    timing: 'Any time during growing season',
    notes: 'Use well-aged materials to avoid nitrogen tie-up.',
  },
};

// Management practices for different OM levels
const managementPractices = {
  low: [
    {
      practice: 'Intensive Addition',
      description: 'Regular application of organic materials',
      methods: [
        'Apply compost annually',
        'Use cover crops in rotation',
        'Incorporate crop residues',
      ],
    },
    {
      practice: 'Reduced Tillage',
      description: 'Minimize soil disturbance',
      methods: [
        'Use no-till when possible',
        'Implement minimum tillage',
        'Keep soil covered',
      ],
    },
  ],
  moderate: [
    {
      practice: 'Maintenance Program',
      description: 'Regular organic matter maintenance',
      methods: [
        'Apply compost every 2-3 years',
        'Rotate with cover crops',
        'Use mulch during growing season',
      ],
    },
    {
      practice: 'Crop Rotation',
      description: 'Diverse crop rotation system',
      methods: [
        'Include high-residue crops',
        'Use legume cover crops',
        'Manage crop residues',
      ],
    },
  ],
  high: [
    {
      practice: 'Conservation',
      description: 'Maintain current levels',
      methods: [
        'Monitor organic matter levels',
        'Continue current practices',
        'Adjust inputs as needed',
      ],
    },
    {
      practice: 'Fine-tuning',
      description: 'Optimize management practices',
      methods: [
        'Balance nutrient cycling',
        'Maintain soil cover',
        'Monitor soil biology',
      ],
    },
  ],
};

const OrganicMatter = () => {
  const [soilType, setSoilType] = useState('');
  const [currentOM, setCurrentOM] = useState(3);
  const [analysis, setAnalysis] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  const handleSoilTypeChange = (event) => {
    setSoilType(event.target.value);
    if (currentOM) {
      analyzeOM(event.target.value, currentOM);
    }
  };

  const handleOMChange = (event, newValue) => {
    setCurrentOM(newValue);
    if (soilType) {
      analyzeOM(soilType, newValue);
    }
  };

  const analyzeOM = (soil, om) => {
    const target = soilTypeTargets[soil].target;
    let status = '';
    let level = '';

    if (om < target.min) {
      status = 'Low organic matter content';
      level = 'low';
    } else if (om > target.max) {
      status = 'High organic matter content';
      level = 'high';
    } else {
      status = 'Optimal organic matter content';
      level = 'moderate';
    }

    setAnalysis({
      status,
      level,
      target,
      practices: managementPractices[level],
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Soil Organic Matter Management
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Assess and manage your soil's organic matter content for optimal soil health.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Soil Assessment
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Soil Type</InputLabel>
                <Select
                  value={soilType}
                  label="Soil Type"
                  onChange={handleSoilTypeChange}
                >
                  {Object.entries(soilTypeTargets).map(([key, type]) => (
                    <MenuItem key={key} value={key}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography gutterBottom>
                Current Organic Matter Content (%)
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={currentOM}
                  onChange={handleOMChange}
                  min={0}
                  max={10}
                  step={0.1}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 5, label: '5%' },
                    { value: 10, label: '10%' },
                  ]}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => `${value}%`}
                />
              </Box>
            </Paper>
          </Grid>

          {analysis && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Analysis Results
                  </Typography>
                  <Chip
                    icon={analysis.level === 'moderate' ? <CheckIcon /> : <WarningIcon />}
                    label={analysis.status}
                    color={analysis.level === 'moderate' ? 'success' : 'warning'}
                    sx={{ ml: 2 }}
                  />
                </Box>

                <Alert 
                  severity={analysis.level === 'moderate' ? 'success' : 'warning'}
                  sx={{ mb: 2 }}
                >
                  Target range for {soilTypeTargets[soilType].name}: {analysis.target.min}% - {analysis.target.max}%
                  (Optimal: {analysis.target.optimal}%)
                </Alert>

                <Typography variant="subtitle1" gutterBottom>
                  Recommended Management Practices
                </Typography>
                <List>
                  {analysis.practices.map((practice) => (
                    <ListItem key={practice.practice}>
                      <ListItemIcon>
                        <OrganicIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={practice.practice}
                        secondary={
                          <>
                            <Typography variant="body2">
                              {practice.description}
                            </Typography>
                            <List dense>
                              {practice.methods.map((method, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <CheckIcon color="success" fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary={method} />
                                </ListItem>
                              ))}
                            </List>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Organic Matter Sources
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Source</TableCell>
                      <TableCell>OM Content</TableCell>
                      <TableCell>Application Rate</TableCell>
                      <TableCell>Timing</TableCell>
                      <TableCell>Benefits</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(organicSources).map(([key, source]) => (
                      <TableRow 
                        key={key}
                        hover
                        onClick={() => setSelectedSource(key)}
                        selected={selectedSource === key}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PlantIcon sx={{ mr: 1, color: 'primary.main' }} />
                            {source.name}
                          </Box>
                        </TableCell>
                        <TableCell>{source.omContent}</TableCell>
                        <TableCell>{source.applicationRate}</TableCell>
                        <TableCell>{source.timing}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {source.benefits.map((benefit, index) => (
                              <Chip
                                key={index}
                                label={benefit}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedSource && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="info">
                    <Typography variant="subtitle2">
                      Application Notes:
                    </Typography>
                    {organicSources[selectedSource].notes}
                  </Alert>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrganicMatter;
