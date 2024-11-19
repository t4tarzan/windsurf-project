import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { addDays, format } from 'date-fns';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Agriculture as AgricultureIcon,
  CalendarMonth as CalendarIcon,
  Park as ParkIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `Succession planting is a gardening strategy that involves planting crops at staggered intervals to ensure a continuous harvest throughout the growing season. This method maximizes garden productivity and provides fresh produce over an extended period.`,
  
  benefits: [
    {
      title: 'Continuous Harvest',
      description: 'Regular harvests throughout the growing season',
      impact: 'Ensures steady supply of fresh produce'
    },
    {
      title: 'Space Optimization',
      description: 'Efficient use of garden space through staggered planting',
      impact: 'Maximizes yield from limited growing area'
    },
    {
      title: 'Risk Management',
      description: 'Spreads risk of crop failure across multiple plantings',
      impact: 'Increases reliability of harvest'
    },
    {
      title: 'Market Planning',
      description: 'Helps maintain consistent supply for market gardeners',
      impact: 'Supports stable income and customer retention'
    }
  ],

  bestPractices: [
    'Consider crop maturity times when planning intervals',
    'Account for seasonal changes in growing conditions',
    'Keep detailed records of planting dates and results',
    'Prepare soil between successive plantings',
    'Monitor weather patterns and adjust accordingly',
    'Use season extension techniques for longer harvests'
  ],

  tips: {
    planning: 'Start with quick-growing crops to gain experience',
    timing: 'Consider harvest window when planning succession intervals',
    spacing: 'Ensure adequate space for each planting cycle',
    maintenance: 'Maintain soil fertility for continuous production'
  }
};

const crops = {
  'Lettuce': {
    daysToMaturity: 45,
    harvestWindow: 14,
    recommendedSuccessions: 14,
    notes: 'Plant every 7-14 days for continuous harvest'
  },
  'Radishes': {
    daysToMaturity: 25,
    harvestWindow: 7,
    recommendedSuccessions: 10,
    notes: 'Plant every 7-10 days for continuous harvest'
  },
  'Bush Beans': {
    daysToMaturity: 55,
    harvestWindow: 21,
    recommendedSuccessions: 21,
    notes: 'Plant every 14-21 days until 8 weeks before frost'
  },
  'Spinach': {
    daysToMaturity: 40,
    harvestWindow: 21,
    recommendedSuccessions: 14,
    notes: 'Plant every 14 days, best in spring and fall'
  },
  'Carrots': {
    daysToMaturity: 70,
    harvestWindow: 30,
    recommendedSuccessions: 21,
    notes: 'Plant every 21 days for continuous harvest'
  }
};

const SuccessionPlanting = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [numberOfSuccessions, setNumberOfSuccessions] = useState(4);
  const [plantingSchedule, setPlantingSchedule] = useState([]);

  const calculateSchedule = () => {
    if (!selectedCrop || !startDate || numberOfSuccessions <= 0) return;

    const crop = crops[selectedCrop];
    const schedule = [];
    let currentDate = startDate;

    for (let i = 0; i < numberOfSuccessions; i++) {
      const harvestDate = addDays(currentDate, crop.daysToMaturity);
      const harvestEndDate = addDays(harvestDate, crop.harvestWindow);

      schedule.push({
        succession: i + 1,
        plantingDate: format(currentDate, 'MMM d, yyyy'),
        harvestStartDate: format(harvestDate, 'MMM d, yyyy'),
        harvestEndDate: format(harvestEndDate, 'MMM d, yyyy')
      });

      currentDate = addDays(currentDate, crop.recommendedSuccessions);
    }

    setPlantingSchedule(schedule);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Succession Planting Calculator
      </Typography>

      {/* Educational Content Section */}
      <Box mb={4}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} /> About Succession Planting
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <AgricultureIcon sx={{ mr: 1 }} /> Benefits
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {educationalContent.benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{benefit.title}</Typography>
                      <Typography paragraph>{benefit.description}</Typography>
                      <Typography variant="body2" color="textSecondary">{benefit.impact}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <TimerIcon sx={{ mr: 1 }} /> Best Practices
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.bestPractices.map((practice, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ParkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={practice} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ mr: 1 }} /> Planning Tips
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {Object.entries(educationalContent.tips).map(([key, value], index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                        {key}
                      </Typography>
                      <Typography>{value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Calculator Form */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Select Crop"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            margin="normal"
          >
            {Object.keys(crops).map((crop) => (
              <MenuItem key={crop} value={crop}>
                {crop}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            type="number"
            fullWidth
            label="Number of Successions"
            value={numberOfSuccessions}
            onChange={(e) => setNumberOfSuccessions(parseInt(e.target.value))}
            margin="normal"
            inputProps={{ min: 1, max: 12 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateSchedule}
            disabled={!selectedCrop || !startDate || numberOfSuccessions <= 0}
          >
            Calculate Schedule
          </Button>
        </Grid>

        {selectedCrop && crops[selectedCrop] && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Crop Information:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Days to Maturity: {crops[selectedCrop].daysToMaturity} days
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Harvest Window: {crops[selectedCrop].harvestWindow} days
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Notes: {crops[selectedCrop].notes}
            </Typography>
          </Grid>
        )}

        {plantingSchedule.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Planting Schedule
            </Typography>
            <List>
              {plantingSchedule.map((schedule, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`Succession ${schedule.succession}`}
                      secondary={
                        <>
                          Plant: {schedule.plantingDate}
                          <br />
                          Harvest: {schedule.harvestStartDate} - {schedule.harvestEndDate}
                        </>
                      }
                    />
                  </ListItem>
                  {index < plantingSchedule.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default SuccessionPlanting;
