import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital as TreatmentIcon,
  Nature as OrganicIcon,
  Science as ChemicalIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import TreatmentCard from '../../components/pest/TreatmentCard';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `The Treatment Guide provides comprehensive information about various pest and disease control methods, including both organic and chemical options. This tool helps farmers make informed decisions about treatment strategies.`,
  
  treatmentTypes: [
    {
      type: 'Cultural Control',
      description: 'Methods that modify the environment or farming practices to reduce pest problems.',
      examples: ['Crop rotation', 'Companion planting', 'Sanitation', 'Timing of planting']
    },
    {
      type: 'Biological Control',
      description: 'Using natural enemies to control pests.',
      examples: ['Beneficial insects', 'Predatory mites', 'Parasitic wasps', 'Microbial pesticides']
    },
    {
      type: 'Chemical Control',
      description: 'Using synthetic pesticides when other methods are insufficient.',
      examples: ['Insecticides', 'Fungicides', 'Herbicides', 'Growth regulators']
    }
  ],
  
  bestPractices: [
    'Start with least toxic options first',
    'Consider environmental impact',
    'Follow label instructions carefully',
    'Monitor treatment effectiveness',
    'Rotate treatments to prevent resistance'
  ]
};

const treatmentDatabase = {
  'organic_sprays': {
    name: 'Organic Sprays',
    type: 'Organic',
    description: 'Natural liquid treatments derived from plants or minerals',
    treatments: [
      {
        name: 'Neem Oil',
        effectiveness: 4,
        targetPests: ['aphids', 'mites', 'whiteflies', 'mealybugs'],
        application: 'Spray on leaves every 7-14 days',
        precautions: [
          'Apply in early morning or evening',
          'Avoid spraying during flowering',
          'Test on small area first'
        ],
        organicCertified: true,
        residualPeriod: '3-7 days'
      },
      {
        name: 'Pyrethrin',
        effectiveness: 4,
        targetPests: ['beetles', 'caterpillars', 'leafhoppers', 'aphids'],
        application: 'Spray directly on pests as needed',
        precautions: [
          'Toxic to bees and aquatic organisms',
          'Apply when bees are not active',
          'Avoid water contamination'
        ],
        organicCertified: true,
        residualPeriod: '1-3 days'
      },
      {
        name: 'Insecticidal Soap',
        effectiveness: 3,
        targetPests: ['aphids', 'mites', 'thrips', 'whiteflies'],
        application: 'Spray thoroughly on both sides of leaves',
        precautions: [
          'May harm tender plants',
          'Test on small area first',
          'Reapply after rain'
        ],
        organicCertified: true,
        residualPeriod: '1-2 days'
      }
    ]
  },
  'biological_control': {
    name: 'Biological Control',
    type: 'Organic',
    description: 'Using natural predators and parasites to control pests',
    treatments: [
      {
        name: 'Ladybugs',
        effectiveness: 4,
        targetPests: ['aphids', 'mites', 'scale insects', 'whiteflies'],
        application: 'Release in evening near infested plants',
        precautions: [
          'Provide water source',
          'Release in enclosed area if possible',
          'Create habitat to retain them'
        ],
        organicCertified: true,
        residualPeriod: 'Ongoing if established'
      },
      {
        name: 'Parasitic Wasps',
        effectiveness: 4,
        targetPests: ['caterpillars', 'aphids', 'whiteflies', 'beetles'],
        application: 'Release near pest populations',
        precautions: [
          'Avoid pesticide use',
          'Provide nectar sources',
          'May take time to establish'
        ],
        organicCertified: true,
        residualPeriod: 'Ongoing if established'
      },
      {
        name: 'Beneficial Nematodes',
        effectiveness: 3,
        targetPests: ['soil insects', 'grubs', 'root pests'],
        application: 'Apply to moist soil when warm',
        precautions: [
          'Keep soil moist',
          'Apply in evening',
          'Store properly before use'
        ],
        organicCertified: true,
        residualPeriod: '2-4 weeks'
      }
    ]
  },
  'cultural_control': {
    name: 'Cultural Control',
    type: 'Preventive',
    description: 'Management practices that prevent or reduce pest problems',
    treatments: [
      {
        name: 'Crop Rotation',
        effectiveness: 5,
        targetPests: ['soil-borne diseases', 'nematodes', 'insects'],
        application: 'Plan 3-4 year rotation cycles',
        precautions: [
          'Consider plant families',
          'Keep good records',
          'Include cover crops'
        ],
        organicCertified: true,
        residualPeriod: 'Long-term'
      },
      {
        name: 'Companion Planting',
        effectiveness: 3,
        targetPests: ['various insects', 'soil pests'],
        application: 'Plant compatible crops together',
        precautions: [
          'Research combinations',
          'Consider spacing',
          'Monitor effectiveness'
        ],
        organicCertified: true,
        residualPeriod: 'Season-long'
      },
      {
        name: 'Physical Barriers',
        effectiveness: 4,
        targetPests: ['flying insects', 'crawling insects', 'birds'],
        application: 'Install before pest presence',
        precautions: [
          'Maintain integrity',
          'Allow for ventilation',
          'Remove for pollination if needed'
        ],
        organicCertified: true,
        residualPeriod: 'Until removed'
      }
    ]
  },
  'chemical_control': {
    name: 'Chemical Control',
    type: 'Synthetic',
    description: 'Synthetic pesticides for severe infestations',
    treatments: [
      {
        name: 'Synthetic Pyrethroids',
        effectiveness: 5,
        targetPests: ['wide range of insects'],
        application: 'Spray according to label',
        precautions: [
          'Follow safety guidelines',
          'Observe pre-harvest interval',
          'Protect beneficial insects'
        ],
        organicCertified: false,
        residualPeriod: '7-14 days'
      },
      {
        name: 'Systemic Insecticides',
        effectiveness: 5,
        targetPests: ['sucking insects', 'boring insects'],
        application: 'Apply to soil or spray on leaves',
        precautions: [
          'Long residual period',
          'Can affect beneficials',
          'Follow label strictly'
        ],
        organicCertified: false,
        residualPeriod: '2-4 weeks'
      }
    ]
  }
};

