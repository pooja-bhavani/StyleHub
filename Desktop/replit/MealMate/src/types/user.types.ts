export interface User {
  id: string;
  tier: 'free' | 'premium';
  scanQuota: {
    used: number;
    limit: number;
    resetDate: Date;
  };
  onboardingCompleted: boolean;
}

export interface ShoppingList {
  id: string;
  items: ShoppingItem[];
  createdDate: Date;
  updatedDate: Date;
}

export interface ShoppingItem {
  id: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  purchased: boolean;
  category?: string; // Optional category for filtering
  addedDate: Date;
}
