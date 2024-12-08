import { Navigate, Outlet } from "react-router-dom";
import './../App.css'
import {useAuthContext} from '../contexts/stateContext'
import { useEffect } from "react";
import axiosClient from "@/helpers/axios-client";
import Header from "./header";
import i18n from "@/i18n";
function DefaultLayout() {
  const {user,token} =  useAuthContext();
  // debugger;

  console.log(token,'token')
  if (!token) {
    return <Navigate to={'/login'}/>
  }
  return (
    <div className="app-container">
           <Header/>

      
      {<Outlet />}
    </div>
  );
}

export default DefaultLayout;
