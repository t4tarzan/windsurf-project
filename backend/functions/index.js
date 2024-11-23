const functions = require('firebase-functions');
const admin = require('firebase-admin');
const openaiService = require('./openaiService');
const feedAggregator = require('./feedAggregator');

admin.initializeApp();

// Export the feed aggregation functions
exports.aggregateFeeds = feedAggregator.aggregateFeeds;
exports.processContent = feedAggregator.processContent;
exports.enhanceContent = feedAggregator.enhanceContent;

// Additional function to generate new blog posts
exports.generateBlogPost = functions.https.onRequest(async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }

    // Generate blog post content using OpenAI
    const content = await openaiService.enhanceContent(
      'Write a comprehensive gardening article about ' + topic,
      topic,
      'generated'
    );

    // Generate SEO metadata
    const seoMetadata = await openaiService.generateSEOMetadata(topic, content);

    // Get related topics
    const relatedTopics = await openaiService.suggestRelatedTopics(topic, content);

    // Save to Firestore
    const blogRef = admin.firestore().collection('blogs');
    const docRef = await blogRef.add({
      title: seoMetadata.title,
      content: content,
      seoMetadata: seoMetadata,
      relatedTopics: relatedTopics,
      category: 'generated',
      status: 'draft',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'AI Generated',
      publishDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });

    res.json({
      success: true,
      postId: docRef.id,
      seoMetadata,
      relatedTopics
    });
  } catch (error) {
    console.error('Error generating blog post:', error);
    res.status(500).json({ error: 'Failed to generate blog post' });
  }
});

// Function to update existing blog posts with enhanced content
exports.enhanceExistingPost = functions.https.onRequest(async (req, res) => {
  try {
    const { postId } = req.body;
    
    if (!postId) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }

    // Get the existing post
    const postRef = admin.firestore().collection('blogs').doc(postId);
    const post = await postRef.get();

    if (!post.exists) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const postData = post.data();

    // Enhance the content
    const enhancedContent = await openaiService.enhanceContent(
      postData.content,
      postData.title,
      postData.category
    );

    // Generate new SEO metadata
    const seoMetadata = await openaiService.generateSEOMetadata(
      postData.title,
      enhancedContent
    );

    // Update the post
    await postRef.update({
      content: enhancedContent,
      seoMetadata: seoMetadata,
      lastModified: new Date().toISOString(),
      aiEnhanced: true
    });

    res.json({
      success: true,
      message: 'Post enhanced successfully'
    });
  } catch (error) {
    console.error('Error enhancing post:', error);
    res.status(500).json({ error: 'Failed to enhance post' });
  }
});

// Function to generate weekly content plan
exports.generateContentPlan = functions.pubsub.schedule('every monday 00:00').onRun(async (context) => {
  try {
    const db = admin.firestore();
    
    // Get current topics from existing posts
    const postsSnapshot = await db.collection('blogs')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    
    const existingTopics = [];
    postsSnapshot.forEach(doc => {
      existingTopics.push(doc.data().title);
    });

    // Generate new topics based on seasonal relevance
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const prompt = `
      Given these existing topics: ${existingTopics.join(', ')}
      
      Generate 5 new gardening article topics that are:
      1. Relevant for ${currentMonth}
      2. Not too similar to existing topics
      3. Likely to be searched by gardening enthusiasts
      4. Include a mix of beginner and advanced topics
      
      Return in JSON format with title and brief description for each.
    `;

    const completion = await openaiService.openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a gardening content strategist planning blog topics."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const topics = JSON.parse(completion.data.choices[0].message.content);

    // Save content plan to Firestore
    await db.collection('contentPlans').add({
      topics,
      month: currentMonth,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    });

    return null;
  } catch (error) {
    console.error('Error generating content plan:', error);
    throw new Error('Content plan generation failed');
  }
});
