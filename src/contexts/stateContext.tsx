import axiosClient from "@/helpers/axios-client";
import {
  createContext,
  ContextType,
  useState,
  useContext,
  useEffect,
} from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface AuthPros {
  user: any;
  setUser: (user: any) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  authenticate: (token: string) => void;
  data: any[];
  setData: (data: any[]) => void;
  action: string;
  setData: (data: string) => void;
  setActionItem: (data) => void;
  add: (data,setSate) => void;
  deleteItem: (item: any) => void;
}
const AuthContext = createContext({
  user: null,
  setUser: (user) => {},
  token: null,
  setToken: (token) => {},
  authenticate: (token) => {},
  data: [],
  setData: (data) => {},
  action: "",
  setAction: (data) => {},
  add : (data,setSatate)=>{},
  deleteItem:(data)=>{}
});

type Action = "add" | "delete" | "";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const navigate =  useNavigate()

  const add = (actionItem,setState)=>{

       if (setState) {
        setState((data)=>{
          if (data.map((item)=>item.id).find((id)=>id==actionItem.id)) {
           //update by replace old item with new item [data]
           return  data.map((item)=>{
               if(item.id===actionItem.id){
                 return actionItem
               }
               return item;
             })
 
          }else{
 
            return  [actionItem,...data ]
          }
         });
       }else{
        setData((data)=>{
          if (data.map((item)=>item.id).find((id)=>id==actionItem.id)) {
           //update by replace old item with new item [data]
           return  data.map((item)=>{
               if(item.id===actionItem.id){
                 return actionItem
               }
               return item;
             })
 
          }else{
 
            return  [actionItem,...data ]
          }
         });
       }
     
        // toast.success("Item added successfully!");
  }

  const deleteItem = (dl) => {
    setData(data.filter((item, index) => item.id != dl.id));
    // toast.success("Item deleted successfully!");
  };

  const authenticate = (token) => {
    // alert('d')
    if (token) {
      // alert('dd')
      setToken(() => token);
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        authenticate,
        data,
        setData,
        add,
        deleteItem
      }}
    >
      <>
        <ToastContainer />
        {children}
      </>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
