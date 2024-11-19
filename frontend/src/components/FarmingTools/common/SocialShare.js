import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Divider
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';

export const SocialShare = () => {
  const shareUrl = window.location.href;
  const title = document.title;

  const handleShare = (platform) => {
    let url;
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Share this tool:
      </Typography>
      <IconButton 
        color="primary" 
        onClick={() => handleShare('facebook')}
        aria-label="Share on Facebook"
      >
        <FacebookIcon />
      </IconButton>
      <IconButton 
        color="primary" 
        onClick={() => handleShare('twitter')}
        aria-label="Share on Twitter"
      >
        <TwitterIcon />
      </IconButton>
      <IconButton 
        color="primary" 
        onClick={() => handleShare('linkedin')}
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon />
      </IconButton>
    </Box>
  );
};
