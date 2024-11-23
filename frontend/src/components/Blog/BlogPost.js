import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  ContentCopy as ContentCopyIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Helmet } from 'react-helmet-async';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const ShareButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const TableOfContents = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.grey[50],
}));

const BlogContent = styled('div')(({ theme }) => ({
  '& .blog-content': {
    fontSize: '1.1rem',
    lineHeight: 1.6,
  },
  '& h2': {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    fontSize: '1.8rem',
  },
  '& h3': {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
    fontSize: '1.5rem',
  },
  '& p': {
    marginBottom: theme.spacing(2),
  },
  '& ul, & ol': {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
  },
  '& li': {
    marginBottom: theme.spacing(1),
  },
  '& blockquote': {
    margin: theme.spacing(3, 0),
    padding: theme.spacing(2, 4),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.grey[50],
    fontStyle: 'italic',
  },
  '& pre': {
    margin: theme.spacing(3, 0),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    overflowX: 'auto',
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    margin: theme.spacing(3, 0),
    borderRadius: theme.shape.borderRadius,
  },
  '& table': {
    width: '100%',
    margin: theme.spacing(3, 0),
    borderCollapse: 'collapse',
  },
  '& th, & td': {
    padding: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  '& th': {
    backgroundColor: theme.palette.grey[50],
    fontWeight: 'bold',
  },
}));

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const postData = docSnap.data();
        setPost({ id: docSnap.id, ...postData });
        
        if (!postData.generatedContent) {
          generateContent(postData);
        }
      } else {
        navigate('/blog');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Error loading the blog post');
      setLoading(false);
    }
  };

  const generateContent = async (postData) => {
    setGeneratingContent(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8000/generate-blog-content', {
        title: postData.title,
        content: postData.content || 'A blog post about ' + postData.title,
        category: postData.category
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.content) {
        // Update Firebase with the generated content
        const docRef = doc(db, 'blogs', id);
        const updatedPost = {
          ...postData,
          generatedContent: response.data.content,
          sections: response.data.sections || [],
          lastUpdated: new Date().toISOString()
        };
        
        await updateDoc(docRef, updatedPost);
        setPost({ id, ...updatedPost });
        setSuccess(true);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error.response?.data?.detail || 'Failed to generate content. Please try again later.');
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = encodeURIComponent(post.title);
    const hashtags = 'gardening,plants,nature';
    
    let shareUrl;
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=${hashtags}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setSuccess(true);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h5" color="error">Post not found</Typography>
      </Box>
    );
  }

  const { title, content, author, createdAt, category, tags, images, seoMetadata } = post;

  return (
    <>
      <Helmet>
        <title>{title} | Gardening Blog</title>
        <meta name="description" content={seoMetadata?.description || `${content.substring(0, 155)}...`} />
        <meta name="keywords" content={tags?.join(', ')} />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={seoMetadata?.description || `${content.substring(0, 155)}...`} />
        <meta property="og:image" content={images?.[0]?.url} />
        <meta property="og:type" content="article" />
        <meta property="og:article:published_time" content={createdAt?.toDate?.().toISOString()} />
        <meta property="og:article:author" content={author} />
        <meta property="og:article:section" content={category} />
        {tags?.map(tag => (
          <meta property="og:article:tag" content={tag} key={tag} />
        ))}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={seoMetadata?.description || `${content.substring(0, 155)}...`} />
        <meta name="twitter:image" content={images?.[0]?.url} />
        
        {/* Schema.org markup for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "image": images?.map(img => img.url),
            "datePublished": createdAt?.toDate?.().toISOString(),
            "dateModified": post.updatedAt?.toDate?.().toISOString() || createdAt?.toDate?.().toISOString(),
            "author": {
              "@type": "Person",
              "name": author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Gardening Blog",
              "logo": {
                "@type": "ImageObject",
                "url": "https://yourdomain.com/logo.png"
              }
            },
            "description": seoMetadata?.description || `${content.substring(0, 155)}...`,
            "keywords": tags?.join(', '),
            "articleSection": category,
            "articleBody": content
          })}
        </script>
      </Helmet>
      <StyledContainer maxWidth="md">
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            {post.title}
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Chip
              icon={<TagIcon />}
              label={post.category}
              color="primary"
              variant="outlined"
            />
            <Box ml="auto">
              <ShareButton onClick={() => handleShare('facebook')} aria-label="Share on Facebook">
                <FacebookIcon />
              </ShareButton>
              <ShareButton onClick={() => handleShare('twitter')} aria-label="Share on Twitter">
                <TwitterIcon />
              </ShareButton>
              <ShareButton onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn">
                <LinkedInIcon />
              </ShareButton>
              <ShareButton onClick={() => handleShare('copy')} aria-label="Copy link">
                <ContentCopyIcon />
              </ShareButton>
            </Box>
          </Box>
        </Box>

        {/* Featured Image */}
        {post.image && (
          <Box mb={4}>
            <img
              src={post.image}
              alt={post.title}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Box>
        )}

        {/* Content Generation Status */}
        {generatingContent && (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography variant="body1" color="textSecondary">
              Generating comprehensive content...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Generated Content */}
        {post.generatedContent && (
          <Paper elevation={0} sx={{ p: 3 }}>
            <BlogContent>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={docco}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table({ node, ...props }) {
                    return (
                      <TableContainer component={Paper} sx={{ my: 2 }}>
                        <Table size="small" {...props} />
                      </TableContainer>
                    );
                  },
                  thead({ node, ...props }) {
                    return <TableHead {...props} />;
                  },
                  tbody({ node, ...props }) {
                    return <TableBody {...props} />;
                  },
                  tr({ node, ...props }) {
                    return <TableRow {...props} />;
                  },
                  th({ node, ...props }) {
                    return <TableCell component="th" sx={{ fontWeight: 'bold' }} {...props} />;
                  },
                  td({ node, ...props }) {
                    return <TableCell {...props} />;
                  },
                  blockquote({ node, ...props }) {
                    return (
                      <Paper
                        elevation={0}
                        sx={{
                          my: 2,
                          px: 3,
                          py: 1,
                          borderLeft: 4,
                          borderColor: 'primary.main',
                          bgcolor: 'grey.50',
                        }}
                        {...props}
                      />
                    );
                  },
                  img({ node, ...props }) {
                    return (
                      <Box
                        component="img"
                        sx={{
                          maxWidth: '100%',
                          height: 'auto',
                          my: 2,
                          borderRadius: 1,
                        }}
                        {...props}
                      />
                    );
                  },
                }}
              >
                {post.generatedContent}
              </ReactMarkdown>
            </BlogContent>
          </Paper>
        )}

        {/* Navigation */}
        <Box display="flex" justifyContent="space-between" mt={6}>
          <Button
            variant="outlined"
            onClick={() => navigate('/blog')}
          >
            Back to Blog
          </Button>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            {post.generatedContent ? 'Content generated successfully!' : 'Link copied to clipboard!'}
          </Alert>
        </Snackbar>
      </StyledContainer>
    </>
  );
};

export default BlogPost;
