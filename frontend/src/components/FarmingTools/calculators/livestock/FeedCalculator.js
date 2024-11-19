import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
  Divider
} from '@mui/material';
import { Pets as LivestockIcon, ExpandMore as ExpandMoreIcon, Info as InfoIcon } from '@mui/icons-material';

// Feed requirements for different livestock types (% of body weight per day)
const feedRequirements = {
  'Beef Cattle': {
    'Maintenance': 0.02,
    'Growing': 0.025,
    'Lactating': 0.03,
    'Finishing': 0.028
  },
  'Dairy Cattle': {
    'Dry': 0.02,
    'Early Lactation': 0.04,
    'Mid Lactation': 0.035,
    'Late Lactation': 0.03
  },
  'Sheep': {
    'Maintenance': 0.02,
    'Pregnant': 0.025,
    'Lactating': 0.035,
    'Growing Lamb': 0.04
  },
  'Goats': {
    'Maintenance': 0.025,
    'Pregnant': 0.03,
    'Lactating': 0.04,
    'Growing Kid': 0.045
  }
};

const FeedCalculator = () => {
  const [formData, setFormData] = useState({
    livestockType: 'Beef Cattle',
    productionStage: 'Maintenance',
    animalWeight: '',
    numberOfAnimals: '',
    feedingDays: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const educationalContent = {
    introduction: {
      title: "Understanding Livestock Feed Requirements",
      content: [
        "Proper feed calculation is crucial for livestock health and production efficiency.",
        "Feed requirements vary based on animal type, life stage, and environmental conditions.",
        "Accurate feed planning helps optimize costs and maintain animal health."
      ]
    },
    feedTypes: [
      {
        type: "Roughages",
        examples: "Hay, silage, pasture",
        benefits: "Provides fiber, maintains rumen health",
        considerations: "Quality varies seasonally"
      },
      {
        type: "Concentrates",
        examples: "Grains, protein meals",
        benefits: "High energy, supports production",
        considerations: "Cost, risk of acidosis"
      },
      {
        type: "Supplements",
        examples: "Minerals, vitamins",
        benefits: "Fills nutritional gaps",
        considerations: "Specific to region and feed quality"
      }
    ],
    bestPractices: [
      {
        title: "Feed Storage",
        content: "Store feed in dry, well-ventilated areas to prevent spoilage"
      },
      {
        title: "Feeding Schedule",
        content: "Maintain consistent feeding times to optimize digestion"
      },
      {
        title: "Water Access",
        content: "Ensure clean water is always available"
      },
      {
        title: "Feed Quality",
        content: "Regularly assess feed quality and adjust rations accordingly"
      }
    ],
    nutritionalNeeds: [
      {
        stage: "Maintenance",
        description: "Basic needs for maintaining body condition",
        considerations: "Adjust for weather conditions"
      },
      {
        stage: "Growth",
        description: "Higher protein and energy needs",
        considerations: "Rate of gain affects requirements"
      },
      {
        stage: "Lactation",
        description: "Peak nutritional demands",
        considerations: "Production level impacts needs"
      },
      {
        stage: "Pregnancy",
        description: "Increased needs in late gestation",
        considerations: "Critical for fetal development"
      }
    ]
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateFeedRequirements = () => {
    if (!formData.animalWeight || !formData.numberOfAnimals || !formData.feedingDays) {
      setError('Please fill in all required fields');
      return;
    }

    const weight = parseFloat(formData.animalWeight);
    const animals = parseInt(formData.numberOfAnimals);
    const days = parseInt(formData.feedingDays);
    const dailyRate = feedRequirements[formData.livestockType][formData.productionStage];

    const dailyFeedPerAnimal = weight * dailyRate;
    const totalDailyFeed = dailyFeedPerAnimal * animals;
    const totalFeedNeeded = totalDailyFeed * days;
    const totalFeedTons = totalFeedNeeded / 2000;

    setResults({
      dailyFeedPerAnimal,
      totalDailyFeed,
      totalFeedNeeded,
      totalFeedTons
    });
    setError('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Livestock Feed Calculator
        <Tooltip title="Calculate feed requirements for your livestock">
          <IconButton size="small" sx={{ ml: 1 }}>
            <LivestockIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Understanding Feed Requirements</Typography>
              {educationalContent.introduction.content.map((text, index) => (
                <Typography key={index} paragraph>{text}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Calculate Feed Requirements</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Livestock Type"
                    name="livestockType"
                    value={formData.livestockType}
                    onChange={handleInputChange}
                  >
                    {Object.keys(feedRequirements).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Production Stage"
                    name="productionStage"
                    value={formData.productionStage}
                    onChange={handleInputChange}
                  >
                    {Object.keys(feedRequirements[formData.livestockType]).map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {stage}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Average Animal Weight (lbs)"
                    name="animalWeight"
                    type="number"
                    value={formData.animalWeight}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Animals"
                    name="numberOfAnimals"
                    type="number"
                    value={formData.numberOfAnimals}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Feeding Period (days)"
                    name="feedingDays"
                    type="number"
                    value={formData.feedingDays}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={calculateFeedRequirements}
                    startIcon={<LivestockIcon />}
                    sx={{ mt: 2 }}
                  >
                    Calculate Feed Requirements
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
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Feed Requirement Results</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Daily Feed per Animal</TableCell>
                        <TableCell>{results.dailyFeedPerAnimal.toFixed(2)} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Daily Feed</TableCell>
                        <TableCell>{results.totalDailyFeed.toFixed(2)} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Feed Needed</TableCell>
                        <TableCell>{results.totalFeedNeeded.toFixed(2)} lbs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Feed (Tons)</TableCell>
                        <TableCell>{results.totalFeedTons.toFixed(2)} tons</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Feeding Guide</Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Feed Types and Characteristics</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Feed Type</TableCell>
                      <TableCell>Examples</TableCell>
                      <TableCell>Benefits</TableCell>
                      <TableCell>Considerations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {educationalContent.feedTypes.map((feed, index) => (
                      <TableRow key={index}>
                        <TableCell>{feed.type}</TableCell>
                        <TableCell>{feed.examples}</TableCell>
                        <TableCell>{feed.benefits}</TableCell>
                        <TableCell>{feed.considerations}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Best Practices</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {educationalContent.bestPractices.map((practice, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          {practice.title}
                        </Typography>
                        <Typography variant="body2">{practice.content}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Nutritional Needs by Life Stage</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {educationalContent.nutritionalNeeds.map((stage, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          {stage.stage}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {stage.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stage.considerations}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeedCalculator;
