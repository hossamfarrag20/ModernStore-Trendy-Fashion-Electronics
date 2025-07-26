import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Sun,
  Moon,
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({ searchTerm, onSearchChange }) => {
    const { isDark, toggleTheme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();
    const { getTotalItems } = useCart();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const themeButtonRef = useRef<HTMLButtonElement>(null);
    const cartButtonRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
      const header = headerRef.current;
      if (!header) return;

      // Animate header on mount - more dramatic
      gsap.fromTo(
        header,
        {
          y: -150,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.8)",
        }
      );

      // Animate logo and search bar with bounce effect
      gsap.fromTo(
        header.querySelectorAll(".animate-item"),
        {
          y: 50,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "bounce.out",
          stagger: 0.3,
          delay: 0.5,
        }
      );
    }, []);

    const handleThemeToggle = () => {
      if (themeButtonRef.current) {
        // Rotate animation for theme toggle
        gsap.to(themeButtonRef.current, {
          rotation: 360,
          duration: 0.6,
          ease: "power2.out",
        });

        // Scale animation
        gsap.to(themeButtonRef.current, {
          scale: 1.2,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }
      toggleTheme();
    };

    const handleCartClick = () => {
      if (cartButtonRef.current) {
        gsap.to(cartButtonRef.current, {
          scale: 1.1,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }
      navigate("/cart");
    };

    const handleLogout = () => {
      logout();
      setIsUserMenuOpen(false);
      navigate("/");
    };

    const totalItems = getTotalItems();

    return (
      <motion.header
        ref={headerRef}
        className="sticky top-0 z-50 glass-header border-b border-white/10 dark:border-gray-700/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-yellow-400 opacity-80" />
                  </motion.div>
                </motion.div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-700 dark:group-hover:from-primary-400 dark:group-hover:to-primary-300 transition-all duration-300">
                  ModernStore
                </h1>
              </Link>
            </motion.div>

            {/* Search Bar - Hidden on mobile */}
            <motion.div
              className="hidden md:flex flex-1 max-w-lg mx-4 sm:mx-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search amazing products..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="
                    w-full
                    pl-12
                    pr-4
                    py-3
                    text-sm sm:text-base
                    glass
                    border
                    border-white/20
                    dark:border-gray-700/50
                    rounded-xl
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary-500/50
                    focus:border-primary-400/50
                    text-gray-900
                    dark:text-white
                    placeholder-gray-500
                    dark:placeholder-gray-400
                    transition-all
                    duration-300
                    hover:border-white/30
                    dark:hover:border-gray-600/50
                    focus:bg-white/30
                    dark:focus:bg-gray-800/30
                  "
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart Button */}
              <motion.button
                ref={cartButtonRef}
                onClick={handleCartClick}
                className="
                  relative
                  p-3
                  rounded-xl
                  glass
                  hover:bg-white/30
                  dark:hover:bg-gray-800/30
                  transition-all
                  duration-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary-500/50
                  border
                  border-white/20
                  dark:border-gray-700/50
                  hover:border-white/40
                  dark:hover:border-gray-600/50
                  group
                "
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="
                      flex
                      items-center
                      space-x-2
                      p-2
                      rounded-lg
                      bg-gray-100
                      dark:bg-gray-800
                      hover:bg-gray-200
                      dark:hover:bg-gray-700
                      transition-all
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      animate-item
                    "
                  >
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.username}
                    </span>
                    {/* {user?.email && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">
                        {user.email}
                      </span>
                    )} */}
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.username}
                        </p>
                        {user?.email && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        )}
                      </div>

                      <Link
                        to="/test-cart"
                        className="
                          flex
                          items-center
                          w-full
                          px-4
                          py-2
                          text-sm
                          text-gray-700
                          dark:text-gray-300
                          hover:bg-gray-100
                          dark:hover:bg-gray-700
                        "
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Test Cart API
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="
                          flex
                          items-center
                          w-full
                          px-4
                          py-2
                          text-sm
                          text-gray-700
                          dark:text-gray-300
                          hover:bg-gray-100
                          dark:hover:bg-gray-700
                        "
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-gray-700
                      dark:text-gray-300
                      hover:text-blue-600
                      dark:hover:text-blue-400
                      transition-colors
                    "
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="
                      px-3
                      py-2
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      text-sm
                      font-medium
                      rounded-lg
                      transition-colors
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      focus:ring-offset-2
                      dark:focus:ring-offset-gray-900
                    "
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Theme Toggle */}
              <motion.button
                ref={themeButtonRef}
                onClick={handleThemeToggle}
                className="
                  p-3
                  rounded-xl
                  glass
                  hover:bg-white/30
                  dark:hover:bg-gray-800/30
                  transition-all
                  duration-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary-500/50
                  border
                  border-white/20
                  dark:border-gray-700/50
                  hover:border-white/40
                  dark:hover:border-gray-600/50
                  group
                "
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                aria-label="Toggle theme"
              >
                <motion.div
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300" />
                  )}
                </motion.div>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="
                md:hidden
                p-2
                rounded-lg
                bg-gray-100
                dark:bg-gray-800
                hover:bg-gray-200
                dark:hover:bg-gray-700
                transition-all
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              {/* Mobile Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="
                      w-full
                      pl-10
                      pr-4
                      py-2
                      bg-gray-100
                      dark:bg-gray-800
                      border
                      border-gray-300
                      dark:border-gray-600
                      rounded-lg
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-transparent
                      text-gray-900
                      dark:text-white
                      placeholder-gray-500
                      dark:placeholder-gray-400
                    "
                  />
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleCartClick}
                  className="
                    flex
                    items-center
                    w-full
                    px-3
                    py-2
                    text-left
                    text-gray-700
                    dark:text-gray-300
                    hover:bg-gray-100
                    dark:hover:bg-gray-700
                    rounded-lg
                  "
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  Cart ({totalItems})
                </button>

                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Signed in as {user?.username}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="
                        flex
                        items-center
                        w-full
                        px-3
                        py-2
                        text-left
                        text-gray-700
                        dark:text-gray-300
                        hover:bg-gray-100
                        dark:hover:bg-gray-700
                        rounded-lg
                      "
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="
                        block
                        px-3
                        py-2
                        text-gray-700
                        dark:text-gray-300
                        hover:bg-gray-100
                        dark:hover:bg-gray-700
                        rounded-lg
                      "
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="
                        block
                        px-3
                        py-2
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        rounded-lg
                        text-center
                      "
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}

                <button
                  onClick={handleThemeToggle}
                  className="
                    flex
                    items-center
                    w-full
                    px-3
                    py-2
                    text-left
                    text-gray-700
                    dark:text-gray-300
                    hover:bg-gray-100
                    dark:hover:bg-gray-700
                    rounded-lg
                  "
                >
                  {isDark ? (
                    <>
                      <Sun className="w-5 h-5 mr-3 text-yellow-500" />
                      Light mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 mr-3" />
                      Dark mode
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.header>
    );
  }
);
