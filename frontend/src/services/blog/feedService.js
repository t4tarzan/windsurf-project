import axios from 'axios';
import Parser from 'rss-parser';
import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

class FeedService {
  constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'media'],
          ['content:encoded', 'contentEncoded'],
        ],
      },
    });
    
    this.sources = {
      rss: [
        {
          name: 'RHS',
          url: 'https://www.rhs.org.uk/feeds/rss',
          category: 'professional',
          priority: 1
        },
        {
          name: 'Gardening Know How',
          url: 'https://blog.gardeningknowhow.com/feed/',
          category: 'educational',
          priority: 2
        },
        {
          name: 'Fine Gardening',
          url: 'https://www.finegardening.com/feed',
          category: 'professional',
          priority: 2
        }
      ],
      apis: [
        {
          name: 'Trefle',
          baseUrl: 'https://trefle.io/api/v1/',
          apiKey: process.env.REACT_APP_TREFLE_API_KEY,
          category: 'scientific',
          priority: 1
        },
        {
          name: 'USDA PLANTS',
          baseUrl: 'https://plants.sc.egov.usda.gov/api/plants/',
          category: 'scientific',
          priority: 2
        }
      ]
    };
  }

  async fetchRSSFeed(source) {
    try {
      const feed = await this.parser.parseURL(source.url);
      return feed.items.map(item => ({
        title: item.title,
        content: item.contentEncoded || item.content,
        link: item.link,
        pubDate: item.pubDate,
        source: source.name,
        category: source.category,
        media: item.media,
      }));
    } catch (error) {
      console.error(`Error fetching RSS feed from ${source.name}:`, error);
      return [];
    }
  }

  async fetchTrefleData(query) {
    try {
      const response = await axios.get(`${this.sources.apis[0].baseUrl}plants/search`, {
        params: {
          q: query,
          token: this.sources.apis[0].apiKey
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Trefle data:', error);
      return [];
    }
  }

  async saveFeedItem(item) {
    try {
      const feedsRef = collection(db, 'blogs');
      const docData = {
        ...item,
        processedContent: await this.processContent(item.content),
        seoMetadata: await this.generateSEOMetadata(item),
        createdAt: serverTimestamp(),
        status: 'draft'
      };
      
      await addDoc(feedsRef, docData);
    } catch (error) {
      console.error('Error saving feed item:', error);
    }
  }

  async processContent(content) {
    // Remove HTML tags, normalize spacing
    let processed = content.replace(/<[^>]*>/g, ' ');
    processed = processed.replace(/\s+/g, ' ').trim();
    
    // TODO: Add AI processing when OpenAI key is provided
    // - Content enhancement
    // - Keyword optimization
    // - Internal linking suggestions
    
    return processed;
  }

  async generateSEOMetadata(item) {
    // Basic SEO metadata generation
    const description = item.content.substring(0, 160).replace(/<[^>]*>/g, '');
    const keywords = this.extractKeywords(item.title + ' ' + description);
    
    return {
      title: item.title,
      description,
      keywords,
      canonicalUrl: item.link,
      publishDate: item.pubDate,
      lastModified: new Date().toISOString()
    };
  }

  extractKeywords(text) {
    // Basic keyword extraction
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => !commonWords.has(word));
    
    return [...new Set(words)];
  }

  async aggregateFeeds() {
    const allItems = [];
    
    // Fetch RSS feeds
    for (const source of this.sources.rss) {
      const items = await this.fetchRSSFeed(source);
      allItems.push(...items);
    }
    
    // Process and save items
    for (const item of allItems) {
      await this.saveFeedItem(item);
    }
    
    return allItems;
  }
}

export default new FeedService();
