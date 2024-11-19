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

const OrganicMatter = () => {
  const [currentOM, setCurrentOM] = useState('');
  const [targetOM, setTargetOM] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [soilDepth, setSoilDepth] = useState('');
  const [result, setResult] = useState(null);

  const organicMatterTable = [
    { type: 'Sandy Soil', ideal: '2-3%', minimum: '1%' },
    { type: 'Clay Soil', ideal: '4-5%', minimum: '2%' },
    { type: 'Loamy Soil', ideal: '3-4%', minimum: '2%' },
    { type: 'Garden Soil', ideal: '5-8%', minimum: '3%' },
    { type: 'Potting Mix', ideal: '10-20%', minimum: '5%' }
  ];

  const calculateAmendments = () => {
    if (!currentOM || !targetOM || !areaSize || !soilDepth) return;

    const current = parseFloat(currentOM);
    const target = parseFloat(targetOM);
    const area = parseFloat(areaSize);
    const depth = parseFloat(soilDepth);

    // Calculate soil volume in cubic feet
    const soilVolume = area * (depth / 12); // Convert depth to feet
    
    // Calculate weight of soil (assuming average soil weight of 100 lbs per cubic foot)
    const soilWeight = soilVolume * 100;
    
    // Calculate pounds of organic matter needed
    const currentOMWeight = soilWeight * (current / 100);
    const targetOMWeight = soilWeight * (target / 100);
    const omNeeded = targetOMWeight - currentOMWeight;
    
    // Calculate amendments needed (assuming 50% of material becomes stable organic matter)
    const compostNeeded = omNeeded * 2;
    const manureNeeded = omNeeded * 4; // Manure has lower OM conversion rate
    
    setResult({
      omNeeded: omNeeded.toFixed(2),
      compostNeeded: compostNeeded.toFixed(2),
      manureNeeded: manureNeeded.toFixed(2),
      soilVolume: soilVolume.toFixed(2)
    });
  };

  return (
    <Box>
      {/* Comprehensive Introduction */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Soil Organic Matter Calculator
        </Typography>
        <Typography variant="body1" paragraph>
          Organic matter is the foundation of healthy soil and sustainable agriculture. This calculator helps you 
          determine how much organic material you need to add to reach optimal soil organic matter levels for 
          your specific growing conditions.
        </Typography>

        {/* Educational Content Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Understanding Soil Organic Matter
                </Typography>
                <Typography variant="body2" paragraph>
                  Soil organic matter (SOM) consists of:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Living Organisms" 
                      secondary="Bacteria, fungi, earthworms, and other soil life (5%)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Fresh Organic Materials" 
                      secondary="Recently added plant and animal residues (10%)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Actively Decomposing Matter" 
                      secondary="Materials in various stages of decomposition (35%)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Humus" 
                      secondary="Stable, long-lasting organic compounds (50%)"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Benefits of Organic Matter
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Improved Soil Structure" 
                      secondary="Better aggregation, reduced compaction, improved drainage"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Enhanced Water Retention" 
                      secondary="Each 1% increase holds about 16,500 gallons of water per acre"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Nutrient Storage" 
                      secondary="Increases cation exchange capacity and nutrient availability"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Biological Activity" 
                      secondary="Supports beneficial microorganisms and earthworms"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Carbon Sequestration" 
                      secondary="Helps mitigate climate change by storing carbon in soil"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Ideal Organic Matter Levels Table */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ideal Organic Matter Levels by Soil Type
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Soil Type</strong></TableCell>
                    <TableCell><strong>Ideal Range</strong></TableCell>
                    <TableCell><strong>Minimum Level</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organicMatterTable.map((row) => (
                    <TableRow key={row.type}>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.ideal}</TableCell>
                      <TableCell>{row.minimum}</TableCell>
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
              1. Test your soil organic matter content:
              <br />• Use a professional soil testing service
              <br />• Request organic matter analysis
              <br />• Collect samples from multiple locations
            </Typography>
            <Typography variant="body2" paragraph>
              2. Enter your current organic matter percentage
            </Typography>
            <Typography variant="body2" paragraph>
              3. Set your target organic matter level based on your soil type
            </Typography>
            <Typography variant="body2" paragraph>
              4. Input your area size and desired soil amendment depth
            </Typography>
            <Typography variant="body2">
              5. The calculator will determine the amount of organic amendments needed
            </Typography>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Pro Tip:</strong> Increase organic matter levels gradually over several seasons. Quick, large 
            additions can lead to nutrient tie-up and imbalances. Aim to increase by 0.5-1% per year.
          </Typography>
        </Alert>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Calculator Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Calculate Organic Matter Amendments
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Current Organic Matter (%)"
              type="number"
              value={currentOM}
              onChange={(e) => setCurrentOM(e.target.value)}
              inputProps={{ step: "0.1", min: "0", max: "100" }}
              helperText="Enter your current organic matter percentage"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Target Organic Matter (%)"
              type="number"
              value={targetOM}
              onChange={(e) => setTargetOM(e.target.value)}
              inputProps={{ step: "0.1", min: "0", max: "100" }}
              helperText="Enter your desired organic matter percentage"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Area Size (sq ft)"
              type="number"
              value={areaSize}
              onChange={(e) => setAreaSize(e.target.value)}
              helperText="Enter the area to be amended"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Soil Depth (inches)"
              type="number"
              value={soilDepth}
              onChange={(e) => setSoilDepth(e.target.value)}
              helperText="Enter the depth of soil to be amended"
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
              Amendment Recommendations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Soil Volume to Amend:
                  </Typography>
                  <Typography variant="h6">
                    {result.soilVolume} cubic feet
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Organic Matter Needed:
                  </Typography>
                  <Typography variant="h6">
                    {result.omNeeded} lbs
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Compost Needed:
                  </Typography>
                  <Typography variant="h6">
                    {result.compostNeeded} lbs
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Manure Needed:
                  </Typography>
                  <Typography variant="h6">
                    {result.manureNeeded} lbs
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Application Tips:</strong>
                <br />• Apply organic amendments when soil is workable
                <br />• Incorporate materials thoroughly into the soil
                <br />• Water well after application
                <br />• Consider split applications over the season
              </Typography>
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Additional Resources Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Organic Matter Sources and Management
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Common Organic Amendments:</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            1. Compost:
            <br />• Well-decomposed, stable organic matter
            <br />• Excellent for improving soil structure
            <br />• Contains beneficial microorganisms
            <br />• Slow-release nutrients
          </Typography>
          <Typography variant="body2" paragraph>
            2. Animal Manures:
            <br />• Rich in nutrients and organic matter
            <br />• Use well-aged or composted manure
            <br />• Different animals provide different benefits
            <br />• Consider food safety guidelines
          </Typography>
          <Typography variant="body2" paragraph>
            3. Cover Crops:
            <br />• Living source of organic matter
            <br />• Improve soil biology
            <br />• Prevent erosion
            <br />• Can fix nitrogen (legumes)
          </Typography>
          <Typography variant="body2">
            Remember that building organic matter is a long-term process. Consistent additions of organic 
            materials, combined with minimal soil disturbance, will gradually improve soil health and fertility.
          </Typography>
        </CardContent>
      </Card>

      <SocialShare />
    </Box>
  );
};

export default OrganicMatter;
