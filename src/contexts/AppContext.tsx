import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataContext';
import { Toaster } from 'sonner';

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <DataProvider>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              color: 'black',
              border: '1px solid #e2e8f0',
            },
          }}
        />
      </DataProvider>
    </AuthProvider>
  );
};

// Re-export hooks for convenience
export { useAuth, useAuthContext } from './AuthContext';
export { useData, useDataContext } from './DataContext'; 