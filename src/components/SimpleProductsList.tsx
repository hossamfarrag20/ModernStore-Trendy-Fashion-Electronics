import React from "react";
import { motion } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import { LoadingSpinner } from "./LoadingSpinner";
import { AlertCircle, Package } from "lucide-react";

export const SimpleProductsList: React.FC = () => {
  const { products, loading, error } = useProducts();

  // Loading state with LoadingSpinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <LoadingSpinner size="lg" className="mb-6" />
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Products
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching the latest products for you...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[400px] p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Products
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[400px] p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Package className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Products Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          There are no products to display at the moment.
        </p>
      </motion.div>
    );
  }

  // Products list
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Products ({products.length})
      </h2>
      
      <div className="grid gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="glass-card p-4 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
