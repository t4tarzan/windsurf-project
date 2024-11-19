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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Straighten as MeasureIcon,
  Landscape as BedIcon,
  Architecture as DesignIcon
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `The Raised Bed Planner helps gardeners design efficient and productive raised bed layouts. Proper planning ensures optimal use of space, easy maintenance access, and ideal growing conditions for plants.`,
  
  designConsiderations: [
    {
      factor: 'Bed Dimensions',
      description: 'Optimal size for accessibility and plant growth',
      guidelines: [
        'Width: 3-4 feet for easy reach from both sides',
        'Length: Based on available space and materials',
        'Height: 6-24 inches depending on crops and soil needs'
      ]
    },
    {
      factor: 'Path Planning',
      description: 'Access routes between beds',
      guidelines: [
        'Main paths: 24-36 inches wide',
        'Secondary paths: 18-24 inches wide',
        'Wheelchair access: 36-48 inches wide'
      ]
    },
    {
      factor: 'Orientation',
      description: 'Optimal bed positioning',
      guidelines: [
        'North-south orientation for even sun exposure',
        'Consider wind patterns and shade',
        'Account for water access points'
      ]
    }
  ],

  constructionGuidelines: {
    materials: {
      description: 'Common building materials',
      options: [
        'Cedar or redwood boards',
        'Composite lumber',
        'Concrete blocks',
        'Galvanized metal'
      ],
      considerations: [
        'Durability and longevity',
        'Cost effectiveness',
        'Environmental impact',
        'Local availability'
      ]
    },
    soil: {
      description: 'Soil mix recommendations',
      components: [
        '40% quality topsoil',
        '30% compost',
        '20% vermiculite',
        '10% perlite'
      ],
      depth: [
        'Shallow rooted crops: 6-12 inches',
        'Medium rooted crops: 12-18 inches',
        'Deep rooted crops: 18-24 inches'
      ]
    }
  },

  maintenanceConsiderations: [
    'Install irrigation systems before filling with soil',
    'Plan for seasonal soil amendments',
    'Consider future bed expansion',
    'Include vertical growing supports if needed',
    'Plan for crop rotation',
    'Account for companion planting'
  ],

  commonMistakes: [
    'Making beds too wide to reach center',
    'Insufficient path width for wheelbarrows',
    'Poor drainage planning',
    'Inadequate soil depth for crops',
    'Overlooking irrigation access',
    'Not considering sun exposure patterns'
  ]
};

