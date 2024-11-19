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
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  BugReport as BugIcon,
  Warning as WarningIcon,
  LocalFlorist as PlantIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

const PestInfoCard = ({ pest }) => {
  return (
    <Card elevation={3} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BugIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{pest.name}</Typography>
          <Chip 
            label={pest.type}
            color="primary"
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          {pest.description}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WarningIcon sx={{ mr: 1 }} />
              Symptoms
            </Typography>
            <List dense>
              {pest.symptoms.map((symptom, index) => (
                <ListItem key={index}>
                  <ListItemText primary={symptom} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PlantIcon sx={{ mr: 1 }} />
              Affected Crops
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {pest.affectedCrops.map((crop, index) => (
                <Chip key={index} label={crop} size="small" />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ScienceIcon sx={{ mr: 1 }} />
              Identification Tips
            </Typography>
            <List dense>
              {pest.identificationTips.map((tip, index) => (
                <ListItem key={index}>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PestInfoCard;
