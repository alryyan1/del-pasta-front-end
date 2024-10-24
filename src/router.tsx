import { createBrowserRouter, RouteObject } from "react-router-dom";
import Error from "./Error";
import App from "./App";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import { log } from "console";

const about: RouteObject = {
    path: "about",
    element: <h1>About</h1>,
  };
  
  const login: RouteObject = {
    path: "login",
    element: <h1>login</h1>,
  };
  const signup: RouteObject = {
    path: "signup",
    element: <h1>signup</h1>,
  };
  const config: RouteObject = {
    path: "config",
    element: <h1>صفحه الاعدادات</h1>,
  };
  
  const orders: RouteObject = {
    path: "orders",
    element: <h1>صفحه الطلبات</h1>,
  };
  const home: RouteObject = {
    path: "/",
    errorElement: <Error />,
    element: <DefaultLayout />,
    children: [about, config, orders],
  };

  const guest: RouteObject = {
    path: "/",
    errorElement: <Error />,
    element: <GuestLayout />,
    children: [login,signup],
  };
  
  export const router =  createBrowserRouter([home,guest]);