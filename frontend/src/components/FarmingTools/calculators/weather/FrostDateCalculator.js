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
} from '@mui/material';

// Hardcoded zones for demo purposes
// In a real app, this would come from an API or database
const hardinessZones = {
  '1a': { min: -60, max: -55, lastFrost: '6/1', firstFrost: '8/1', growingDays: 60 },
  '1b': { min: -55, max: -50, lastFrost: '5/25', firstFrost: '8/15', growingDays: 80 },
  '2a': { min: -50, max: -45, lastFrost: '5/20', firstFrost: '8/30', growingDays: 100 },
  '2b': { min: -45, max: -40, lastFrost: '5/15', firstFrost: '9/15', growingDays: 120 },
  '3a': { min: -40, max: -35, lastFrost: '5/15', firstFrost: '9/15', growingDays: 120 },
  '3b': { min: -35, max: -30, lastFrost: '5/10', firstFrost: '9/25', growingDays: 135 },
  '4a': { min: -30, max: -25, lastFrost: '5/5', firstFrost: '10/1', growingDays: 145 },
  '4b': { min: -25, max: -20, lastFrost: '5/1', firstFrost: '10/5', growingDays: 155 },
  '5a': { min: -20, max: -15, lastFrost: '4/25', firstFrost: '10/10', growingDays: 165 },
  '5b': { min: -15, max: -10, lastFrost: '4/20', firstFrost: '10/15', growingDays: 175 },
  '6a': { min: -10, max: -5, lastFrost: '4/15', firstFrost: '10/20', growingDays: 185 },
  '6b': { min: -5, max: 0, lastFrost: '4/10', firstFrost: '10/25', growingDays: 195 },
  '7a': { min: 0, max: 5, lastFrost: '4/5', firstFrost: '10/30', growingDays: 205 },
  '7b': { min: 5, max: 10, lastFrost: '3/30', firstFrost: '11/1', growingDays: 215 },
  '8a': { min: 10, max: 15, lastFrost: '3/15', firstFrost: '11/15', growingDays: 240 },
  '8b': { min: 15, max: 20, lastFrost: '3/1', firstFrost: '11/25', growingDays: 265 },
  '9a': { min: 20, max: 25, lastFrost: '2/15', firstFrost: '12/1', growingDays: 285 },
  '9b': { min: 25, max: 30, lastFrost: '2/1', firstFrost: '12/15', growingDays: 315 },
  '10a': { min: 30, max: 35, lastFrost: 'N/A', firstFrost: 'N/A', growingDays: 365 },
  '10b': { min: 35, max: 40, lastFrost: 'N/A', firstFrost: 'N/A', growingDays: 365 },
};

const commonCrops = {
  'tomatoes': { frostTolerant: false, daysToMaturity: 75, plantingTemp: 15 },
  'peppers': { frostTolerant: false, daysToMaturity: 70, plantingTemp: 15 },
  'lettuce': { frostTolerant: true, daysToMaturity: 45, plantingTemp: 5 },
  'peas': { frostTolerant: true, daysToMaturity: 60, plantingTemp: 10 },
  'beans': { frostTolerant: false, daysToMaturity: 55, plantingTemp: 15 },
  'carrots': { frostTolerant: true, daysToMaturity: 70, plantingTemp: 7 },
  'spinach': { frostTolerant: true, daysToMaturity: 40, plantingTemp: 5 },
  'corn': { frostTolerant: false, daysToMaturity: 65, plantingTemp: 15 },
};

const FrostDateCalculator = () => {
  const [inputs, setInputs] = useState({
    zone: '',
    crop: '',
    unit: 'celsius'
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
    if (name === 'zone' && value) {
      calculatePlantingDates(value, inputs.crop);
    }
  };

  const convertTemp = (temp) => {
    return inputs.unit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  };

  const calculatePlantingDates = (zone, crop) => {
    if (!zone) {
      setError('Please select a hardiness zone');
      return;
    }

    const zoneData = hardinessZones[zone];
    const cropData = crop ? commonCrops[crop] : null;

    const lastFrostDate = new Date(2024 + '/' + zoneData.lastFrost);
    const firstFrostDate = new Date(2024 + '/' + zoneData.firstFrost);

    let plantingDates = {
      zone: zone,
      minTemp: convertTemp(zoneData.min),
      maxTemp: convertTemp(zoneData.max),
      lastFrost: zoneData.lastFrost,
      firstFrost: zoneData.firstFrost,
      growingDays: zoneData.growingDays,
    };

    if (cropData) {
      // Calculate safe planting date based on frost tolerance
      const safetyBuffer = cropData.frostTolerant ? 0 : 14; // Two weeks after last frost for non-frost-tolerant
      const plantingDate = new Date(lastFrostDate);
      plantingDate.setDate(plantingDate.getDate() + safetyBuffer);

      // Calculate harvest window
      const harvestStart = new Date(plantingDate);
      harvestStart.setDate(harvestStart.getDate() + cropData.daysToMaturity);

      plantingDates = {
        ...plantingDates,
        crop: crop,
        frostTolerant: cropData.frostTolerant,
        plantingTemp: convertTemp(cropData.plantingTemp),
        daysToMaturity: cropData.daysToMaturity,
        recommendedPlanting: plantingDate.toLocaleDateString(),
        expectedHarvest: harvestStart.toLocaleDateString(),
      };
    }

    setResults(plantingDates);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Frost Date Calculator
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Calculate safe planting dates and growing seasons based on your hardiness zone.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Temperature Unit</InputLabel>
            <Select
              name="unit"
              value={inputs.unit}
              label="Temperature Unit"
              onChange={handleInputChange}
            >
              <MenuItem value="celsius">Celsius</MenuItem>
              <MenuItem value="fahrenheit">Fahrenheit</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Hardiness Zone</InputLabel>
            <Select
              name="zone"
              value={inputs.zone}
              label="Hardiness Zone"
              onChange={handleInputChange}
            >
              {Object.keys(hardinessZones).map((zone) => (
                <MenuItem key={zone} value={zone}>Zone {zone}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Crop (Optional)</InputLabel>
            <Select
              name="crop"
              value={inputs.crop}
              label="Crop (Optional)"
              onChange={handleInputChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Object.keys(commonCrops).map((crop) => (
                <MenuItem key={crop} value={crop}>
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            Growing Season Information
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Zone</TableCell>
                  <TableCell>{results.zone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Temperature Range</TableCell>
                  <TableCell>
                    {results.minTemp}° to {results.maxTemp}° {inputs.unit === 'celsius' ? 'C' : 'F'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Frost Date</TableCell>
                  <TableCell>{results.lastFrost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>First Frost Date</TableCell>
                  <TableCell>{results.firstFrost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Growing Days</TableCell>
                  <TableCell>{results.growingDays}</TableCell>
                </TableRow>
                {results.crop && (
                  <>
                    <TableRow>
                      <TableCell>Frost Tolerant</TableCell>
                      <TableCell>{results.frostTolerant ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Minimum Planting Temperature</TableCell>
                      <TableCell>{results.plantingTemp}° {inputs.unit === 'celsius' ? 'C' : 'F'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Days to Maturity</TableCell>
                      <TableCell>{results.daysToMaturity}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Recommended Planting Date</TableCell>
                      <TableCell>{results.recommendedPlanting}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Expected Harvest Date</TableCell>
                      <TableCell>{results.expectedHarvest}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
};

export default FrostDateCalculator;
