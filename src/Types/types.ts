export interface Cost {
  id: number;
  user_cost: null;
  description: string;
  comment: null;
  amount: number;
  cost_category_id: number|null;
  created_at: string;
  updated_at: string;
  user: null;
  cost_category: CostCategory;
}


export interface Meal {
  id: number;
  name: string;
  price: number;
  category_id: number;
  description: string;
  image: string;
  available: boolean;
  calories?: number;
  prep_time?: number;
  spice_level?: number;
  is_vegan: boolean;
  is_gluten_free: boolean;
}
export interface CostCategory {
  id: number;
  name: string;
}