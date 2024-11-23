import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

const fetchUniqueImages = async (query, count = 3) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos`,
      {
        params: {
          query,
          per_page: count,
          orientation: 'landscape'
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (response.data.results.length === 0) {
      throw new Error('No images found');
    }

    // Get unique images URLs
    return response.data.results.map(photo => ({
      url: photo.urls.regular,
      alt: photo.alt_description || query,
      credit: {
        name: photo.user.name,
        link: photo.user.links.html
      }
    }));
  } catch (error) {
    console.error(`Error fetching images for query "${query}":`, error);
    return null;
  }
};

const gardeningBlogPosts = [
  {
    title: "Urban Balcony Garden Ideas for Small Spaces",
    content: "Transform your balcony into a thriving garden with creative vertical gardening solutions and space-saving container ideas.",
    category: "Urban Gardening",
    tags: ["balcony garden", "small spaces", "container gardening"],
    author: "Garden Expert",
    imageQuery: "urban balcony garden plants"
  },
  {
    title: "Natural Composting Methods for Organic Gardens",
    content: "Master the art of composting with natural materials and create nutrient-rich soil for your organic garden.",
    category: "Sustainability",
    tags: ["composting", "organic gardening", "sustainability"],
    author: "Garden Expert",
    imageQuery: "garden compost pile organic"
  },
  {
    title: "Essential Culinary Herbs: Growing Guide",
    content: "Learn to grow and maintain a thriving herb garden filled with basil, thyme, rosemary, and other essential culinary herbs.",
    category: "Herbs",
    tags: ["herbs", "culinary garden", "kitchen garden"],
    author: "Garden Expert",
    imageQuery: "fresh herbs garden basil"
  },
  {
    title: "Seasonal Vegetable Growing Calendar",
    content: "Plan your vegetable garden throughout the year with this comprehensive seasonal growing guide and harvest calendar.",
    category: "Vegetables",
    tags: ["vegetables", "seasonal gardening", "planning"],
    author: "Garden Expert",
    imageQuery: "vegetable garden harvest"
  },
  {
    title: "Japanese Garden Design Elements",
    content: "Create a serene Japanese-inspired garden with traditional design elements, including rock gardens, water features, and zen spaces.",
    category: "Design",
    tags: ["japanese garden", "landscape", "zen garden"],
    author: "Garden Expert",
    imageQuery: "japanese zen garden"
  },
  {
    title: "Butterfly and Bee Garden Planning",
    content: "Design a pollinator-friendly garden that attracts butterflies, bees, and other beneficial insects with the right plants and layout.",
    category: "Wildlife",
    tags: ["pollinators", "butterfly garden", "bee-friendly"],
    author: "Garden Expert",
    imageQuery: "butterfly garden flowers"
  },
  {
    title: "Desert Landscaping with Succulents",
    content: "Master the art of desert landscaping with drought-resistant succulents, cacti, and other water-wise plants.",
    category: "Xeriscaping",
    tags: ["succulents", "desert garden", "drought-resistant"],
    author: "Garden Expert",
    imageQuery: "succulent garden desert"
  },
  {
    title: "Tropical Paradise Garden Design",
    content: "Transform your space into a lush tropical paradise with exotic plants, vibrant flowers, and dramatic foliage.",
    category: "Tropical",
    tags: ["tropical plants", "exotic garden", "paradise garden"],
    author: "Garden Expert",
    imageQuery: "tropical garden paradise"
  }
];

export const addBlogPosts = async () => {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error('Unsplash API key is missing! Please add REACT_APP_UNSPLASH_ACCESS_KEY to your .env file');
    return;
  }

  const blogsCollection = collection(db, 'blogs');
  const results = [];

  for (const post of gardeningBlogPosts) {
    try {
      console.log(`Fetching images for: ${post.title}`);
      
      // Fetch unique images from Unsplash
      const images = await fetchUniqueImages(post.imageQuery);
      
      if (!images) {
        console.error(`Failed to fetch images for: ${post.title}`);
        continue;
      }

      const now = new Date();
      
      const docRef = await addDoc(blogsCollection, {
        ...post,
        images,
        mainImage: images[0],
        createdAt: now.toISOString(),
        publishDate: now.toISOString(),
        lastUpdated: now.toISOString()
      });

      results.push({
        id: docRef.id,
        ...post,
        images,
        mainImage: images[0]
      });
      
      console.log('Added blog post:', docRef.id);
      
      // Add a delay between posts to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error adding blog post:', error);
    }
  }

  console.log('Added posts:', results);
  return results;
};
