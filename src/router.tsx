import { createBrowserRouter, RouteObject } from "react-router-dom";
import Error from "./Error";
import App from "./App";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
<<<<<<< HEAD
import CreateNewOrder from "./pages/create_new_order";

=======
>>>>>>> origin/hashim
import About from "./pages/About";
import Signup from "./pages/Signup";
import Config from "./pages/Config";
import Login from "./pages/Login";
<<<<<<< HEAD
import LandingPage from "./pages/LandingPage";
import MakeOrder from "./pages/MakeOrder";
import Meals from "./pages/Meals";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Expenses from "./pages/Expenses";
import MealCategoryForm from "./components/meal_category_form";
=======

import CreateNewOrder from "./pages/create_new_order";
import OrdersPage from "./pages/orders_page";
import CreateCategory from "./pages/categories/create_category";
import CreateMeal from "./pages/meals/CreateMeal";
>>>>>>> origin/hashim

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
  
  const MealCategories: RouteObject = {
    path: "MealCategories",
    element: <MealCategoryForm/>,
  };
  const makeOrder: RouteObject = {
    path: "makeOrder",
    element: <CreateNewOrder/>,
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
    children: [about, config, MealCategories,landingPage,makeOrder,meals,dashboard,customers,expenses],
  };

<<<<<<< HEAD
  const guest: RouteObject = {
    path: "/",
    errorElement: <Error />,
    element: <GuestLayout />,
    children: [login,signup],
  };
  
  export const router =  createBrowserRouter([authoroized,guest]);
=======
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
>>>>>>> origin/hashim
