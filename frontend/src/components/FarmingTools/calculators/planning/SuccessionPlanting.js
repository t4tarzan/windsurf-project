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
  Divider,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { addDays, format } from 'date-fns';

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
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Succession Planting Calculator
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Plan sequential plantings to ensure continuous harvests throughout the season.
        </Typography>

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
      </CardContent>
    </Card>
  );
};

export default SuccessionPlanting;
