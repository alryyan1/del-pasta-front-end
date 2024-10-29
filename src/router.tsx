import { createBrowserRouter, RouteObject } from "react-router-dom";
import Error from "./Error";
import GuestLayout from "./components/GuestLayout";
import NewOrder from "./pages/NewOrder";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Meals from "./pages/Meals";
import Expenses from "./pages/Expenses";
import MealCategoryForm from "./components/forms/meal_category_form";
import Orders from "./pages/Orders";
import DashboardLayoutBasic from "./Layout/Layout";
import { AuthProvider } from "./contexts/stateContext";
import { CustomerList } from "./pages/Customer/CustomerList";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customer/Customers";
import Reservations from "./pages/Reservation/App";

const login: RouteObject = {
  path: "login",
  element: <Login />,
};
const signup: RouteObject = {
  path: "signup",
  element: <Signup />,
};

const makeOrder: RouteObject = {
  path: "makeOrder",
  element: <NewOrder />,
};
const landingPage: RouteObject = {
  path: "/dashboard",
  element: <Dashboard />,
};
//confgiuration
const MealCategoriesConfig: RouteObject = {
  path: "MealCategories",
  element: <MealCategoryForm />,
};
const mealConfig: RouteObject = {
  path: "meals",
  element: <Meals />,
};
const customers: RouteObject = {
  path: "customers",
  element: <Customers />,
};
const config: RouteObject = {
  path: "/config",
  children: [MealCategoriesConfig, mealConfig,customers],
};
const orders: RouteObject = {
  path: "/orders",
  element: <Orders />,
};

const expenses: RouteObject = {
  path: "/expenses",
  element: <Expenses />,
};
const reservation: RouteObject = {
  path: "/reservation",
  element: <Reservations />,
};
const authoroized: RouteObject = {
  path: "/",
  errorElement: <Error />,
  element: <DashboardLayoutBasic />,
  children: [
    landingPage,
    makeOrder,
    config,
    orders,
    customers,
    expenses,
    reservation
  ],
};

const guest: RouteObject = {
  path: "/",
  errorElement: <Error />,
  element: <AuthProvider><GuestLayout /></AuthProvider>,
  children: [login, signup],
};

export const router = createBrowserRouter([authoroized, guest]);

