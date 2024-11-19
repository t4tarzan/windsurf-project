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
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital as TreatmentIcon,
  Nature as OrganicIcon,
  Science as ChemicalIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedTreatment(null);
  };

  const renderTreatmentIcon = (type) => {
    switch (type) {
      case 'Organic':
        return <OrganicIcon color="success" />;
      case 'Synthetic':
        return <ChemicalIcon color="error" />;
      default:
        return <TreatmentIcon color="primary" />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Pest Treatment Guide
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Explore different treatment methods and their appropriate applications.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Treatment Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Select Treatment Category"
                onChange={handleCategoryChange}
              >
                {Object.entries(treatmentDatabase).map(([key, category]) => (
                  <MenuItem key={key} value={key}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedCategory && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {renderTreatmentIcon(treatmentDatabase[selectedCategory].type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {treatmentDatabase[selectedCategory].name}
                  </Typography>
                  <Chip
                    label={treatmentDatabase[selectedCategory].type}
                    color={treatmentDatabase[selectedCategory].type === 'Organic' ? 'success' : 'default'}
                    sx={{ ml: 2 }}
                  />
                </Box>
                <Typography variant="body1" paragraph>
                  {treatmentDatabase[selectedCategory].description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {treatmentDatabase[selectedCategory].treatments.map((treatment, index) => (
                  <Accordion
                    key={index}
                    expanded={selectedTreatment === index}
                    onChange={() => setSelectedTreatment(selectedTreatment === index ? null : index)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Grid container alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography>{treatment.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Rating
                            value={treatment.effectiveness}
                            readOnly
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Chip
                            size="small"
                            label={treatment.organicCertified ? 'Organic Certified' : 'Non-Organic'}
                            color={treatment.organicCertified ? 'success' : 'default'}
                          />
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Target Pests
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            {treatment.targetPests.map((pest, i) => (
                              <Chip
                                key={i}
                                label={pest}
                                size="small"
                                sx={{ m: 0.5 }}
                                variant="outlined"
                              />
                            ))}
                          </Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Application Method
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {treatment.application}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Precautions
                          </Typography>
                          {treatment.precautions.map((precaution, i) => (
                            <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <WarningIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                              {precaution}
                            </Typography>
                          ))}
                          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Residual Period
                          </Typography>
                          <Typography variant="body2">
                            {treatment.residualPeriod}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>
            </Grid>
          )}

          {!selectedCategory && (
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Number of Treatments</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(treatmentDatabase).map(([key, category]) => (
                      <TableRow key={key}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {renderTreatmentIcon(category.type)}
                            <Typography sx={{ ml: 1 }}>
                              {category.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={category.type}
                            color={category.type === 'Organic' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{category.treatments.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TreatmentGuide;
