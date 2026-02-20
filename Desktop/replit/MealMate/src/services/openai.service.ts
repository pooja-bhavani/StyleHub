import axios from 'axios';
import { Ingredient, IngredientCategory } from '../types/ingredient.types';
import { getOpenAIKey } from '../config/api.config';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface IngredientIdentification {
  ingredients: Array<{
    name: string;
    confidence: number;
    category: string;
  }>;
  processingTime: number;
}

export const identifyIngredients = async (imageBase64: string): Promise<Ingredient[]> => {
  const apiKey = getOpenAIKey();
  
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identify all food ingredients in this image. Return ONLY a JSON array with objects containing: name (string), confidence (0-1), category (produce/protein/dairy/grains/spices/condiments/beverages/other). Identify at least 10 items if present. Example: [{"name":"tomato","confidence":0.95,"category":"produce"}]'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const ingredientsData = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    const ingredients: Ingredient[] = ingredientsData.map((item: any, index: number) => ({
      id: `ingredient-${Date.now()}-${index}`,
      name: item.name,
      category: item.category as IngredientCategory,
      confidence: item.confidence || 0.9,
      addedDate: new Date(),
      source: 'scan' as const,
    }));

    return ingredients;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to identify ingredients. Please try again.');
  }
};

// Enhanced AI with conversation history support
export const askAIAssistant = async (
  systemPrompt: string, 
  userMessage: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<string> => {
  const apiKey = getOpenAIKey();
  
  console.log('OpenAI API Key present:', !!apiKey);
  console.log('API Key length:', apiKey.length);
  console.log('API Key prefix:', apiKey.substring(0, 10));
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.');
  }

  try {
    // Build messages array with conversation history
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history if provided (last 10 messages for context)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    console.log('Making OpenAI API request...');
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o', // Upgraded to gpt-4o for better responses
        messages: messages,
        max_tokens: 1500, // Increased for more detailed responses
        temperature: 0.8, // Slightly higher for more creative responses
        presence_penalty: 0.6, // Encourage diverse responses
        frequency_penalty: 0.3, // Reduce repetition
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000 // Increased timeout for longer responses
      }
    );

    console.log('OpenAI API response received');
    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error('OpenAI API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Provide more specific error messages
      if (error.response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.response.status === 402) {
        throw new Error('Billing issue. Please check your OpenAI account billing.');
      }
    }
    throw new Error('Failed to get AI response. Please check your API key and try again.');
  }
};

export const askAIWithImage = async (
  systemPrompt: string, 
  userMessage: string, 
  imageUri: string,
  conversationHistory?: Array<{ role: string; content: any }>
): Promise<string> => {
  const apiKey = getOpenAIKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.');
  }

  try {
    // Import image processing utilities
    const { compressImage, convertToBase64 } = require('../utils/imageProcessing');
    
    // Compress and convert image to base64
    const compressedUri = await compressImage(imageUri);
    const base64Image = await convertToBase64(compressedUri);

    // Build messages array with conversation history
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history if provided (last 8 messages for context, excluding images to save tokens)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-8).map(msg => {
        // Convert image content to text-only for history
        if (typeof msg.content === 'object' && Array.isArray(msg.content)) {
          return {
            role: msg.role,
            content: msg.content.find((c: any) => c.type === 'text')?.text || 'Image uploaded'
          };
        }
        return msg;
      });
      messages.push(...recentHistory);
    }

    // Add current user message with image
    messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: userMessage
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
            detail: 'high' // High detail for better image analysis
          }
        }
      ]
    });

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 1500, // Increased for detailed image analysis
        temperature: 0.8,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error('OpenAI Vision API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw new Error('Failed to analyze image. Please check your API key and try again.');
  }
};
