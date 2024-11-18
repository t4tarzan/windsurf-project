import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ImagePreview = ({ image, onClose }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <img
        src={image}
        alt="Plant preview"
        style={{
          width: '100%',
          borderRadius: 8,
          maxHeight: '60vh',
          objectFit: 'contain',
        }}
      />
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'white',
          '&:hover': {
            bgcolor: 'grey.100',
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default ImagePreview;
