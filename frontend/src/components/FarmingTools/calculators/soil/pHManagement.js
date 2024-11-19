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
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { SocialShare } from '../../common/SocialShare';

const PHManagement = () => {
  const [currentPH, setCurrentPH] = useState('');
  const [targetPH, setTargetPH] = useState('');
  const [soilType, setSoilType] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [result, setResult] = useState(null);

  const calculateAmendments = () => {
    // Add your pH calculation logic here
    // This is a simplified example
    if (!currentPH || !targetPH || !soilType || !areaSize) return;

    const phDifference = Math.abs(parseFloat(targetPH) - parseFloat(currentPH));
    const areaSqFt = parseFloat(areaSize);

    // Simplified calculation - in reality, would need more complex formulas
    const limeNeeded = phDifference * areaSqFt * 0.75; // Example rate
    const sulfurNeeded = phDifference * areaSqFt * 0.5; // Example rate

    setResult({
      limeAmount: parseFloat(currentPH) < parseFloat(targetPH) ? limeNeeded.toFixed(2) : 0,
      sulfurAmount: parseFloat(currentPH) > parseFloat(targetPH) ? sulfurNeeded.toFixed(2) : 0,
      phDifference: phDifference.toFixed(2)
    });
  };

  const phRangeTable = [
    { crop: 'Most Vegetables', range: '6.0-7.0', optimal: '6.5' },
    { crop: 'Potatoes', range: '5.0-6.0', optimal: '5.5' },
    { crop: 'Blueberries', range: '4.5-5.5', optimal: '5.0' },
    { crop: 'Tomatoes', range: '6.0-6.8', optimal: '6.5' },
    { crop: 'Carrots', range: '5.5-7.0', optimal: '6.3' },
    { crop: 'Beans', range: '6.0-7.0', optimal: '6.5' },
    { crop: 'Corn', range: '5.8-7.0', optimal: '6.5' }
  ];

  return (
    <Box>
      {/* Comprehensive Introduction */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Soil pH Management Calculator
        </Typography>
        <Typography variant="body1" paragraph>
          Soil pH is one of the most crucial factors in plant growth and nutrient availability. This calculator helps you determine 
          the right amount of amendments needed to optimize your soil pH for specific crops, ensuring maximum nutrient availability 
          and plant health.
        </Typography>

        {/* Educational Content Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Understanding Soil pH
                </Typography>
                <Typography variant="body2" paragraph>
                  Soil pH measures the acidity or alkalinity of your soil on a scale from 0 to 14, with 7 being neutral. Most plants 
                  thrive in slightly acidic to neutral soil (pH 6.0-7.0), but some plants have specific pH requirements:
                </Typography>
                <Typography variant="body2" paragraph>
                  • Below 7.0: Acidic soil (preferred by acid-loving plants like blueberries)<br />
                  • 7.0: Neutral<br />
                  • Above 7.0: Alkaline soil (preferred by some vegetables and herbs)
                </Typography>
                <Typography variant="body2" paragraph>
                  The pH level affects nutrient availability, soil bacteria activity, and overall plant health. When pH is too high or 
                  too low, certain nutrients become less available to plants, leading to deficiencies even when those nutrients are 
                  present in the soil.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Why pH Management Matters
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Nutrient Availability" 
                      secondary="Proper pH ensures plants can access essential nutrients in the soil"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Root Health" 
                      secondary="Optimal pH promotes healthy root development and function"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Beneficial Microorganisms" 
                      secondary="Correct pH supports beneficial soil microbe activity"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Plant Growth" 
                      secondary="Balanced pH leads to stronger, healthier plants and better yields"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Cost Efficiency" 
                      secondary="Proper pH reduces fertilizer waste and improves nutrient uptake"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Common Crops pH Requirements Table */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Common Crop pH Requirements
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Crop</strong></TableCell>
                    <TableCell><strong>pH Range</strong></TableCell>
                    <TableCell><strong>Optimal pH</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {phRangeTable.map((row) => (
                    <TableRow key={row.crop}>
                      <TableCell>{row.crop}</TableCell>
                      <TableCell>{row.range}</TableCell>
                      <TableCell>{row.optimal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* How to Use Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              How to Use This Calculator
            </Typography>
            <Typography variant="body2" paragraph>
              1. Test your soil pH using a reliable soil testing kit or professional lab analysis
            </Typography>
            <Typography variant="body2" paragraph>
              2. Enter your current soil pH value
            </Typography>
            <Typography variant="body2" paragraph>
              3. Select your target pH based on what you plan to grow (use the table above as a reference)
            </Typography>
            <Typography variant="body2" paragraph>
              4. Enter your soil type and area size
            </Typography>
            <Typography variant="body2">
              5. The calculator will determine the amount of lime (to raise pH) or sulfur (to lower pH) needed
            </Typography>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Pro Tip:</strong> Always perform a soil test before making major pH adjustments. Apply amendments gradually 
            and retest after each application. It's better to make several small adjustments than one large correction.
          </Typography>
        </Alert>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Calculator Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Calculate pH Amendments
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Current Soil pH"
              type="number"
              value={currentPH}
              onChange={(e) => setCurrentPH(e.target.value)}
              inputProps={{ step: "0.1", min: "0", max: "14" }}
              helperText="Enter your current soil pH (0-14)"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Target pH"
              type="number"
              value={targetPH}
              onChange={(e) => setTargetPH(e.target.value)}
              inputProps={{ step: "0.1", min: "0", max: "14" }}
              helperText="Enter your desired soil pH (0-14)"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Soil Type"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              helperText="Enter your soil type (e.g., sandy, clay, loam)"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Area Size (sq ft)"
              type="number"
              value={areaSize}
              onChange={(e) => setAreaSize(e.target.value)}
              helperText="Enter the area to be treated in square feet"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateAmendments}
              fullWidth
            >
              Calculate Amendments
            </Button>
          </Grid>
        </Grid>

        {result && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Recommended Amendments
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    pH Adjustment Needed:
                  </Typography>
                  <Typography variant="h6">
                    {result.phDifference} units
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Lime Needed (to raise pH):
                  </Typography>
                  <Typography variant="h6">
                    {result.limeAmount} lbs
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sulfur Needed (to lower pH):
                  </Typography>
                  <Typography variant="h6">
                    {result.sulfurAmount} lbs
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Application Tips:</strong>
                <br />• Apply amendments when soil is moist but not wet
                <br />• Incorporate amendments into the top 6 inches of soil
                <br />• Allow 2-3 months for changes to take effect
                <br />• Retest soil pH before making additional adjustments
              </Typography>
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Additional Resources Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Additional Resources
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Common pH Amendments:</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            To Raise pH:
            <br />• Agricultural lime (calcium carbonate)
            <br />• Dolomitic lime (calcium and magnesium carbonate)
            <br />• Wood ash (use cautiously, test first)
          </Typography>
          <Typography variant="body2" paragraph>
            To Lower pH:
            <br />• Elemental sulfur
            <br />• Aluminum sulfate
            <br />• Iron sulfate
          </Typography>
          <Typography variant="body2">
            Remember that soil pH changes take time and multiple applications may be needed to reach your target pH. Regular 
            monitoring and maintenance are key to successful pH management.
          </Typography>
        </CardContent>
      </Card>

      <SocialShare />
    </Box>
  );
};

export default PHManagement;
