import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Grass as GrassIcon,
  Info as InfoIcon,
  Timer as TimerIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `Rotational grazing is a management-intensive system that divides pastures into smaller paddocks, allowing livestock to graze one area while other areas rest and regrow. This approach optimizes forage production, improves pasture health, and enhances livestock performance.`,
  
  benefits: [
    {
      title: 'Improved Pasture Health',
      points: [
        'Better root development and plant recovery',
        'Increased organic matter in soil',
        'Enhanced drought resistance',
        'Reduced soil erosion'
      ]
    },
    {
      title: 'Enhanced Animal Performance',
      points: [
        'Access to higher quality forage',
        'More uniform grazing distribution',
        'Better weight gain',
        'Improved herd health'
      ]
    },
    {
      title: 'Economic Benefits',
      points: [
        'Increased stocking rates',
        'Reduced feed costs',
        'Better pasture utilization',
        'Extended grazing season'
      ]
    }
  ],

  bestPractices: [
    {
      practice: 'Paddock Design',
      tips: [
        'Consider water access for each paddock',
        'Account for natural barriers and terrain',
        'Plan for easy animal movement',
        'Size paddocks based on herd needs'
      ]
    },
    {
      practice: 'Timing Management',
      tips: [
        'Monitor grass height before and after grazing',
        'Adjust rotation based on growth rates',
        'Consider seasonal variations',
        'Allow adequate rest periods'
      ]
    },
    {
      practice: 'Monitoring',
      tips: [
        'Keep detailed grazing records',
        'Track pasture recovery rates',
        'Observe animal behavior',
        'Assess forage quality'
      ]
    }
  ],

  seasonalConsiderations: {
    Spring: 'Faster growth rates, shorter rotations needed',
    Summer: 'Moderate growth, standard rotation lengths',
    Fall: 'Slowing growth, longer rotations required',
    Winter: 'Minimal growth, consider supplemental feeding'
  }
};

// Recovery periods (days) for different pasture types
const pastureTypes = {
  'Tall Fescue': { min: 21, max: 35 },
  'Orchardgrass': { min: 14, max: 28 },
  'Perennial Ryegrass': { min: 14, max: 25 },
  'Kentucky Bluegrass': { min: 21, max: 35 },
  'Alfalfa': { min: 28, max: 42 },
  'Mixed Grass': { min: 21, max: 35 },
  'Native Warm Season': { min: 35, max: 45 }
};

// Seasonal adjustments for growth rates
const seasonalAdjustments = {
  'Spring': 1.2,
  'Summer': 1.0,
  'Fall': 0.8,
  'Winter': 0.6
};

const GrazingRotationPlanner = () => {
  const [formData, setFormData] = useState({
    pastureType: 'Mixed Grass',
    totalAcres: '',
    numberOfPaddocks: '',
    season: 'Spring',
    grazingDays: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRotation = () => {
    if (!formData.totalAcres || !formData.numberOfPaddocks || !formData.grazingDays) {
      setError('Please fill in all required fields');
      return;
    }

    const acres = parseFloat(formData.totalAcres);
    const paddocks = parseInt(formData.numberOfPaddocks);
    const grazingDays = parseInt(formData.grazingDays);
    
    // Get recovery period for selected pasture type
    const recoveryPeriod = {
      min: pastureTypes[formData.pastureType].min,
      max: pastureTypes[formData.pastureType].max
    };

    // Adjust recovery period based on season
    const seasonalFactor = seasonalAdjustments[formData.season];
    recoveryPeriod.min = Math.ceil(recoveryPeriod.min / seasonalFactor);
    recoveryPeriod.max = Math.ceil(recoveryPeriod.max / seasonalFactor);

    // Calculate paddock sizes
    const paddockSize = acres / paddocks;
    
    // Calculate rest period provided
    const restPeriod = grazingDays * (paddocks - 1);
    
    // Calculate total rotation length
    const rotationLength = grazingDays * paddocks;
    
    // Determine if rest period is adequate
    const restAdequacy = restPeriod >= recoveryPeriod.min ? 
      (restPeriod <= recoveryPeriod.max ? 'Optimal' : 'Too Long') : 
      'Too Short';

    setResults({
      paddockSize,
      restPeriod,
      rotationLength,
      recoveryPeriod,
      restAdequacy
    });
    setError('');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Grazing Rotation Planner
        <Tooltip title="Plan your rotational grazing system">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About Rotational Grazing
            </Typography>
            <Typography paragraph>
              {educationalContent.introduction}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Benefits of Rotational Grazing
            </Typography>
            <Grid container spacing={3}>
              {educationalContent.benefits.map((benefit) => (
                <Grid item xs={12} md={4} key={benefit.title}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {benefit.title}
                      </Typography>
                      <List dense>
                        {benefit.points.map((point, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={point} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Best Management Practices
            </Typography>
            <Grid container spacing={3}>
              {educationalContent.bestPractices.map((item) => (
                <Grid item xs={12} md={4} key={item.practice}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {item.practice}
                      </Typography>
                      <List dense>
                        {item.tips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Seasonal Considerations
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(educationalContent.seasonalConsiderations).map(([season, info]) => (
                <Grid item xs={12} sm={6} md={3} key={season}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {season}
                      </Typography>
                      <Typography variant="body2">
                        {info}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Calculate Grazing Rotation
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Pasture Type"
              name="pastureType"
              value={formData.pastureType}
              onChange={handleInputChange}
            >
              {Object.keys(pastureTypes).map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Season"
              name="season"
              value={formData.season}
              onChange={handleInputChange}
            >
              {Object.keys(seasonalAdjustments).map(season => (
                <MenuItem key={season} value={season}>
                  {season}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Total Pasture Area (acres)"
              name="totalAcres"
              type="number"
              value={formData.totalAcres}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Number of Paddocks"
              name="numberOfPaddocks"
              type="number"
              value={formData.numberOfPaddocks}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Days per Paddock"
              name="grazingDays"
              type="number"
              value={formData.grazingDays}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateRotation}
              fullWidth
            >
              Calculate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Rotation Plan
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Paddock Size</TableCell>
                  <TableCell align="right">{results.paddockSize.toFixed(2)} acres</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rest Period</TableCell>
                  <TableCell align="right">{results.restPeriod} days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Rotation Length</TableCell>
                  <TableCell align="right">{results.rotationLength} days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recommended Recovery Period</TableCell>
                  <TableCell align="right">{results.recoveryPeriod.min}-{results.recoveryPeriod.max} days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rest Period Adequacy</TableCell>
                  <TableCell align="right">{results.restAdequacy}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default GrazingRotationPlanner;
