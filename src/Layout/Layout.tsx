import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Outlet, useNavigate } from "react-router-dom";
import { router } from "@/router";
import SettingsIcon from "@mui/icons-material/Settings";
import { AuthProvider, useAuthContext } from "@/contexts/stateContext";
import { Button } from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CacheProvider } from "@emotion/react";
import { cacheRtl } from "@/helpers/constants";
import { Beef, LayoutPanelTop, PersonStanding, Users } from "lucide-react";
import logo from './../assets/logo.png'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
const demoTheme = createTheme({
  // direction: "rtl",
  typography: {
    fontFamily: [
      "Cairo", // Add your default font here
      "Arial",
      "sans-serif",
    ].join(","),
    // You can customize other typography settings here
    h1: {
      fontFamily: "Cairo", // Custom font for h1
    },
    h2: {
      fontFamily: "Cairo", // Custom font for h2
    },
    // Add other styles as needed
  },
  components: {
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          display: "none",
        },
      },
    },
  },

  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1500,
      xl: 1536,
    },
  },
});

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function DashboardLayoutBasic(props: DemoProps) {
  const { window } = props;

  const [loading, setLoading] = React.useState(false);
  const { authenticate, setUser } = useAuthContext();
  const navigate = useNavigate();
  const logoutHandler = () => {
    setLoading(true);
    console.log("navigate to to login");
    axiosClient
      .post("logout")
      .then(() => {
        authenticate(null);
        setUser(null);
        localStorage.clear();
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));
  };
  const NAVIGATION: Navigation = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      segment: "dashboard",
      title: "الرئيسيه",
      icon: <DashboardIcon />,
    },
    {
      segment: "orders",
      title: "الطلبات",
      icon: <ShoppingCartIcon />,
    },
    {
      segment: "makeOrder",
      title: "طلب جديد",
      icon: <AddShoppingCartIcon />,
    },
    {
      segment: "reservations2",
      title: "الحجوزات",
      icon: <BookmarkAddedIcon />,
    },
    {
      segment: "expenses",
      title: "المصروفات",
      icon: <AttachMoneyIcon />,
    },
    {
      segment: "menu",
      title: "قائمه الطعام",
      icon: <RestaurantMenuIcon />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Analytics",
    },
    {
      segment: "config",
      title: "الاعدادات",
      icon: <SettingsIcon />,
      children: [
        {
          segment: "meals",
          title: "باقات الوجبات",
          icon: <Beef />,
        },
        {
          segment: "MealCategories",
          title: "الاقسام",
          icon: <LayoutPanelTop />,
        },
        {
          segment: "customers",
          title: "الزبائن",
          icon: <Users />,
        },
      ],
    },
    {
      segment: "login",
      title: "تسجيل خروج",
      icon: <LayersIcon />,
      action: <Button onClick={logoutHandler}>logout</Button>,
    },
  ];
  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider 
      navigation={NAVIGATION}
      router={router}
      
      theme={demoTheme}
      branding={{
        title: "Kitchen App",
        logo :<img src={logo}/>
      }}
      window={demoWindow}
    >
      <CacheProvider value={cacheRtl}>
        <AuthProvider>
          {/* sx={{height:'90vh'}}  */}
          <DashboardLayout >
            <PageContainer sx={{ margin: 0,p:0 }}>
              <Outlet />
            </PageContainer>{" "}
          </DashboardLayout>
        </AuthProvider>
      </CacheProvider>
    </AppProvider>
    // preview-end
  );
}
