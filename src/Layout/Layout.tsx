import * as React from "react";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppProvider, type Navigation, type Router } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuthContext } from "@/contexts/AppContext";
import { CircularProgress } from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CacheProvider } from "@emotion/react";
import { cacheRtl } from "@/helpers/constants";
import {
  Grid2x2PlusIcon,
  HandPlatter,
  LayoutPanelTop,
  List,
  Scale,
  Users,
  MessageCircle,
} from "lucide-react";
import del from "./../assets/logo.png";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import SidebarFooter from "@/components/footer";
import NavActions from "@/components/NavActions";
import "./../i18n";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./../i18n";
import ArriavalDialog from "@/components/ArriavalDialog";
import alarm from "./../assets/alarm.wav";
import { Meal, Order } from "@/Types/types";
import LoginDialog from "@/components/LoginDialog";
import { useAuthStore } from "@/AuthStore";

const demoTheme = createTheme({
  // direction: "rtl",
  palette: {
    primary: {
      main: "#9c27b0",// purple
      // main: "#1976d2",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1900,
      xl: 2000,
    },
  },
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

// Custom router that integrates React Router with @toolpad/core
function useReactRouter(): Router {
  const navigate = useNavigate();
  const location = useLocation();

  return React.useMemo(() => {
    return {
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (url: string | URL) => {
        const urlString = typeof url === 'string' ? url : url.toString();
        navigate(urlString);
      },
    };
  }, [navigate, location]);
}

export default function DashboardLayoutBasic() {
  const [isIpadPro, setIsIpadPro] = React.useState(false);
  const {openLoginDialog,setCloseLoginDialog} =  useAuthStore((state)=>state)
  console.log(openLoginDialog,'openDialog')
  const navigate =  useNavigate()
   const {setUser,setToken,} = useAuthContext()
    const [meals,setMeals] = React.useState<Meal[]>([]);
  const router = useReactRouter();
   React.useEffect(()=>{
      axiosClient.get('meals').then(({data})=>{
        setMeals(data)
      })
    },[])

   
  React.useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    }).catch(()=>{
    console.log('error')
    setUser(null);
    setToken(null)
    navigate('/login');
  localStorage.removeItem('ACCESS_TOKEN')

  });
  }, [navigate])
  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1366px)'
    );

    const handleResize = (e: MediaQueryListEvent) => setIsIpadPro(e.matches);
    if (mediaQuery.matches) {
      console.log('The screen width is between 768px and 1366px');
    } else {
      console.log('The screen width is outside the range');
    }
    

    setIsIpadPro(mediaQuery.matches); // Initial check
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);
  React.useEffect(() => {
    //get lang from localstorage
    const lang = localStorage.getItem("lang");
    if (lang != null) {
      i18n.changeLanguage(lang);
    }
  }, []);
  const { t } = useTranslation("layout");

  const NAVIGATION: Navigation = [
    {
      kind: "header",
      title: t("Main items"), // Use translation key for "Main items"
    },
    {
      segment: "dashboard",
      title: t("Dashboard"), // Use translation key for "Dashboard"
      icon: <DashboardIcon />,
    },
    {
      segment: "makeOrder",
      title: t("New Order"), // Use translation key for "New Order"
      icon: <AddShoppingCartIcon />,
    },
    {
      segment: "buffet-orders-management",
      title: t("Buffet Orders Management"), // Use translation key for "Buffet Orders Management"
      icon: <AddShoppingCartIcon />,
    },
    {
      segment: "orders",
      title: t("Orders"), // Use translation key for "Orders"
      icon: <List />,
    },
    {
      segment: "buffet-order",
      title: t("Buffet Order"), // Use translation key for "Buffet Order"
      icon: <AddShoppingCartIcon />,
    },
    {
      segment: "online-order",
      title: t("Online Order"), // Use translation key for "Online Order"
      icon: <AddShoppingCartIcon />,
    },
    {
      segment: "online-orders-management",
      title: t("Online Orders Management"), // Use translation key for "Online Orders Management"
      icon: <List />,
    },

    {
      segment: "stats",
      title: t("Order Quantities"), // Use translation key for "Order Quantities"
      icon: <Scale />,
    },
    {
      segment: "expenses",
      title: t("Expenses"), // Use translation key for "Expenses"
      icon: <AttachMoneyIcon />,
    },
    {
      segment: "menu",
      title: t("Menu"), // Use translation key for "Menu"
      icon: <RestaurantMenuIcon />,
    },
    {
      segment: "reservations2",
      title: t("Reservations"), // Use translation key for "Reservations"
      icon: <BookmarkAddedIcon />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: t("Analytics"), // Use translation key for "Analytics"
    },
    {
      segment: "config",
      title: t("Settings"), // Use translation key for "Settings"
      icon: <SettingsIcon />,
      children: [
        {
          segment: "meals",
          title: t("Services"), // Use translation key for "Services"
          icon: <Grid2x2PlusIcon />,
        },
        {
          segment: "buffet-packages",
          title: t("Buffet Packages"), // Use translation key for "Buffet Packages"
          icon: <AddShoppingCartIcon />,
        },
        {
          segment: "MealCategories",
          title: t("Categories"), // Use translation key for "Categories"
          icon: <LayoutPanelTop />,
        },
      
        {
          segment: "customers",
          title: t("Customers"), // Use translation key for "Customers"
          icon: <Users />,
        },
        {
          segment: "users",
          title: t("Users"), // Use translation key for "Users"
          icon: <Users />,
        },
        {
          segment: "services",
          title: t("Sub Services"), // Use translation key for "Sub Services"
          icon: <HandPlatter />,
        },
        {
          segment: "settings",
          title: t("Other"), // Use translation key for "Other"
          icon: <Users />,
        },
        {
          segment: "whatsapp-test",
          title: t("WhatsApp Test"), // Use translation key for "WhatsApp Test"
          icon: <MessageCircle />,
        },


      ],
    },
  ];
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [audio] = React.useState(new Audio(alarm));

  const pauseAlarm = () => {
    audio.pause();
  };
  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     axiosClient.get("arrival").then(({ data }) => {
  //       console.log(data);
  //       setOrders(data);
  //       if (data.length > 0) {
  //         setOpen(true);
  //         playAlarm();
  //       }
  //     });
  //   }, 15000);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={{
        title: "Del Pasta ",
        logo: <img src={del} />,
      }}
    >
      <React.Suspense
        fallback={
          <Box
            sx={{
              userSelect:'none',
              // height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            <CircularProgress />{" "}
          </Box>
        }
      >
        <I18nextProvider i18n={i18n}>
          <CacheProvider value={cacheRtl}>
            {/* sx={{height:'90vh'}}  */}
            <DashboardLayout
              slots={{
                sidebarFooter: SidebarFooter,
                toolbarActions: NavActions,
              }}
            >
              <PageContainer
                className="root-container"
                sx={{ margin: 0, p: 1 }}
              >
                <Outlet
                  context={{
                    selectedOrder,
                    setSelectedOrder,
                    isIpadPro, setIsIpadPro,meals
                  }}
                />
              </PageContainer>{" "}
            </DashboardLayout>
          </CacheProvider>
        </I18nextProvider>
      </React.Suspense>
      <ArriavalDialog
        pauseAlarm={pauseAlarm}
        setSelectedOrder={setSelectedOrder}
        selectedOrder={selectedOrder}
        handleClose={handleClose}
        open={open}
        orders={orders}
        setOrders={setOrders}
      />
      <React.Suspense>
      <LoginDialog open={openLoginDialog} handleClose={()=>{
        setCloseLoginDialog()
      }}/>
      </React.Suspense>
    
    </AppProvider>
    // preview-end
  );
}
