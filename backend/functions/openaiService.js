const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

class OpenAIService {
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async enhanceContent(content, title, category) {
    try {
      const prompt = `
        As a gardening and plant care expert, enhance this article while maintaining its core message.
        Make it more engaging, informative, and SEO-friendly.
        
        Original Title: ${title}
        Category: ${category}
        
        Original Content:
        ${content}
        
        Please enhance this content by:
        1. Improving readability and flow
        2. Adding relevant gardening tips and best practices
        3. Including scientific plant care information
        4. Optimizing for SEO
        5. Making it more engaging for readers
        
        Return the enhanced content in markdown format.
      `;

      const completion = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert gardening and plant care content writer with deep knowledge of SEO best practices."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return completion.data.choices[0].message.content;
    } catch (error) {
      console.error('Error enhancing content with OpenAI:', error);
      throw error;
    }
  }

  async generateSEOMetadata(title, content) {
    try {
      const prompt = `
        Generate SEO metadata for this gardening article:
        
        Title: ${title}
        Content: ${content.substring(0, 500)}...
        
        Please provide:
        1. SEO-optimized title (under 60 characters)
        2. Meta description (under 160 characters)
        3. Focus keyword
        4. Related keywords (5-7)
        5. Suggested internal linking topics
        
        Return in JSON format.
      `;

      const completion = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert specializing in gardening and plant care content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      return JSON.parse(completion.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating SEO metadata:', error);
      throw error;
    }
  }

  async suggestRelatedTopics(title, content) {
    try {
      const prompt = `
        Based on this gardening article:
        
        Title: ${title}
        Content: ${content.substring(0, 500)}...
        
        Suggest:
        1. 5 related article topics
        2. 3 relevant plant species to mention
        3. 2 seasonal gardening tips
        4. 2 common problems and solutions
        
        Return in JSON format.
      `;

      const completion = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a gardening content strategist with expertise in creating engaging content series."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      return JSON.parse(completion.data.choices[0].message.content);
    } catch (error) {
      console.error('Error suggesting related topics:', error);
      throw error;
    }
  }
}

module.exports = new OpenAIService();
