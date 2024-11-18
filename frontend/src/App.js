import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
  blog: {
    title: 'Community & Blog',
    description: 'Our gardening community hub is sprouting! Share your experiences, read expert articles, and connect with fellow plant enthusiasts in our upcoming social platform.',
    icon: <BlogIcon />,
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<PlantAnalyzer />} />
            <Route 
              path="/tools" 
              element={<PlaceholderPage {...placeholderContent.tools} />} 
            />
            <Route 
              path="/progress" 
              element={<PlaceholderPage {...placeholderContent.progress} />} 
            />
            <Route 
              path="/blog" 
              element={<PlaceholderPage {...placeholderContent.blog} />} 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
