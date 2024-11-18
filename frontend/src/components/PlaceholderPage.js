import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

function PlaceholderPage({ title, icon, description }) {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 60, color: 'primary.main', mb: 2 } })}
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {description}
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 4,
              bgcolor: 'primary.main',
              mt: 2,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #2e7d32 0%, #60ad5e 100%)',
            }}
          />
        </Paper>
      </Box>
    </Container>
  );
}

export default PlaceholderPage;
