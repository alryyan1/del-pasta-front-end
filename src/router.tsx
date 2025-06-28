import { createHashRouter, Navigate, Outlet, RouteObject } from "react-router-dom";

// Layouts
import GuestLayout from "./components/GuestLayout";
import DashboardLayoutBasic from "./Layout/Layout"; // Main authenticated layout

// General Pages
import Error from "./Error";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import Foribidden from "./pages/Foribidden";
import Arrive from "./pages/Arrive";
import BuffetOrderPage from "./pages/BuffetOrderPage"; // The new buffet ordering page

// Authenticated Pages
import NewOrder from "./pages/NewOrder";
import Orders from "./pages/Orders";
import Expenses from "./pages/Expenses";
import Stats from "./pages/Stats";
import ReservationCalendar from "./chatgpt/Calender"; // Assuming this is correct

// Configuration Pages
import Customers from "./pages/Customer/Customers";
import Meals from "./pages/Meals";
import MealCategoryForm from "./components/forms/meal_category_form";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import BuffetPackagesPage from "./pages/config/BuffetPackagesPage";
import ManagePackageDetailsPage from "./pages/config/ManagePackageDetailsPage";

// Helper components
import ProtectedRoute from "./pages/Protected";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./contexts/stateContext";
import FoodMenu from "./pages/Reservation/FoodMenu";
import BuffetOrdersListPage from "./pages/BuffetOrdersListPage";
import BuffetOrderSuccessPage from "./pages/BuffetOrderSuccessPage";

// --- Route Definitions ---

// GUEST ROUTES (Accessible when NOT logged in)
const guestRoutes: RouteObject = {
  path: "/",
  element: (
    // Wrap the entire guest experience in providers
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <GuestLayout />
      </AuthProvider>
    </I18nextProvider>
  ),
  children: [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup", // If you have a signup page
      element: <Signup />,
    },
    {
      path: "/menu", // General food menu
      element: <FoodMenu />,
    },
   
    // Redirect root guest path to login
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
  ],
};
// Add the new success route
// const buffetOrderSuccess: RouteObject = {
//   path: "/buffet-order/success/:orderId", // Notice the :orderId parameter
//   element: <BuffetOrderSuccessPage />,
// };
// AUTHORIZED ROUTES (Accessible ONLY when logged in)
const authorizedRoutes: RouteObject = {
  path: "/",
  element: (
    // Wrap the entire authenticated experience in the main layout
    // The Layout itself should contain the providers
    <DashboardLayoutBasic />
  ),
  children: [
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/makeOrder",
      element: <NewOrder />,
    },
    {
      path: "/buffet-order/success/:orderId", // Notice the :orderId parameter
      element: <BuffetOrderSuccessPage />,
    },
    {
      path: "/orders",
      element: <Orders />,
    },

    {
      path: "/buffet-orders-management", // <-- Add new route
      element: <BuffetOrdersListPage />,
    },
    {
      path: "/buffet-order", // Buffet ordering page
      element: <BuffetOrderPage />,
    },
    {
      path: "/buffet-order-success", // Buffet ordering page
      element: <BuffetOrderSuccessPage />,
    },
    {
      path: "/stats",
      element: <Stats />,
    },
    {
      path: "/expenses",
      element: <Expenses />,
    },
    {
      path: "/reservations2",
      element: <ReservationCalendar />,
    },
    // Configuration Section
    {
      path: "/config",
      element: <ProtectedRoute><Outlet /></ProtectedRoute>, // Protect the config section
      children: [
        {
            path: "meals",
            element: <Meals />,
        },
        {
            path: "MealCategories",
            element: <MealCategoryForm />,
        },
        {
            path: "customers",
            element: <Customers />,
        },
        {
            path: "users",
            element: <Users />,
        },
        {
            path: "services",
            element: <Services />,
        },
        {
            path: "settings",
            element: <Settings />,
        },
        // Buffet Admin Routes
        {
          path: "buffet-packages",
          element: <BuffetPackagesPage />
        },
        {
          path: "buffet-packages/:packageId/manage",
          element: <ManagePackageDetailsPage />
        }
      ]
    },
    // Redirect root authenticated path to dashboard
    {
      path: "/",
      element: <Navigate to="/dashboard" />,
    },
  ],
};

// STANDALONE ROUTES (No main layout)
const standaloneRoutes: RouteObject[] = [
    {
        path: "/arrive/:id",
        element: <Arrive />,
    },
    {
        path: "/forbidden",
        element: <Foribidden />,
    },
];


export const router = createHashRouter([
    guestRoutes,
    authorizedRoutes,
    ...standaloneRoutes,
    // A general "not found" catch-all could be added here if needed,
    // but the nested structures handle most cases.
]);