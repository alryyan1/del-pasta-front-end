import * as React from "react";
import Box from "@mui/material/Box";
import { ConfigProvider, Layout, Menu, theme as antdTheme, Avatar, Dropdown } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  DollarOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/contexts/stateContext";
import { CircularProgress } from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import { CacheProvider } from "@emotion/react";
import { cacheRtl } from "@/helpers/constants";
 
import "./../i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./../i18n";
import ArriavalDialog from "@/components/ArriavalDialog";
import alarm from "./../assets/alarm.wav";
import { Meal, Order } from "@/Types/types";
import LoginDialog from "@/components/LoginDialog";
import { useAuthStore } from "@/AuthStore";
// import logo from "./../assets/logo.svg";

const demoTheme = createTheme({
  // direction: "rtl",
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
  colorSchemes: { light: true },
});


export default function DashboardLayoutBasic() {
  const [isIpadPro, setIsIpadPro] = React.useState(false);
  const {openLoginDialog,setCloseLoginDialog} =  useAuthStore((state)=>state)
  console.log(openLoginDialog,'openDialog')
  const navigate =  useNavigate()
   const {setUser,setToken,} = useAuthContext()
    const [meals,setMeals] = React.useState<Meal[]>([]);
  // const screens = Grid.useBreakpoint();
  const [collapsed, setCollapsed] = React.useState(false);
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
  const sidebarItems: { key: string; label: string; icon: React.ReactNode; to: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined />, to: '/dashboard' },
    { key: 'makeOrder', label: 'New Order', icon: <ShoppingCartOutlined />, to: '/makeOrder' },
    { key: 'orders', label: 'Orders', icon: <UnorderedListOutlined />, to: '/orders' },
    { key: 'expenses', label: 'Expenses', icon: <DollarOutlined />, to: '/expenses' },
    { key: 'menu', label: 'Menu', icon: <AppstoreOutlined />, to: '/menu' },
    { key: 'online-order', label: 'Online Order', icon: <ShoppingCartOutlined />, to: '/online-order' },
    { key: 'online-orders-list', label: 'Online Orders', icon: <ShoppingCartOutlined />, to: '/online-orders-list' },
  ];

  const settingsItems: { key: string; label: string; icon: React.ReactNode; to: string }[] = [
    { key: 'meals', label: 'Services', icon: <ToolOutlined />, to: '/config/meals' },
    { key: 'MealCategories', label: 'Categories', icon: <AppstoreOutlined />, to: '/config/MealCategories' },
    { key: 'customers', label: 'Customers', icon: <TeamOutlined />, to: '/config/customers' },
    { key: 'users', label: 'Users', icon: <UserSwitchOutlined />, to: '/config/users' },
    { key: 'services', label: 'Sub Services', icon: <ToolOutlined />, to: '/config/services' },
    { key: 'settings', label: 'Other', icon: <SettingOutlined />, to: '/config/settings' },
  ];

  const { user } = useAuthContext() as { user: { name?: string } | null };
  
  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('user_type');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];
  return (
    // preview-start
    <ThemeProvider theme={demoTheme}>
      <CssBaseline />
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
            <AuthProvider>
              <ConfigProvider
                theme={{
                  algorithm: antdTheme.defaultAlgorithm,
                  token: {
                    colorPrimary: '#9c27b0',
                    colorBgLayout: '#f5f5f7',
                    colorText: '#111827',
                  },
                }}
              >
              <Layout style={{ minHeight: '100vh' }}>
                <Layout.Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} breakpoint="lg">
                  <div style={{ height: 64, margin: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    {/* <img src={logo} alt="logo" style={{ width: 100, height: 100 }} /> */}
                    <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Del-pasta</h1>

                  </div>
                  <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[]}
                    onClick={({ key }) => {
                      const item = [...sidebarItems, ...settingsItems].find(i => i.key === key);
                      if (item) navigate(item.to);
                    }}
                    items={[
                      {
                        key: 'main',
                        label: 'Main Items',
                        type: 'group',
                        children: sidebarItems.map(i => ({ key: i.key, icon: i.icon, label: i.label }))
                      },
                      {
                        key: 'settings',
                        label: 'Settings',
                        type: 'group',
                        children: settingsItems.map(i => ({ key: i.key, icon: i.icon, label: i.label }))
                      }
                    ]}
                  />
                </Layout.Sider>
                <Layout>
                  <Layout.Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
                    <Box sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
                      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        onClick: () => setCollapsed(!collapsed),
                        style: { fontSize: 18, cursor: 'pointer' ,color:'#fff'}
                      })}
                      del-pasta
                    </Box>
                    <Box sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span>{user?.name || 'User'}</span>
                      <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        arrow
                      >
                        <Avatar 
                          style={{ backgroundColor: '#9c27b0', cursor: 'pointer' }}
                          icon={<UserOutlined />}
                        />
                      </Dropdown>
                    </Box>
                  </Layout.Header>
                  <Layout.Content style={{ margin: 16 }}>
                    <Box sx={{ p: 1, minHeight: 'calc(100vh - 64px - 32px)' }}>
                      <Outlet
                        context={{
                          selectedOrder,
                          setSelectedOrder,
                          isIpadPro, setIsIpadPro,meals
                        }}
                      />
                    </Box>
                  </Layout.Content>
                </Layout>
              </Layout>
              </ConfigProvider>
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
      <LoginDialog open={openLoginDialog} handleClose={()=>{
        setCloseLoginDialog()
      }}/>
      </React.Suspense>
    
    </ThemeProvider>
    // preview-end
  );
}
