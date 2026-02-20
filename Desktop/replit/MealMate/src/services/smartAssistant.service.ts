// Smart Rule-Based AI Assistant - No API needed!
// This provides intelligent cooking advice without external APIs

interface RecipeDatabase {
  [key: string]: {
    name: string;
    time: string;
    difficulty: string;
    ingredients: string[];
    instructions: string[];
    tips: string[];
  };
}

// Comprehensive recipe database
const RECIPE_DATABASE: RecipeDatabase = {
  // Quick 15-min recipes
  'scrambled-eggs': {
    name: 'Perfect Scrambled Eggs',
    time: '5 minutes',
    difficulty: 'Easy',
    ingredients: ['2-3 eggs', 'butter', 'salt', 'pepper', 'milk (optional)'],
    instructions: [
      'Beat eggs with a splash of milk, salt, and pepper',
      'Heat butter in a non-stick pan over medium-low heat',
      'Pour in eggs and let sit for 20 seconds',
      'Gently stir with a spatula, creating large curds',
      'Remove from heat when still slightly wet (they\'ll continue cooking)',
      'Serve immediately'
    ],
    tips: ['Low heat is key for creamy eggs', 'Don\'t overcook - remove when slightly wet', 'Add cheese or herbs for variety']
  },
  'avocado-toast': {
    name: 'Avocado Toast',
    time: '5 minutes',
    difficulty: 'Easy',
    ingredients: ['bread', 'avocado', 'lemon juice', 'salt', 'pepper', 'red pepper flakes'],
    instructions: [
      'Toast bread until golden brown',
      'Mash avocado with lemon juice, salt, and pepper',
      'Spread avocado on toast',
      'Top with red pepper flakes, olive oil, or a fried egg'
    ],
    tips: ['Use ripe avocado for best texture', 'Add tomatoes or feta for extra flavor']
  },
  'pasta-aglio-olio': {
    name: 'Pasta Aglio e Olio',
    time: '15 minutes',
    difficulty: 'Easy',
    ingredients: ['spaghetti', 'garlic', 'olive oil', 'red pepper flakes', 'parsley', 'parmesan'],
    instructions: [
      'Cook pasta in salted boiling water until al dente',
      'Meanwhile, sauté sliced garlic in olive oil until golden',
      'Add red pepper flakes and pasta water',
      'Toss cooked pasta in the garlic oil',
      'Add parsley and parmesan, serve hot'
    ],
    tips: ['Don\'t burn the garlic!', 'Save pasta water for sauce', 'Simple but delicious']
  },
  'stir-fry': {
    name: 'Quick Vegetable Stir-Fry',
    time: '15 minutes',
    difficulty: 'Easy',
    ingredients: ['mixed vegetables', 'soy sauce', 'garlic', 'ginger', 'oil', 'rice or noodles'],
    instructions: [
      'Heat oil in a wok or large pan over high heat',
      'Add garlic and ginger, stir for 30 seconds',
      'Add vegetables, stir-fry for 3-5 minutes',
      'Add soy sauce and other seasonings',
      'Serve over rice or noodles'
    ],
    tips: ['High heat is essential', 'Cut vegetables uniformly', 'Don\'t overcrowd the pan']
  },
  'grilled-cheese': {
    name: 'Perfect Grilled Cheese',
    time: '10 minutes',
    difficulty: 'Easy',
    ingredients: ['bread', 'cheese', 'butter'],
    instructions: [
      'Butter one side of each bread slice',
      'Place cheese between bread (butter side out)',
      'Cook in pan over medium heat until golden',
      'Flip and cook other side until cheese melts'
    ],
    tips: ['Medium heat prevents burning', 'Cover pan to melt cheese faster', 'Try different cheese combinations']
  },
  'chicken-breast': {
    name: 'Pan-Seared Chicken Breast',
    time: '20 minutes',
    difficulty: 'Medium',
    ingredients: ['chicken breast', 'salt', 'pepper', 'oil', 'butter', 'garlic'],
    instructions: [
      'Pat chicken dry and season with salt and pepper',
      'Heat oil in pan over medium-high heat',
      'Sear chicken 6-7 minutes per side until golden',
      'Add butter and garlic, baste chicken',
      'Rest 5 minutes before slicing'
    ],
    tips: ['Don\'t move chicken while searing', 'Use meat thermometer (165°F)', 'Resting keeps it juicy']
  }
};

