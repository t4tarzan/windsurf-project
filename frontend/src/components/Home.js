import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          pt: 8,
          pb: 6,
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Background with loading state */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'primary.main',
            zIndex: -2,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(rgba(46, 125, 50, 0.9), rgba(46, 125, 50, 0.9)), url(${heroBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: heroLoaded ? 1 : 0,
            transition: 'opacity 0.5s',
            zIndex: -1,
          }}
        />
        {/* Preload hero image */}
        <img
          src={heroBackgroundImage}
          alt=""
          style={{ display: 'none' }}
          onLoad={() => setHeroLoaded(true)}
        />

        <Container maxWidth="sm" sx={{ position: 'relative' }}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Your Smart Plant Health Companion
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Diagnose plant health, access farming tools, and grow with our community
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/analyze"
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                px: 4,
                py: 1.5,
              }}
            >
              Start Analyzing
            </Button>
          </Box>
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