const TreatmentGuide = () => {
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTreatments, setFilteredTreatments] = useState([]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term) {
      const filtered = Object.entries(treatmentDatabase).filter(([key, treatment]) => {
        return treatment.name.toLowerCase().includes(term) ||
               treatment.type.toLowerCase().includes(term) ||
               treatment.targetPests.some(pest => pest.toLowerCase().includes(term));
      });
      setFilteredTreatments(filtered);
    } else {
      setFilteredTreatments([]);
    }
  };

  const handleTypeSelect = (event) => {
    setSelectedType(event.target.value);
    if (event.target.value) {
      const filtered = Object.entries(treatmentDatabase).filter(([key, treatment]) => 
        treatment.type === event.target.value
      );
      setFilteredTreatments(filtered);
    } else {
      setFilteredTreatments([]);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Treatment Guide
        </Typography>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">About Treatment Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
            <Grid container spacing={2}>
              {educationalContent.treatmentTypes.map((type) => (
                <Grid item xs={12} md={4} key={type.type}>
                  <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {type.type}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {type.description}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Examples:
                    </Typography>
                    <ul>
                      {type.examples.map((example, index) => (
                        <li key={index}>
                          <Typography variant="body2">{example}</Typography>
                        </li>
                      ))}
                    </ul>
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
                label="Search Treatments"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Treatment Type</InputLabel>
                <Select
                  value={selectedType}
                  onChange={handleTypeSelect}
                  label="Treatment Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Organic">Organic</MenuItem>
                  <MenuItem value="Chemical">Chemical</MenuItem>
                  <MenuItem value="Biological">Biological</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {(searchTerm || selectedType) && filteredTreatments.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Treatment Options
            </Typography>
            {filteredTreatments.map(([key, treatment]) => (
              <TreatmentCard key={key} treatment={treatment} />
            ))}
          </Box>
        )}

        {(searchTerm || selectedType) && filteredTreatments.length === 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="text.secondary">
              No treatments found matching your criteria.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TreatmentGuide;
