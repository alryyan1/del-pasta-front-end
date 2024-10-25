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
import LandingPage from "./pages/LandingPage";
import MakeOrder from "./pages/MakeOrder";
import Meals from "./pages/Meals";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Expenses from "./pages/Expenses";

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
  const makeOrder: RouteObject = {
    path: "makeOrder",
    element: <MakeOrder/>,
  };
  const landingPage: RouteObject = {
    path: "/home",
    element: <LandingPage/>,
  };
  const meals: RouteObject = {
    path: "/meals",
    element: <Meals/>,
  };
  const dashboard: RouteObject = {
    path: "/dashboard",
    element: <Dashboard/>,
  };
  const customers: RouteObject = {
    path: "/customers",
    element: <Customers/>,
  };
  const expenses: RouteObject = {
    path: "/expenses",
    element: <Expenses/>,
  };
  const authoroized: RouteObject = {
    path: "/",
    errorElement: <Error />,
    element: <DefaultLayout />,
    children: [about, config, orders,landingPage,makeOrder,meals,dashboard,customers,expenses],
  };

  const guest: RouteObject = {
    path: "/",
    errorElement: <Error />,
    element: <GuestLayout />,
    children: [login,signup],
  };
  
  export const router =  createBrowserRouter([authoroized,guest]);