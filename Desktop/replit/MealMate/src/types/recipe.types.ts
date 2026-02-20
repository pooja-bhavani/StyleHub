export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: RecipeIngredient[];
  usedIngredients: RecipeIngredient[];
  likes: number;
  readyInMinutes: number;
  servings: number;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image: string;
}

export interface RecipeDetail extends Recipe {
  instructions: string;
  analyzedInstructions: AnalyzedInstruction[];
  extendedIngredients: ExtendedIngredient[];
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
}

export interface ExtendedIngredient extends RecipeIngredient {
  original: string;
  originalName: string;
  meta: string[];
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  number: number;
  step: string;
  ingredients: Array<{ id: number; name: string; image: string }>;
  equipment: Array<{ id: number; name: string; image: string }>;
}

export interface RecipeMatch extends Recipe {
  matchPercentage: number;
  canMakeNow: boolean;
}

export interface RecipeFilters {
  maxReadyTime?: number;
  cuisine?: string;
  diet?: string[];
}
