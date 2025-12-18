import * as React from "react";
import {
  Box,
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
  Divider,
  alpha,
  Chip,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
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
  RestaurantMenu,
  Logout,
  Person,
  ChevronLeft,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/contexts/stateContext";
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

// Constants
const DRAWER_WIDTH = 260;
const APPBAR_HEIGHT = 64;

// Theme configuration
const theme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#7c3aed", // Modern purple
      light: "#a78bfa",
      dark: "#5b21b6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#10b981", // Emerald green
      light: "#34d399",
      dark: "#059669",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    divider: "#e2e8f0",
    success: {
      main: "#10b981",
    },
    error: {
      main: "#ef4444",
    },
  },
  typography: {
    fontFamily: ["Inter", "Tajawal", "Arial", "sans-serif"].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          display: "none",
        },
      },
    },
  },
});

// Navigation items
const mainNavItems = [
  { path: "/dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { path: "/makeOrder", title: "New Order", icon: <ShoppingCart /> },
  { path: "/orders", title: "Orders", icon: <List /> },
  { path: "/expenses", title: "Expenses", icon: <AttachMoney /> },
  { path: "/stats", title: "Statistics", icon: <Apps /> },
  { path: "/online-order", title: "Online Order", icon: <ShoppingCart /> },
  { path: "/online-orders-list", title: "Online Orders", icon: <ShoppingCart /> },
];

const settingsNavItems = [
  { path: "/config/meals", title: "Meals", icon: <RestaurantMenu /> },
  { path: "/config/MealCategories", title: "Categories", icon: <Apps /> },
  { path: "/config/customers", title: "Customers", icon: <People /> },
  { path: "/config/users", title: "Users", icon: <PersonAdd /> },
  { path: "/config/services", title: "Services", icon: <Build /> },
  { path: "/config/settings", title: "Settings", icon: <Settings /> },
];

export default function DashboardLayoutBasic() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [drawerOpen, setDrawerOpen] = React.useState(!isMobile);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [meals, setMeals] = React.useState<Meal[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [arrivalDialogOpen, setArrivalDialogOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order>({} as Order);
  const [isIpadPro, setIsIpadPro] = React.useState(false);
  const [audio] = React.useState(new Audio(alarm));

  const { openLoginDialog, setCloseLoginDialog } = useAuthStore((state) => state);
  const { user, setUser, setToken } = useAuthContext() as {
    user: { name?: string; user_type?: string } | null;
    setUser: (user: { name?: string; user_type?: string } | null) => void;
    setToken: (token: string | null) => void;
  };

  const userType = user?.user_type || localStorage.getItem("user_type");
  const isStaff = userType === "staff";

  // Fetch initial data
  React.useEffect(() => {
    axiosClient.get("meals").then(({ data }) => setMeals(data));
  }, []);

  // Auth check
  React.useEffect(() => {
    axiosClient
      .get("/user")
      .then(({ data }) => setUser(data))
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("ACCESS_TOKEN");
        navigate("/login");
      });
  }, [navigate, setToken, setUser]);

  // Language setup
  React.useEffect(() => {
    const lang = localStorage.getItem("lang");
    if (lang) i18n.changeLanguage(lang);
  }, []);

  // iPad Pro detection
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px) and (max-width: 1366px)");
    const handleResize = (e: MediaQueryList | MediaQueryListEvent) => {
      setIsIpadPro("matches" in e ? e.matches : (e as MediaQueryList).matches);
    };
    handleResize(mediaQuery);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Auto-close drawer on mobile
  React.useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    axiosClient
      .post("logout")
      .then(() => {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("user_type");
        setUser(null);
        setToken(null);
        setAnchorEl(null);
        navigate("/login");
      })
      .catch(() => {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("user_type");
        setUser(null);
        setToken(null);
        setAnchorEl(null);
        navigate("/login");
      });
  };

  const pauseAlarm = () => audio.pause();
  const handleArrivalClose = () => setArrivalDialogOpen(false);

  const NavItem = ({ item, isActive }: { item: typeof mainNavItems[0]; isActive: boolean }) => (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        selected={isActive}
        onClick={() => {
          navigate(item.path);
          if (isMobile) setDrawerOpen(false);
        }}
        sx={{
          borderRadius: 2,
          py: 1.25,
          px: 2,
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "white",
            boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
            "&:hover": {
              bgcolor: "primary.dark",
            },
            "& .MuiListItemIcon-root": {
              color: "white",
            },
          },
          "&:hover:not(.Mui-selected)": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: isActive ? "white" : "text.secondary",
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
          }}
        />
      </ListItemButton>
    </ListItem>
  );

  const SidebarContent = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        pt: 1,
      }}
    >
      {/* Main Navigation */}
      <Box sx={{ px: 2, mb: 1 }}>
        <Typography
          variant="overline"
          sx={{
            fontWeight: 700,
            fontSize: "0.65rem",
            color: "text.secondary",
            letterSpacing: "0.08em",
            pl: 1,
          }}
        >
          Main Menu
        </Typography>
      </Box>
      <MuiList sx={{ px: 1.5, flex: 1 }}>
        {mainNavItems.map((item) => (
          <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
        ))}
      </MuiList>

      {/* Settings Navigation (Admin only) */}
      {!isStaff && (
        <>
          <Divider sx={{ mx: 2, my: 2 }} />
          <Box sx={{ px: 2, mb: 1 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                fontSize: "0.65rem",
                color: "text.secondary",
                letterSpacing: "0.08em",
                pl: 1,
              }}
            >
              Settings
            </Typography>
          </Box>
          <MuiList sx={{ px: 1.5, pb: 2 }}>
            {settingsNavItems.map((item) => (
              <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
            ))}
          </MuiList>
        </>
      )}

      {/* User Info Card */}
      <Box
        sx={{
          p: 2,
          mx: 1.5,
          mb: 2,
          borderRadius: 3,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name || "User"}
            </Typography>
            <Chip
              label={isStaff ? "Staff" : "Admin"}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 600,
                bgcolor: isStaff
                  ? (theme) => alpha(theme.palette.info.main, 0.1)
                  : (theme) => alpha(theme.palette.success.main, 0.1),
                color: isStaff ? "info.main" : "success.main",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <React.Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              bgcolor: "background.default",
            }}
          >
            <CircularProgress size={48} />
          </Box>
        }
      >
        <I18nextProvider i18n={i18n}>
          <CacheProvider value={cacheLtr}>
            <AuthProvider>
              <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
                {/* AppBar */}
                <AppBar
                  position="fixed"
                  elevation={0}
                  sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: "background.paper",
                    color: "text.primary",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    backdropFilter: "blur(8px)",
                    backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                  }}
                >
                  <Toolbar sx={{ height: APPBAR_HEIGHT, px: { xs: 2, sm: 3 } }}>
                    {/* Menu Toggle */}
                    <IconButton
                      onClick={() => setDrawerOpen(!drawerOpen)}
                      sx={{
                        mr: 2,
                        color: "text.secondary",
                        "&:hover": {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                          color: "primary.main",
                        },
                      }}
                    >
                      {drawerOpen ? <ChevronLeft /> : <MenuIcon />}
                    </IconButton>

                    {/* Logo */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2,
                          bgcolor: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        DP
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          display: { xs: "none", sm: "block" },
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Del-Pasta
                      </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* User Menu */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          display: { xs: "none", md: "block" },
                        }}
                      >
                        Welcome, {user?.name || "User"}
                      </Typography>
                      <Tooltip title="Account">
                        <IconButton
                          onClick={(e) => setAnchorEl(e.currentTarget)}
                          sx={{
                            p: 0.5,
                            border: "2px solid",
                            borderColor: "divider",
                            "&:hover": {
                              borderColor: "primary.main",
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "primary.main",
                              fontSize: "0.875rem",
                              fontWeight: 600,
                            }}
                          >
                            {user?.name?.[0]?.toUpperCase() || "U"}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* User Dropdown Menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          mt: 1,
                          minWidth: 200,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {user?.name || "User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {isStaff ? "Staff Account" : "Administrator"}
                        </Typography>
                      </Box>
                      <MenuItem
                        onClick={() => setAnchorEl(null)}
                        sx={{ py: 1.5, gap: 1.5 }}
                      >
                        <Person fontSize="small" />
                        Profile
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          py: 1.5,
                          gap: 1.5,
                          color: "error.main",
                          "&:hover": {
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                          },
                        }}
                      >
                        <Logout fontSize="small" />
                        Logout
                      </MenuItem>
                    </Menu>
                  </Toolbar>
                </AppBar>

                {/* Sidebar Drawer */}
                <Drawer
                  variant={isMobile ? "temporary" : "persistent"}
                  anchor="right"
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  sx={{
                    width: drawerOpen ? DRAWER_WIDTH : 0,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                      width: DRAWER_WIDTH,
                      boxSizing: "border-box",
                      mt: `${APPBAR_HEIGHT}px`,
                      height: `calc(100% - ${APPBAR_HEIGHT}px)`,
                      borderRight: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                    },
                  }}
                >
                  <SidebarContent />
                </Drawer>

                {/* Main Content */}
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    minWidth: 0, // CRITICAL: allows flex child to shrink/stay within bounds
                    p: { xs: 2, sm: 3 },
                    mt: `${APPBAR_HEIGHT}px`,
                    transition: "width 0.3s ease",
                    minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`,
                  }}
                >
                  <Outlet
                    context={{
                      selectedOrder,
                      setSelectedOrder,
                      isIpadPro,
                      setIsIpadPro,
                      meals,
                    }}
                  />
                </Box>
              </Box>
            </AuthProvider>
          </CacheProvider>
        </I18nextProvider>
      </React.Suspense>

      {/* Dialogs */}
      <ArriavalDialog
        pauseAlarm={pauseAlarm}
        setSelectedOrder={setSelectedOrder}
        selectedOrder={selectedOrder}
        handleClose={handleArrivalClose}
        open={arrivalDialogOpen}
        orders={orders}
        setOrders={setOrders}
      />
      <React.Suspense fallback={null}>
        <LoginDialog open={openLoginDialog} handleClose={setCloseLoginDialog} />
      </React.Suspense>
    </ThemeProvider>
  );
}
