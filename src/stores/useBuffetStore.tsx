// src/stores/useBuffetStore.ts
import { create } from 'zustand';
import { BuffetPackage, BuffetPersonOption, BuffetStep, Customer, BuffetJuiceRule, Meal } from '@/Types/buffet-types';
import { toast } from 'sonner';

type BuffetState = {
  currentStep: number;
  packages: BuffetPackage[];
  personOptions: BuffetPersonOption[];
  steps: BuffetStep[];
  juiceInfo: BuffetJuiceRule | null;
  
  selectedPackage: BuffetPackage | null;
  selectedPersonOption: BuffetPersonOption | null;
  selections: Record<number, number[]>; // { stepId: [mealId1, mealId2] }

  customer: Customer | null;
  deliveryDate: string;
  deliveryTime: string;
  notes: string;
};

type BuffetActions = {
  setCurrentStep: (step: number) => void;
  setPackages: (packages: BuffetPackage[]) => void;
  setPersonOptions: (options: BuffetPersonOption[]) => void;
  setSteps: (steps: BuffetStep[]) => void;
  setJuiceInfo: (info: BuffetJuiceRule | null) => void;

  selectPackage: (pkg: BuffetPackage | null) => void;
  selectPersonOption: (option: BuffetPersonOption | null) => void;
  updateMealSelection: (stepId: number, mealId: number) => void;
  
  setCustomer: (customer: Customer | null) => void;
  setDeliveryDate: (date: string) => void;
  setDeliveryTime: (time: string) => void;
  setNotes: (notes: string) => void;
  
  reset: () => void;
};

const initialState: BuffetState = {
  currentStep: 1,
  packages: [],
  personOptions: [],
  steps: [],
  juiceInfo: null,
  selectedPackage: null,
  selectedPersonOption: null,
  selections: {},
  customer: null,
  deliveryDate: '',
  deliveryTime: '18:00',
  notes: '',
};

export const useBuffetStore = create<BuffetState & BuffetActions>((set, get) => ({
  ...initialState,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  setPackages: (packages) => set({ packages }),
  setPersonOptions: (options) => set({ personOptions: options }),
  setSteps: (steps) => set({ steps }),
  setJuiceInfo: (info) => set({ juiceInfo: info }),

  selectPackage: (pkg) => set({ selectedPackage: pkg }),
  selectPersonOption: (option) => set({ selectedPersonOption: option }),
  
  updateMealSelection: (stepId, mealId) => {
    const step = get().steps.find(s => s.id === stepId);
    if (!step) return;

    set(state => {
      const currentSelections = state.selections[stepId] || [];
      const newSelectionsForStep = currentSelections.includes(mealId)
        ? currentSelections.filter(id => id !== mealId) // Deselect
        : (currentSelections.length < step.max_selections ? [...currentSelections, mealId] : currentSelections); // Select if not at max
      
      if (currentSelections.length >= step.max_selections && !currentSelections.includes(mealId)) {
        toast.warning(`Selection limit of ${step.max_selections} reached.`);
      }

      return {
        selections: {
          ...state.selections,
          [stepId]: newSelectionsForStep,
        }
      };
    });
  },

  setCustomer: (customer) => set({ customer }),
  setDeliveryDate: (date) => set({ deliveryDate: date }),
  setDeliveryTime: (time) => set({ deliveryTime: time }),
  setNotes: (notes) => set({ notes }),

  reset: () => set(initialState),
}));