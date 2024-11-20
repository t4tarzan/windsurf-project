import React from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  background: 'linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, 0.1)',
}));

const PlantNetInfo = ({ plantData }) => {
  if (!plantData || plantData.source !== 'plantnet') return null;

  return (
    <StyledPaper elevation={3}>
      <Box mb={2}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>
          Pl@ntNet Results
        </Typography>
        <Typography variant="h5" gutterBottom>
          {plantData.name}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box mb={3}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Scientific Details
            </Typography>
            <Typography variant="body1">
              <strong>Scientific Name:</strong> {plantData.scientificName}
            </Typography>
            <Typography variant="body1">
              <strong>Confidence:</strong> {plantData.confidence}%
            </Typography>
          </Box>

          {plantData.taxonomy && (
            <Box>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Taxonomy
              </Typography>
              <Typography variant="body1">
                <strong>Family:</strong> {plantData.taxonomy.family}
              </Typography>
              <Typography variant="body1">
                <strong>Genus:</strong> {plantData.taxonomy.genus}
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {plantData.description && (
            <Box mb={3}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2">
                {plantData.description}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default PlantNetInfo;
