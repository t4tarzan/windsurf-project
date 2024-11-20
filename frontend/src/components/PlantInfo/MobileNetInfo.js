import React from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  background: 'linear-gradient(145deg, #c7b8ea 0%, #a77dc2 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 3px 5px 2px rgba(156, 39, 176, 0.1)',
}));

const MobileNetInfo = ({ plantData }) => {
  if (!plantData || plantData.source !== 'mobilenet') return null;

  return (
    <StyledPaper elevation={3}>
      <Box mb={2}>
        <Typography variant="overline" color="secondary" sx={{ fontWeight: 'bold' }}>
          Identified by Local AI
        </Typography>
        <Typography variant="h5" gutterBottom>
          {plantData.name}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Identified As:</strong> {plantData.name}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Confidence:</strong> {plantData.confidence}%
          </Typography>
          {plantData.scientificName && (
            <Typography variant="body1" paragraph>
              <strong>Scientific Name:</strong> {plantData.scientificName}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {plantData.description && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {plantData.description}
              </Typography>
            </Box>
          )}
        </Grid>

        {plantData.careInfo && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Care Tips
            </Typography>
            {Object.entries(plantData.careInfo).map(([key, value]) => (
              <Typography key={key} variant="body1" paragraph>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
              </Typography>
            ))}
          </Grid>
        )}

        {plantData.uses && (plantData.uses.medicinalUses.length > 0 || plantData.uses.otherUses.length > 0) && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Uses
            </Typography>
            {plantData.uses.medicinalUses.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Medicinal Uses:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {plantData.uses.medicinalUses.map((use, index) => (
                    <Chip key={index} label={use} color="secondary" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
            {plantData.uses.otherUses.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Other Uses:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {plantData.uses.otherUses.map((use, index) => (
                    <Chip key={index} label={use} color="primary" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        )}
      </Grid>
    </StyledPaper>
  );
};

export default MobileNetInfo;
