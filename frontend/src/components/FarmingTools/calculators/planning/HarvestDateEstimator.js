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
  Paper,
  Divider,
} from '@mui/material';
import { CalendarMonth, Agriculture, WbSunny } from '@mui/icons-material';
import { addDays, format } from 'date-fns';

const cropData = {
  'tomatoes': {
    name: 'Tomatoes',
    varieties: {
      'early_girl': { name: 'Early Girl', days: 50 },
      'beefsteak': { name: 'Beefsteak', days: 85 },
      'cherry': { name: 'Cherry', days: 60 },
      'roma': { name: 'Roma', days: 75 },
      'heirloom': { name: 'Heirloom', days: 80 }
    },
    conditions: {
      temperature: { min: 18, max: 29, unit: '°C' },
      sunlight: 'Full sun (6-8 hours)',
      soil: 'Well-draining, rich in organic matter'
    }
  },
  'lettuce': {
    name: 'Lettuce',
    varieties: {
      'butterhead': { name: 'Butterhead', days: 45 },
      'romaine': { name: 'Romaine', days: 55 },
      'iceberg': { name: 'Iceberg', days: 60 },
      'loose_leaf': { name: 'Loose Leaf', days: 40 },
      'batavian': { name: 'Batavian', days: 50 }
    },
    conditions: {
      temperature: { min: 15, max: 21, unit: '°C' },
      sunlight: 'Partial to full sun',
      soil: 'Rich, moist soil with good drainage'
    }
  },
  'carrots': {
    name: 'Carrots',
    varieties: {
      'nantes': { name: 'Nantes', days: 65 },
      'chantenay': { name: 'Chantenay', days: 70 },
      'imperator': { name: 'Imperator', days: 75 },
      'danvers': { name: 'Danvers', days: 70 },
      'baby': { name: 'Baby', days: 50 }
    },
    conditions: {
      temperature: { min: 16, max: 21, unit: '°C' },
      sunlight: 'Full sun to partial shade',
      soil: 'Deep, loose, well-draining soil'
    }
  },
  'peppers': {
    name: 'Peppers',
    varieties: {
      'bell': { name: 'Bell', days: 70 },
      'jalapeno': { name: 'Jalapeño', days: 75 },
      'cayenne': { name: 'Cayenne', days: 80 },
      'banana': { name: 'Banana', days: 65 },
      'habanero': { name: 'Habanero', days: 90 }
    },
    conditions: {
      temperature: { min: 21, max: 32, unit: '°C' },
      sunlight: 'Full sun (6-8 hours)',
      soil: 'Rich, well-draining soil'
    }
  },
  'beans': {
    name: 'Beans',
    varieties: {
      'bush': { name: 'Bush', days: 50 },
      'pole': { name: 'Pole', days: 65 },
      'lima': { name: 'Lima', days: 70 },
      'fava': { name: 'Fava', days: 75 },
      'snap': { name: 'Snap', days: 55 }
    },
    conditions: {
      temperature: { min: 18, max: 27, unit: '°C' },
      sunlight: 'Full sun',
      soil: 'Well-draining, fertile soil'
    }
  }
};

const HarvestDateEstimator = () => {
  const [inputs, setInputs] = useState({
    crop: '',
    variety: '',
    plantingDate: format(new Date(), 'yyyy-MM-dd'),
    growthConditions: 'optimal'
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => {
      const newInputs = {
        ...prev,
        [name]: value
      };
      
      // Reset variety when crop changes
      if (name === 'crop') {
        newInputs.variety = '';
      }
      
      return newInputs;
    });
    setError('');
  };

  const calculateHarvestDate = () => {
    if (!inputs.crop || !inputs.variety || !inputs.plantingDate) {
      setError('Please fill in all required fields');
      return;
    }

    const crop = cropData[inputs.crop];
    const variety = crop.varieties[inputs.variety];
    const baseDays = variety.days;
    
    // Adjust days based on growth conditions
    let adjustedDays = baseDays;
    switch (inputs.growthConditions) {
      case 'poor':
        adjustedDays = Math.round(baseDays * 1.3); // 30% longer
        break;
      case 'fair':
        adjustedDays = Math.round(baseDays * 1.15); // 15% longer
        break;
      case 'optimal':
        adjustedDays = baseDays;
        break;
      default:
        adjustedDays = baseDays;
    }

    const plantingDate = new Date(inputs.plantingDate);
    const harvestDate = addDays(plantingDate, adjustedDays);
    
    // Calculate early and late harvest windows (±5 days)
    const earlyHarvestDate = addDays(harvestDate, -5);
    const lateHarvestDate = addDays(harvestDate, 5);

    setResults({
      crop: crop.name,
      variety: variety.name,
      daysToMaturity: adjustedDays,
      estimatedHarvestDate: format(harvestDate, 'MMMM d, yyyy'),
      harvestWindow: {
        early: format(earlyHarvestDate, 'MMMM d, yyyy'),
        late: format(lateHarvestDate, 'MMMM d, yyyy')
      },
      growingConditions: crop.conditions
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Harvest Date Estimator
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Calculate estimated harvest dates based on planting date, crop variety, and growing conditions.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Crop</InputLabel>
              <Select
                name="crop"
                value={inputs.crop}
                onChange={handleInputChange}
                label="Crop"
                startAdornment={<Agriculture sx={{ mr: 1 }} />}
              >
                {Object.keys(cropData).map(crop => (
                  <MenuItem key={crop} value={crop}>
                    {cropData[crop].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!inputs.crop}>
              <InputLabel>Variety</InputLabel>
              <Select
                name="variety"
                value={inputs.variety}
                onChange={handleInputChange}
                label="Variety"
              >
                {inputs.crop && Object.keys(cropData[inputs.crop].varieties).map(variety => (
                  <MenuItem key={variety} value={variety}>
                    {cropData[inputs.crop].varieties[variety].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Planting Date"
              type="date"
              name="plantingDate"
              value={inputs.plantingDate}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <CalendarMonth sx={{ mr: 1 }} />,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Growing Conditions</InputLabel>
              <Select
                name="growthConditions"
                value={inputs.growthConditions}
                onChange={handleInputChange}
                label="Growing Conditions"
                startAdornment={<WbSunny sx={{ mr: 1 }} />}
              >
                <MenuItem value="poor">Poor (Limited sun/nutrients)</MenuItem>
                <MenuItem value="fair">Fair (Some limitations)</MenuItem>
                <MenuItem value="optimal">Optimal (Ideal conditions)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateHarvestDate}
              fullWidth
              startIcon={<CalendarMonth />}
            >
              Calculate Harvest Date
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
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Harvest Estimate for {results.crop} ({results.variety})
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    Days to Maturity: {results.daysToMaturity} days
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Estimated Harvest Date: {results.estimatedHarvestDate}
                  </Typography>
                  <Typography variant="body1">
                    Harvest Window: {results.harvestWindow.early} to {results.harvestWindow.late}
                  </Typography>
                </Paper>

                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Optimal Growing Conditions
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    Temperature Range: {results.growingConditions.temperature.min}-
                    {results.growingConditions.temperature.max}
                    {results.growingConditions.temperature.unit}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Sunlight Requirements: {results.growingConditions.sunlight}
                  </Typography>
                  <Typography variant="body1">
                    Soil Conditions: {results.growingConditions.soil}
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HarvestDateEstimator;
