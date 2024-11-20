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
  LocalFlorist,
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
  Park as EcoIcon,
  NightsStay,
  ContentCut
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
    <Box sx={{ textAlign: 'center', mb: 2 }}>
      <Box sx={{ position: 'relative', display: 'inline-flex', m: 2 }}>
        <CircularProgress
          variant="determinate"
          value={result.healthAssessment?.overallHealth || 0}
          size={100}
          thickness={4}
          sx={{
            color: (result.healthAssessment?.overallHealth || 0) > 70 ? 'success.main' : 
                  (result.healthAssessment?.overallHealth || 0) > 40 ? 'warning.main' : 'error.main'
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
            {result.healthAssessment?.overallHealth || 0}%
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Plant Health Status
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(result.healthAssessment?.vitalSigns || {}).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}: <Typography component="span" color="text.secondary">{value}</Typography>
              </Typography>
            </Grid>
          ))}
        </Grid>
        {result.healthAssessment?.recommendations?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Recommendations:
            </Typography>
            <List dense>
              {result.healthAssessment.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon><InfoIcon /></ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
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
            {result.detailedInfo?.nativeTo && result.detailedInfo.nativeTo.length > 0 && (
              <>
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
              </>
            )}
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
                  secondary={result.careInfo?.watering || 'Not available'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SunIcon /></ListItemIcon>
                <ListItemText
                  primary="Sunlight"
                  secondary={result.careInfo?.sunlight || 'Not available'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SoilIcon /></ListItemIcon>
                <ListItemText
                  primary="Soil"
                  secondary={result.careInfo?.soil || 'Not available'}
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
                  secondary={result.careInfo?.temperature || 'Not available'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><HumidityIcon /></ListItemIcon>
                <ListItemText
                  primary="Humidity"
                  secondary={result.careInfo?.humidity || 'Not available'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><InfoIcon /></ListItemIcon>
                <ListItemText
                  primary="Additional Care"
                  secondary={result.careInfo?.fertilizer || 'Not available'}
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
          Seasonal Care Guide
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <List dense>
              {result.seasonalInfo?.growingSeason && (
                <ListItem>
                  <ListItemIcon><SunIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Growing Season"
                    secondary={result.seasonalInfo.growingSeason.join(', ')}
                  />
                </ListItem>
              )}
              {result.seasonalInfo?.floweringSeason && (
                <ListItem>
                  <ListItemIcon><LocalFlorist /></ListItemIcon>
                  <ListItemText 
                    primary="Flowering Season"
                    secondary={result.seasonalInfo.floweringSeason.join(', ')}
                  />
                </ListItem>
              )}
              {result.seasonalInfo?.dormancyPeriod && (
                <ListItem>
                  <ListItemIcon><NightsStay /></ListItemIcon>
                  <ListItemText 
                    primary="Dormancy Period"
                    secondary={result.seasonalInfo.dormancyPeriod.join(', ')}
                  />
                </ListItem>
              )}
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <List dense>
              {result.seasonalInfo?.pruningTime && (
                <ListItem>
                  <ListItemIcon><ContentCut /></ListItemIcon>
                  <ListItemText 
                    primary="Pruning Time"
                    secondary={result.seasonalInfo.pruningTime.join(', ')}
                  />
                </ListItem>
              )}
              {result.seasonalInfo?.fertilizingSchedule && (
                <ListItem>
                  <ListItemIcon><ScienceIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Fertilizing Schedule"
                    secondary={result.seasonalInfo.fertilizingSchedule.join(', ')}
                  />
                </ListItem>
              )}
            </List>
          </Grid>
          {result.seasonalInfo?.commonIssues && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Seasonal Care Tips
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(result.seasonalInfo.commonIssues).map(([season, issues]) => (
                  <Grid item xs={12} sm={6} key={season}>
                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                      {season}:
                    </Typography>
                    <List dense>
                      {issues.map((issue, index) => (
                        <ListItem key={index}>
                          <ListItemIcon><InfoIcon /></ListItemIcon>
                          <ListItemText primary={issue} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
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
          {result.uses?.medicinal && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <MedicinalIcon sx={{ mr: 1 }} />
                Medicinal Uses
              </Typography>
              <List dense>
                {result.uses.medicinalUses?.map((use, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={use} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
          {result.uses?.otherUses && result.uses.otherUses.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <EcoIcon sx={{ mr: 1 }} />
                Other Uses
              </Typography>
              <List dense>
                {result.uses.otherUses.map((use, index) => (
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
        {result.trivia?.length > 0 ? (
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
        ) : (
          <Typography variant="body2" color="text.secondary">
            No interesting facts available for this plant.
          </Typography>
        )}
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
          Let&apos;s analyze your plant&apos;s health and provide personalized care recommendations
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
                  color="secondary"
                  onClick={resetAnalyzer}
                  data-testid="reset-button"
                >
                  Reset
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
