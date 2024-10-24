import { createContext, ContextType, useState, useContext } from "react";
export interface AuthPros {
  user: any;
  setUser: (user: any) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  authenticate: (token: string) => void;  
}
const AuthContext = createContext({
  user: null,
  setUser: (user) => {},
  token: null,
  setToken: (token) => {},
  authenticate: (token) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(5165);
  const authenticate = (token) => {
    if (token) {
      setToken(token);
      localStorage.setItem("ACCESS_TOKEN", token);
    }else{
        localStorage.removeItem("ACCESS_TOKEN");
  
    }
  };
  return (
      <AuthContext.Provider
        value={{ user, setUser, token, setToken, authenticate }}
      >
        {children}
      </AuthContext.Provider>
  
  );
};


export const useAuthContext = () =>{
  return useContext(AuthContext);
}
