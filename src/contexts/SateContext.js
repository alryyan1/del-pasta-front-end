import { createContext, ContextType, useState, useContext } from "react";

const AuthContext = createContext({
  user: null,
  setUser: (user) => {},
  token: null,
  setToken: (token) => {},
  authenticate: (token) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const authenticate = (token) => {
    if (token) {
      setToken(token);
      localStorage.setItem("ACCESS_TOKEN", token);
    }else{
        localStorage.removeItem("ACCESS_TOKEN");
  
    }
  };
  return (
    <AuthContext.Provider value={{ user, token, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuthContext = () =>{
  return useContext(AuthContext);
}
