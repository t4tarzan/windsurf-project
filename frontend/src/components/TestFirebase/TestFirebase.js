import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import plantAnalysisService from '../../services/ml/plantAnalysisService';

function TestFirebase() {
    const [status, setStatus] = useState('Loading...');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function runTest() {
            try {
                setStatus('Creating test image...');
                
                // Create a canvas and draw a simple plant-like shape
                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 400;
                const ctx = canvas.getContext('2d');
                
                // Fill background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 400, 400);
                
                // Draw a simple plant (green stem and leaves)
                ctx.strokeStyle = '#2d5a27';
                ctx.lineWidth = 8;
                
                // Stem
                ctx.beginPath();
                ctx.moveTo(200, 350);
                ctx.lineTo(200, 150);
                ctx.stroke();
                
                // Leaves
                ctx.fillStyle = '#4a8a44';
                for (let i = 0; i < 3; i++) {
                    const y = 200 + i * 50;
                    // Left leaf
                    ctx.beginPath();
                    ctx.ellipse(160, y, 40, 20, Math.PI / 4, 0, 2 * Math.PI);
                    ctx.fill();
                    // Right leaf
                    ctx.beginPath();
                    ctx.ellipse(240, y, 40, 20, -Math.PI / 4, 0, 2 * Math.PI);
                    ctx.fill();
                }

                // Convert canvas to blob
                const blob = await new Promise((resolve) => {
                    canvas.toBlob(resolve, 'image/jpeg', 0.9);
                });

                const imageFile = new File([blob], 'test-plant.jpg', {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });

                console.log('Test image created:', {
                    name: imageFile.name,
                    size: imageFile.size,
                    type: imageFile.type
                });

                setStatus('Starting first plant analysis...');
                const result = await plantAnalysisService.identifyWithPlantId(imageFile);
                console.log('Analysis result:', JSON.stringify(result, null, 2));

                setStatus('Testing cache - analyzing same image again...');
                const cachedResult = await plantAnalysisService.identifyWithPlantId(imageFile);
                console.log('Cached result:', JSON.stringify(cachedResult, null, 2));

                setStatus('Test completed successfully! Check the console for full results.');
            } catch (error) {
                console.error('Test failed:', error);
                setError(error.message);
                setStatus('Test failed!');
            }
        }

        runTest();
    }, []);

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            padding: 3
        }}>
            <Typography variant="h4" gutterBottom>
                Firebase Integration Test
            </Typography>
            
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 2,
                marginTop: 4 
            }}>
                {status !== 'Test completed successfully! Check the console for full results.' && (
                    <CircularProgress />
                )}
                
                <Typography variant="body1">
                    {status}
                </Typography>

                {error && (
                    <Typography variant="body1" color="error">
                        Error: {error}
                    </Typography>
                )}

                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Open the browser console (F12) to see the full test results
                </Typography>
            </Box>
        </Box>
    );
}

export default TestFirebase;
