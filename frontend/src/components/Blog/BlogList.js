import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Search as SearchIcon, LocalOffer as TagIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '300px', // Fixed height for content
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '4.5em', // Approximately 3 lines of text
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: '200px',
  objectFit: 'cover',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const fallbackImages = {
  default: [
    'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg', // General garden
    'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg', // Plant closeup
    'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg', // Greenhouse
  ],
  'Gardening Tips': [
    'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg', // Gardening tools
    'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg', // Person gardening
    'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg', // Garden work
  ],
  'Equipment': [
    'https://images.pexels.com/photos/1684820/pexels-photo-1684820.jpeg', // Tools
    'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg', // Garden tools
    'https://images.pexels.com/photos/1301643/pexels-photo-1301643.jpeg', // Watering can
  ],
  'Test': [
    'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg', // Test tubes with plants
    'https://images.pexels.com/photos/1207978/pexels-photo-1207978.jpeg', // Plant experiment
    'https://images.pexels.com/photos/1029844/pexels-photo-1029844.jpeg', // Plant growth
  ]
};

const getRandomImage = (category) => {
  const categoryImages = fallbackImages[category] || fallbackImages.default;
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

const BlogList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const articlesRef = collection(db, 'blogs');
      let q = query(
        articlesRef,
        orderBy('createdAt', 'desc'),
        limit(12)
      );

      const querySnapshot = await getDocs(q);
      const fetchedArticles = [];
      const categoriesSet = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Fetched article:', { id: doc.id, ...data }); // Debug log
        fetchedArticles.push({ id: doc.id, ...data });
        if (data.category) {
          categoriesSet.add(data.category);
        }
      });

      console.log('All fetched articles:', fetchedArticles); // Debug log
      setArticles(fetchedArticles);
      setCategories(Array.from(categoriesSet));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.seoMetadata?.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <StyledChip
                label="All"
                onClick={() => setSelectedCategory('all')}
                color={selectedCategory === 'all' ? 'primary' : 'default'}
              />
              {categories.map((category) => (
                <StyledChip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Articles Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : filteredArticles.length === 0 ? (
        <Box display="flex" justifyContent="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No articles found. {searchTerm ? 'Try a different search term.' : ''}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredArticles.map((article) => (
            <Grid item key={article.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={article.mainImage?.url || getRandomImage(article.category) || '/placeholder-garden.jpg'}
                  alt={article.mainImage?.alt || article.title}
                  sx={{ objectFit: 'cover' }}
                />
                {article.mainImage?.credit && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, px: 2 }}>
                    Photo by{' '}
                    <Link href={article.mainImage.credit.link} target="_blank" rel="noopener noreferrer">
                      {article.mainImage.credit.name}
                    </Link>
                    {' on Unsplash'}
                  </Typography>
                )}
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        height: '3.6em',
                        lineHeight: '1.8em',
                      }}
                    >
                      {article.title || 'Untitled Post'}
                    </Typography>
                  </Box>
                  
                  <StyledTypography variant="body2" color="text.secondary" paragraph>
                    {article.content ? article.content.substring(0, 160) + '...' : 'No content available'}
                  </StyledTypography>
                  
                  <Box sx={{ mt: 'auto' }}>
                    {article.category && (
                      <Box display="flex" gap={1} mb={2}>
                        <Chip
                          size="small"
                          icon={<TagIcon />}
                          label={article.category}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    )}
                    <Button
                      component={RouterLink}
                      to={`/blog/${article.id}`}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Read More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BlogList;
