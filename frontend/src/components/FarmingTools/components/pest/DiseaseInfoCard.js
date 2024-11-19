import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Coronavirus as VirusIcon,
  Warning as WarningIcon,
  LocalFlorist as PlantIcon,
  Science as ScienceIcon,
  WaterDrop as WaterIcon,
  Thermostat as TempIcon,
} from '@mui/icons-material';

const DiseaseInfoCard = ({ disease }) => {
  return (
    <Card elevation={3} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VirusIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{disease.name}</Typography>
          <Chip 
            label={disease.type}
            color="error"
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          {disease.description}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WarningIcon sx={{ mr: 1 }} />
              Symptoms
            </Typography>
            <List dense>
              {disease.symptoms.map((symptom, index) => (
                <ListItem key={index}>
                  <ListItemText primary={symptom} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PlantIcon sx={{ mr: 1 }} />
              Susceptible Crops
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {disease.susceptibleCrops.map((crop, index) => (
                <Chip key={index} label={crop} size="small" />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ScienceIcon sx={{ mr: 1 }} />
              Environmental Conditions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TempIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Temperature: {disease.conditions.temperature}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WaterIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Humidity: {disease.conditions.humidity}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              Prevention Methods
            </Typography>
            <List dense>
              {disease.preventionMethods.map((method, index) => (
                <ListItem key={index}>
                  <ListItemText primary={method} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DiseaseInfoCard;
