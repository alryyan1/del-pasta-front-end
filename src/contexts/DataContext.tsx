import { 
  createContext, 
  useContext, 
  useState, 
  ReactNode,
  useCallback 
} from 'react';
import { toast } from 'sonner';

// Types
interface DataItem {
  id: string | number;
  [key: string]: any;
}

interface DataContextType {
  data: DataItem[];
  setData: (data: DataItem[]) => void;
  addItem: (item: DataItem, customSetter?: (updateFn: (prev: DataItem[]) => DataItem[]) => void) => void;
  updateItem: (item: DataItem, customSetter?: (updateFn: (prev: DataItem[]) => DataItem[]) => void) => void;
  deleteItem: (item: DataItem, customSetter?: (updateFn: (prev: DataItem[]) => DataItem[]) => void) => void;
  findItemById: (id: string | number) => DataItem | undefined;
  clearData: () => void;
}

// Context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider Props
interface DataProviderProps {
  children: ReactNode;
  initialData?: DataItem[];
}

// Provider Component
export const DataProvider: React.FC<DataProviderProps> = ({ 
  children, 
  initialData = [] 
}) => {
  const [data, setData] = useState<DataItem[]>(initialData);

  const addItem = useCallback((
    item: DataItem, 
    customSetter?: (updateFn: (prev: DataItem[]) => DataItem[]) => void
  ) => {
    const updateFn = (prevData: DataItem[]) => {
      const existingIndex = prevData.findIndex(existingItem => existingItem.id === item.id);
      
      if (existingIndex !== -1) {
        // Update existing item
        const updatedData = [...prevData];
        updatedData[existingIndex] = item;
        return updatedData;
      } else {
        // Add new item
        return [item, ...prevData];
      }
    };

    if (customSetter) {
      customSetter(updateFn);
    } else {
      setData(updateFn);
    }
  }, []);

  const updateItem = useCallback((
    item: DataItem, 
    customSetter?: (updateFn: (prev: DataItem[]) => DataItem[]) => void
  ) => {
    const updateFn = (prevData: DataItem[]) => {
      return prevData.map(existingItem => 
        existingItem.id === item.id ? item : existingItem
      );
    };

    if (customSetter) {
      customSetter(updateFn);
    } else {
      setData(updateFn);
    }
  }, []);

  const deleteItem = useCallback((
    item: DataItem, 
    customSetter?: (updateFn: (prev: DataItem[]) => DataItem[]) => void
  ) => {
    const updateFn = (prevData: DataItem[]) => {
      return prevData.filter(existingItem => existingItem.id !== item.id);
    };

    if (customSetter) {
      customSetter(updateFn);
    } else {
      setData(updateFn);
    }
  }, []);

  const findItemById = useCallback((id: string | number) => {
    return data.find(item => item.id === id);
  }, [data]);

  const clearData = useCallback(() => {
    setData([]);
  }, []);

  // Legacy add method for backward compatibility
  const add = (item: DataItem, customSetter?: any) => {
    addItem(item, customSetter);
  };

  const value: DataContextType = {
    data,
    setData,
    addItem,
    updateItem,
    deleteItem,
    findItemById,
    clearData,
    // Legacy method for backward compatibility
    add,
  } as any;

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Legacy hook for backward compatibility
export const useDataContext = useData; 