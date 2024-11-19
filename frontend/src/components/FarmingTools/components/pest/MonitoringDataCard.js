import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Rating,
  Divider,
} from '@mui/material';
import {
  BugReport as PestIcon,
  CalendarMonth as DateIcon,
  LocationOn as LocationIcon,
  Warning as SeverityIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const severityColors = {
  1: 'success',
  2: 'warning',
  3: 'error',
};

const severityLabels = {
  1: 'Low',
  2: 'Moderate',
  3: 'High',
};

const MonitoringDataCard = ({ data }) => {
  return (
    <Card elevation={3} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PestIcon sx={{ mr: 1 }} />
              <Typography variant="h6">{data.pestType}</Typography>
              <Chip 
                label={severityLabels[data.severity]}
                color={severityColors[data.severity]}
                size="small"
                sx={{ ml: 2 }}
                icon={<SeverityIcon />}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DateIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                {format(new Date(data.date), 'MMMM d, yyyy')}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                {data.location}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <NotesIcon sx={{ mr: 1 }} />
                Observations
              </Typography>
              <Typography variant="body2">
                {data.notes}
              </Typography>
            </Box>
          </Grid>

          {data.treatments && data.treatments.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Applied Treatments
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {data.treatments.map((treatment, index) => (
                  <Chip 
                    key={index}
                    label={treatment}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          )}

          {data.recommendations && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Recommendations
              </Typography>
              <Typography variant="body2">
                {data.recommendations}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MonitoringDataCard;
