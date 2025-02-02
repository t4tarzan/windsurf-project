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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Agriculture as AgricultureIcon,
  Nature as NatureIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const cropFamilies = {
  'solanaceae': {
    name: 'Nightshades',
    crops: ['Tomatoes', 'Peppers', 'Potatoes', 'Eggplants'],
    nutrients: 'Heavy Feeders',
    nextBest: ['legumes', 'brassicas'],
    avoid: ['solanaceae'],
    waitYears: 3
  },
  'brassicas': {
    name: 'Brassicas',
    crops: ['Cabbage', 'Broccoli', 'Cauliflower', 'Kale'],
    nutrients: 'Heavy Feeders',
    nextBest: ['legumes', 'alliums'],
    avoid: ['brassicas'],
    waitYears: 2
  },
  'legumes': {
    name: 'Legumes',
    crops: ['Peas', 'Beans', 'Lentils'],
    nutrients: 'Nitrogen Fixers',
    nextBest: ['brassicas', 'solanaceae'],
    avoid: ['legumes', 'alliums'],
    waitYears: 2
  },
  'cucurbits': {
    name: 'Cucurbits',
    crops: ['Cucumber', 'Squash', 'Pumpkin', 'Melons'],
    nutrients: 'Heavy Feeders',
    nextBest: ['legumes', 'alliums'],
    avoid: ['cucurbits'],
    waitYears: 2
  },
  'alliums': {
    name: 'Alliums',
    crops: ['Onions', 'Garlic', 'Leeks'],
    nutrients: 'Light Feeders',
    nextBest: ['brassicas', 'cucurbits'],
    avoid: ['alliums', 'legumes'],
    waitYears: 3
  },
  'apiaceae': {
    name: 'Umbellifers',
    crops: ['Carrots', 'Parsnips', 'Celery'],
    nutrients: 'Light Feeders',
    nextBest: ['legumes', 'solanaceae'],
    avoid: ['apiaceae'],
    waitYears: 2
  },
  'chenopodiaceae': {
    name: 'Chenopods',
    crops: ['Beets', 'Spinach', 'Swiss Chard'],
    nutrients: 'Medium Feeders',
    nextBest: ['legumes', 'alliums'],
    avoid: ['chenopodiaceae'],
    waitYears: 2
  }
};

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `Crop rotation is a systematic approach to deciding which crops to plant where in your garden or field from one season to the next. This practice helps maintain soil health, manage pests and diseases, and optimize nutrient usage for better yields.`,
  
  benefits: [
    {
      title: 'Soil Health Management',
      description: 'Different crops have different nutrient needs and root depths',
      impact: 'Prevents soil depletion and improves structure'
    },
    {
      title: 'Pest and Disease Control',
      description: 'Breaking pest and disease cycles by moving crop families',
      impact: 'Reduces need for chemical interventions'
    },
    {
      title: 'Nutrient Management',
      description: 'Alternating heavy feeders with soil builders',
      impact: 'Optimizes nutrient availability'
    },
    {
      title: 'Weed Suppression',
      description: 'Different crops suppress different types of weeds',
      impact: 'Natural weed control'
    }
  ],

  bestPractices: [
    'Follow recommended waiting periods between same-family crops',
    'Alternate between heavy feeders and soil builders',
    'Consider cover crops in your rotation plan',
    'Keep detailed records of crop locations and performance',
    'Plan rotations 3-4 years in advance'
  ],

  commonMistakes: [
    'Planting same-family crops in succession',
    'Ignoring soil-building crops in the rotation',
    'Not maintaining proper records',
    'Overlooking cover crops',
    'Planning only one season ahead'
  ]
};

