// API Configuration
// For Expo web, environment variables need special handling

export const API_CONFIG = {
  OPENAI_API_KEY: '',
  SPOONACULAR_API_KEY: '',
};

// Helper to get API keys with fallback
export const getOpenAIKey = (): string => {
  return (
    process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    API_CONFIG.OPENAI_API_KEY
  );
};

export const getSpoonacularKey = (): string => {
  return (
    process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY ||
    process.env.SPOONACULAR_API_KEY ||
    API_CONFIG.SPOONACULAR_API_KEY
  );
};
