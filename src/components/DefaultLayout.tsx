import { Navigate, Outlet } from "react-router-dom";
import {useAuthContext} from '../contexts/stateContext'
import { useEffect } from "react";
import axiosClient from "@/helpers/axios-client";
import Header from "./header";
function DefaultLayout() {
  const {user,token} =  useAuthContext();
  // debugger;

  console.log(token,'token')
  if (!token) {
    return <Navigate to={'/login'}/>
  }
  return (
    <div>
           <Header/>

      DefaultLayout
      {<Outlet />}
    </div>
  );
}

export default DefaultLayout;
