import React from "react";
import { motion } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import { LoadingSpinner } from "./LoadingSpinner";
import { ProductCard } from "./ProductCard";
import { AlertCircle } from "lucide-react";

interface ProductsWithLoadingProps {
  searchTerm?: string;
  category?: string;
  className?: string;
}

export const ProductsWithLoading: React.FC<ProductsWithLoadingProps> = ({
  searchTerm = "",
  category = "",
  className = "",
}) => {
  const { products, loading, error } = useProducts();

  // Filter products based on search term and category
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = !category || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, category]);

  // Loading state with LoadingSpinner
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <LoadingSpinner size="lg" className="mb-4" />
        <motion.p
          className="text-gray-600 dark:text-gray-400 text-lg font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading products...
        </motion.p>
        <motion.p
          className="text-gray-500 dark:text-gray-500 text-sm mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Please wait while we fetch the latest products
        </motion.p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Products
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // No products found
  if (filteredProducts.length === 0) {
    return (
      <motion.div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Products Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || category
              ? "Try adjusting your search or filter criteria"
              : "No products available at the moment"}
          </p>
        </div>
      </motion.div>
    );
  }

  // Products grid
  return (
    <motion.div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {filteredProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </motion.div>
  );
};
