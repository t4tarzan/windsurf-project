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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Pets as LivestockIcon 
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `A stocking rate calculator helps farmers determine the optimal number of livestock that can be sustainably maintained on a given pasture area. This tool considers factors like forage production, animal units, and grazing period to ensure sustainable land management.`,
  keyTerms: [
    {
      term: 'Animal Unit Equivalent (AUE)',
      definition: 'A standardized unit used to compare different types of livestock, based on their forage consumption. One AU equals a 1,000 lb beef cow with calf.'
    },
    {
      term: 'Carrying Capacity',
      definition: 'The maximum stocking rate possible without causing damage to vegetation or related resources.'
    },
    {
      term: 'Grazing Period',
      definition: 'The number of days livestock will spend grazing in a specific pasture area.'
    }
  ],
  bestPractices: [
    'Regularly monitor pasture condition and adjust stocking rates accordingly',
    'Consider seasonal variations in forage production',
    'Maintain proper rotational grazing schedules',
    'Leave adequate residual forage for plant recovery',
    'Account for drought conditions and climate variability'
  ]
};

// Animal Unit Equivalents (AUE) for different livestock types
const livestockTypes = {
  'Beef Cow (1000 lbs with calf)': 1.0,
  'Bull (mature)': 1.3,
  'Yearling Cattle (600-800 lbs)': 0.7,
  'Sheep (mature)': 0.2,
  'Goat (mature)': 0.15,
  'Horse (mature)': 1.25,
  'Alpaca': 0.3,
  'Llama': 0.4
};

// Pasture quality ratings and their carrying capacity (AUM/acre/year)
const pastureQuality = {
  'Excellent': 1.0,
  'Good': 0.75,
  'Fair': 0.5,
  'Poor': 0.25
};

// Educational content about pasture quality indicators
const pastureQualityIndicators = {
  'Excellent': [
    'Dense, vigorous growth of desirable forage species',
    'High species diversity',
    'Minimal bare ground (<5%)',
    'No signs of erosion',
    'Abundant plant litter'
  ],
  'Good': [
    'Good coverage of desirable species',
    'Some species diversity',
    'Limited bare ground (5-10%)',
    'Minor signs of erosion',
    'Adequate plant litter'
  ],
  'Fair': [
    'Moderate coverage with some undesirable species',
    'Limited species diversity',
    'Noticeable bare ground (10-25%)',
    'Visible erosion',
    'Limited plant litter'
  ],
  'Poor': [
    'Sparse coverage with many undesirable species',
    'Very low species diversity',
    'Significant bare ground (>25%)',
    'Severe erosion',
    'Little to no plant litter'
  ]
};

const StockingRateCalculator = () => {
  const [formData, setFormData] = useState({
    pastureAcres: '',
    pastureQuality: 'Good',
    livestockType: 'Beef Cow (1000 lbs with calf)',
    grazingMonths: ''
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

  const calculateStockingRate = () => {
    if (!formData.pastureAcres || !formData.grazingMonths) {
      setError('Please fill in all required fields');
      return;
    }

    const acres = parseFloat(formData.pastureAcres);
    const months = parseFloat(formData.grazingMonths);
    const aue = livestockTypes[formData.livestockType];
    const qualityFactor = pastureQuality[formData.pastureQuality];

    // Calculate Animal Unit Months (AUM) available
    const totalAUM = acres * qualityFactor * months;
    
    // Calculate recommended number of animals
    const recommendedAnimals = Math.floor(totalAUM / (aue * months));
    
    // Calculate actual stocking rate (AUM/acre)
    const actualStockingRate = (recommendedAnimals * aue * months) / acres;

    setResults({
      recommendedAnimals,
      totalAUM,
      actualStockingRate,
      aue
    });
    setError('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stocking Rate Calculator
      </Typography>

      {/* Educational Content */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} /> About Stocking Rates
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            {educationalContent.introduction}
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Key Concepts:
          </Typography>
          <List>
            {educationalContent.keyTerms.map((term, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={term.term}
                  secondary={term.definition}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Calculator Input Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Calculate Your Stocking Rate
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pasture Size (acres)"
              name="pastureAcres"
              type="number"
              value={formData.pastureAcres}
              onChange={handleInputChange}
              helperText="Enter the total available grazing area"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Pasture Quality"
              name="pastureQuality"
              value={formData.pastureQuality}
              onChange={handleInputChange}
              helperText="Select the overall condition of your pasture"
            >
              {Object.keys(pastureQuality).map((quality) => (
                <MenuItem key={quality} value={quality}>
                  {quality}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Livestock Type"
              name="livestockType"
              value={formData.livestockType}
              onChange={handleInputChange}
              helperText="Select the type of livestock you plan to graze"
            >
              {Object.keys(livestockTypes).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Grazing Period (months)"
              name="grazingMonths"
              type="number"
              value={formData.grazingMonths}
              onChange={handleInputChange}
              helperText="Enter the planned grazing duration"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateStockingRate}
              sx={{ mt: 2 }}
            >
              Calculate Stocking Rate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Results Display */}
      {results && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Calculation Results
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Recommended Number of Animals</strong></TableCell>
                    <TableCell>{results.recommendedAnimals}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Total Animal Unit Months (AUM)</strong></TableCell>
                    <TableCell>{results.totalAUM.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Actual Stocking Rate (AUM/acre)</strong></TableCell>
                    <TableCell>{results.actualStockingRate.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Animal Unit Equivalent (AUE)</strong></TableCell>
                    <TableCell>{results.aue}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Pasture Quality Guide */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Pasture Quality Guidelines
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {Object.entries(pastureQualityIndicators).map(([quality, indicators]) => (
              <Grid item xs={12} md={6} key={quality}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {quality} Pasture
                    </Typography>
                    <List dense>
                      {indicators.map((indicator, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={indicator} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Best Practices */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Best Practices for Pasture Management
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {educationalContent.bestPractices.map((practice, index) => (
              <ListItem key={index}>
                <ListItemText primary={practice} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default StockingRateCalculator;
