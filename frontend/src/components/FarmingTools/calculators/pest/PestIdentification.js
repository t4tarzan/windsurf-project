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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  BugReport as BugIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import PestInfoCard from '../../components/pest/PestInfoCard';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `The Pest Identification Tool helps farmers accurately identify crop pests through their characteristics and symptoms. Early and accurate pest identification is crucial for effective pest management.`,
  
  importancePoints: [
    {
      title: 'Early Detection',
      content: 'Identifying pests early allows for timely intervention before significant damage occurs.'
    },
    {
      title: 'Targeted Treatment',
      content: 'Proper identification ensures the most effective treatment methods are used.'
    },
    {
      title: 'Cost Efficiency',
      content: 'Accurate identification prevents wastage of resources on incorrect treatments.'
    }
  ],
  
  bestPractices: [
    'Regular crop inspection',
    'Document pest characteristics',
    'Monitor pest patterns',
    'Consider environmental factors',
    'Consult reference materials'
  ]
};

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPest, setSelectedPest] = useState('');
  const [filteredPests, setFilteredPests] = useState([]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term) {
      const filtered = Object.entries(pestDatabase).filter(([key, pest]) => {
        return pest.name.toLowerCase().includes(term) ||
               pest.type.toLowerCase().includes(term) ||
               pest.symptoms.some(symptom => symptom.toLowerCase().includes(term)) ||
               pest.affectedCrops.some(crop => crop.toLowerCase().includes(term));
      });
      setFilteredPests(filtered);
    } else {
      setFilteredPests([]);
    }
  };

  const handlePestSelect = (event) => {
    setSelectedPest(event.target.value);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Pest Identification Tool
        </Typography>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">About Pest Identification</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
            <Grid container spacing={2}>
              {educationalContent.importancePoints.map((point) => (
                <Grid item xs={12} md={4} key={point.title}>
                  <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {point.title}
                    </Typography>
                    <Typography variant="body2">
                      {point.content}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Best Practices</Typography>
              <Grid container spacing={1}>
                {educationalContent.bestPractices.map((practice, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Typography variant="body2">• {practice}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Pests"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Pest</InputLabel>
                <Select
                  value={selectedPest}
                  onChange={handlePestSelect}
                  label="Select Pest"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Object.entries(pestDatabase).map(([key, pest]) => (
                    <MenuItem value={key} key={key}>
                      {pest.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {searchTerm && filteredPests.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            {filteredPests.map(([key, pest]) => (
              <PestInfoCard key={key} pest={pest} />
            ))}
          </Box>
        )}

        {selectedPest && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Selected Pest Details
            </Typography>
            <PestInfoCard pest={pestDatabase[selectedPest]} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PestIdentification;
