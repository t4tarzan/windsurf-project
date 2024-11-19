import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Divider,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  BugReport as BugIcon,
  LocalFlorist as PlantIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const pestDatabase = {
  'aphids': {
    name: 'Aphids',
    type: 'Insect',
    description: 'Small, soft-bodied insects that cluster on new growth',
    symptoms: [
      'Curled or distorted leaves',
      'Sticky honeydew on leaves',
      'Yellowing leaves',
      'Stunted growth'
    ],
    affectedCrops: ['tomatoes', 'peppers', 'cabbage', 'beans', 'lettuce'],
    identificationTips: [
      'Look for clusters on new growth',
      'Check undersides of leaves',
      'Various colors (green, black, red)',
      'Presence of ants'
    ],
    severity: 'moderate',
    naturalControls: [
      'Ladybugs',
      'Lacewings',
      'Parasitic wasps',
      'Neem oil spray'
    ]
  },
  'cabbage_worms': {
    name: 'Cabbage Worms',
    type: 'Insect',
    description: 'Green caterpillars that feed on brassica crops',
    symptoms: [
      'Large holes in leaves',
      'Presence of green droppings',
      'Damaged plant heads',
      'Reduced yield'
    ],
    affectedCrops: ['cabbage', 'broccoli', 'kale', 'cauliflower', 'brussels sprouts'],
    identificationTips: [
      'Look for velvety green caterpillars',
      'White butterflies nearby',
      'Irregular holes in leaves',
      'Clusters of yellow eggs'
    ],
    severity: 'high',
    naturalControls: [
      'Row covers',
      'Bacillus thuringiensis (Bt)',
      'Hand picking',
      'Companion planting with herbs'
    ]
  },
  'tomato_hornworm': {
    name: 'Tomato Hornworm',
    type: 'Insect',
    description: 'Large green caterpillars with white stripes and a horn',
    symptoms: [
      'Defoliated plants',
      'Damaged fruit',
      'Black droppings',
      'Stripped stems'
    ],
    affectedCrops: ['tomatoes', 'peppers', 'eggplants', 'potatoes'],
    identificationTips: [
      'Look for large green caterpillars',
      'V-shaped white markings',
      'Red horn on rear',
      'Extensive defoliation'
    ],
    severity: 'high',
    naturalControls: [
      'Hand picking',
      'Parasitic wasps',
      'Bt spray',
      'Companion planting with dill'
    ]
  },
  'squash_bugs': {
    name: 'Squash Bugs',
    type: 'Insect',
    description: 'Gray-brown bugs that feed on squash family plants',
    symptoms: [
      'Wilting leaves',
      'Yellow spotting',
      'Death of young plants',
      'Damaged fruit'
    ],
    affectedCrops: ['squash', 'pumpkins', 'cucumbers', 'melons'],
    identificationTips: [
      'Look for brown, shield-shaped adults',
      'Clusters of bronze eggs',
      'Check under leaves',
      'Early morning inspection'
    ],
    severity: 'moderate',
    naturalControls: [
      'Row covers',
      'Trap crops',
      'Hand picking',
      'Neem oil'
    ]
  },
  'spider_mites': {
    name: 'Spider Mites',
    type: 'Arachnid',
    description: 'Tiny spider-like pests that cause stippling on leaves',
    symptoms: [
      'Stippled leaves',
      'Webbing on plants',
      'Bronzing of leaves',
      'Plant death in severe cases'
    ],
    affectedCrops: ['tomatoes', 'cucumbers', 'melons', 'beans', 'strawberries'],
    identificationTips: [
      'Look for fine webbing',
      'Tap leaves over white paper',
      'Use magnifying glass',
      'Check undersides of leaves'
    ],
    severity: 'high',
    naturalControls: [
      'Predatory mites',
      'Strong water spray',
      'Neem oil',
      'Maintain humidity'
    ]
  }
};

