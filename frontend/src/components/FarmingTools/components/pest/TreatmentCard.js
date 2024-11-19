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
  Rating,
  Divider,
} from '@mui/material';
import {
  LocalHospital as TreatmentIcon,
  Nature as OrganicIcon,
  Science as ChemicalIcon,
  Warning as WarningIcon,
  Schedule as TimingIcon,
} from '@mui/icons-material';

const TreatmentCard = ({ treatment }) => {
  return (
    <Card elevation={3} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TreatmentIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{treatment.name}</Typography>
          <Chip 
            label={treatment.type}
            color={treatment.type === 'Organic' ? 'success' : 'warning'}
            size="small"
            sx={{ ml: 2 }}
            icon={treatment.type === 'Organic' ? <OrganicIcon /> : <ChemicalIcon />}
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          {treatment.description}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              Target Pests
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {treatment.targetPests.map((pest, index) => (
                <Chip key={index} label={pest} size="small" />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              Effectiveness
            </Typography>
            <Rating 
              value={treatment.effectiveness} 
              readOnly 
              max={5}
              sx={{ mb: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimingIcon sx={{ mr: 1 }} />
              Application Details
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {treatment.application}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Residual Period: {treatment.residualPeriod}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WarningIcon sx={{ mr: 1 }} />
              Precautions
            </Typography>
            <List dense>
              {treatment.precautions.map((precaution, index) => (
                <ListItem key={index}>
                  <ListItemText primary={precaution} />
                </ListItem>
              ))}
            </List>
          </Grid>

          {treatment.organicCertified && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <OrganicIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body2" color="success.main">
                  Organic Certified
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TreatmentCard;
