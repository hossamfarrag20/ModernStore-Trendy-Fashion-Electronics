import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProductsWithLoading } from "./ProductsWithLoading";
import { FilterBar } from "./FilterBar";
import { AnimatedBackground } from "./AnimatedBackground";
import {
  useProductsWithLoading,
  useCategoriesWithLoading,
} from "../hooks/useProducts";
import { LoadingSpinner } from "./LoadingSpinner";
import type { FilterState } from "../types";

export const ProductsPage: React.FC = () => {
  const { hasError: productsError } = useProductsWithLoading();
  const { categories, isLoading: categoriesLoading } =
    useCategoriesWithLoading();

  const [filters, setFilters] = useState<FilterState>({
    category: "",
    searchTerm: "",
    sortBy: "name",
  });

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
          <p className="text-gray-600 dark:text-gray-400">
            Something went wrong while loading products
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <motion.main
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="welcome-title text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent mb-4">
            Our Products
          </h1>
          <p className="welcome-subtitle text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing products with the best quality and prices
          </p>
        </motion.div>

        {/* Filter Bar */}
        {categoriesLoading ? (
          <div className="flex justify-center mb-8">
            <LoadingSpinner size="md" className="text-primary-600" />
          </div>
        ) : (
          <FilterBar
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            totalProducts={0} // Will be calculated in ProductsWithLoading
          />
        )}

        {/* Products Grid with Loading */}
        <ProductsWithLoading
          searchTerm={filters.searchTerm}
          category={filters.category}
          className="mt-8"
        />
      </motion.main>
    </div>
  );
};
