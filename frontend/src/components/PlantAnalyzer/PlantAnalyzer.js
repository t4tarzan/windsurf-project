import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  Close as CloseIcon,
  LocalFlorist as PlantIcon,
  WaterDrop as WaterIcon,
  WbSunny as SunIcon,
  Terrain as SoilIcon,
  Thermostat as TempIcon,
  Opacity as HumidityIcon,
  Science as ScienceIcon,
  Restaurant as FoodIcon,
  LocalHospital as MedicinalIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Event as SeasonIcon,
  Eco as EcoIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { analyzeImage } from '../../services/ml/plantAnalysisService';

const Input = styled('input')({
  display: 'none',
});

const PlantAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      analyzeUploadedImage(file);
    }
  };

  const handleCameraCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setShowCamera(false);
    
    // Convert base64 to blob
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        analyzeUploadedImage(file);
      });
  };

  const analyzeUploadedImage = async (file) => {
    setAnalyzing(true);
    setError(null);
    try {
      const analysisResult = await analyzeImage(file);
      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setShowCamera(false);
  };

  const renderHealthScore = () => (
    <Box sx={{ position: 'relative', display: 'inline-flex', m: 2 }}>
      <CircularProgress
        variant="determinate"
        value={result.healthScore}
        size={100}
        thickness={4}
        sx={{
          color: result.healthScore > 70 ? 'success.main' : 
                result.healthScore > 40 ? 'warning.main' : 'error.main'
        }}
      />
      <Box sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Typography variant="h6" component="div">
          {result.healthScore}%
        </Typography>
      </Box>
    </Box>
  );

  const renderBasicInfo = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {result.plantType}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {result.commonNames?.join(', ')}
            </Typography>
            <Typography variant="body2" paragraph>
              {result.description}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                icon={<ScienceIcon />}
                label={`Family: ${result.family}`}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip
                icon={<EcoIcon />}
                label={`Genus: ${result.genus}`}
                sx={{ mr: 1, mb: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Native Regions
            </Typography>
            <List dense>
              {result.detailedInfo.nativeTo.map((region, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText primary={region} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderCareInfo = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Care Instructions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <List dense>
              <ListItem>
                <ListItemIcon><WaterIcon /></ListItemIcon>
                <ListItemText 
                  primary="Watering"
                  secondary={result.careInfo.watering}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SunIcon /></ListItemIcon>
                <ListItemText
                  primary="Sunlight"
                  secondary={result.careInfo.sunlight}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SoilIcon /></ListItemIcon>
                <ListItemText
                  primary="Soil"
                  secondary={result.careInfo.soil}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <List dense>
              <ListItem>
                <ListItemIcon><TempIcon /></ListItemIcon>
                <ListItemText
                  primary="Temperature"
                  secondary={result.careInfo.temperature}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><HumidityIcon /></ListItemIcon>
                <ListItemText
                  primary="Humidity"
                  secondary={result.careInfo.humidity}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderSeasonalInfo = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Seasonal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <List dense>
              <ListItem>
                <ListItemIcon><SeasonIcon /></ListItemIcon>
                <ListItemText
                  primary="Flowering Season"
                  secondary={result.detailedInfo.floweringSeason.join(', ') || 'Not available'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SeasonIcon /></ListItemIcon>
                <ListItemText
                  primary="Harvest Season"
                  secondary={result.detailedInfo.harvestSeason.join(', ') || 'Not available'}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <List dense>
              <ListItem>
                <ListItemIcon><WaterIcon /></ListItemIcon>
                <ListItemText
                  primary="Precipitation Needs"
                  secondary={`${result.detailedInfo.minimumPrecipitation || '?'} - ${result.detailedInfo.maximumPrecipitation || '?'} mm`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><TempIcon /></ListItemIcon>
                <ListItemText
                  primary="Temperature Range"
                  secondary={`${result.detailedInfo.minimumTemperature || '?'}°C - ${result.detailedInfo.maximumTemperature || '?'}°C`}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderUsesAndBenefits = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Uses and Benefits</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {result.uses.medicinal && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <MedicinalIcon sx={{ mr: 1 }} />
                Medicinal Uses
              </Typography>
              <List dense>
                {result.uses.medicinalUses.map((use, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={use} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
          {result.detailedInfo.edible && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <FoodIcon sx={{ mr: 1 }} />
                Edible Uses
              </Typography>
              <List dense>
                {result.uses.edibleUses.map((use, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={use} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderTrivia = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Interesting Facts</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List dense>
          {result.trivia.map((fact, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary={fact} />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Plant Health Analyzer
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Upload a photo or use your camera to analyze your plant's health
        </Typography>

        <Paper elevation={3} sx={{ p: 2 }}>
          {!image && !showCamera && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  data-testid="file-input"
                />
                <Button variant="contained" component="span">
                  Upload Photo
                </Button>
              </label>
              <Button
                variant="contained"
                onClick={() => setShowCamera(true)}
              >
                Take Photo
              </Button>
            </Box>
          )}

          {showCamera && (
            <Box sx={{ position: 'relative' }}>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{ width: '100%' }}
              />
              <Box sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2
              }}>
                <IconButton
                  color="primary"
                  onClick={handleCameraCapture}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <CameraIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => setShowCamera(false)}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {image && !showCamera && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={image}
                alt="Uploaded plant"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </Box>
          )}

          {analyzing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {renderHealthScore()}
              </Box>
              
              {renderBasicInfo()}
              {renderCareInfo()}
              {renderSeasonalInfo()}
              {renderUsesAndBenefits()}
              {renderTrivia()}

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  onClick={resetAnalyzer}
                >
                  Analyze Another Plant
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default PlantAnalyzer;
