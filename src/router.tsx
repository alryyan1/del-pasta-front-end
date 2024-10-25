import { createBrowserRouter, RouteObject } from "react-router-dom";
import Error from "./Error";
import App from "./App";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import { log } from "console";
import CreateNewOrder from "./pages/create_new_order";

import About from "./pages/About";
import Signup from "./pages/Signup";
import Config from "./pages/Config";
import Login from "./pages/Login";
import OrdersPage from "./pages/orders_page";

const about: RouteObject = {
  path: "about",
  element: <About />,
};

const login: RouteObject = {
  path: "login",
  element: <Login />,
};
const signup: RouteObject = {
  path: "signup",
  element: <Signup />,
};
const config: RouteObject = {
  path: "config",
  element: <Config />,
};
const orders: RouteObject = {
  path: "orders",
  element: <OrdersPage />,
};
const create_new_order: RouteObject = {
  path: "create-new-order",
  element: <CreateNewOrder />,
};
const home: RouteObject = {
  path: "/",
  errorElement: <Error />,
  element: <DefaultLayout />,
  children: [about, config, orders, create_new_order],
};

const guest: RouteObject = {
  path: "/",
  errorElement: <Error />,
  element: <GuestLayout />,
  children: [login, signup],
};

export const router = createBrowserRouter([home, guest]);
