import { FiMenu } from "react-icons/fi";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import clsx from "clsx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="bg-primary text-white shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <h1 className="text-2xl font-bold">تطبيق المطبخ</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 space-x-reverse">
          <a href="/home" className="hover:underline">
            لوحة التحكم
          </a>
          <a href="/orders" className="hover:underline">
            الطلبات
          </a>
          <a href="/about" className="hover:underline">
            حول
          </a>
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

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="bg-primary text-white md:hidden transition-all duration-300 ease-in-out">
          <ul className="flex flex-col space-y-4 p-4">
            {["الرئيسية", "حول", "اتصل بنا"].map((label, idx) => (
              <li key={idx}>
                <a
                  href={`/${
                    label === "الرئيسية"
                      ? "home"
                      : label === "حول"
                      ? "about"
                      : "contact"
                  }`}
                  className={clsx(
                    "block p-2 rounded transition duration-300",
                    "hover:bg-gray-200 hover:text-gray-800"
                  )}
                  onClick={closeMenu}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
