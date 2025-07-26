import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import type { Product } from "../types";
import { useCart } from "../contexts/CartContext";

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const cartButtonRef = useRef<HTMLButtonElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const { addToCart, cartItems } = useCart();

    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;

      // Initial animation - more dramatic and slower
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotation: -5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
          delay: index * 0.2,
        }
      );

      // Hover animations - more dramatic
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -15,
          scale: 1.05,
          rotation: 2,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotation: 0,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          duration: 0.4,
          ease: "power2.out",
        });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
        gsap.killTweensOf(card);
      };
    }, [index]);

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price || 0);
    };

    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ));
    };

    const handleAddToCart = async () => {
      if (isAddingToCart) return;

      setIsAddingToCart(true);

      try {
        await addToCart(product, 1);
        setAddedToCart(true);

        // Animate cart button
        if (cartButtonRef.current) {
          gsap.to(cartButtonRef.current, {
            scale: 1.1,
            duration: 0.2,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          });
        }

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

    // Check if product is already in cart
    const isInCart = cartItems.some((item) => item.id === product.id);
    const cartItem = cartItems.find((item) => item.id === product.id);

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
        className="
          group
          relative
          glass-card
          hover-lift
          hover-glow
          overflow-hidden
          cursor-pointer
          border-0
          bg-gradient-to-br
          from-white/20
          via-white/10
          to-white/5
          dark:from-gray-800/20
          dark:via-gray-800/10
          dark:to-gray-800/5
          backdrop-blur-xl
          shadow-2xl
          hover:shadow-3xl
          transition-all
          duration-500
          ease-out
          flex
          flex-col
          justify-between
        "
      >
        {/* Shimmer Effect Overlay */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Sparkle Effect */}
        <motion.div
          className="absolute top-4 right-4 text-yellow-400 opacity-0 group-hover:opacity-100"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>

        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-8 h-8 border-4 border-primary-300 border-t-primary-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
          <motion.img
            ref={imageRef}
            src={product.image}
            alt={product.title}
            loading="lazy"
            className={`
              w-full
              h-64
              object-contain
              p-6
              transition-all
              duration-500
              ease-out
              ${imageLoaded ? "opacity-100" : "opacity-0"}
            `}
            whileHover={{
              scale: 1.08,
              rotate: 2,
              transition: { duration: 0.3 },
            }}
            onLoad={() => {
              setImageLoaded(true);
              // Animate image appearance
              if (imageRef.current) {
                gsap.fromTo(
                  imageRef.current,
                  {
                    opacity: 0,
                    scale: 0.8,
                    rotation: -10,
                  },
                  {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                  }
                );
              }
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
              setImageLoaded(true);
            }}
          />

          {/* Category Badge */}
          <motion.div
            className="absolute top-4 left-4 z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: 0.2 + index * 0.1 },
            }}
          >
            <span
              className="
              px-3
              py-1.5
              bg-gradient-to-r
              from-primary-500
              to-primary-600
              text-white
              text-xs
              font-semibold
              rounded-full
              capitalize
              shadow-lg
              backdrop-blur-sm
              border
              border-white/20
              hover:from-primary-600
              hover:to-primary-700
              transition-all
              duration-300
              cursor-default
            "
            >
              {product.category}
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="">
          <motion.div
            className="p-6 space-y-4 "
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.4 + index * 0.1 },
            }}
          >
            {/* Title */}
            <h3
              className="
            
            text-lg
            font-bold
            text-gray-900
            dark:text-white
            line-clamp-2
            group-hover:text-primary-600
            dark:group-hover:text-primary-400
            transition-colors
            duration-300
            leading-tight
            tracking-tight
          "
            >
              {product.title}
            </h3>

            {/* Description */}
            <p
              className="
            text-sm
            text-gray-600
            dark:text-gray-300
            line-clamp-2
            leading-relaxed
            opacity-80
            group-hover:opacity-100
            transition-opacity
            duration-300
          "
            >
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-0.5">
                  {renderStars(product.rating.rate)}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {product.rating.rate}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                {product.rating.count} reviews
              </span>
            </div>

            {/* Price and Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <motion.span
                  className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatPrice(product.price)}
                </motion.span>
                {isInCart && cartItem && (
                  <motion.span
                    className="text-xs text-accent-600 dark:text-accent-400 font-semibold bg-accent-50 dark:bg-accent-900/20 px-2 py-1 rounded-full border border-accent-200 dark:border-accent-800"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    In cart ({cartItem.quantity})
                  </motion.span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  ref={cartButtonRef}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`
                  flex-1
                  flex
                  items-center
                  justify-center
                  px-4
                  py-3
                  rounded-xl
                  font-semibold
                  text-sm
                  transition-all
                  duration-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-offset-transparent
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  backdrop-blur-sm
                  border
                  ${
                    addedToCart
                      ? "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white border-accent-400 shadow-lg shadow-accent-500/25"
                      : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-primary-400 shadow-lg shadow-primary-500/25"
                  }
                `}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {isAddingToCart ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : addedToCart ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </>
                  )}
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/products/${product.id}`}
                    className="
                    inline-flex
                    items-center
                    justify-center
                    px-4
                    py-3
                    glass
                    hover:bg-white/30
                    dark:hover:bg-gray-800/30
                    text-gray-700
                    dark:text-gray-200
                    rounded-xl
                    font-semibold
                    text-sm
                    transition-all
                    duration-300
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary-500
                    focus:ring-offset-2
                    focus:ring-offset-transparent
                    text-center
                    no-underline
                    border
                    border-white/20
                    dark:border-gray-700/50
                    hover:border-white/40
                    dark:hover:border-gray-600/50
                    backdrop-blur-sm
                  "
                  >
                    Details
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
);
