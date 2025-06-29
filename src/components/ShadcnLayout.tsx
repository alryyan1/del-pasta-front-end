import React, { useState, useEffect, startTransition } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/contexts/stateContext";
import axiosClient from "@/helpers/axios-client";
import { Order } from "@/Types/types";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  LayoutDashboard,
  ListOrdered,
  PlusSquare,
  BarChart3,
  Settings,
  Users,
  HandPlatter,
  LayoutPanelTop,
  Utensils,
  Bookmark,
  Coins,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Home,
  Languages,
} from "lucide-react";

// Assets
import delPastaLogo from "@/assets/logo.png";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const ShadcnLayout: React.FC = () => {
  const { t, i18n } = useTranslation("layout");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuthContext();
  
  const [isValidatingAuth, setIsValidatingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isIpadPro, setIsIpadPro] = useState(false);

  // Authentication validation
  useEffect(() => {
    const validateAuth = async () => {
      if (!token) {
        startTransition(() => {
          setIsValidatingAuth(false);
        });
        navigate("/login", { replace: true });
        return;
      }

      try {
        await axiosClient.get("/user");
        startTransition(() => {
          setIsValidatingAuth(false);
        });
      } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { status: number } };
          if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
            startTransition(() => {
              logout();
            });
            navigate("/login", { replace: true });
            return;
          }
        }
        startTransition(() => {
          setIsValidatingAuth(false);
        });
      }
    };

    validateAuth();
  }, [token]);

  // Navigation configuration
  const navigationSections: NavigationSection[] = [
    {
      title: t("main_items"),
      items: [
        {
          title: t("dashboard"),
          href: "/dashboard",
          icon: <LayoutDashboard size={20} />,
        },
        {
          title: t("new_order"),
          href: "/makeOrder",
          icon: <PlusSquare size={20} />,
        },
        {
          title: t("orders"),
          href: "/orders",
          icon: <ListOrdered size={20} />,
        },
        {
          title: t("order_quantities"),
          href: "/stats",
          icon: <BarChart3 size={20} />,
        },
        {
          title: t("expenses"),
          href: "/expenses",
          icon: <Coins size={20} />,
        },
        {
          title: t("menu"),
          href: "/menu",
          icon: <Utensils size={20} />,
        },
        {
          title: t("reservations"),
          href: "/reservations2",
          icon: <Bookmark size={20} />,
        },
      ],
    },
    {
      title: t("settings_group"),
      items: [
        {
          title: t("services_nav"),
          href: "/config/meals",
          icon: <LayoutPanelTop size={20} />,
        },
        {
          title: t("categories_nav"),
          href: "/config/MealCategories",
          icon: <LayoutPanelTop size={20} />,
        },
        {
          title: t("customers_nav"),
          href: "/config/customers",
          icon: <Users size={20} />,
        },
        {
          title: t("users_nav"),
          href: "/config/users",
          icon: <Users size={20} />,
        },
        {
          title: t("sub_services_nav"),
          href: "/config/services",
          icon: <HandPlatter size={20} />,
        },
        {
          title: t("other_settings_nav"),
          href: "/config/settings",
          icon: <Settings size={20} />,
        },
      ],
    },
  ];

  const handleNavigation = (href: string) => {
    startTransition(() => {
      navigate(href);
      setIsMobileMenuOpen(false);
    });
  };

  const handleLogout = () => {
    startTransition(() => {
      logout();
      navigate("/login");
    });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <img
          src={delPastaLogo}
          alt="Del Pasta Logo"
          className="h-8 w-auto"
        />
        <span className="ml-2 text-lg font-semibold">Del Pasta</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {navigationSections.map((section, index) => (
            <div key={index}>
              <h4 className="mb-2 px-3 text-sm font-medium text-muted-foreground">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant={isActiveRoute(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigation(item.href)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  if (isValidatingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Card className="h-full rounded-none border-r">
          <SidebarContent />
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center border-b bg-background px-4 lg:px-6">
          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          {/* Breadcrumb / Title */}
          <div className="flex items-center ml-4 md:ml-0">
            <Home size={16} className="text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">/</span>
            <span className="ml-2 text-sm font-medium">
              {location.pathname.split('/').pop() || 'dashboard'}
            </span>
          </div>

          {/* Right side actions */}
          <div className="ml-auto flex items-center space-x-2">
            {/* Language Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Languages size={20} />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block">{user?.name}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User size={16} className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings size={16} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet
            context={{
              selectedOrder,
              setSelectedOrder,
              isIpadPro,
              setIsIpadPro,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default ShadcnLayout; 