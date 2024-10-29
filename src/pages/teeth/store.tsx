import {create} from 'zustand';

interface ToothCondition {
  needsCleaning?: boolean;
  needsFilling?: boolean;
  needsExtraction?: boolean;
}

interface DentalState {
  selectedTooth: number | null;
  toothConditions: Record<number, ToothCondition>;
  selectTooth: (toothNumber: number) => void;
  setToothCondition: (toothNumber: number, condition: string) => void;
}

export const useStore = create<DentalState>((set) => ({
  selectedTooth: null,
  toothConditions: {},
  selectTooth: (toothNumber) =>
    set((state) => ({
      selectedTooth: state.selectedTooth === toothNumber ? null : toothNumber,
    })),
  setToothCondition: (toothNumber, condition) =>
    set((state) => {
      const currentConditions = state.toothConditions[toothNumber] || {};
      const conditionKey = `needs${condition.charAt(0).toUpperCase() + condition.slice(1)}` as keyof ToothCondition;
      
      return {
        toothConditions: {
          ...state.toothConditions,
          [toothNumber]: {
            ...currentConditions,
            [conditionKey]: !currentConditions[conditionKey],
          },
        },
      };
    }),
}));