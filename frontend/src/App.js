import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import CssBaseline from '@mui/material/CssBaseline';
import {
  CameraAlt as CameraIcon,
  Build as ToolsIcon,
  EmojiEvents as TrophyIcon,
  Article as BlogIcon,
} from '@mui/icons-material';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PlaceholderPage from './components/PlaceholderPage';
import PlantAnalyzer from './components/PlantAnalyzer/PlantAnalyzer';
import FarmingTools from './components/FarmingTools/FarmingTools';
import TestFirebase from './components/TestFirebase/TestFirebase';
import BlogList from './components/Blog/BlogList';
import BlogPost from './components/Blog/BlogPost';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green shade
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#ff6f00', // Orange shade
      light: '#ffa040',
      dark: '#c43e00',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
});

const placeholderContent = {
  tools: {
    title: 'Farming Tools',
    description: 'Advanced farming calculators and planning tools are being cultivated! Soon you\'ll have access to irrigation planning, harvest scheduling, fertilizer recommendations, and profit estimation tools.',
    icon: <ToolsIcon />,
  },
  progress: {
    title: 'Progress Dashboard',
    description: 'Your personal gardening journey tracker is growing! Track your achievements, monitor plant health history, and compete with fellow gardeners on our leaderboard.',
    icon: <TrophyIcon />,
  },
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <Helmet>
                    <title>Plant Health Meter - Monitor Plant Health & Smart Farming Tools</title>
                    <meta name="description" content="Professional plant health monitoring tools and farming calculators. Measure plant health status, access farming calculators, and get expert agricultural insights." />
                    <meta name="keywords" content="plant health, plant health monitor, plant health status, farming tools, agriculture calculator, crop planning tools, plant monitoring system" />
                    
                    {/* Open Graph / Social Media Meta Tags */}
                    <meta property="og:title" content="Plant Health Meter - Monitor Plant Health & Smart Farming Tools" />
                    <meta property="og:description" content="Professional plant health monitoring tools and farming calculators. Track plant health status and optimize your farming operations." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://planthealthmeter.com" />
                    
                    {/* Structured Data for Google */}
                    <script type="application/ld+json">
                      {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "Plant Health Meter",
                        "applicationCategory": "Farming & Agriculture Tool",
                        "description": "Professional plant health monitoring tools and farming calculators.",
                        "url": "https://planthealthmeter.com",
                        "offers": {
                          "@type": "Offer",
                          "category": "Free"
                        },
                        "featureList": [
                          "Plant Health Monitoring",
                          "Farming Calculators",
                          "Crop Planning Tools",
                          "Agricultural Analytics"
                        ]
                      })}
                    </script>
                    <link rel="canonical" href="https://planthealthmeter.com" />
                  </Helmet>
                  <Home />
                </>
              } />
              <Route path="/analyze" element={
                <>
                  <Helmet>
                    <title>Plant Health Monitor - Check Plant Health Status | Plant Health Meter</title>
                    <meta name="description" content="Monitor plant health status in real-time. Our advanced plant health monitoring system helps detect diseases, nutrient deficiencies, and growth issues early." />
                    <meta name="keywords" content="plant health monitor, plant health status, plant disease detection, plant health analysis, plant monitoring system" />
                    
                    <meta property="og:title" content="Plant Health Monitor - Check Plant Health Status | Plant Health Meter" />
                    <meta property="og:description" content="Monitor plant health status in real-time. Detect plant diseases and health issues early with our advanced monitoring system." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://planthealthmeter.com/analyze" />
                    
                    <script type="application/ld+json">
                      {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Plant Health Monitor",
                        "applicationCategory": "Plant Health Analysis Tool",
                        "description": "Advanced plant health monitoring system for early disease detection and health analysis.",
                        "url": "https://planthealthmeter.com/analyze",
                        "featureList": [
                          "Real-time plant health monitoring",
                          "Disease detection",
                          "Nutrient deficiency analysis",
                          "Growth tracking"
                        ],
                        "offers": {
                          "@type": "Offer",
                          "category": "Free"
                        }
                      })}
                    </script>
                    <link rel="canonical" href="https://planthealthmeter.com/analyze" />
                  </Helmet>
                  <PlantAnalyzer />
                </>
              } />
              <Route path="/tools" element={<FarmingTools />} />
              <Route 
                path="/progress" 
                element={<PlaceholderPage {...placeholderContent.progress} />} 
              />
              <Route path="/blog" element={
                <>
                  <Helmet>
                    <title>Gardening Blog - Expert Tips & Insights</title>
                    <meta name="description" content="Read our latest gardening articles, tips, and expert advice. Stay updated with gardening trends, techniques, and sustainable practices." />
                    <meta name="keywords" content="gardening blog, gardening tips, plant care tips, garden maintenance, sustainable gardening" />
                    <meta property="og:title" content="Gardening Blog - Expert Tips & Insights" />
                    <meta property="og:description" content="Read our latest gardening articles, tips, and expert advice." />
                    <meta property="og:type" content="blog" />
                    <link rel="canonical" href="https://yourdomain.com/blog" />
                  </Helmet>
                  <BlogList />
                </>
              } />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/test-firebase" element={<TestFirebase />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
