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
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { Info as InfoIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const CompostCalculator = () => {
  const [inputs, setInputs] = useState({
    greenWeight: '',
    brownWeight: '',
    moisture: 50,
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const materials = {
    green: [
      { name: 'Grass Clippings', carbonNitrogen: 20 },
      { name: 'Kitchen Scraps', carbonNitrogen: 15 },
      { name: 'Coffee Grounds', carbonNitrogen: 20 },
      { name: 'Fresh Manure', carbonNitrogen: 15 },
      { name: 'Garden Waste', carbonNitrogen: 25 }
    ],
    brown: [
      { name: 'Dry Leaves', carbonNitrogen: 60 },
      { name: 'Straw', carbonNitrogen: 80 },
      { name: 'Cardboard', carbonNitrogen: 350 },
      { name: 'Wood Chips', carbonNitrogen: 400 },
      { name: 'Paper', carbonNitrogen: 170 }
    ]
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateCompost = () => {
    try {
      // Validate inputs
      const greenWeight = Number(inputs.greenWeight);
      const brownWeight = Number(inputs.brownWeight);
      const moisture = Number(inputs.moisture);

      if (isNaN(greenWeight) || isNaN(brownWeight)) {
        throw new Error('Please enter valid numbers for material weights');
      }

      if (greenWeight <= 0 || brownWeight <= 0) {
        throw new Error('Material weights must be greater than zero');
      }

      // Calculate ratios
      const totalWeight = greenWeight + brownWeight;
      const greenRatio = greenWeight / totalWeight;
      const brownRatio = brownWeight / totalWeight;

      // Ideal moisture is between 40-60%
      const moistureStatus = moisture < 40 ? 'Too Dry' : moisture > 60 ? 'Too Wet' : 'Optimal';

      // Calculate approximate C:N ratio
      // Assuming average C:N ratios: Green = 20:1, Brown = 60:1
      const averageGreenCN = 20;
      const averageBrownCN = 60;
      const estimatedCNRatio = (brownWeight * averageBrownCN + greenWeight * averageGreenCN) / totalWeight;

      // Determine if adjustments are needed
      const idealCNRatio = 30; // The ideal C:N ratio is around 30:1
      let adjustment = '';
      if (estimatedCNRatio < 25) {
        adjustment = 'Add more brown materials (carbon-rich)';
      } else if (estimatedCNRatio > 35) {
        adjustment = 'Add more green materials (nitrogen-rich)';
      } else {
        adjustment = 'Ratio is optimal';
      }

      setResults({
        totalWeight,
        greenRatio: (greenRatio * 100).toFixed(1),
        brownRatio: (brownRatio * 100).toFixed(1),
        estimatedCNRatio: estimatedCNRatio.toFixed(1),
        moistureStatus,
        adjustment,
        recommendations: [
          'Turn pile every 1-2 weeks',
          'Maintain moisture like a wrung-out sponge',
          'Keep pile size between 3-5 cubic feet',
          'Chop materials for faster decomposition',
          'Monitor temperature (135-150°F ideal)'
        ],
        materials: {
          green: [
            'Fresh grass clippings',
            'Kitchen scraps',
            'Coffee grounds',
            'Fresh manure',
            'Green leaves'
          ],
          brown: [
            'Dry leaves',
            'Straw',
            'Cardboard',
            'Wood chips',
            'Newspaper'
          ]
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const educationalContent = {
    introduction: {
      title: "Understanding Composting",
      content: [
        "Composting is a natural process that transforms organic waste into nutrient-rich soil amendment.",
        "Successful composting requires balancing four key elements: carbon (browns), nitrogen (greens), moisture, and oxygen.",
        "The ideal carbon-to-nitrogen (C:N) ratio for efficient composting is approximately 30:1.",
      ]
    },
    materials: {
      green: [
        { name: 'Grass Clippings', carbonNitrogen: 20, tips: 'Let wilt before adding to prevent matting' },
        { name: 'Kitchen Scraps', carbonNitrogen: 15, tips: 'Avoid meat, dairy, and oils' },
        { name: 'Coffee Grounds', carbonNitrogen: 20, tips: 'Filters can be included' },
        { name: 'Fresh Manure', carbonNitrogen: 15, tips: 'Use only from herbivores' },
        { name: 'Garden Waste', carbonNitrogen: 25, tips: 'Chop into smaller pieces' }
      ],
      brown: [
        { name: 'Dry Leaves', carbonNitrogen: 60, tips: 'Shred to prevent matting' },
        { name: 'Straw', carbonNitrogen: 80, tips: 'Break into smaller pieces' },
        { name: 'Cardboard', carbonNitrogen: 350, tips: 'Remove tape and shred' },
        { name: 'Wood Chips', carbonNitrogen: 400, tips: 'Use sparingly - slow to decompose' },
        { name: 'Paper', carbonNitrogen: 170, tips: 'Shred and avoid glossy paper' }
      ]
    },
    bestPractices: [
      {
        title: "Temperature Management",
        content: "Maintain temperatures between 135-150°F (57-66°C) for optimal decomposition and pathogen elimination."
      },
      {
        title: "Moisture Control",
        content: "Keep material as moist as a wrung-out sponge (40-60% moisture). Too wet or dry will slow decomposition."
      },
      {
        title: "Aeration",
        content: "Turn pile every 1-2 weeks to provide oxygen and speed up decomposition process."
      },
      {
        title: "Particle Size",
        content: "Smaller particles (½ to 1½ inches) decompose faster but need more frequent turning."
      },
      {
        title: "Pile Size",
        content: "Maintain pile size between 3x3x3 feet to 5x5x5 feet for optimal heat retention and airflow."
      }
    ],
    troubleshooting: [
      {
        problem: "Bad Odor",
        solution: "Too wet or compacted. Add brown materials and turn pile for better aeration."
      },
      {
        problem: "Slow Decomposition",
        solution: "Check moisture, particle size, and C:N ratio. Ensure proper aeration."
      },
      {
        problem: "Attracting Pests",
        solution: "Bury food scraps in center of pile and avoid meat/dairy products."
      }
    ]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Compost Calculator & Guide
        <Tooltip title="Calculate optimal ratios and learn composting best practices">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Introduction</Typography>
              {educationalContent.introduction.content.map((text, index) => (
                <Typography key={index} paragraph>{text}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Calculate Your Compost Mix</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Green Materials Weight"
                    name="greenWeight"
                    value={inputs.greenWeight}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">lbs</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Brown Materials Weight"
                    name="brownWeight"
                    value={inputs.brownWeight}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">lbs</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>Moisture Level</Typography>
                  <Slider
                    value={inputs.moisture}
                    onChange={(e, newValue) => handleInputChange({ target: { name: 'moisture', value: newValue }})}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={calculateCompost} sx={{ mt: 2 }}>
                    Calculate Ratios
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Grid>
        )}

        {results && (
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Composition Analysis</Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Total Weight</TableCell>
                            <TableCell>{results.totalWeight} lbs</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Green Materials Ratio</TableCell>
                            <TableCell>{results.greenRatio}%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Brown Materials Ratio</TableCell>
                            <TableCell>{results.brownRatio}%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Estimated C:N Ratio</TableCell>
                            <TableCell>{results.estimatedCNRatio}:1</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Moisture Status</TableCell>
                            <TableCell>{results.moistureStatus}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Recommended Adjustment</TableCell>
                            <TableCell>{results.adjustment}</TableCell>
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
                    <Typography variant="h6" gutterBottom>Material Examples</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Green Materials (Nitrogen-rich)
                        </Typography>
                        <ul>
                          {results.materials.green.map((material, index) => (
                            <li key={index}><Typography>{material}</Typography></li>
                          ))}
                        </ul>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Brown Materials (Carbon-rich)
                        </Typography>
                        <ul>
                          {results.materials.brown.map((material, index) => (
                            <li key={index}><Typography>{material}</Typography></li>
                          ))}
                        </ul>
                      </Grid>
                    </Grid>
                    <Typography variant="h6" sx={{ mt: 2 }}>Composting Tips</Typography>
                    <ul>
                      {results.recommendations.map((rec, index) => (
                        <li key={index}><Typography>{rec}</Typography></li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Composting Guide</Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Material Guide</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Green Materials (Nitrogen-rich)
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Material</TableCell>
                          <TableCell>C:N Ratio</TableCell>
                          <TableCell>Tips</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {educationalContent.materials.green.map((material, index) => (
                          <TableRow key={index}>
                            <TableCell>{material.name}</TableCell>
                            <TableCell>{material.carbonNitrogen}:1</TableCell>
                            <TableCell>{material.tips}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Brown Materials (Carbon-rich)
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Material</TableCell>
                          <TableCell>C:N Ratio</TableCell>
                          <TableCell>Tips</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {educationalContent.materials.brown.map((material, index) => (
                          <TableRow key={index}>
                            <TableCell>{material.name}</TableCell>
                            <TableCell>{material.carbonNitrogen}:1</TableCell>
                            <TableCell>{material.tips}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Best Practices</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {educationalContent.bestPractices.map((practice, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          {practice.title}
                        </Typography>
                        <Typography>{practice.content}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Troubleshooting Guide</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Problem</TableCell>
                      <TableCell>Solution</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {educationalContent.troubleshooting.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.problem}</TableCell>
                        <TableCell>{item.solution}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompostCalculator;
