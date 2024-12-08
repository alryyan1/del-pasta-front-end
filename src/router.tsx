import { createBrowserRouter, createHashRouter, Navigate, RouteObject } from "react-router-dom";
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
import Dashboard from "./pages/dashboard";
import Customers from "./pages/Customer/Customers";
import Reservations from "./pages/Reservation/FoodMenu";
import FoodMenu from "./pages/Reservation/FoodMenu";
import ReservationCalendar from "./chatgpt/Calender";
import Foribidden from "./pages/Foribidden";
import ProtectedRoute from "./pages/Protected";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import Services from "./pages/Services";
import Users from "./pages/Users";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const login: RouteObject = {
  path: "login",
  element: <Login />,
};
const signup: RouteObject = {
  path: "signup",
  element: <Signup />,
};
const settings: RouteObject = {
  path: "settings",
  element: <Settings />,
};
const makeOrder: RouteObject = {
  path: "makeOrder",
  element: <NewOrder />,
};
const landingPage: RouteObject = {
  path: "/dashboard",
  element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
};
//confgiuration
const MealCategoriesConfig: RouteObject = {
  path: "MealCategories",
  element: <MealCategoryForm />,
};
const services: RouteObject = {
  path: "services",
  element: <Services />,
};
const mealConfig: RouteObject = {
  path: "meals",
  element: <Meals />,
};
const customers: RouteObject = {
  path: "customers",
  element: <Customers />,
};
const users: RouteObject = {
  path: "users",
  element: <Users />,
};
const config: RouteObject = {
  path: "/config",
  children: [MealCategoriesConfig, mealConfig,customers,settings,services,users],
};
const orders: RouteObject = {
  path: "/orders",
  element: <Orders />,
};

const stats: RouteObject = {
  path: "/stats",
  element: <Stats />,
};

const expenses: RouteObject = {
  path: "/expenses",
  element: <Expenses />,
};
const reservation: RouteObject = {
  path: "/reservations2",
  element: <ReservationCalendar />,
};
const reservation2: RouteObject = {
  path: "/reservation2",
  element: <ReservationCalendar />,
};

const menu: RouteObject = {
  path: "/menu",
  element: <FoodMenu />,
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
    reservation,
    menu,
    reservation2,
    stats,
  ],
};
const forbidden :RouteObject = {
  path : '/forbidden',
  element:<Foribidden/>
}
const guest: RouteObject = {
  path: "/",
  errorElement: <Error />,
  element: <I18nextProvider i18n={i18n}><AuthProvider><GuestLayout /></AuthProvider></I18nextProvider> 
  ,
  children: [login, signup],
};

export const router = createHashRouter([authoroized, guest,forbidden]);

