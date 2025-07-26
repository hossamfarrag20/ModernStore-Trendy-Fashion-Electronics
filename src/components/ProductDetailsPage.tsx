import React, { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  Loader,
  Sparkles,
} from "lucide-react";
import { useProduct, useProductsByCategory } from "../hooks/useProducts";
import { useCart } from "../contexts/CartContext";

import { AnimatedBackground } from "./AnimatedBackground";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  // Use React Query hooks for data fetching with caching
  const productId = id ? parseInt(id, 10) : 0;
  const { product, loading, error } = useProduct(productId);
  const { products: relatedProducts } = useProductsByCategory(
    product?.category || ""
  );

  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  // const [isLiked, setIsLiked] = useState(false); // TODO: Implement wishlist functionality

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Filter related products to exclude current product and limit to 4
  const filteredRelatedProducts = relatedProducts
    .filter((p) => p.id !== productId)
    .slice(0, 4);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      await addToCart(product, quantity);
      setAddedToCart(true);

      // Reset added state after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  // Check if product is already in cart
  const cartItem = cartItems.find((item) => item.id === product?.id);
  const isInCart = !!cartItem;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The product you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to="/"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white capitalize font-medium">
              {product.category}
            </span>
            <span>/</span>
            <span className="text-gray-900 dark:text-white truncate max-w-xs font-medium">
              {product.title}
            </span>
          </motion.nav>

          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="
              inline-flex items-center px-4 py-2 mb-8
              glass border border-white/20 dark:border-gray-700/50
              text-primary-600 hover:text-primary-500 dark:text-primary-400
              rounded-xl transition-all duration-300 hover:shadow-lg
              hover:border-primary-300/50 group
            "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </motion.button>

          <motion.div
            ref={containerRef}
            className="glass-card shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-500" />

            <div className="md:grid md:grid-cols-2 lg:gap-x-8 relative z-10">
              {/* Product Images */}
              <motion.div
                className="aspect-w-1 aspect-h-1 glass lg:aspect-none  relative group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  ref={imageRef}
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-center object-contain lg:w-full lg:h-full p-8 transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>

              {/* Product Info */}
              <motion.div
                ref={detailsRef}
                className="p-6 lg:p-8 flex flex-col justify-between"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div>
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <span className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-700 dark:text-primary-300 rounded-xl border border-primary-200/50 dark:border-primary-700/50 capitalize">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {product.category}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-primary-400 dark:to-purple-400 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    {product.title}
                  </motion.h1>

                  {/* Rating */}
                  <motion.div
                    className="flex items-center space-x-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating.rate)}
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {product.rating.rate} ({product.rating.count} reviews)
                    </span>
                  </motion.div>

                  {/* Price */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      <div className="glass px-3 py-1 rounded-lg">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          Free shipping
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Description
                    </h3>
                    <div className="glass p-4 rounded-xl border border-white/20 dark:border-gray-700/50">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </motion.div>
                </div>{" "}
                {/* Category */}
                {/* Quantity and Add to Cart */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="
                          p-3 glass border border-white/20 dark:border-gray-700/50 rounded-xl
                          hover:border-primary-300/50 disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-300 hover:shadow-lg
                        "
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Minus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </motion.button>

                      <div className="glass px-6 py-3 border border-white/20 dark:border-gray-700/50 rounded-xl text-center min-w-[80px]">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quantity}
                        </span>
                      </div>

                      <motion.button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="
                          p-3 glass border border-white/20 dark:border-gray-700/50 rounded-xl
                          hover:border-primary-300/50 transition-all duration-300 hover:shadow-lg
                        "
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className={`
                        group relative flex-1 flex items-center justify-center px-8 py-4 rounded-xl font-semibold
                        transition-all duration-300 transform hover:scale-[1.02] overflow-hidden
                        ${
                          addedToCart
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25"
                            : "bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 hover:from-primary-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-primary-500/25"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button shimmer effect */}
                      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative flex items-center space-x-2">
                        {isAddingToCart ? (
                          <>
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <span>Adding to Cart...</span>
                          </>
                        ) : addedToCart ? (
                          <>
                            <Check className="w-5 h-5" />
                            <span>Added to Cart</span>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              <Sparkles className="w-4 h-4" />
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            <span>Add to Cart</span>
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Sparkles className="w-4 h-4" />
                            </motion.div>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </div>

                  {/* Cart Status */}
                  {isInCart && (
                    <motion.div
                      className="glass border border-green-300/50 dark:border-green-600/50 rounded-xl p-4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <p className="text-green-600 dark:text-green-400 font-medium">
                          This item is already in your cart ({cartItem.quantity}{" "}
                          items)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Related Products */}
          {filteredRelatedProducts.length > 0 && (
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <motion.h2
                className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-primary-400 dark:to-purple-400 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                Related Products
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRelatedProducts.map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    className="glass-card hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <Link
                      to={`/products/${relatedProduct.id}`}
                      className="relative z-10"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.title}
                          className="w-full h-48 object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>

                    <div className="p-4 relative z-10">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                        {relatedProduct.title}
                      </h3>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        <div className="flex items-center space-x-1">
                          {renderStars(relatedProduct.rating.rate)}
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            ({relatedProduct.rating.count})
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/products/${relatedProduct.id}`}
                        className="
                          w-full bg-gradient-to-r from-primary-500 to-purple-500
                          hover:from-primary-600 hover:to-purple-600
                          text-white py-2 px-4 rounded-xl
                          transition-all duration-300 text-center block text-sm font-semibold
                          hover:shadow-lg transform hover:scale-[1.02]
                        "
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
