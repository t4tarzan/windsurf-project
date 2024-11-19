import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Alert,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Straighten,
  GridOn,
  LocalFlorist,
  Speed
} from '@mui/icons-material';

// Common greenhouse crops and their spacing requirements
const commonCrops = [
  {
    name: 'Tomatoes',
    rowSpacing: 4,
    plantSpacing: 2,
    notes: 'Requires vertical support, benefits from good air circulation'
  },
  {
    name: 'Lettuce',
    rowSpacing: 1.5,
    plantSpacing: 1,
    notes: 'Can be planted densely, good for succession planting'
  },
  {
    name: 'Cucumbers',
    rowSpacing: 4,
    plantSpacing: 1.5,
    notes: 'Needs trellising, heavy feeders'
  },
  {
    name: 'Peppers',
    rowSpacing: 2.5,
    plantSpacing: 1.5,
    notes: 'Moderate spacing, may need support as plants mature'
  }
];

// Environmental considerations
const environmentalFactors = [
  {
    factor: 'Ventilation',
    recommendation: 'Ensure 20-30% of floor area in ventilation capacity',
    importance: 'Critical for temperature control and plant health'
  },
  {
    factor: 'Light Exposure',
    recommendation: 'Orient greenhouse east-west for maximum light exposure',
    importance: 'Affects plant growth and productivity'
  },
  {
    factor: 'Temperature Control',
    recommendation: 'Plan for heating/cooling based on climate',
    importance: 'Maintains optimal growing conditions'
  },
  {
    factor: 'Humidity Management',
    recommendation: 'Include proper air circulation systems',
    importance: 'Prevents disease and promotes healthy growth'
  }
];

const GreenhouseCalculator = () => {
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    rowSpacing: '',
    plantSpacing: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDimensions(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateSpace = () => {
    try {
      // Validate inputs
      const values = Object.values(dimensions);
      if (values.some(val => val === '' || isNaN(val) || Number(val) <= 0)) {
        throw new Error('Please enter valid positive numbers for all fields');
      }

      const length = Number(dimensions.length);
      const width = Number(dimensions.width);
      const height = Number(dimensions.height);
      const rowSpacing = Number(dimensions.rowSpacing);
      const plantSpacing = Number(dimensions.plantSpacing);

      // Calculate results
      const floorArea = length * width;
      const numberOfRows = Math.floor(width / rowSpacing);
      const plantsPerRow = Math.floor(length / plantSpacing);
      const totalPlants = numberOfRows * plantsPerRow;
      const volume = length * width * height;
      const walkwaySpace = floorArea * 0.2; // Assuming 20% for walkways
      const usableSpace = floorArea - walkwaySpace;
      const recommendedVentilation = floorArea * 0.25; // 25% of floor area

      setResults({
        floorArea: floorArea.toFixed(2),
        volume: volume.toFixed(2),
        numberOfRows,
        plantsPerRow,
        totalPlants,
        walkwaySpace: walkwaySpace.toFixed(2),
        usableSpace: usableSpace.toFixed(2),
        recommendedVentilation: recommendedVentilation.toFixed(2)
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Greenhouse Space Calculator
        <Tooltip title="Calculate optimal space usage in your greenhouse based on dimensions and plant spacing requirements">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      {/* Educational Content */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} /> About Greenhouse Planning
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Proper greenhouse planning is crucial for successful plant cultivation. The layout and space utilization
            directly impact plant health, productivity, and ease of maintenance. Consider factors such as walkway space,
            ventilation requirements, and specific crop needs when designing your greenhouse layout.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Key Planning Considerations:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Straighten /></ListItemIcon>
              <ListItemText 
                primary="Dimensions"
                secondary="Choose dimensions that maximize usable space while maintaining proper airflow"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><GridOn /></ListItemIcon>
              <ListItemText 
                primary="Layout"
                secondary="Plan for adequate walkways (typically 20% of floor space) and work areas"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><LocalFlorist /></ListItemIcon>
              <ListItemText 
                primary="Plant Spacing"
                secondary="Consider mature plant size and maintenance requirements when planning spacing"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Speed /></ListItemIcon>
              <ListItemText 
                primary="Environmental Control"
                secondary="Include space for ventilation, heating, and cooling systems"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Calculator Input Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Calculate Your Greenhouse Space
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Greenhouse Length"
                name="length"
                value={dimensions.length}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
                helperText="Enter the total length of your greenhouse"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Greenhouse Width"
                name="width"
                value={dimensions.width}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
                helperText="Enter the total width of your greenhouse"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Greenhouse Height"
                name="height"
                value={dimensions.height}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
                helperText="Enter the peak height of your greenhouse"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Row Spacing"
                name="rowSpacing"
                value={dimensions.rowSpacing}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
                helperText="Distance between plant rows"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Plant Spacing"
                name="plantSpacing"
                value={dimensions.plantSpacing}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ft</InputAdornment>
                }}
                helperText="Distance between plants in a row"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={calculateSpace}
                sx={{ mt: 2 }}
              >
                Calculate Space
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
                    <TableCell><strong>Total Floor Area</strong></TableCell>
                    <TableCell>{results.floorArea} sq ft</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Greenhouse Volume</strong></TableCell>
                    <TableCell>{results.volume} cu ft</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Number of Plant Rows</strong></TableCell>
                    <TableCell>{results.numberOfRows}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Plants per Row</strong></TableCell>
                    <TableCell>{results.plantsPerRow}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Total Plant Capacity</strong></TableCell>
                    <TableCell>{results.totalPlants}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Walkway Space</strong></TableCell>
                    <TableCell>{results.walkwaySpace} sq ft</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Usable Growing Space</strong></TableCell>
                    <TableCell>{results.usableSpace} sq ft</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Recommended Ventilation Area</strong></TableCell>
                    <TableCell>{results.recommendedVentilation} sq ft</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Common Crops Guide */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Common Greenhouse Crops & Spacing
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Crop</strong></TableCell>
                  <TableCell><strong>Row Spacing (ft)</strong></TableCell>
                  <TableCell><strong>Plant Spacing (ft)</strong></TableCell>
                  <TableCell><strong>Notes</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commonCrops.map((crop) => (
                  <TableRow key={crop.name}>
                    <TableCell>{crop.name}</TableCell>
                    <TableCell>{crop.rowSpacing}</TableCell>
                    <TableCell>{crop.plantSpacing}</TableCell>
                    <TableCell>{crop.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Environmental Considerations */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            Environmental Considerations
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {environmentalFactors.map((factor, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {factor.factor}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {factor.recommendation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {factor.importance}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default GreenhouseCalculator;
