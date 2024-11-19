import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent
} from '@mui/material';
import { SocialShare } from '../../common/SocialShare';

const SeedSpacingCalculator = () => {
  const [rowSpacing, setRowSpacing] = useState('');
  const [plantSpacing, setPlantSpacing] = useState('');
  const [areaLength, setAreaLength] = useState('');
  const [areaWidth, setAreaWidth] = useState('');
  const [result, setResult] = useState(null);

  const calculateSpacing = () => {
    if (!rowSpacing || !plantSpacing || !areaLength || !areaWidth) {
      return;
    }

    const rowSpacingNum = parseFloat(rowSpacing);
    const plantSpacingNum = parseFloat(plantSpacing);
    const areaLengthNum = parseFloat(areaLength);
    const areaWidthNum = parseFloat(areaWidth);

    // Calculate number of rows and plants per row
    const numberOfRows = Math.floor(areaWidthNum / rowSpacingNum);
    const plantsPerRow = Math.floor(areaLengthNum / plantSpacingNum);
    const totalPlants = numberOfRows * plantsPerRow;

    // Calculate area utilization
    const usedArea = (numberOfRows * rowSpacingNum) * (plantsPerRow * plantSpacingNum);
    const totalArea = areaLengthNum * areaWidthNum;
    const areaUtilization = (usedArea / totalArea) * 100;

    setResult({
      numberOfRows,
      plantsPerRow,
      totalPlants,
      areaUtilization: areaUtilization.toFixed(2)
    });
  };

  return (
    <Box>
      {/* Tool Information Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Seed Spacing Calculator
        </Typography>
        <Typography variant="body1" paragraph>
          Optimize your planting layout by calculating the ideal spacing between plants and rows. 
          This tool helps you maximize your growing area while ensuring each plant has adequate space to thrive.
        </Typography>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  How It Works
                </Typography>
                <Typography variant="body2" paragraph>
                  1. Enter the recommended spacing between rows
                </Typography>
                <Typography variant="body2" paragraph>
                  2. Input the recommended spacing between plants within each row
                </Typography>
                <Typography variant="body2" paragraph>
                  3. Provide your growing area dimensions
                </Typography>
                <Typography variant="body2">
                  4. Get instant calculations for optimal plant layout
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Benefits
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Maximize Space Utilization" 
                      secondary="Get the most out of your growing area while maintaining proper spacing"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Prevent Overcrowding" 
                      secondary="Ensure plants have adequate space for healthy growth"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Plan Ahead" 
                      secondary="Know exactly how many plants you can grow in your space"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Resource Planning" 
                      secondary="Calculate seed and material needs accurately"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            Example: For tomatoes, typical spacing is 24-36 inches between rows and 18-24 inches between plants.
            Adjust based on your specific variety and growing conditions.
          </Typography>
        </Alert>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Calculator Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Calculate Your Spacing
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Row Spacing (inches)"
              type="number"
              value={rowSpacing}
              onChange={(e) => setRowSpacing(e.target.value)}
              helperText="Distance between rows"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Plant Spacing (inches)"
              type="number"
              value={plantSpacing}
              onChange={(e) => setPlantSpacing(e.target.value)}
              helperText="Distance between plants in a row"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Area Length (feet)"
              type="number"
              value={areaLength}
              onChange={(e) => setAreaLength(e.target.value)}
              helperText="Length of your growing area"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Area Width (feet)"
              type="number"
              value={areaWidth}
              onChange={(e) => setAreaWidth(e.target.value)}
              helperText="Width of your growing area"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateSpacing}
              fullWidth
            >
              Calculate
            </Button>
          </Grid>
        </Grid>

        {result && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Number of Rows:
                  </Typography>
                  <Typography variant="h6">
                    {result.numberOfRows}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Plants per Row:
                  </Typography>
                  <Typography variant="h6">
                    {result.plantsPerRow}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Plants:
                  </Typography>
                  <Typography variant="h6">
                    {result.totalPlants}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Area Utilization:
                  </Typography>
                  <Typography variant="h6">
                    {result.areaUtilization}%
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <SocialShare />
    </Box>
  );
};

export default SeedSpacingCalculator;
