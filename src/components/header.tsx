import { FiMenu } from "react-icons/fi";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { useAuthContext } from "@/contexts/stateContext";
import axiosClient from "@/helpers/axios-client";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const navigate = useNavigate();
  const { authenticate, user, setUser } = useAuthContext();
  const [loading, setLoading] = useState<boolean>();
  const logoutHandler = () => {
    setLoading(true);
    console.log("navigate to to login");
    axiosClient
      .post("logout")
      .then(() => {
        authenticate(null);
        setUser(null);
        localStorage.clear();
        navigate("/login");
      })
      .finally(() => setLoading(false));
  };

  return (
    <header className="bg-primary text-white shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <h1 className="text-2xl font-bold">تطبيق المطبخ</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 space-x-reverse">
          <Link to={"/orders"} style={{ fontSize: '18px' }}>الطلبات</Link>
          <Link to={"/makeOrder"} style={{ fontSize: '18px' }}>طلب جديد</Link>
          <Link to={"/mealCategories"} style={{ fontSize: '18px' }}>الفئات</Link>
          <Link to={"/config"} style={{ fontSize: '18px' }} color="inherit">الإعدادات</Link>
          <Link to={"/meals"} style={{ fontSize: '18px' }} color="inherit">الوجبات</Link>
          <Link to={"/dashboard"} style={{ fontSize: '18px' }} color="inherit">لوحة التحكم</Link>
          <Link to={"/customers"} style={{ fontSize: '18px' }} color="inherit">العملاء</Link>
          <Link to={"/expenses"} style={{ fontSize: '18px' }} color="inherit">المصروفات</Link>
          <LoadingButton
            onClick={logoutHandler}
            loading={loading}
            size="large"
            edge="start"
            color="inherit"
            aria-label="logout"
            sx={{ mr: 2 }}
          >
            <LogOutIcon />
          </LoadingButton>
        </nav>

        {/* Mobile Menu Toggle */}
        <Button
          className="md:hidden"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle Menu"
        >
          <FiMenu size={24} />
        </Button>
      </div>
    </header>
  );
};

export default Header;