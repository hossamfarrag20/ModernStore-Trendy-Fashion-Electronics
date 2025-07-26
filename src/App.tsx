import { useState, useMemo, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { ProductCard } from "./components/ProductCard";
import { LoadingGrid } from "./components/LoadingSpinner";
import { RegisterPage } from "./components/RegisterPage";
import { LoginPage } from "./components/LoginPage";
import { CartPage } from "./components/CartPage";
import { ProductDetailsPage } from "./components/ProductDetailsPage";
import { useProducts, useCategories } from "./hooks/useProducts";
import { filterAndSortProducts } from "./utils/productUtils";
import { useAuth } from "./contexts/AuthContext";
import type { FilterState } from "./types";

function HomePage({ searchTerm }: { searchTerm: string }) {
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { user, isAuthenticated } = useAuth();
  const mainRef = useRef<HTMLElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: "",
    searchTerm: "",
    sortBy: "name",
  });

  // Update filters when searchTerm prop changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  }, [searchTerm]);

  // Animate main content when products load
  useEffect(() => {
    if (!productsLoading && products.length > 0 && mainRef.current) {
      // Animate welcome title
      gsap.fromTo(
        ".welcome-title",
        {
          opacity: 0,
          y: -50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.8)",
          delay: 0.5,
        }
      );

      // Animate welcome subtitle
      gsap.fromTo(
        ".welcome-subtitle",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.8,
        }
      );

      // Animate main container
      gsap.fromTo(
        mainRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    }
  }, [productsLoading, products]);

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, filters);
  }, [products, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{productsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <motion.main
        ref={mainRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {!categoriesLoading && (
          <FilterBar
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            totalProducts={filteredProducts.length}
          />
        )}

        {productsLoading ? (
          <LoadingGrid />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {!productsLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Welcome message with enhanced animations */}
        {!productsLoading && filteredProducts.length > 0 && (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 welcome-title"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              🛍️{" "}
              {isAuthenticated
                ? `Welcome back, ${user?.username}!`
                : "Welcome to ModernStore"}
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 welcome-subtitle max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {isAuthenticated
                ? `Discover amazing products and manage your cart with ease`
                : "Discover amazing products with modern design and smooth animations"}
            </motion.p>
            {isAuthenticated && user?.username && (
              <motion.p
                className="text-sm text-gray-600 dark:text-gray-400 mt-4 glass px-4 py-2 rounded-full inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                Logged in as: {user.username}
              </motion.p>
            )}
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}

function AppContent() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header searchTerm={searchTerm} onSearchChange={handleSearchChange} />

        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
