import { addBlogPosts } from '../utils/blogPosts';

const run = async () => {
  console.log('Adding blog posts...');
  const posts = await addBlogPosts();
  console.log('Added posts:', posts);
  process.exit(0);
};

run().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
