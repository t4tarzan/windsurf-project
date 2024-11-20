import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  LocalFlorist,
  Warning,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Opacity as WaterIcon,
  Speed as HealthMeterIcon,
  BugReport as DiseaseIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const HealthMeter = ({ value, size = 80 }) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress
      variant="determinate"
      value={value}
      size={size}
      thickness={4}
      sx={{
        color: value > 70 ? 'success.main' : value > 40 ? 'warning.main' : 'error.main',
      }}
    />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" component="div" color="text.secondary">
        {`${Math.round(value)}%`}
      </Typography>
    </Box>
  </Box>
);

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const PlantHealthCard = ({ healthData, careInfo }) => {
  const [diseaseExpanded, setDiseaseExpanded] = React.useState(false);

  if (!healthData) return null;

  const healthScore = healthData.isHealthyProbability * 100;
  const hasDisease = healthData.diseases && healthData.diseases.length > 0;

  return (
    <StyledCard>
      <CardContent>
        {/* Health Status Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <HealthMeter value={healthScore} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" gutterBottom>
              Plant Health Status
            </Typography>
            <Chip
              icon={<LocalFlorist />}
              label={healthData.isHealthy ? 'Healthy' : 'Needs Attention'}
              color={healthData.isHealthy ? 'success' : 'warning'}
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Care Information */}
        {careInfo && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Care Information
            </Typography>
            <List dense>
              {careInfo.watering && (
                <ListItem>
                  <ListItemIcon>
                    <WaterIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Watering Needs"
                    secondary={careInfo.watering}
                  />
                </ListItem>
              )}
              {careInfo.difficulty && (
                <ListItem>
                  <ListItemIcon>
                    <HealthMeterIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Care Difficulty"
                    secondary={careInfo.difficulty}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}

        {/* Disease Information */}
        {hasDisease && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Health Issues Detected
                </Typography>
                <IconButton
                  onClick={() => setDiseaseExpanded(!diseaseExpanded)}
                  aria-expanded={diseaseExpanded}
                >
                  {diseaseExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              <Collapse in={diseaseExpanded}>
                <List dense>
                  {healthData.diseases.map((disease, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <DiseaseIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={disease.name}
                          secondary={`Probability: ${Math.round(
                            disease.probability * 100
                          )}%`}
                        />
                      </ListItem>
                      {disease.details && (
                        <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                          {disease.details.symptoms && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Symptoms:</strong>{' '}
                              {Array.isArray(disease.details.symptoms)
                                ? disease.details.symptoms.join(', ')
                                : typeof disease.details.symptoms === 'object'
                                ? Object.values(disease.details.symptoms).join(', ')
                                : disease.details.symptoms}
                            </Typography>
                          )}
                          {disease.details.treatment && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Treatment:</strong>{' '}
                              {Array.isArray(disease.details.treatment)
                                ? disease.details.treatment.join(', ')
                                : typeof disease.details.treatment === 'object'
                                ? Object.entries(disease.details.treatment).map(([key, value]) => 
                                    `${key}: ${value}`
                                  ).join('; ')
                                : disease.details.treatment}
                            </Typography>
                          )}
                          {disease.details.cause && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Cause:</strong>{' '}
                              {Array.isArray(disease.details.cause)
                                ? disease.details.cause.join(', ')
                                : typeof disease.details.cause === 'object'
                                ? Object.values(disease.details.cause).join(', ')
                                : disease.details.cause}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </Box>
          </>
        )}

        {/* Warning Message for Unhealthy Plants */}
        {!healthData.isHealthy && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'warning.light',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Warning color="warning" sx={{ mr: 1 }} />
            <Typography variant="body2" color="warning.dark">
              This plant may need attention. Check the care recommendations and
              consider consulting a plant specialist.
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default PlantHealthCard;
