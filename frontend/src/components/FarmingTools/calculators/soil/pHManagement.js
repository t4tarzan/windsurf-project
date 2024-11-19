import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Slider,
  Paper,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Science as TestIcon,
  ArrowUpward as IncreaseIcon,
  ArrowDownward as DecreaseIcon,
  Check as OptimalIcon,
} from '@mui/icons-material';

// Optimal pH ranges for common crops
const cropPHRanges = {
  'Vegetables': {
    'Tomatoes': { min: 6.0, max: 6.8 },
    'Peppers': { min: 6.0, max: 7.0 },
    'Carrots': { min: 6.0, max: 6.8 },
    'Lettuce': { min: 6.0, max: 7.0 },
    'Potatoes': { min: 5.5, max: 6.5 },
    'Beans': { min: 6.0, max: 7.0 },
  },
  'Fruits': {
    'Strawberries': { min: 5.5, max: 6.8 },
    'Blueberries': { min: 4.5, max: 5.5 },
    'Raspberries': { min: 5.5, max: 6.5 },
    'Apples': { min: 6.0, max: 7.0 },
  },
  'Grains': {
    'Corn': { min: 6.0, max: 7.0 },
    'Wheat': { min: 6.0, max: 7.0 },
    'Soybeans': { min: 6.0, max: 6.8 },
  },
};

// Soil amendments and their effects on pH
const soilAmendments = {
  'increase': [
    {
      name: 'Agricultural Lime',
      effect: 'Strong increase',
      rate: '2-3 lbs per 100 sq ft',
      notes: 'Most common amendment for acidic soils. Apply in fall for best results.',
    },
    {
      name: 'Dolomitic Limestone',
      effect: 'Strong increase',
      rate: '2-3 lbs per 100 sq ft',
      notes: 'Contains magnesium, good for magnesium-deficient soils.',
    },
    {
      name: 'Wood Ash',
      effect: 'Moderate increase',
      rate: '1-2 lbs per 100 sq ft',
      notes: 'Also adds potassium and trace minerals. Use with caution.',
    },
  ],
  'decrease': [
    {
      name: 'Elemental Sulfur',
      effect: 'Strong decrease',
      rate: '1-2 lbs per 100 sq ft',
      notes: 'Slow-acting but long-lasting. Best applied in spring.',
    },
    {
      name: 'Aluminum Sulfate',
      effect: 'Quick decrease',
      rate: '1-2 lbs per 100 sq ft',
      notes: 'Fast-acting but use with caution to avoid aluminum toxicity.',
    },
    {
      name: 'Iron Sulfate',
      effect: 'Moderate decrease',
      rate: '2-3 lbs per 100 sq ft',
      notes: 'Also adds iron, good for iron-deficient soils.',
    },
  ],
};

const PHManagement = () => {
  const [currentPH, setCurrentPH] = useState('');
  const [targetPH, setTargetPH] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [recommendations, setRecommendations] = useState(null);

  const handlePHChange = (event, newValue) => {
    setCurrentPH(newValue);
    if (selectedCrop) {
      analyzeAndRecommend(newValue, selectedCrop);
    }
  };

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    if (currentPH) {
      analyzeAndRecommend(currentPH, crop);
    }
  };

  const analyzeAndRecommend = (ph, crop) => {
    let cropRange = null;
    
    // Find the crop range
    for (const category in cropPHRanges) {
      if (cropPHRanges[category][crop]) {
        cropRange = cropPHRanges[category][crop];
        break;
      }
    }

    if (!cropRange) return;

    const recommendations = {
      current: ph,
      optimal: cropRange,
      status: '',
      amendments: [],
    };

    if (ph < cropRange.min) {
      recommendations.status = 'too_acidic';
      recommendations.amendments = soilAmendments.increase;
    } else if (ph > cropRange.max) {
      recommendations.status = 'too_alkaline';
      recommendations.amendments = soilAmendments.decrease;
    } else {
      recommendations.status = 'optimal';
    }

    setRecommendations(recommendations);
    setTargetPH((cropRange.max + cropRange.min) / 2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'too_acidic':
        return 'error';
      case 'too_alkaline':
        return 'warning';
      case 'optimal':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'too_acidic':
        return <IncreaseIcon />;
      case 'too_alkaline':
        return <DecreaseIcon />;
      case 'optimal':
        return <OptimalIcon />;
      default:
        return <TestIcon />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Soil pH Management
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Optimize your soil pH for better crop growth and nutrient availability.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Current Soil pH
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={currentPH || 7}
                  onChange={handlePHChange}
                  min={4}
                  max={9}
                  step={0.1}
                  marks={[
                    { value: 4, label: '4.0' },
                    { value: 5, label: '5.0' },
                    { value: 6, label: '6.0' },
                    { value: 7, label: '7.0' },
                    { value: 8, label: '8.0' },
                    { value: 9, label: '9.0' },
                  ]}
                  valueLabelDisplay="on"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Move the slider to set your current soil pH value
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Select Crop
              </Typography>
              <Grid container spacing={1}>
                {Object.entries(cropPHRanges).map(([category, crops]) => (
                  <Grid item xs={12} key={category}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {category}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Object.keys(crops).map((crop) => (
                        <Chip
                          key={crop}
                          label={crop}
                          onClick={() => handleCropSelect(crop)}
                          color={selectedCrop === crop ? 'primary' : 'default'}
                          variant={selectedCrop === crop ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {recommendations && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Analysis & Recommendations
                  </Typography>
                  <Chip
                    icon={getStatusIcon(recommendations.status)}
                    label={recommendations.status === 'optimal' ? 'Optimal pH' : 'Adjustment Needed'}
                    color={getStatusColor(recommendations.status)}
                    sx={{ ml: 2 }}
                  />
                </Box>

                <Alert 
                  severity={getStatusColor(recommendations.status)}
                  sx={{ mb: 2 }}
                >
                  {recommendations.status === 'optimal' ? (
                    `Your soil pH (${currentPH}) is within the optimal range for ${selectedCrop} (${recommendations.optimal.min}-${recommendations.optimal.max}).`
                  ) : recommendations.status === 'too_acidic' ? (
                    `Your soil pH (${currentPH}) is too acidic for ${selectedCrop}. Target range: ${recommendations.optimal.min}-${recommendations.optimal.max}.`
                  ) : (
                    `Your soil pH (${currentPH}) is too alkaline for ${selectedCrop}. Target range: ${recommendations.optimal.min}-${recommendations.optimal.max}.`
                  )}
                </Alert>

                {recommendations.status !== 'optimal' && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Recommended Amendments
                    </Typography>
                    <List>
                      {recommendations.amendments.map((amendment, index) => (
                        <React.Fragment key={amendment.name}>
                          <ListItem>
                            <ListItemIcon>
                              <TestIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={amendment.name}
                              secondary={
                                <>
                                  <Typography variant="body2">
                                    Effect: {amendment.effect}
                                  </Typography>
                                  <Typography variant="body2">
                                    Application Rate: {amendment.rate}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {amendment.notes}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                          {index < recommendations.amendments.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PHManagement;
