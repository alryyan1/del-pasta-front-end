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
import { Button, CircularProgress } from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CacheProvider } from "@emotion/react";
import { cacheRtl } from "@/helpers/constants";
import { Beef, Grid2x2PlusIcon, HandPlatter, LayoutPanelTop, List, PersonStanding, Scale, Users } from "lucide-react";
import logo from './../assets/images/h2o-logo.png'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import SidebarFooter from "@/components/footer";
import NavActions from "@/components/NavActions";
import './../i18n'
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./../i18n";

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

  React.useEffect(()=>{
    //get lang from localstorage
   const lang =    localStorage.getItem('lang')
   if (lang != null) {
    
     i18n.changeLanguage(lang)
   }
},[])
  const {t}= useTranslation('layout')

  const NAVIGATION: Navigation = [
    {
      kind: "header",
      title: t("Main items"),  // Use translation key for "Main items"
    },
    {
      segment: "dashboard",
      title: t("Dashboard"),  // Use translation key for "Dashboard"
      icon: <DashboardIcon />,
    },
    {
      segment: "makeOrder",
      title: t("New Order"),  // Use translation key for "New Order"
      icon: <AddShoppingCartIcon />,
    },
    {
      segment: "orders",
      title: t("Orders"),  // Use translation key for "Orders"
      icon: <List />,
    },
    {
      segment: "reservations2",
      title: t("Reservations"),  // Use translation key for "Reservations"
      icon: <BookmarkAddedIcon />,
    },
    {
      segment: "stats",
      title: t("Order Quantities"),  // Use translation key for "Order Quantities"
      icon: <Scale />,
    },
    {
      segment: "expenses",
      title: t("Expenses"),  // Use translation key for "Expenses"
      icon: <AttachMoneyIcon />,
    },
    {
      segment: "menu",
      title: t("Menu"),  // Use translation key for "Menu"
      icon: <RestaurantMenuIcon />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: t("Analytics"),  // Use translation key for "Analytics"
    },
    {
      segment: "config",
      title: t("Settings"),  // Use translation key for "Settings"
      icon: <SettingsIcon />,
      children: [
        {
          segment: "meals",
          title: t("Services"),  // Use translation key for "Services"
          icon: <Grid2x2PlusIcon />,
        },
        {
          segment: "MealCategories",
          title: t("Categories"),  // Use translation key for "Categories"
          icon: <LayoutPanelTop />,
        },
        {
          segment: "customers",
          title: t("Customers"),  // Use translation key for "Customers"
          icon: <Users />,
        },
        {
          segment: "users",
          title: t("Users"),  // Use translation key for "Users"
          icon: <Users />,
        },
        {
          segment: "services",
          title: t("Sub Services"),  // Use translation key for "Sub Services"
          icon: <HandPlatter />,
        },
        {
          segment: "settings",
          title: t("Other"),  // Use translation key for "Other"
          icon: <Users />,
        },
      ],
    },
  ];
  
  // const NAVIGATION: Navigation = [
  //   {
  //     kind: "header",
  //     title: "Main items",
  //   },
  //   {
  //     segment: "dashboard",
  //     title: t('Dashboard'),
  //     icon: <DashboardIcon />,
  //   },
  //   {
  //     segment: "makeOrder",
  //     title: "طلب جديد",
  //     icon: <AddShoppingCartIcon />,
  //   }
  //   ,

  //   {
  //     segment: "orders",
  //     title: "الطلبات",
  //     icon: <List />,
  //   },
    
  //   {
  //     segment: "reservations2",
  //     title: "الحجوزات",
  //     icon: <BookmarkAddedIcon />,
  //   },
  //   {
  //     segment: "stats",
  //     title: "كميات الطلبات",
  //     icon: <Scale />,
  //   },
  //   {
  //     segment: "expenses",
  //     title: "المصروفات",
  //     icon: <AttachMoneyIcon />,
  //   },
  //   {
  //     segment: "menu",
  //     title: "قائمه المعرض",
  //     icon: <RestaurantMenuIcon />,
  //   },
  //   {
  //     kind: "divider",
  //   },
  //   {
  //     kind: "header",
  //     title: "Analytics",
  //   },
   
    

  //   {
  //     segment: "config",
  //     title: "الاعدادات",
  //     icon: <SettingsIcon />,
  //     children: [
  //       {
  //         segment: "meals",
  //         title: " الخدمات",
  //         icon: <Grid2x2PlusIcon />,
  //       },
  //       {
  //         segment: "MealCategories",
  //         title: "الاقسام",
  //         icon: <LayoutPanelTop />,
  //       },
  //       {
  //         segment: "customers",
  //         title: "الزبائن",
  //         icon: <Users />,
  //       },
  //       {
  //         segment: "users",
  //         title: "المستخدمين",
  //         icon: <Users />,
  //       },
  //       {
  //         segment: "services",
  //         title: "خدمات الفرعيه",
  //         icon: <HandPlatter />,
  //       },
  //       {
  //         segment: "settings",
  //         title: "اخري",
  //         icon: <Users />,
  //       },
        
  //     ],
  //   },
 
  // ];
  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider 
    
      navigation={NAVIGATION}
      router={router}
      
      theme={demoTheme}
      branding={{
        title: "Laundry App",
        logo :<img src={logo}/>
        
      }}
    
      window={demoWindow}
    >
      <React.Suspense fallback={<Box sx={{height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>  <CircularProgress/>   </Box>}>
          <I18nextProvider i18n={i18n}>
         <CacheProvider value={cacheRtl}>
        <AuthProvider>
          {/* sx={{height:'90vh'}}  */}
          <DashboardLayout slots={{
            sidebarFooter:SidebarFooter,
            toolbarActions:NavActions
            
          }} >
            <PageContainer className="root-container" sx={{ margin: 0,p:1 }}>
              <Outlet />
            </PageContainer>{" "}
          </DashboardLayout>
        </AuthProvider>
      </CacheProvider>
      </I18nextProvider>
      </React.Suspense>
    
     
    </AppProvider>
    // preview-end
  );
}
