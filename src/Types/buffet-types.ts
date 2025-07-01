// src/Types/buffet-types.ts
import { Meal } from './types'; // Reuse existing Meal type if it fits

export interface BuffetPackage {
    id: number;
    name_ar: string;
    name_en: string | null;
    description_ar: string | null;
    image_url: string | null;
    person_options?: BuffetPersonOption[];
    steps?: BuffetStep[];
}

export interface BuffetPersonOption {
    id: number;
    label_ar: string;
    label_en: string | null;
    price: number;
}

export interface BuffetStep {
    id: number;
    step_number: number;
    title_ar: string;
    title_en: string | null;
    instructions_ar: string | null;
    min_selections: number;
    max_selections: number;
    category: {
        id: number;
        name: string;
        meals: Meal[]; // Assuming meals are nested under category
    };
}

// You can reuse Customer and Meal from your main types.ts if they are suitable
export type { Customer, Meal } from './types'; 


export interface BuffetJuiceRule {
    id: number;
    description_ar: string;
    description_en: string | null;
}

export interface BuffetPersonOption {
    id: number;
    label_ar: string;
    label_en: string | null;
    price: number;
    is_active: boolean;
    juiceRule?: BuffetJuiceRule; // Add optional relationship
}

// src/Types/buffet-types.ts

// ... (other types like Meal, Category)

export interface BuffetJuiceRule {
    id: number;
    description_ar: string;
    description_en: string | null;
}

export interface BuffetPersonOption {
    id: number;
    label_ar: string;
    label_en: string | null;
    price: number;
    is_active: boolean;
    juiceRule?: BuffetJuiceRule;
}

export interface BuffetStep {
    id: number;
    step_number: number;
    title_ar: string;
    title_en: string | null;
    instructions_ar: string | null;
    min_selections: number;
    max_selections: number;
    is_active: boolean;
    category_id?: number;
    category?: {
        id: number;
        name: string;
    };
}

// Main type for this page
export interface BuffetPackage { 
    id: number; 
    name_ar: string; 
    name_en: string | null; 
    description_ar: string | null; 
    image_url: string | null;
    is_active: boolean;
    // Relations that will be loaded
    personOptions?: BuffetPersonOption[];
    steps?: BuffetStep[];
}

// src/Types/buffet-types.ts
// ...
export interface BuffetOrder {
    id: number;
    order_number: string;
    customer?: { name: string; phone: string; address?: string };
    buffetPackage?: { name_ar: string };
    buffetPersonOption?: { label_ar: string };
    base_price: number;
    delivery_date: string;
    delivery_time: string;
    notes: string | null;
    status: string;
    selections?: { // This will be loaded on demand for the dialog
        meal: { name: string };
        buffetStep: { title_ar: string; title_en?: string };
    }[];
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    address?: string; // Add address as an optional field
    // ... any other fields like state, area
}