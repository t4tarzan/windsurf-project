import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  Build as ToolsIcon,
  EmojiEvents as TrophyIcon,
  Article as BlogIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Feature card images (you would save these images in your assets folder)
const featureImages = {
  'Plant Analysis': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&q=80',
  'Farming Tools': 'https://images.unsplash.com/photo-1592991538534-788285176b55?w=400&h=300&q=80',
  'Track Progress': 'https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=400&h=300&q=80',
  'Community & Blog': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&q=80',
};

const heroBackgroundImage = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1920&h=1080&q=80';

const features = [
  {
    title: 'Plant Analysis',
    description: 'Upload or take photos of your plants for instant health analysis and care recommendations.',
    icon: <CameraIcon sx={{ fontSize: 40 }} />,
    path: '/analyze',
  },
  {
    title: 'Farming Tools',
    description: 'Access comprehensive farming calculators and planning tools for optimal crop management.',
    icon: <ToolsIcon sx={{ fontSize: 40 }} />,
    path: '/tools',
  },
  {
    title: 'Track Progress',
    description: 'Gamified experience to track your gardening journey and earn achievements.',
    icon: <TrophyIcon sx={{ fontSize: 40 }} />,
    path: '/progress',
  },
  {
    title: 'Community & Blog',
    description: 'Join our community of gardening enthusiasts and share your experiences.',
    icon: <BlogIcon sx={{ fontSize: 40 }} />,
    path: '/blog',
  },
];

function FeatureCard({ feature, loading }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <Skeleton variant="rectangular" height={140} />
        <CardContent>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={80} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      component={Link}
      to={feature.path}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.light',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <CardMedia
          component="img"
          height="140"
          image={featureImages[feature.title]}
          alt={feature.title}
          onLoad={() => setImageLoaded(true)}
          sx={{ opacity: imageLoaded ? 1 : 0 }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          {React.cloneElement(feature.icon, { color: 'primary' })}
          <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
            {feature.title}
          </Typography>
        </Box>
        <Typography color="text.secondary">
          {feature.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Home() {
  const [loading, setLoading] = useState(false);
  const [envStatus, setEnvStatus] = useState('');

  // Test environment variables
  const testEnvVariables = () => {
    setLoading(true);
    const plantnetKey = process.env.REACT_APP_PLANTNET_API_KEY;
    const trefleKey = process.env.REACT_APP_TREFLE_API_KEY;
    
    setEnvStatus(`
      PlantNet API Key: ${plantnetKey ? '✅ Present' : '❌ Missing'}
      Trefle API Key: ${trefleKey ? '✅ Present' : '❌ Missing'}
    `);
    setLoading(false);
  };

  useEffect(() => {
    testEnvVariables();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Plant Health Analysis
          </Typography>
          <Typography variant="h5" gutterBottom>
            Your AI-Powered Plant Care Assistant
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Version 1.0.0 - Powered by Vercel
          </Typography>
          {envStatus && (
            <Typography variant="body2" sx={{ mb: 4, whiteSpace: 'pre-line' }}>
              {envStatus}
            </Typography>
          )}
          <Button
            component={Link}
            to="/analyze"
            variant="contained"
            size="large"
            startIcon={<CameraIcon />}
            sx={{ mr: 2 }}
          >
            Analyze Plant
          </Button>
          <Button
            component={Link}
            to="/blog"
            variant="outlined"
            size="large"
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Learn More
          </Button>
        </Container>
      </Box>

      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={3}>
              <FeatureCard feature={feature} loading={loading} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
