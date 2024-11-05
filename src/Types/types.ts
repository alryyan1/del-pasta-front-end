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
export interface Category {
  id: number;
  name: string;
  image:string;
  meals:Meal[];
}
export type AxiosResponseProps<T>  ={
  data : T;
  status:boolean
}
export type User = {
  id: number;
  username: string;
}


export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}
export interface Order {
  id: number;
  customer_id?: null;
  customer?:Customer;
  order_number: string;
  payment_type: string;
  order_confirmed:boolean;
  discount: number;
  amount_paid: number;
  user_id: number;
  notes: string;
  delivery_date: null;
  completed_at: null;
  delivery_address: string;
  special_instructions: string;
  status: string;
  payment_status: string;
  is_delivery: number;
  delivery_fee: number;
  address_id: null;
  created_at: string;
  updated_at: string;
  meal_orders: Mealorder[];
  cost : number;
}




export interface Mealorder {
  id: number;
  order_id: number;
  meal_id: number;
  status: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  meal: Meal;
}


export interface Meal {
  id: number;
  name: string;
  price: number;
  category_id?: number;
  description?: string;
  image?: string;
  available?: boolean;
  calories?: number;
  prep_time?: number;
  spice_level?: number;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  category?:Category;
  child_meals:ChildMeal[]
  
}

export interface ChildMeal {
  id: number;
  name: string;
  meal:Meal;
  quantity:number
}
export interface CostCategory {
  id: number;
  name: string;
  
}