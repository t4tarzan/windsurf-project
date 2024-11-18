import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import {
  LocalFlorist as PlantIcon,
  WaterDrop as WaterIcon,
  WbSunny as SunIcon,
  Spa as HealthIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const HealthIndicator = ({ value }) => {
  const getColor = (health) => {
    if (health >= 80) return 'success';
    if (health >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Overall Health
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        color={getColor(value)}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

const AnalysisResult = ({ result }) => {
  const { plantType: plantName, healthScore, issues, recommendations } = result;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PlantIcon color="primary" />
        {plantName}
      </Typography>

      <HealthIndicator value={healthScore} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon />
              Issues Detected
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {issues.map((issue, index) => (
                <Chip
                  key={index}
                  label={issue}
                  color="error"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Recommendations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recommendations.map((rec, index) => (
                <Typography key={index} variant="body2" color="text.secondary">
                  • {rec}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalysisResult;
