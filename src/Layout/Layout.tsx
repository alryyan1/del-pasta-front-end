import * as React from "react";
import Box from "@mui/material/Box";
import {
  Dashboard as DashboardIcon,
  ShoppingCart,
  List,
  AttachMoney,
  Apps,
  Settings,
  People,
  PersonAdd,
  Build,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/contexts/stateContext";
import {
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Drawer,
  List as MuiList,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import { CacheProvider } from "@emotion/react";
import { cacheLtr } from "@/helpers/constants";
 
import "./../i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./../i18n";
import ArriavalDialog from "@/components/ArriavalDialog";
import alarm from "./../assets/alarm.wav";
import { Meal, Order } from "@/Types/types";
import LoginDialog from "@/components/LoginDialog";
import { useAuthStore } from "@/AuthStore";

const demoTheme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#9c27b0",// purple
      // main: "#1976d2",
    },
    mode: 'light',
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
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
      "Tajawal", // Add your default font here
      "Arial",
      "sans-serif",
    ].join(","),
    // You can customize other typography settings here
    h1: {
      fontFamily: "Tajawal", // Custom font for h1
    },
    h2: {
      fontFamily: "Tajawal", // Custom font for h2
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
  colorSchemes: { light: true },
});

export default function DashboardLayoutBasic() {
  const [isIpadPro, setIsIpadPro] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const {openLoginDialog,setCloseLoginDialog} =  useAuthStore((state)=>state)
  console.log(openLoginDialog,'openDialog')
  const navigate =  useNavigate()
  const location = useLocation()
   const {setUser,setToken,} = useAuthContext()
    const [meals,setMeals] = React.useState<Meal[]>([]);
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
  }, [navigate, setToken, setUser])
  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1366px)'
    );

    const handleResize = (e: MediaQueryList | MediaQueryListEvent) => {
      const isMatch = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      setIsIpadPro(isMatch);
    };
    if (mediaQuery.matches) {
      console.log('The screen width is between 768px and 1366px');
    } else {
      console.log('The screen width is outside the range');
    }
    

    handleResize(mediaQuery); // Initial check
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
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order>({} as unknown as Order);
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
  const sidebarItems = [
    { path: '/dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/makeOrder', title: 'New Order', icon: <ShoppingCart /> },
    { path: '/orders', title: 'Orders', icon: <List /> },
    { path: '/expenses', title: 'Expenses', icon: <AttachMoney /> },
    { path: '/stats', title: 'Stats', icon: <Apps /> },
    // { path: '/menu', title: 'Menu', icon: <Apps /> },
    { path: '/online-order', title: 'Online Order', icon: <ShoppingCart /> },
    { path: '/online-orders-list', title: 'MOC', icon: <ShoppingCart /> },
  ];

  const settingsItems = [
    { path: '/config/meals', title: 'Services', icon: <Build /> },
    { path: '/config/MealCategories', title: 'Categories', icon: <Apps /> },
    { path: '/config/customers', title: 'Customers', icon: <People /> },
    { path: '/config/users', title: 'Users', icon: <PersonAdd /> },
    { path: '/config/services', title: 'Sub Services', icon: <Build /> },
    { path: '/config/settings', title: 'Other', icon: <Settings /> },
  ];

  const { user } = useAuthContext() as { user: { name?: string; user_type?: string } | null };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  // Get user type from user object or localStorage
  const userType = user?.user_type || localStorage.getItem('user_type');
  
  // Filter navigation items based on user type
  // All users (including staff) should see main items
  const getFilteredSidebarItems = () => {
    // Ensure all users can see main navigation items
    return sidebarItems;
  };
  
  const getFilteredSettingsItems = () => {
    // Only admin users can see settings, staff users cannot
    if (userType === 'staff') {
      return [];
    }
    return settingsItems;
  };
  
  const handleLogout = () => {
    // Call logout API endpoint
    axiosClient
      .post("logout")
      .then(() => {
        // Clear local storage
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('user_type');
        // Clear auth state
        setUser(null);
        setToken(null);
        // Close menu
        setAnchorEl(null);
        // Navigate to login
        navigate('/login');
      })
      .catch(() => {
        // Even if API call fails, clear local data and logout
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('user_type');
        setUser(null);
        setToken(null);
        setAnchorEl(null);
        navigate('/login');
      });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <ThemeProvider theme={demoTheme}>
      <CssBaseline />
      <React.Suspense
        fallback={
          <Box
            sx={{
              userSelect: 'none',
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <I18nextProvider i18n={i18n}>
          <CacheProvider value={cacheLtr}>
            <AuthProvider>
              <Box sx={{ display: 'flex', height: '100vh', direction: 'ltr' }}>
                {/* AppBar */}
                <AppBar 
                  position="fixed" 
                  elevation={1}
                  sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    direction: 'ltr',
                    left: 0,
                    right: 'auto',
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
                    <IconButton
                      color="inherit"
                      edge="start"
                      onClick={() => setDrawerOpen(!drawerOpen)}
                      sx={{ mr: 2 }}
                      aria-label="toggle drawer"
                    >
                      <MenuIcon />
                    </IconButton>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        flexGrow: 1,
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      }}
                    >
                      Del-pasta
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'inherit',
                          display: { xs: 'none', sm: 'block' },
                        }}
                      >
                        {user?.name || 'User'}
                      </Typography>
                      <IconButton 
                        onClick={handleMenuOpen} 
                        size="small" 
                        sx={{ color: 'inherit' }}
                        aria-label="user menu"
                      >
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main', 
                            width: 36, 
                            height: 36,
                            fontSize: '0.875rem',
                          }}
                        >
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </Box>
                  </Toolbar>
                </AppBar>

                {/* Drawer Sidebar - LEFT */}
                <Drawer
                  variant="persistent"
                  open={drawerOpen}
                  anchor="left"
                  sx={{
                    width: { xs: drawerOpen ? 240 : 0, sm: drawerOpen ? 240 : 0 },
                    flexShrink: 0,
                    display: { xs: drawerOpen ? 'block' : 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                      width: 240,
                      boxSizing: 'border-box',
                      mt: 8,
                      left: 0,
                      right: 'auto',
                      position: 'fixed',
                      borderRight: '1px solid',
                      borderColor: 'divider',
                    },
                  }}
                >
                  <Toolbar />
                  <Box sx={{ overflow: 'auto', pt: 2, pb: 2, direction: 'ltr', height: '100%' }}>
                    {/* Main Items */}
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        px: 2, 
                        py: 1,
                        fontWeight: 600, 
                        textAlign: 'left',
                        color: 'text.secondary',
                        display: 'block',
                      }}
                    >
                      Main Items
                    </Typography>
                    <MuiList sx={{ px: 1 }}>
                      {getFilteredSidebarItems().map((item) => (
                        <ListItem key={item.path} disablePadding>
                          <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            sx={{ 
                              direction: 'ltr',
                              borderRadius: 1,
                              mb: 0.5,
                              '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': {
                                  bgcolor: 'primary.dark',
                                },
                                '& .MuiListItemIcon-root': {
                                  color: 'primary.contrastText',
                                },
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                            <ListItemText 
                              primary={item.title} 
                              sx={{ textAlign: 'left' }}
                              primaryTypographyProps={{
                                fontWeight: location.pathname === item.path ? 600 : 400,
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </MuiList>

                    {/* Settings Items (only for non-staff) */}
                    {getFilteredSettingsItems().length > 0 && (
                      <>
                        <Typography 
                          variant="overline" 
                          sx={{ 
                            px: 2, 
                            py: 1,
                            fontWeight: 600, 
                            mt: 3,
                            display: 'block', 
                            textAlign: 'left',
                            color: 'text.secondary',
                          }}
                        >
                          Settings
                        </Typography>
                        <MuiList sx={{ px: 1 }}>
                          {getFilteredSettingsItems().map((item) => (
                            <ListItem key={item.path} disablePadding>
                              <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                                sx={{ 
                                  direction: 'ltr',
                                  borderRadius: 1,
                                  mb: 0.5,
                                  '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                      bgcolor: 'primary.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                      color: 'primary.contrastText',
                                    },
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                                <ListItemText 
                                  primary={item.title} 
                                  sx={{ textAlign: 'left' }}
                                  primaryTypographyProps={{
                                    fontWeight: location.pathname === item.path ? 600 : 400,
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </MuiList>
                      </>
                    )}
                  </Box>
                </Drawer>

                {/* Main Content */}
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    mt: 8,
                    ml: { xs: 0, sm: drawerOpen ? '240px' : 0 },
                    width: { xs: '100%', sm: drawerOpen ? 'calc(100% - 240px)' : '100%' },
                    maxWidth: { xl: '1920px' },
                    mx: { xl: 'auto' },
                    transition: 'margin-left 0.3s, width 0.3s',
                    minHeight: 'calc(100vh - 64px)',
                  }}
                >
                  <Outlet
                    context={{
                      selectedOrder,
                      setSelectedOrder,
                      isIpadPro,
                      setIsIpadPro,
                      meals
                    }}
                  />
                </Box>
              </Box>
            </AuthProvider>
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
        <LoginDialog
          open={openLoginDialog}
          handleClose={() => {
            setCloseLoginDialog()
          }}
        />
      </React.Suspense>
    </ThemeProvider>
  );
}