const RaisedBedPlanner = () => {
  const [inputs, setInputs] = useState({
    bedLength: '',
    bedWidth: '',
    plantSpacing: '',
    rowSpacing: '',
    pathWidth: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateLayout = () => {
    try {
      // Validate inputs
      if (Object.values(inputs).some(val => val === '')) {
        throw new Error('Please fill in all fields');
      }

      const length = Number(inputs.bedLength);
      const width = Number(inputs.bedWidth);
      const plantSpacing = Number(inputs.plantSpacing);
      const rowSpacing = Number(inputs.rowSpacing);
      const pathWidth = Number(inputs.pathWidth);

      if ([length, width, plantSpacing, rowSpacing, pathWidth].some(val => isNaN(val) || val <= 0)) {
        throw new Error('Please enter valid positive numbers for all measurements');
      }

      // Calculate number of plants and rows
      const numRows = Math.floor((width - pathWidth) / rowSpacing);
      const plantsPerRow = Math.floor(length / plantSpacing);
      const totalPlants = numRows * plantsPerRow;

      // Calculate area utilization
      const totalArea = length * width;
      const pathArea = length * pathWidth;
      const plantingArea = totalArea - pathArea;
      const utilizationRate = (plantingArea / totalArea) * 100;

      // Generate planting grid visualization data
      const grid = Array(numRows).fill().map(() => Array(plantsPerRow).fill('🌱'));

      setResults({
        numRows,
        plantsPerRow,
        totalPlants,
        totalArea,
        plantingArea,
        pathArea,
        utilizationRate: utilizationRate.toFixed(1),
        grid,
        recommendations: [
          'Consider companion planting to maximize space efficiency',
          'Add vertical growing supports for climbing plants',
          'Use succession planting to maintain continuous harvests',
          'Install drip irrigation along plant rows',
          `Leave ${pathWidth}" paths for easy access and maintenance`
        ]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Educational Content Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BedIcon sx={{ mr: 1 }} />
            Raised Bed Planner
          </Typography>
          <Typography paragraph color="text.secondary">
            {educationalContent.introduction}
          </Typography>
        </CardContent>
      </Card>

      {/* Design Considerations */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <DesignIcon sx={{ mr: 1 }} />
            Design Considerations
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {educationalContent.designConsiderations.map((consideration, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Typography variant="subtitle1" gutterBottom>
                  {consideration.factor}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {consideration.description}
                </Typography>
                <List dense>
                  {consideration.guidelines.map((guideline, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={guideline} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Construction Guidelines */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <MeasureIcon sx={{ mr: 1 }} />
            Construction Guidelines
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Materials
              </Typography>
              <List>
                {educationalContent.constructionGuidelines.materials.options.map((material, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={material} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle2" gutterBottom>
                Key Considerations:
              </Typography>
              <List dense>
                {educationalContent.constructionGuidelines.materials.considerations.map((consideration, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={consideration} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Soil Mix
              </Typography>
              <List>
                {educationalContent.constructionGuidelines.soil.components.map((component, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={component} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle2" gutterBottom>
                Depth Requirements:
              </Typography>
              <List dense>
                {educationalContent.constructionGuidelines.soil.depth.map((depth, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={depth} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Calculator Section */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Raised Bed Planner
          <Tooltip title="Plan optimal plant spacing and layout for your raised bed garden">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Bed Length"
                  name="bedLength"
                  value={inputs.bedLength}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">inches</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Bed Width"
                  name="bedWidth"
                  value={inputs.bedWidth}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">inches</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Plant Spacing"
                  name="plantSpacing"
                  value={inputs.plantSpacing}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">inches</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Row Spacing"
                  name="rowSpacing"
                  value={inputs.rowSpacing}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">inches</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Path Width"
                  name="pathWidth"
                  value={inputs.pathWidth}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">inches</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={calculateLayout} sx={{ mt: 2 }}>
                  Calculate Layout
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {results && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Layout Summary</Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Number of Rows</TableCell>
                          <TableCell>{results.numRows}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Plants per Row</TableCell>
                          <TableCell>{results.plantsPerRow}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Plants</TableCell>
                          <TableCell>{results.totalPlants}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Area</TableCell>
                          <TableCell>{results.totalArea} sq inches</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Planting Area</TableCell>
                          <TableCell>{results.plantingArea} sq inches</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Path Area</TableCell>
                          <TableCell>{results.pathArea} sq inches</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Space Utilization</TableCell>
                          <TableCell>{results.utilizationRate}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Planting Grid</Typography>
                  <Box sx={{ 
                    overflowX: 'auto', 
                    fontFamily: 'monospace',
                    whiteSpace: 'pre',
                    backgroundColor: '#f5f5f5',
                    p: 2,
                    borderRadius: 1
                  }}>
                    {results.grid.map((row, i) => (
                      <div key={i}>{row.join(' ')}</div>
                    ))}
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2 }}>Recommendations</Typography>
                  <ul>
                    {results.recommendations.map((rec, index) => (
                      <li key={index}><Typography>{rec}</Typography></li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Maintenance Tips */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} />
            Maintenance & Common Mistakes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Maintenance Considerations
              </Typography>
              <List>
                {educationalContent.maintenanceConsiderations.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Common Mistakes to Avoid
              </Typography>
              <List>
                {educationalContent.commonMistakes.map((mistake, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={mistake} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default RaisedBedPlanner;
