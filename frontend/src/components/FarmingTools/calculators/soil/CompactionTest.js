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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import { SocialShare } from '../../common/SocialShare';

const CompactionTest = () => {
  const [penetrationDepth, setPenetrationDepth] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('moderate');
  const [soilType, setSoilType] = useState('');
  const [result, setResult] = useState(null);

  const calculateCompaction = () => {
    if (!penetrationDepth || !soilType) return;

    const depth = parseFloat(penetrationDepth);
    let compactionLevel;
    let recommendations = [];

    // Basic compaction assessment
    if (depth < 3) {
      compactionLevel = 'Severe';
      recommendations = [
        'Deep tillage or subsoiling may be necessary',
        'Add organic matter to improve soil structure',
        'Consider cover crops with deep root systems',
        'Minimize traffic on wet soil'
      ];
    } else if (depth < 6) {
      compactionLevel = 'Moderate';
      recommendations = [
        'Incorporate organic matter',
        'Use cover crops to improve soil structure',
        'Avoid working wet soil',
        'Consider reduced tillage practices'
      ];
    } else {
      compactionLevel = 'Low';
      recommendations = [
        'Maintain current soil management practices',
        'Continue monitoring soil compaction',
        'Practice crop rotation',
        'Use mulch to protect soil surface'
      ];
    }

    setResult({
      compactionLevel,
      recommendations,
      penetrationDepth: depth
    });
  };

  return (
    <Box>
      {/* Comprehensive Introduction */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Soil Compaction Test Calculator
        </Typography>
        <Typography variant="body1" paragraph>
          Soil compaction is a critical factor affecting plant growth, water movement, and root development. 
          This calculator helps you assess soil compaction levels and provides specific recommendations for 
          soil management based on your test results.
        </Typography>

        {/* Educational Content Section */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Understanding Soil Compaction
                </Typography>
                <Typography variant="body2" paragraph>
                  Soil compaction occurs when soil particles are pressed together, reducing the pore space between them. 
                  This can lead to:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Restricted Root Growth" 
                      secondary="Roots struggle to penetrate compacted soil, limiting plant growth"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Poor Water Infiltration" 
                      secondary="Water pools on the surface instead of being absorbed"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Reduced Aeration" 
                      secondary="Less oxygen available for root respiration and soil microbes"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Nutrient Deficiencies" 
                      secondary="Limited root access to soil nutrients"
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
                  Causes of Soil Compaction
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Heavy Equipment" 
                      secondary="Machinery traffic, especially on wet soil"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Excessive Tillage" 
                      secondary="Repeated cultivation, particularly at the same depth"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Poor Drainage" 
                      secondary="Consistently wet soil conditions"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Lack of Organic Matter" 
                      secondary="Insufficient soil structure and stability"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Foot Traffic" 
                      secondary="Regular walking paths and high-traffic areas"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* How to Test Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              How to Perform a Soil Compaction Test
            </Typography>
            <Typography variant="body2" paragraph>
              1. Select Your Testing Tool:
              <br />• Use a penetrometer (soil compaction tester) for most accurate results
              <br />• A wire flag or sturdy metal rod can work as an alternative
              <br />• Ensure the tool has measurement markings
            </Typography>
            <Typography variant="body2" paragraph>
              2. Prepare the Test Area:
              <br />• Clear surface debris
              <br />• Mark multiple testing spots for a representative sample
              <br />• Note recent rainfall or irrigation
            </Typography>
            <Typography variant="body2" paragraph>
              3. Perform the Test:
              <br />• Push the testing tool into the soil at a steady rate
              <br />• Note the depth at which resistance increases significantly
              <br />• Record measurements from multiple locations
            </Typography>
            <Typography variant="body2">
              4. Enter your results in the calculator below for analysis
            </Typography>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Pro Tip:</strong> Test when soil moisture is moderate (not too wet or dry) for most accurate results. 
            Different soil types will have different natural resistance levels, so consider your soil type when interpreting results.
          </Typography>
        </Alert>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Calculator Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Calculate Soil Compaction
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Penetration Depth (inches)"
              type="number"
              value={penetrationDepth}
              onChange={(e) => setPenetrationDepth(e.target.value)}
              helperText="Enter the depth at which significant resistance was felt"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Soil Type"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              helperText="Enter your soil type (e.g., clay, loam, sandy)"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Soil Moisture Level</FormLabel>
              <RadioGroup
                row
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(e.target.value)}
              >
                <FormControlLabel value="dry" control={<Radio />} label="Dry" />
                <FormControlLabel value="moderate" control={<Radio />} label="Moderate" />
                <FormControlLabel value="wet" control={<Radio />} label="Wet" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateCompaction}
              fullWidth
            >
              Analyze Compaction
            </Button>
          </Grid>
        </Grid>

        {result && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Compaction Analysis Results
            </Typography>
            <Alert 
              severity={
                result.compactionLevel === 'Severe' ? 'error' : 
                result.compactionLevel === 'Moderate' ? 'warning' : 
                'success'
              }
              sx={{ mb: 3 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Compaction Level: {result.compactionLevel}
              </Typography>
              <Typography variant="body2">
                Based on penetration depth of {result.penetrationDepth} inches
              </Typography>
            </Alert>

            <Typography variant="subtitle1" gutterBottom>
              Recommendations:
            </Typography>
            <List>
              {result.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {/* Additional Resources Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Preventing Soil Compaction
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Best Management Practices:</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            1. Traffic Management:
            <br />• Establish permanent traffic lanes
            <br />• Avoid driving on wet soil
            <br />• Use flotation tires or tracks
            <br />• Minimize unnecessary equipment passes
          </Typography>
          <Typography variant="body2" paragraph>
            2. Soil Structure Improvement:
            <br />• Add organic matter regularly
            <br />• Use cover crops with deep roots
            <br />• Practice crop rotation
            <br />• Maintain good drainage
          </Typography>
          <Typography variant="body2" paragraph>
            3. Timing Considerations:
            <br />• Work soil at proper moisture content
            <br />• Plan operations to avoid wet conditions
            <br />• Allow adequate time for soil to dry
          </Typography>
          <Typography variant="body2">
            Regular monitoring and proactive management are essential for maintaining good soil structure 
            and preventing compaction issues before they become severe.
          </Typography>
        </CardContent>
      </Card>

      <SocialShare />
    </Box>
  );
};

export default CompactionTest;
