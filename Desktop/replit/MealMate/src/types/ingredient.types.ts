export enum IngredientCategory {
  PRODUCE = 'produce',
  PROTEIN = 'protein',
  DAIRY = 'dairy',
  GRAINS = 'grains',
  SPICES = 'spices',
  CONDIMENTS = 'condiments',
  BEVERAGES = 'beverages',
  OTHER = 'other'
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity?: number;
  unit?: string;
  addedDate: Date;
  expirationDate?: Date;
  imageUrl?: string;
  source: 'scan' | 'manual';
}