const PestIdentification = () => {
  const [selectedPest, setSelectedPest] = useState('');
  const [searchSymptom, setSearchSymptom] = useState('');
  const [searchCrop, setSearchCrop] = useState('');
  const [filteredPests, setFilteredPests] = useState([]);

  const handlePestSelect = (event) => {
    setSelectedPest(event.target.value);
  };

  const searchPests = () => {
    const results = Object.entries(pestDatabase).filter(([_, pest]) => {
      const matchesSymptom = searchSymptom === '' || 
        pest.symptoms.some(s => s.toLowerCase().includes(searchSymptom.toLowerCase()));
      const matchesCrop = searchCrop === '' ||
        pest.affectedCrops.some(c => c.toLowerCase().includes(searchCrop.toLowerCase()));
      return matchesSymptom && matchesCrop;
    });
    setFilteredPests(results);
  };

  const renderSeverityChip = (severity) => {
    const color = {
      low: 'success',
      moderate: 'warning',
      high: 'error'
    }[severity];

    return (
      <Chip
        icon={<WarningIcon />}
        label={severity.toUpperCase()}
        color={color}
        size="small"
        sx={{ ml: 1 }}
      />
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Pest Identification Guide
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Identify common garden pests and learn about control methods.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Known Pest</InputLabel>
              <Select
                value={selectedPest}
                label="Select Known Pest"
                onChange={handlePestSelect}
              >
                {Object.entries(pestDatabase).map(([key, pest]) => (
                  <MenuItem key={key} value={key}>
                    {pest.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search by Symptom"
              value={searchSymptom}
              onChange={(e) => setSearchSymptom(e.target.value)}
              placeholder="e.g., wilting, holes, yellow"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search by Affected Crop"
              value={searchCrop}
              onChange={(e) => setSearchCrop(e.target.value)}
              placeholder="e.g., tomatoes, cabbage"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={searchPests}
              disabled={!searchSymptom && !searchCrop}
            >
              Search Pests
            </Button>
          </Grid>
        </Grid>

        {selectedPest && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              {pestDatabase[selectedPest].name}
              {renderSeverityChip(pestDatabase[selectedPest].severity)}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <BugIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Description
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {pestDatabase[selectedPest].description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Identification Tips
                  </Typography>
                  {pestDatabase[selectedPest].identificationTips.map((tip, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      • {tip}
                    </Typography>
                  ))}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <PlantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Symptoms
                  </Typography>
                  {pestDatabase[selectedPest].symptoms.map((symptom, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      • {symptom}
                    </Typography>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Natural Control Methods
                  </Typography>
                  {pestDatabase[selectedPest].naturalControls.map((control, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      • {control}
                    </Typography>
                  ))}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Affected Crops
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {pestDatabase[selectedPest].affectedCrops.map((crop) => (
                      <Chip
                        key={crop}
                        label={crop}
                        sx={{ m: 0.5 }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {filteredPests.length > 0 && !selectedPest && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            {filteredPests.map(([key, pest]) => (
              <Accordion key={key} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    {pest.name}
                    {renderSeverityChip(pest.severity)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {pest.description}
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom>
                        Symptoms
                      </Typography>
                      {pest.symptoms.map((symptom, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                          • {symptom}
                        </Typography>
                      ))}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Affected Crops
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {pest.affectedCrops.map((crop) => (
                          <Chip
                            key={crop}
                            label={crop}
                            sx={{ m: 0.5 }}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Natural Controls
                      </Typography>
                      {pest.naturalControls.map((control, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                          • {control}
                        </Typography>
                      ))}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {!selectedPest && filteredPests.length === 0 && (searchSymptom || searchCrop) && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No pests found matching your search criteria.
            </Typography>
          </Box>
        )}

        {!selectedPest && !searchSymptom && !searchCrop && (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pest</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Severity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(pestDatabase).map(([key, pest]) => (
                  <TableRow key={key}>
                    <TableCell>{pest.name}</TableCell>
                    <TableCell>{pest.type}</TableCell>
                    <TableCell>{pest.description}</TableCell>
                    <TableCell>
                      {renderSeverityChip(pest.severity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PestIdentification;
