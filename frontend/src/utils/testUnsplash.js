const { addBlogPosts } = require('./blogPosts');

console.log('Starting blog post generation with Unsplash images...');
console.log('Environment variable:', process.env.REACT_APP_UNSPLASH_ACCESS_KEY);
addBlogPosts()
  .then(results => {
    console.log('Successfully generated blog posts with images:', results);
  })
  .catch(error => {
    console.error('Error generating blog posts:', error);
  });