const CropRotationPlanner = () => {
  const [inputs, setInputs] = useState({
    currentFamily: '',
    years: 4,
    plots: 4
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

  const generateRotationPlan = () => {
    const { currentFamily, years, plots } = inputs;
    
    if (!currentFamily) {
      setError('Please select a crop family');
      return;
    }

    if (plots < 2 || plots > 8) {
      setError('Number of plots must be between 2 and 8');
      return;
    }

    if (years < 2 || years > 6) {
      setError('Number of years must be between 2 and 6');
      return;
    }

    // Generate rotation plan
    const plan = [];
    let availableFamilies = Object.keys(cropFamilies);
    let currentFam = currentFamily;

    for (let year = 0; year < years; year++) {
      const yearPlan = [];
      let usedFamilies = new Set();

      for (let plot = 0; plot < plots; plot++) {
        if (plot === 0 && year === 0) {
          yearPlan.push(currentFam);
          usedFamilies.add(currentFam);
          continue;
        }

        // Find next best crop family
        const current = cropFamilies[currentFam];
        let nextFamily = '';

        // First try preferred families
        for (const preferred of current.nextBest) {
          if (!usedFamilies.has(preferred)) {
            nextFamily = preferred;
            break;
          }
        }

        // If no preferred family available, try others
        if (!nextFamily) {
          for (const family of availableFamilies) {
            if (!usedFamilies.has(family) && !current.avoid.includes(family)) {
              nextFamily = family;
              break;
            }
          }
        }

        // If still no family found, use any unused family
        if (!nextFamily) {
          for (const family of availableFamilies) {
            if (!usedFamilies.has(family)) {
              nextFamily = family;
              break;
            }
          }
        }

        yearPlan.push(nextFamily);
        usedFamilies.add(nextFamily);
        currentFam = nextFamily;
      }

      plan.push(yearPlan);
    }

    setResults({
      rotationPlan: plan,
      families: cropFamilies
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Crop Rotation Planner
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Plan your crop rotation to maintain soil health and maximize yields.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Current Crop Family</InputLabel>
            <Select
              name="currentFamily"
              value={inputs.currentFamily}
              label="Current Crop Family"
              onChange={handleInputChange}
            >
              {Object.entries(cropFamilies).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Number of Plots"
            name="plots"
            type="number"
            value={inputs.plots}
            onChange={handleInputChange}
            inputProps={{ min: 2, max: 8 }}
            helperText="2-8 plots"
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Years to Plan"
            name="years"
            type="number"
            value={inputs.years}
            onChange={handleInputChange}
            inputProps={{ min: 2, max: 6 }}
            helperText="2-6 years"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={generateRotationPlan}
            fullWidth
          >
            Generate Rotation Plan
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {results && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Rotation Plan
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  {Array.from({ length: inputs.plots }, (_, i) => (
                    <TableCell key={i}>Plot {i + 1}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results.rotationPlan.map((yearPlan, yearIndex) => (
                  <TableRow key={yearIndex}>
                    <TableCell>Year {yearIndex + 1}</TableCell>
                    {yearPlan.map((family, plotIndex) => (
                      <TableCell key={plotIndex}>
                        <Chip
                          label={results.families[family].name}
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {results.families[family].nutrients}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {results.families[family].crops.join(', ')}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Rotation Guidelines
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(results.families).map(([key, family]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {family.name}
                    </Typography>
                    <Typography variant="body2">
                      Wait Years: {family.waitYears}
                    </Typography>
                    <Typography variant="body2">
                      Best Following: {family.nextBest.map(f => results.families[f].name).join(', ')}
                    </Typography>
                    <Typography variant="body2">
                      Avoid Following: {family.avoid.map(f => results.families[f].name).join(', ')}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}

      <Box mt={3}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Introduction to Crop Rotation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">{educationalContent.introduction}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Benefits of Crop Rotation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.benefits.map((benefit, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <AgricultureIcon />
                  </ListItemIcon>
                  <ListItemText primary={benefit.title} secondary={benefit.description} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Best Practices for Crop Rotation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.bestPractices.map((practice, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <NatureIcon />
                  </ListItemIcon>
                  <ListItemText primary={practice} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Common Mistakes in Crop Rotation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.commonMistakes.map((mistake, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WarningIcon />
                  </ListItemIcon>
                  <ListItemText primary={mistake} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
};

export default CropRotationPlanner;
