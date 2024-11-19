import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Box,
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
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { addDays, differenceInDays } from 'date-fns';

const commonCrops = {
  'Tomato': {
    optimalTemp: '21-27°C',
    daysToGerminate: '5-10',
    expectedRate: '75-95%',
    viabilityYears: '4-5',
    notes: 'Keep soil consistently moist but not waterlogged'
  },
  'Lettuce': {
    optimalTemp: '16-22°C',
    daysToGerminate: '2-8',
    expectedRate: '80-95%',
    viabilityYears: '1-2',
    notes: 'Light required for germination'
  },
  'Carrot': {
    optimalTemp: '18-24°C',
    daysToGerminate: '14-21',
    expectedRate: '60-85%',
    viabilityYears: '2-3',
    notes: 'Keep soil surface moist until germination'
  },
  'Pepper': {
    optimalTemp: '21-29°C',
    daysToGerminate: '7-14',
    expectedRate: '70-90%',
    viabilityYears: '2-3',
    notes: 'Bottom heat improves germination'
  },
  'Spinach': {
    optimalTemp: '10-21°C',
    daysToGerminate: '5-10',
    expectedRate: '70-90%',
    viabilityYears: '2-3',
    notes: 'Cooler temperatures preferred'
  }
};

const educationalContent = {
  introduction: `Germination rate is a crucial metric in agriculture that measures the percentage of seeds that successfully sprout under specific conditions. Understanding and tracking germination rates helps farmers and gardeners optimize their planting strategies and improve crop yields.`,
  
  importance: [
    {
      title: 'Seed Quality Assessment',
      description: 'Evaluate the viability and health of seed batches',
      impact: 'Ensures investment in quality seeds'
    },
    {
      title: 'Planting Density Planning',
      description: 'Determine optimal seed spacing and quantity',
      impact: 'Optimizes resource utilization'
    },
    {
      title: 'Crop Success Prediction',
      description: 'Forecast potential crop establishment rates',
      impact: 'Improves planning and risk management'
    }
  ],

  bestPractices: [
    'Maintain consistent moisture levels during germination testing',
    'Control temperature within optimal range for specific crop types',
    'Use clean, sterile containers and growing medium',
    'Document testing conditions and results systematically',
    'Consider conducting multiple tests for accuracy'
  ],

  factors: [
    'Seed age and storage conditions',
    'Temperature and moisture levels',
    'Soil or growing medium quality',
    'Light exposure (for light-sensitive seeds)',
    'Seed treatment methods'
  ]
};

const GerminationRate = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [seedsPlanted, setSeedsPlanted] = useState('');
  const [seedsGerminated, setSeedsGerminated] = useState('');
  const [plantingDate, setPlantingDate] = useState(null);
  const [germinationDate, setGerminationDate] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculateGerminationRate = () => {
    if (!seedsPlanted || !seedsGerminated || !plantingDate || !germinationDate) {
      setError('Please fill in all fields');
      return;
    }

    const planted = parseInt(seedsPlanted);
    const germinated = parseInt(seedsGerminated);

    if (germinated > planted) {
      setError('Number of germinated seeds cannot exceed number of planted seeds');
      return;
    }

    const daysToGerminate = differenceInDays(germinationDate, plantingDate);
    if (daysToGerminate < 0) {
      setError('Germination date must be after planting date');
      return;
    }

    const germinationRate = (germinated / planted) * 100;
    const cropInfo = commonCrops[selectedCrop];
    const expectedRateRange = cropInfo?.expectedRate.split('-').map(rate => parseFloat(rate.replace('%', ''))) || [0, 100];
    const isWithinExpectedRange = germinationRate >= expectedRateRange[0] && germinationRate <= expectedRateRange[1];
    const expectedDaysRange = cropInfo?.daysToGerminate.split('-').map(days => parseInt(days));
    const isWithinExpectedDays = expectedDaysRange ? 
      daysToGerminate >= expectedDaysRange[0] && daysToGerminate <= expectedDaysRange[1] : true;

    setResults({
      germinationRate: germinationRate.toFixed(1),
      daysToGerminate,
      isWithinExpectedRange,
      isWithinExpectedDays,
      expectedRate: cropInfo?.expectedRate,
      expectedDays: cropInfo?.daysToGerminate,
    });
    setError('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Germination Rate Calculator
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Calculate and track seed germination rates to optimize planting success.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Select Crop"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              margin="normal"
            >
              {Object.keys(commonCrops).map((crop) => (
                <MenuItem key={crop} value={crop}>
                  {crop}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Seeds Planted"
              type="number"
              value={seedsPlanted}
              onChange={(e) => setSeedsPlanted(e.target.value)}
              margin="normal"
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Planting Date"
                value={plantingDate}
                onChange={(newValue) => setPlantingDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Germination Date"
                value={germinationDate}
                onChange={(newValue) => setGerminationDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Seeds Germinated"
              type="number"
              value={seedsGerminated}
              onChange={(e) => setSeedsGerminated(e.target.value)}
              margin="normal"
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateGerminationRate}
              disabled={!selectedCrop || !seedsPlanted || !seedsGerminated || !plantingDate || !germinationDate}
            >
              Calculate Germination Rate
            </Button>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {selectedCrop && commonCrops[selectedCrop] && (
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Optimal Temperature</TableCell>
                      <TableCell>Expected Days to Germinate</TableCell>
                      <TableCell>Expected Rate</TableCell>
                      <TableCell>Seed Viability (Years)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{commonCrops[selectedCrop].optimalTemp}</TableCell>
                      <TableCell>{commonCrops[selectedCrop].daysToGerminate} days</TableCell>
                      <TableCell>{commonCrops[selectedCrop].expectedRate}</TableCell>
                      <TableCell>{commonCrops[selectedCrop].viabilityYears}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Note: {commonCrops[selectedCrop].notes}
              </Typography>
            </Grid>
          )}

          {results && (
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Germination Rate</TableCell>
                      <TableCell>Days to Germinate</TableCell>
                      <TableCell>Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {results.germinationRate}%
                        {!results.isWithinExpectedRange && (
                          <Typography variant="caption" color="error" display="block">
                            Below expected rate ({results.expectedRate})
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {results.daysToGerminate} days
                        {!results.isWithinExpectedDays && (
                          <Typography variant="caption" color="error" display="block">
                            Outside expected range ({results.expectedDays} days)
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {results.isWithinExpectedRange && results.isWithinExpectedDays ? (
                          <Typography color="success.main">Normal</Typography>
                        ) : (
                          <Typography color="error">Needs Attention</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">What is Germination Rate?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{educationalContent.introduction}</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Why is Germination Rate Important?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {educationalContent.importance.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ScienceIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.title} secondary={item.description} />
                    <Typography variant="body2" color="textSecondary">
                      {item.impact}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Best Practices for Germination Testing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {educationalContent.bestPractices.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <LightbulbIcon />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Factors Affecting Germination Rate</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {educationalContent.factors.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PsychologyIcon />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GerminationRate;
