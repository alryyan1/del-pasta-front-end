import { createBrowserRouter, RouteObject } from "react-router-dom";
import Error from "./Error";
import App from "./App";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Config from "./pages/Config";
import Login from "./pages/Login";

import CreateNewOrder from "./pages/create_new_order";
import OrdersPage from "./pages/orders_page";
import CreateCategory from "./pages/categories/create_category";
import CreateMeal from "./pages/meals/CreateMeal";

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
const Orders: RouteObject = {
  path: "/orders",
  element: <OrdersPage />,
};
const makeOrder: RouteObject = {
  path: "/create-new-order",
  element: <CreateNewOrder />,
};

const createCategory: RouteObject = {
  path: "/create-category",
  element: <CreateCategory />,
};

const createMeal: RouteObject = {
  path: "/create-meal",
  element: <CreateMeal />,
};
const authoroized: RouteObject = {
  path: "/",
  errorElement: <Error />,
  element: <DefaultLayout />,
  children: [about, config, makeOrder, Orders, createCategory, createMeal],
};

const guest: RouteObject = {
  path: "/",
  errorElement: <Error />,
  element: <GuestLayout />,
  children: [login, signup],
};

export const router = createBrowserRouter([authoroized, guest]);
