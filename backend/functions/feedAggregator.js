const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Parser = require('rss-parser');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();
const parser = new Parser();

exports.aggregateFeeds = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const feedsRef = db.collection('blogs');
  const sourcesRef = db.collection('sources');

  try {
    // Get all active sources
    const sourcesSnapshot = await sourcesRef.where('active', '==', true).get();
    const sources = [];
    sourcesSnapshot.forEach(doc => sources.push({ id: doc.id, ...doc.data() }));

    for (const source of sources) {
      if (source.type === 'rss') {
        try {
          const feed = await parser.parseURL(source.url);
          
          for (const item of feed.items) {
            // Check if article already exists
            const existing = await feedsRef
              .where('link', '==', item.link)
              .limit(1)
              .get();

            if (existing.empty) {
              await feedsRef.add({
                title: item.title,
                content: item.content,
                link: item.link,
                pubDate: new Date(item.pubDate),
                source: source.name,
                category: source.category,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'draft',
                processed: false
              });
            }
          }
        } catch (error) {
          console.error(`Error processing RSS feed ${source.name}:`, error);
        }
      }
    }

    // Cleanup old draft posts
    const oldDrafts = await feedsRef
      .where('status', '==', 'draft')
      .where('createdAt', '<', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .get();

    const batch = db.batch();
    oldDrafts.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return null;
  } catch (error) {
    console.error('Error in feed aggregation:', error);
    throw new Error('Feed aggregation failed');
  }
});

exports.processContent = functions.firestore
  .document('blogs/{blogId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    if (data.processed) return null;

    try {
      // Basic content processing
      let processedContent = data.content.replace(/<[^>]*>/g, ' ');
      processedContent = processedContent.replace(/\s+/g, ' ').trim();

      // Generate SEO metadata
      const description = processedContent.substring(0, 160);
      const keywords = extractKeywords(data.title + ' ' + description);

      // Update the document
      await snap.ref.update({
        processedContent,
        seoMetadata: {
          description,
          keywords,
          canonicalUrl: data.link,
          publishDate: data.pubDate,
          lastModified: admin.firestore.FieldValue.serverTimestamp()
        },
        processed: true
      });

      return null;
    } catch (error) {
      console.error('Error processing content:', error);
      throw new Error('Content processing failed');
    }
  });

function extractKeywords(text) {
  const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => !commonWords.has(word));
  
  return [...new Set(words)];
}

// When OpenAI key is provided, add AI processing here
exports.enhanceContent = functions.firestore
  .document('blogs/{blogId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    if (!newData.processed || newData.aiEnhanced || !process.env.OPENAI_API_KEY) return null;

    try {
      // TODO: Implement OpenAI content enhancement
      // - Improve readability
      // - Add relevant internal links
      // - Optimize for SEO
      // - Generate additional related content

      return null;
    } catch (error) {
      console.error('Error enhancing content:', error);
      throw new Error('Content enhancement failed');
    }
  });
