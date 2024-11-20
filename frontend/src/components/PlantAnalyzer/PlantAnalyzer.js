import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Box, Typography, Button, CircularProgress, Container, Paper, Alert, IconButton, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CameraAlt as CameraIcon, Close as CloseIcon } from '@mui/icons-material';
import PlantIdInfo from '../PlantInfo/PlantIdInfo';
import PlantNetInfo from '../PlantInfo/PlantNetInfo';
import MobileNetInfo from '../PlantInfo/MobileNetInfo';
import PlantHealthCard from '../PlantHealth/PlantHealthCard';
import plantAnalysisService from '../../services/ml/plantAnalysisService';

const Input = styled('input')({
  display: 'none',
});

const StyledHealthAssessment = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

const PlantAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    await analyzeImage(file);
  };

  const handleCameraCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setShowCamera(false);
    
    // Convert base64 to blob
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
    await analyzeImage(file);
  };

  const analyzeImage = async (file) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await plantAnalysisService.analyzeImage(file);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message || 'Failed to analyze plant image');
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Plant Health Analyzer
        </Typography>

        <Paper sx={{ p: 3 }}>
          {!image && !showCamera && (
            <Box mb={4} textAlign="center" display="flex" justifyContent="center" gap={2}>
              <label htmlFor="plant-image-upload">
                <Input
                  accept="image/*"
                  id="plant-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <Button
                  variant="contained"
                  component="span"
                  color="primary"
                  disabled={analyzing}
                >
                  Upload Photo
                </Button>
              </label>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowCamera(true)}
                disabled={analyzing}
              >
                Take Photo
              </Button>
            </Box>
          )}

          {showCamera && (
            <Box sx={{ position: 'relative', mb: 2 }}>
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
                  color="secondary"
                  onClick={() => setShowCamera(false)}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {image && !showCamera && (
            <Box sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
              <img
                src={image}
                alt="Uploaded plant"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </Box>
          )}

          {analyzing && (
            <Box display="flex" justifyContent="center" mb={4}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box>
              {/* Show API results */}
              {result.plantnet && (
                <PlantNetInfo plantData={result.plantnet} />
              )}

              {result.plantId && (
                <PlantIdInfo data={result.plantId} />
              )}

              {result.mobilenet && (
                <MobileNetInfo plantData={result.mobilenet} />
              )}

              {result.healthAssessment && (
                <StyledHealthAssessment>
                  <Typography variant="h6" gutterBottom>
                    Plant Health Assessment
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Overall Health:</strong> {result.healthAssessment.overallHealth}%
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Tissue Analysis:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      Healthy Tissue: {result.healthAssessment.details.healthyTissue}
                    </Typography>
                    <Typography variant="body1">
                      Stressed Tissue: {result.healthAssessment.details.stressedTissue}
                    </Typography>
                    <Typography variant="body1">
                      Damaged Tissue: {result.healthAssessment.details.damagedTissue}
                    </Typography>
                  </Box>
                  
                  {result.healthAssessment.issues.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Identified Issues:
                      </Typography>
                      {result.healthAssessment.issues.map((issue, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="body1">
                            <strong>{issue.type}</strong> (Severity: {issue.severity})
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {issue.description}
                          </Typography>
                          <Box mt={1}>
                            <Typography variant="body2">Solutions:</Typography>
                            <ul style={{ marginTop: 4 }}>
                              {issue.solutions.map((solution, idx) => (
                                <li key={idx}>{solution}</li>
                              ))}
                            </ul>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </StyledHealthAssessment>
              )}

              {result.plantId && (
                <Grid item xs={12} md={6}>
                  <PlantHealthCard
                    healthData={result.plantId.health}
                    careInfo={result.plantId.careInfo}
                  />
                </Grid>
              )}

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetAnalyzer}
                  data-testid="reset-button"
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
