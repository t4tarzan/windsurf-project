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
  Alert
} from '@mui/material';

// Feed requirements for different livestock types (% of body weight per day)
const feedRequirements = {
  'Beef Cattle': {
    'Maintenance': 0.02,
    'Growing': 0.025,
    'Lactating': 0.03,
    'Finishing': 0.028
  },
  'Dairy Cattle': {
    'Dry': 0.02,
    'Early Lactation': 0.04,
    'Mid Lactation': 0.035,
    'Late Lactation': 0.03
  },
  'Sheep': {
    'Maintenance': 0.02,
    'Pregnant': 0.025,
    'Lactating': 0.035,
    'Growing Lamb': 0.04
  },
  'Goats': {
    'Maintenance': 0.025,
    'Pregnant': 0.03,
    'Lactating': 0.04,
    'Growing Kid': 0.045
  }
};

const FeedCalculator = () => {
  const [formData, setFormData] = useState({
    livestockType: 'Beef Cattle',
    productionStage: 'Maintenance',
    animalWeight: '',
    numberOfAnimals: '',
    feedingDays: ''
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

  const calculateFeedRequirements = () => {
    if (!formData.animalWeight || !formData.numberOfAnimals || !formData.feedingDays) {
      setError('Please fill in all required fields');
      return;
    }

    const weight = parseFloat(formData.animalWeight);
    const animals = parseInt(formData.numberOfAnimals);
    const days = parseInt(formData.feedingDays);
    const dailyRate = feedRequirements[formData.livestockType][formData.productionStage];

    // Calculate daily feed per animal (lbs)
    const dailyFeedPerAnimal = weight * dailyRate;
    
    // Calculate total daily feed (lbs)
    const totalDailyFeed = dailyFeedPerAnimal * animals;
    
    // Calculate total feed needed for the period (lbs)
    const totalFeedNeeded = totalDailyFeed * days;
    
    // Convert to tons
    const totalFeedTons = totalFeedNeeded / 2000;

    setResults({
      dailyFeedPerAnimal,
      totalDailyFeed,
      totalFeedNeeded,
      totalFeedTons
    });
    setError('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Feed Requirement Calculator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Livestock Type"
              name="livestockType"
              value={formData.livestockType}
              onChange={handleInputChange}
            >
              {Object.keys(feedRequirements).map(type => (
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
              label="Production Stage"
              name="productionStage"
              value={formData.productionStage}
              onChange={handleInputChange}
            >
              {Object.keys(feedRequirements[formData.livestockType]).map(stage => (
                <MenuItem key={stage} value={stage}>
                  {stage}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Average Animal Weight (lbs)"
              name="animalWeight"
              type="number"
              value={formData.animalWeight}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Number of Animals"
              name="numberOfAnimals"
              type="number"
              value={formData.numberOfAnimals}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Feeding Period (days)"
              name="feedingDays"
              type="number"
              value={formData.feedingDays}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateFeedRequirements}
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
            Feed Requirements
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Daily Feed per Animal</TableCell>
                  <TableCell align="right">{results.dailyFeedPerAnimal.toFixed(2)} lbs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Daily Feed</TableCell>
                  <TableCell align="right">{results.totalDailyFeed.toFixed(2)} lbs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Feed Needed</TableCell>
                  <TableCell align="right">{results.totalFeedNeeded.toFixed(2)} lbs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Feed (Tons)</TableCell>
                  <TableCell align="right">{results.totalFeedTons.toFixed(2)} tons</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default FeedCalculator;