// Cooking techniques database
const TECHNIQUES = {
  'searing': 'High heat, dry surface, don\'t move the food until a crust forms',
  'sautéing': 'Medium-high heat, keep food moving, use enough oil',
  'roasting': 'Dry heat in oven, 400-450°F, gives caramelization',
  'braising': 'Brown first, then cook low and slow in liquid',
  'blanching': 'Boil briefly, then ice bath to stop cooking',
  'deglazing': 'Add liquid to hot pan to lift browned bits',
};

// Ingredient substitutions
const SUBSTITUTIONS = {
  'butter': ['olive oil', 'coconut oil', 'ghee'],
  'milk': ['almond milk', 'oat milk', 'coconut milk'],
  'eggs': ['flax eggs', 'chia eggs', 'applesauce (baking)'],
  'flour': ['almond flour', 'coconut flour', 'oat flour'],
  'sugar': ['honey', 'maple syrup', 'stevia'],
  'soy sauce': ['tamari', 'coconut aminos', 'worcestershire sauce'],
};

// Smart response generator with conversation memory
export const getSmartResponse = (userMessage: string, inventory: string[], conversationHistory: string[] = []): string => {
  const message = userMessage.toLowerCase();
  
  // Check if this is a repeat question
  const isRepeat = conversationHistory.some(msg => msg.toLowerCase().includes(message.substring(0, 20)));
  
  // Specific ingredient questions
  if (message.includes('chicken') || message.includes('poultry')) {
    return `🍗 **Chicken Cooking Guide:**

**Best Methods:**
- **Pan-Seared:** 6-7 min per side, golden crust
- **Baked:** 375°F for 25-30 min, juicy inside
- **Grilled:** High heat, 5-6 min per side
- **Stir-Fry:** Cut small, cook fast on high heat

**Quick Recipes:**
1. **Lemon Garlic Chicken:** Pan-sear with butter, garlic, lemon juice
2. **Chicken Stir-Fry:** High heat, veggies, soy sauce, ginger
3. **Baked Herb Chicken:** Olive oil, rosemary, thyme, 375°F

**Pro Tips:**
- Pat dry before cooking for better browning
- Don't overcook! Use thermometer (165°F)
- Let rest 5 minutes before cutting
- Pound to even thickness for uniform cooking`;
  }
  
  if (message.includes('pasta') || message.includes('spaghetti') || message.includes('noodle')) {
    return `🍝 **Pasta Perfection:**

**Cooking Basics:**
- Use lots of salted water (tastes like the sea!)
- Don't add oil to water (sauce won't stick)
- Save 1 cup pasta water before draining
- Cook to al dente (firm to bite)

**Quick Sauces (10 min):**
1. **Aglio e Olio:** Garlic + olive oil + red pepper + pasta water
2. **Cacio e Pepe:** Butter + black pepper + parmesan + pasta water
3. **Marinara:** Canned tomatoes + garlic + basil + olive oil
4. **Carbonara:** Eggs + parmesan + bacon + black pepper

**Pro Secrets:**
- Pasta water is liquid gold (starchy, salty, perfect for sauce)
- Finish cooking pasta IN the sauce
- Toss with tongs, don't just pour sauce on top
- Add pasta water gradually to reach perfect consistency`;
  }
  
  if (message.includes('egg') || message.includes('omelette') || message.includes('scramble')) {
    return `🥚 **Egg Mastery:**

**Scrambled Eggs (Creamy):**
- Beat eggs with splash of milk
- Low heat + butter
- Stir gently, large curds
- Remove when slightly wet
- **Time:** 5 minutes

**Perfect Fried Egg:**
- Medium heat, butter or oil
- Crack egg gently into pan
- Cover for over-easy
- **Time:** 3-4 minutes

**Fluffy Omelette:**
- Beat eggs with fork (not too much!)
- Medium heat, butter
- Let set 30 seconds, then fold
- **Time:** 5 minutes

**Pro Tips:**
- Low and slow for scrambled
- Fresh eggs have better flavor
- Room temperature eggs cook more evenly
- Salt at the end (prevents watery eggs)`;
  }
  
  if (message.includes('steak') || message.includes('beef')) {
    return `🥩 **Perfect Steak Every Time:**

**The Method:**
1. **Prep:** Pat DRY, room temp 30 min, salt generously
2. **Sear:** Smoking hot pan, don't move for 4 min
3. **Flip:** Once, cook 3-4 min other side
4. **Butter Baste:** Add butter, garlic, thyme - spoon over steak
5. **Rest:** 5-10 minutes (crucial!)

**Temperatures:**
- Rare: 125°F (cool red center)
- Medium-Rare: 135°F (warm red center) ⭐ Best!
- Medium: 145°F (warm pink center)
- Well: 155°F+ (no pink)

**Pro Secrets:**
- Dry surface = better crust
- Don't press down on steak!
- Resting redistributes juices
- Cut against the grain

**Best Cuts for Pan:**
Ribeye, NY Strip, Filet Mignon`;
  }
  
  if (message.includes('rice') || message.includes('grain')) {
    return `🍚 **Perfect Rice & Grains:**

**White Rice (Absorption Method):**
- 1 cup rice : 2 cups water
- Bring to boil, cover, simmer 18 min
- Let sit 5 min, fluff with fork
- **Never lift the lid while cooking!**

**Brown Rice:**
- 1 cup rice : 2.5 cups water
- Simmer 45 minutes
- More nutritious, nuttier flavor

**Quinoa:**
- 1 cup quinoa : 2 cups water
- Simmer 15 minutes
- Complete protein!

**Pro Tips:**
- Rinse rice first (removes excess starch)
- Toast rice in oil before adding water (nutty flavor)
- Add salt to cooking water
- Fluff with fork, not spoon`;
  }
  
  if (message.includes('vegetable') || message.includes('veggie')) {
    return `🥬 **Vegetable Cooking Guide:**

**Roasting (Best Method!):**
- 425°F, 20-30 minutes
- Toss with olive oil, salt, pepper
- Spread in single layer
- **Works for:** Broccoli, carrots, Brussels sprouts, cauliflower

**Sautéing (Quick!):**
- High heat, oil, 5-7 minutes
- Keep moving
- **Works for:** Spinach, mushrooms, peppers, zucchini

**Steaming (Healthy!):**
- 5-10 minutes
- Preserves nutrients
- **Works for:** Broccoli, green beans, asparagus

**Grilling:**
- High heat, brush with oil
- **Works for:** Corn, peppers, eggplant, zucchini

**Pro Tips:**
- Don't overcook! Veggies should have bite
- Season well (salt brings out flavor)
- Roasting caramelizes = more flavor`;
  }
  
  if (message.includes('sauce') || message.includes('gravy')) {
    return `🥫 **Sauce Secrets:**

**Basic Pan Sauce (5 min):**
1. After cooking meat, keep brown bits in pan
2. Add wine/broth (1/2 cup)
3. Scrape up brown bits (deglazing)
4. Simmer until reduced by half
5. Add butter, swirl to thicken

**Quick Tomato Sauce:**
- Sauté garlic in olive oil
- Add canned tomatoes, crush
- Simmer 20 min, add basil
- Season with salt, pepper

**Creamy Sauce:**
- Butter + flour (roux)
- Add milk slowly, whisk
- Simmer until thick
- Add cheese if desired

**Pro Tips:**
- Brown bits = flavor (fond)
- Reduce = concentrate flavor
- Butter at end = glossy finish
- Taste and adjust seasoning`;
  }
  
  if (message.includes('bake') || message.includes('oven') || message.includes('roast')) {
    return `🔥 **Oven Cooking Guide:**

**Temperature Guide:**
- **325-350°F:** Slow roasting, baking cakes
- **375-400°F:** General baking, roasting chicken
- **425-450°F:** Fast roasting vegetables, pizza
- **Broil:** Top heat only, for browning

**Roasting Times:**
- **Chicken breast:** 25-30 min at 375°F
- **Whole chicken:** 20 min per pound at 375°F
- **Vegetables:** 20-30 min at 425°F
- **Fish:** 10-12 min at 400°F

**Pro Tips:**
- Preheat oven fully (15 min)
- Middle rack for even cooking
- Use thermometer for meat
- Let meat rest after cooking
- Convection = 25°F lower temp`;
  }
  
  if (message.includes('spice') || message.includes('season') || message.includes('flavor')) {
    return `🌶️ **Seasoning Like a Pro:**

**Essential Spices:**
- Salt & Pepper (foundation)
- Garlic powder & Onion powder
- Paprika (color + mild flavor)
- Cumin (earthy, warm)
- Chili powder (heat + depth)

**When to Season:**
- **Salt:** Throughout cooking (builds flavor)
- **Pepper:** At end (loses flavor with heat)
- **Dried herbs:** Early (need time to bloom)
- **Fresh herbs:** At end (preserve brightness)

**Flavor Combinations:**
- **Italian:** Basil, oregano, garlic, olive oil
- **Mexican:** Cumin, chili powder, cilantro, lime
- **Asian:** Ginger, garlic, soy sauce, sesame
- **Indian:** Cumin, coriander, turmeric, garam masala

**Pro Tips:**
- Toast whole spices first (releases oils)
- Layer flavors (season at each step)
- Taste as you go!
- Fresh herbs = 3x dried herbs`;
  }
  
  // Quick recipes
  if (message.includes('quick') || message.includes('15') || message.includes('fast') || message.includes('easy')) {
    if (isRepeat) {
      return `⚡ **More Quick Recipes:**

**Under 10 Minutes:**
- **Quesadilla:** Cheese + tortilla, pan-fry 3 min per side
- **Fried Rice:** Leftover rice + egg + soy sauce + veggies
- **Caprese Salad:** Tomato + mozzarella + basil + balsamic

**10-15 Minutes:**
- **Shrimp Scampi:** Garlic + butter + white wine + shrimp
- **Chicken Fajitas:** Sliced chicken + peppers + onions + spices
- **Pesto Pasta:** Cook pasta, toss with pesto, done!

**Pro Speed Tips:**
- Prep while water boils
- Use pre-cut vegetables
- High heat cooks faster
- One-pan meals save time`;
    }
    
    return `🍳 **Quick 15-Minute Recipes:**

**1. Scrambled Eggs (5 min)**
Beat 2-3 eggs with milk, cook in butter over low heat, stir gently. Creamy and delicious!

**2. Avocado Toast (5 min)**
Toast bread, mash avocado with lemon, salt, pepper. Top with red pepper flakes or a fried egg!

**3. Pasta Aglio e Olio (15 min)**
Italian classic! Spaghetti with garlic, olive oil, red pepper flakes. Simple but amazing.

**4. Stir-Fry (15 min)**
High heat, any vegetables, soy sauce, garlic, ginger. Serve over rice!

**5. Grilled Cheese (10 min)**
Butter bread, add cheese, cook until golden. Comfort food at its best!

💡 **Pro Tip:** Prep ingredients first (mise en place) to make cooking even faster!`;
  }
  
  // Healthy recipes
  if (message.includes('healthy') || message.includes('diet') || message.includes('nutrition') || message.includes('low calorie')) {
    return `🥗 **Healthy Meal Ideas:**

**High Protein:**
- Grilled chicken salad with olive oil dressing
- Baked salmon with roasted vegetables
- Greek yogurt parfait with berries and nuts
- Quinoa bowl with chickpeas and tahini

**Low Carb:**
- Cauliflower rice stir-fry
- Zucchini noodles with marinara
- Lettuce wrap tacos
- Egg white omelette with vegetables

**Balanced Meals:**
- 1/2 plate vegetables
- 1/4 plate lean protein
- 1/4 plate whole grains
- Healthy fat (olive oil, avocado, nuts)

**Healthy Cooking Methods:**
- Grill, bake, or steam (not fry)
- Use herbs instead of salt
- Choose whole grains
- Add vegetables to everything!`;
  }
  
  // Recipe suggestions based on inventory
  if (message.includes('what can i cook') || message.includes('what can i make') || message.includes('suggestions')) {
    if (inventory.length > 0) {
      return `🍳 **Based on your inventory (${inventory.slice(0, 5).join(', ')}${inventory.length > 5 ? '...' : ''}), here are ideas:**

**Quick Meals:**
- Stir-fry with your vegetables
- Pasta with whatever you have
- Omelette or scrambled eggs
- Salad with protein
- Soup or stew

**Cooking Strategy:**
1. Pick your protein (chicken, eggs, tofu, beans)
2. Choose cooking method (sauté, bake, grill)
3. Add your vegetables
4. Season well!

💡 **Ask me about specific ingredients for detailed recipes!**`;
    } else {
      return `🍳 **Popular Recipe Categories:**

**By Meal:**
- Breakfast: Eggs, pancakes, oatmeal, smoothies
- Lunch: Sandwiches, salads, wraps, soup
- Dinner: Pasta, stir-fry, grilled meat, tacos

**By Cuisine:**
- Italian: Pasta, pizza, risotto
- Mexican: Tacos, burritos, quesadillas
- Asian: Stir-fry, fried rice, noodles
- American: Burgers, BBQ, mac and cheese

💡 **Add ingredients to your inventory for personalized suggestions!**`;
    }
  }
  
  // Cooking techniques
  if (message.includes('how to') || message.includes('technique') || message.includes('method')) {
    return `🔪 **Essential Cooking Techniques:**

**Sautéing:**
- Medium-high heat, keep food moving
- Use enough oil to coat pan
- Don't overcrowd!

**Roasting:**
- Dry heat in oven, 400-450°F
- Creates caramelization and crispy exterior
- Great for vegetables and meat

**Braising:**
- Brown meat first (high heat)
- Then simmer low and slow in liquid
- Makes tough cuts tender

**Grilling:**
- High direct heat
- Creates char and smoky flavor
- Oil grates to prevent sticking

**Steaming:**
- Gentle cooking with steam
- Preserves nutrients and color
- Perfect for vegetables and fish

💡 **Ask about a specific technique for detailed instructions!**`;
  }
  
  // Substitutions
  if (message.includes('substitute') || message.includes('replace') || message.includes('instead of') || message.includes('alternative') || message.includes('out of')) {
    return `🔄 **Common Ingredient Substitutions:**

**Dairy:**
- Butter → Olive oil, coconut oil, ghee
- Milk → Almond milk, oat milk, coconut milk
- Cream → Coconut cream, cashew cream
- Sour cream → Greek yogurt

**Baking:**
- Eggs → Flax eggs (1 tbsp flax + 3 tbsp water)
- Flour → Almond flour, coconut flour, oat flour
- Sugar → Honey, maple syrup, stevia
- Baking powder → Baking soda + cream of tartar

**Savory:**
- Soy sauce → Tamari, coconut aminos, Worcestershire
- Garlic → Garlic powder (1 clove = 1/8 tsp)
- Onion → Shallots, leeks, onion powder
- Wine → Broth + splash of vinegar

💡 **Substitutions may slightly change flavor but usually work great!**`;
  }
  
  // App usage
  if (message.includes('how') && (message.includes('app') || message.includes('use') || message.includes('work'))) {
    return `📱 **How to Use MealMate:**

**🏠 Home:** Browse recipe suggestions
**📸 Scan:** Take photos to identify ingredients with AI
**📦 Inventory:** Track what you have at home
**🛒 Shopping List:** Plan groceries (search shows recipe preview!)
**🤖 AI Assistant:** Ask me anything about cooking!
**⚙️ Settings:** Customize preferences

**Pro Tips:**
- Add ingredients to inventory for personalized recipes
- Use shopping list search to preview recipes
- I remember our conversation!

💡 **Try:** "What can I cook?" or "Quick recipes"`;
  }
  
  // Meal planning
  if (message.includes('meal plan') || message.includes('week') || message.includes('grocery') || message.includes('shopping')) {
    return `📋 **Meal Planning Made Easy:**

**Weekly Strategy:**
- **Monday:** Pasta (quick after work)
- **Tuesday:** Stir-fry (use up vegetables)
- **Wednesday:** Chicken + roasted veggies
- **Thursday:** Tacos or wraps
- **Friday:** Pizza or takeout
- **Weekend:** Try new recipes!

**Smart Shopping:**
- Shop once a week
- Buy versatile ingredients (eggs, pasta, rice, chicken)
- Stock pantry staples (oil, spices, canned goods)
- Buy seasonal produce (cheaper + fresher)

**Batch Cooking:**
- Cook rice/grains in bulk
- Prep vegetables on Sunday
- Make sauces ahead
- Double recipes and freeze

💡 **Use the Shopping List tab to organize your groceries!**`;
  }
  
  // Default helpful response
  return `👨‍🍳 **I'm your cooking assistant! Ask me anything:**

**Popular Questions:**
- "How to cook chicken?" - Specific ingredient guides
- "Quick pasta recipe" - Fast meal ideas
- "Substitute for butter" - Ingredient swaps
- "How to sear a steak?" - Cooking techniques
- "Healthy dinner ideas" - Nutritious meals
- "Meal planning tips" - Weekly strategies

**I can help with:**
🍳 Specific ingredients (chicken, pasta, eggs, etc.)
⏱️ Quick recipes (15 min or less)
🥗 Healthy cooking
🔪 Techniques (searing, roasting, etc.)
🔄 Substitutions
📋 Meal planning

💡 **Just ask naturally - I'll understand!**`;
};

// Get recipe details
export const getRecipeDetails = (recipeName: string): string => {
  const recipe = Object.values(RECIPE_DATABASE).find(r => 
    r.name.toLowerCase().includes(recipeName.toLowerCase())
  );
  
  if (!recipe) {
    return `I don't have that specific recipe, but I can help you with general cooking advice! Try asking about quick recipes, healthy meals, or cooking techniques.`;
  }
  
  return `🍳 **${recipe.name}**
⏱️ Time: ${recipe.time} | 📊 Difficulty: ${recipe.difficulty}

**Ingredients:**
${recipe.ingredients.map(i => `- ${i}`).join('\n')}

**Instructions:**
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

**Pro Tips:**
${recipe.tips.map(t => `💡 ${t}`).join('\n')}`;
};
