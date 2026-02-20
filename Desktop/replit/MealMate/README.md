# 🍽️ MealMate - AI-Powered Meal Planning App

MealMate is a React Native mobile app that helps you discover recipes based on ingredients you have at home. Scan your fridge, get AI cooking advice, and never waste food again!

## ✨ Features

- 📸 **Smart Scanning**: Use your camera to identify ingredients with AI vision
- 🤖 **AI Chef Assistant**: Get instant cooking advice and recipe suggestions (no API needed!)
- 🍳 **Recipe Discovery**: Find recipes based on your available ingredients
- 🛒 **Shopping List**: Automatically generate shopping lists for missing ingredients
- 📦 **Inventory Management**: Track your ingredients with categories and images
- 🎨 **Beautiful UI**: Modern design with gradients and real food images

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd MealMate

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

- **Web**: Press `w` or navigate to http://localhost:8081
- **iOS**: Press `i` (requires Xcode)
- **Android**: Press `a` (requires Android Studio)
- **Mobile Device**: Scan the QR code with Expo Go app

## 🔑 API Configuration

The app uses two APIs:

1. **OpenAI API** (for ingredient scanning only)
2. **Spoonacular API** (for recipe and ingredient images)

### Setup API Keys

1. Copy `.env.example` to `.env`
2. Add your API keys:

```env
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key_here
EXPO_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_key_here
```

### Get API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **Spoonacular**: https://spoonacular.com/food-api

## 📱 App Structure

```
MealMate/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── services/         # API services
│   ├── store/            # Redux state management
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── theme/            # Colors and styling
├── assets/               # Images and icons
├── .env                  # API keys (not in git)
└── app.json              # Expo configuration
```

## 🎯 How It Works

### 1. AI Assistant (Chat)
- **Technology**: Rule-based pattern matching
- **Cost**: Free, no API calls
- **Speed**: Instant responses
- **Features**: Cooking tips, recipe ideas, techniques

### 2. Scan Screen
- **Technology**: OpenAI Vision (gpt-4o)
- **Purpose**: Identify ingredients from photos
- **Process**: Camera → AI → Inventory

### 3. Recipe Discovery
- **Technology**: Spoonacular API
- **Purpose**: Find recipes with your ingredients
- **Features**: Match percentage, missing ingredients

### 4. Ingredient Search
- **Technology**: Spoonacular API
- **Purpose**: Browse ingredients by category
- **Features**: Real food images, 1000+ ingredients

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Storage**: AsyncStorage with Redux Persist
- **APIs**: OpenAI Vision, Spoonacular
- **UI**: Expo Linear Gradient, Vector Icons

## 📦 Key Dependencies

```json
{
  "expo": "~54.0.33",
  "react-native": "0.81.5",
  "@reduxjs/toolkit": "^2.11.2",
  "axios": "^1.13.5",
  "expo-camera": "^17.0.10",
  "expo-image-picker": "^17.0.10"
}
```

## 🎨 Features Breakdown

### Smart Scanning
- Take photos of your fridge
- AI identifies ingredients automatically
- Adds to inventory with categories

### AI Chef Assistant
- Ask cooking questions
- Get recipe suggestions
- Learn cooking techniques
- Instant responses (no waiting!)

### Recipe Discovery
- Recipes based on your ingredients
- Match percentage indicator
- Missing ingredients highlighted
- Step-by-step instructions

### Shopping List
- Auto-generate from recipes
- Category filtering
- Mark items as purchased
- Delete functionality

### Inventory Management
- Add ingredients manually or by scanning
- Category-based organization
- Real food images
- Track when added

## 🚢 Deployment

### Deploy to Replit

1. Push code to GitHub
2. Import repository to Replit
3. Replit auto-detects Expo project
4. Click "Run" to start

### Build for Production

```bash
# iOS
expo build:ios

# Android
expo build:android

# Web
expo build:web
```

## 🐛 Troubleshooting

### Images not loading
- Check Spoonacular API key in `.env`
- Verify internet connection
- Check browser console for errors

### Scan not working
- Check OpenAI API key in `.env`
- Grant camera permissions
- Ensure good lighting for photos

### AI chat not responding
- Should always work (no API needed)
- Check browser console for errors
- Reload the app

## 📝 Environment Variables

```env
# OpenAI API (for scanning only)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...

# Spoonacular API (for images and recipes)
EXPO_PUBLIC_SPOONACULAR_API_KEY=...
```

## 🎯 Project Goals

Built for the Replit Mobile App Challenge with these goals:
- ✅ Solve real-world problem (meal planning)
- ✅ Beautiful, modern UI
- ✅ Smart AI integration
- ✅ Production-ready quality
- ✅ Fast and responsive

## 📄 License

MIT License - feel free to use this project for learning or building your own apps!

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for the Replit Mobile App Challenge**
