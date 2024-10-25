import { createContext, ContextType, useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export interface AuthPros {
  user: any;
  setUser: (user: any) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  authenticate: (token: string) => void;  
  data:any[];
  setData: (data: any[]) => void;
  action: string;
  setData: (data: string) => void;
  actionItem : any;
  
   setActionItem: (data)=>void
}
const AuthContext = createContext({
  user: null,
  setUser: (user) => {},
  token: null,
  setToken: (token) => {},
  authenticate: (token) => {},
  data: [],
  setData: (data) => {},
  action: '',
  setAction: (data) => {},
  actionItem:null,
  setActionItem: ()=>{}
  
});

type Action = 'add' | 'delete' | ''
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [actionItem, setActionItem] = useState(null);
  const [action, setAction] = useState<Action>('');
  const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  useEffect(()=>{
    switch(action){
      case 'add':
        setData([...data, actionItem]);
        toast.success('Item added successfully!');
        break;
      case 'delete':
        setData(data.filter((item, index) => item.id != actionItem.id));
        toast.success('Item deleted successfully!');
        break;
      default:
        break;
    }
  },[action])

  const authenticate = (token) => {
    if (token) {
      // alert('dd')
      setToken(()=>token);
      localStorage.setItem("ACCESS_TOKEN", token);
    }else{
        localStorage.removeItem("ACCESS_TOKEN");
  
    }
  };
  return (
      <AuthContext.Provider
        value={{ user, setUser, token, setToken, authenticate,data,setData,action,setAction,setActionItem }}
      >
        <>
        <ToastContainer />
        {children}
        </>
      </AuthContext.Provider>
  
  );
};


export const useAuthContext = () =>{
  return useContext(AuthContext);
}
