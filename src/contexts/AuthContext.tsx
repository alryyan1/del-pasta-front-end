import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';

// Types
interface User {
  id: string;
  username: string;
  email?: string;
  user_type: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('ACCESS_TOKEN')
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('ACCESS_TOKEN');
    const storedUser = localStorage.getItem('USER_DATA');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setTokenState(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('USER_DATA');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setTokenState(newToken);
    setUser(newUser);
    localStorage.setItem('ACCESS_TOKEN', newToken);
    localStorage.setItem('USER_DATA', JSON.stringify(newUser));
    localStorage.setItem('user_type', newUser.user_type);
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('USER_DATA');
    localStorage.removeItem('user_type');
  };

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('ACCESS_TOKEN', newToken);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  };

  // Legacy authenticate method for backward compatibility
  const authenticate = (newToken: string) => {
    setToken(newToken);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    setUser: (newUser: User | null) => {
      setUser(newUser);
      if (newUser) {
        localStorage.setItem('USER_DATA', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('USER_DATA');
      }
    },
    setToken,
    // Legacy method for backward compatibility
    authenticate,
  } as any;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Legacy hook for backward compatibility
export const useAuthContext = useAuth; 