import { createBrowserRouter, RouteObject } from "react-router-dom";
import Error from "./Error";
import App from "./App";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Config from "./pages/Config";
import Orders from "./pages/Orders";
import Login from "./pages/Login";

const about: RouteObject = {
    path: "about",
    element: <About/>,
  };
  
  const login: RouteObject = {
    path: "login",
    element: <Login/>,
  };
  const signup: RouteObject = {
    path: "signup",
    element: <Signup/>,
  };
  const config: RouteObject = {
    path: "config",
    element: <Config/>,
  };
  
  const orders: RouteObject = {
    path: "orders",
    element: <Orders/>,
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