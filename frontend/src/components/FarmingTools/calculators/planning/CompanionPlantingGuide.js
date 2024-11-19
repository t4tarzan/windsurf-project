import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const companionData = {
  'tomatoes': {
    name: 'Tomatoes',
    companions: ['basil', 'marigolds', 'carrots', 'onions', 'parsley'],
    antagonists: ['potatoes', 'cabbage', 'fennel', 'corn'],
    benefits: {
      'basil': 'Improves growth and flavor, repels pests',
      'marigolds': 'Repels nematodes and other pests',
      'carrots': 'Breaks up soil, provides ground cover',
      'onions': 'Deters pests with strong scent',
      'parsley': 'Attracts beneficial insects'
    },
    spacing: '45-60 cm',
    notes: 'Plant deeply, remove lower leaves'
  },
  'beans': {
    name: 'Beans',
    companions: ['corn', 'carrots', 'cucumbers', 'potatoes', 'rosemary'],
    antagonists: ['onions', 'garlic', 'leeks', 'shallots'],
    benefits: {
      'corn': 'Provides support, beans fix nitrogen',
      'carrots': 'Beans provide nitrogen',
      'cucumbers': 'Mutual pest protection',
      'potatoes': 'Beans fix nitrogen',
      'rosemary': 'Deters bean beetles'
    },
    spacing: '10-15 cm',
    notes: 'Fix nitrogen in soil'
  },
  'carrots': {
    name: 'Carrots',
    companions: ['tomatoes', 'peas', 'rosemary', 'sage', 'leeks'],
    antagonists: ['dill', 'parsnips', 'celery'],
    benefits: {
      'tomatoes': 'Tomatoes provide shade',
      'peas': 'Peas fix nitrogen',
      'rosemary': 'Repels carrot fly',
      'sage': 'Repels pests',
      'leeks': 'Repels carrot fly'
    },
    spacing: '5-7 cm',
    notes: 'Need loose, deep soil'
  },
  'cucumbers': {
    name: 'Cucumbers',
    companions: ['beans', 'peas', 'radishes', 'sunflowers', 'corn'],
    antagonists: ['potatoes', 'aromatic herbs'],
    benefits: {
      'beans': 'Provide nitrogen',
      'peas': 'Fix nitrogen',
      'radishes': 'Deter cucumber beetles',
      'sunflowers': 'Provide support and shade',
      'corn': 'Provides support and shade'
    },
    spacing: '30-45 cm',
    notes: 'Need support for climbing'
  },
  'lettuce': {
    name: 'Lettuce',
    companions: ['carrots', 'radishes', 'strawberries', 'cucumbers', 'onions'],
    antagonists: ['broccoli', 'cabbage', 'celery'],
    benefits: {
      'carrots': 'Lettuce provides shade',
      'radishes': 'Quick harvest companion',
      'strawberries': 'Ground cover combination',
      'cucumbers': 'Provides shade',
      'onions': 'Pest protection'
    },
    spacing: '20-25 cm',
    notes: 'Good for intercropping'
  },
  'peppers': {
    name: 'Peppers',
    companions: ['basil', 'onions', 'carrots', 'spinach', 'petunias'],
    antagonists: ['beans', 'kale', 'cabbage'],
    benefits: {
      'basil': 'Improves flavor and growth',
      'onions': 'Deters pests',
      'carrots': 'Provides ground cover',
      'spinach': 'Ground cover',
      'petunias': 'Pest protection'
    },
    spacing: '30-45 cm',
    notes: 'Need warm soil'
  },
  'onions': {
    name: 'Onions',
    companions: ['tomatoes', 'peppers', 'lettuce', 'carrots', 'beets'],
    antagonists: ['beans', 'peas', 'sage'],
    benefits: {
      'tomatoes': 'Pest protection',
      'peppers': 'Pest protection',
      'lettuce': 'Maximizes space',
      'carrots': 'Pest protection',
      'beets': 'Improves growth'
    },
    spacing: '10-15 cm',
    notes: 'Plant near pest-prone vegetables'
  },
  'corn': {
    name: 'Corn',
    companions: ['beans', 'squash', 'pumpkins', 'cucumbers', 'melons'],
    antagonists: ['tomatoes', 'celery'],
    benefits: {
      'beans': 'Three sisters planting',
      'squash': 'Ground cover, three sisters',
      'pumpkins': 'Ground cover',
      'cucumbers': 'Provides support',
      'melons': 'Provides shade'
    },
    spacing: '30-45 cm',
    notes: 'Plant in blocks for pollination'
  }
};

const CompanionPlantingGuide = () => {
  const [selectedCrop, setSelectedCrop] = useState('');

  const handleCropChange = (event) => {
    setSelectedCrop(event.target.value);
  };

  const renderCompanionship = (cropData) => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Good Companions
              </Typography>
              <Divider sx={{ my: 1 }} />
              {cropData.companions.map((companion) => (
                <Box key={companion} sx={{ mb: 2 }}>
                  <Chip
                    icon={<CheckIcon />}
                    label={companion.charAt(0).toUpperCase() + companion.slice(1)}
                    color="success"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {cropData.benefits[companion]}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Poor Companions
              </Typography>
              <Divider sx={{ my: 1 }} />
              {cropData.antagonists.map((antagonist) => (
                <Box key={antagonist} sx={{ mb: 2 }}>
                  <Chip
                    icon={<CloseIcon />}
                    label={antagonist.charAt(0).toUpperCase() + antagonist.slice(1)}
                    color="error"
                    variant="outlined"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Planting Guidelines
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Spacing Requirements
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cropData.spacing}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Special Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cropData.notes}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Companion Planting Guide
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Learn which plants grow well together and which should be kept apart.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Select Crop</InputLabel>
          <Select
            value={selectedCrop}
            label="Select Crop"
            onChange={handleCropChange}
          >
            {Object.entries(companionData).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedCrop && renderCompanionship(companionData[selectedCrop])}

      {!selectedCrop && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Crop</TableCell>
                <TableCell>Good Companions</TableCell>
                <TableCell>Poor Companions</TableCell>
                <TableCell>Spacing</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(companionData).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{value.name}</TableCell>
                  <TableCell>
                    {value.companions.map((companion) => (
                      <Chip
                        key={companion}
                        label={companion}
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    {value.antagonists.map((antagonist) => (
                      <Chip
                        key={antagonist}
                        label={antagonist}
                        size="small"
                        color="error"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{value.spacing}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default CompanionPlantingGuide;
