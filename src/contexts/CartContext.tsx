import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  Product,
  Cart,
  CartItem,
  CartContextType,
  CartProduct,
} from "../types";
import { apiService } from "../services/api";
import { useAuth } from "./AuthContext";
import {
  useCreateCartMutation,
  useUpdateCartMutation,
  // useDeleteCartMutation, // TODO: Import when implementing cart deletion
  // useInvalidateCartCache, // TODO: Import when implementing cache invalidation
} from "../hooks/useCartQueries";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // React Query mutations for optimized cart operations
  const createCartMutation = useCreateCartMutation();
  const updateCartMutation = useUpdateCartMutation();
  // const deleteCartMutation = useDeleteCartMutation(); // TODO: Implement cart deletion
  // const { invalidateUserCarts } = useInvalidateCartCache(); // TODO: Implement cache invalidation

  // Load cart when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCart(null);
      // Load guest cart from localStorage for non-authenticated users
      loadLocalCart();
    }
  }, [isAuthenticated, user]);

  const loadUserCart = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Loading cart for user ID: ${user.id}`);

      // First try localStorage (most reliable for persistence)
      const userCartKey = `cart_user_${user.id}`;
      const localCart = localStorage.getItem(userCartKey);

      if (localCart) {
        try {
          const items: CartItem[] = JSON.parse(localCart);
          setCartItems(items);
          console.log("Loaded cart from localStorage:", items);
          setLoading(false);
          return;
        } catch (parseError) {
          console.error("Error parsing local cart:", parseError);
        }
      }

      // If no local cart, try to load from API
      try {
        const userCarts = await apiService.getUserCart(user.id);
        console.log("API response for user carts:", userCarts);

        if (userCarts.length > 0) {
          const latestCart = userCarts[0]; // Get the most recent cart
          setCart(latestCart);

          // Convert cart products to cart items with full product data
          const items: CartItem[] = await Promise.all(
            latestCart.products.map(async (cartProduct) => {
              try {
                // Use productId from API response (fakestoreapi uses productId, not id)
                const productId = cartProduct.productId || cartProduct.id;

                // Ensure we have a valid product ID
                if (!productId || typeof productId !== "number") {
                  throw new Error(`Invalid product ID: ${productId}`);
                }

                // Fetch full product details from API to get complete data
                const fullProduct = await apiService.getProductById(productId);
                return {
                  ...fullProduct,
                  quantity: cartProduct.quantity || 1,
                };
              } catch (productError) {
                console.error(
                  `Error fetching product ${
                    cartProduct.productId || cartProduct.id
                  }:`,
                  productError
                );
                // Fallback to cart product data with default values
                const productId = cartProduct.productId || cartProduct.id;

                // Ensure we have a valid product ID for fallback
                const fallbackId =
                  typeof productId === "number" ? productId : 0;

                return {
                  id: fallbackId,
                  title: cartProduct.title || "Unknown Product",
                  price: cartProduct.price || 0,
                  description: cartProduct.description || "",
                  category: cartProduct.category || "unknown",
                  image: cartProduct.image || "",
                  rating: { rate: 0, count: 0 },
                  quantity: cartProduct.quantity || 1,
                };
              }
            })
          );

          setCartItems(items);
          console.log("Loaded cart from API with full product data:", items);

          // Save to localStorage for future use
          localStorage.setItem(userCartKey, JSON.stringify(items));
        } else {
          // No cart found in API, start with empty cart
          setCartItems([]);
          console.log("No cart found in API, starting with empty cart");
        }
      } catch (apiError) {
        console.log("API cart not available:", apiError);
        // Start with empty cart if both localStorage and API fail
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading user cart:", error);
      setError("Failed to load cart");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalCart = () => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const items: CartItem[] = JSON.parse(storedCart);
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error loading local cart:", error);
    }
  };

  const saveLocalCart = (items: CartItem[]) => {
    if (isAuthenticated && user) {
      // Save cart with user-specific key for authenticated users
      const userCartKey = `cart_user_${user.id}`;
      localStorage.setItem(userCartKey, JSON.stringify(items));
    } else {
      // Save cart with generic key for guest users
      localStorage.setItem("cart", JSON.stringify(items));
    }
  };

  const addToCart = async (
    product: Product,
    quantity: number = 1
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );
      let newCartItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newCartItems = [...cartItems];
        newCartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem: CartItem = { ...product, quantity };
        newCartItems = [...cartItems, newItem];
      }

      setCartItems(newCartItems);

      // Always save to localStorage first for persistence
      saveLocalCart(newCartItems);

      if (isAuthenticated && user) {
        // Also try to save to API using React Query mutations
        try {
          const cartProducts: CartProduct[] = newCartItems.map((item) => ({
            productId: item.id, // Use productId for API compatibility
            title: item.title,
            price: item.price,
            description: item.description,
            category: item.category,
            image: item.image,
            quantity: item.quantity,
          }));

          if (cart) {
            // Update existing cart using mutation
            console.log("Updating existing cart:", cart.id);
            updateCartMutation.mutate(
              { cartId: cart.id, cart: { products: cartProducts } },
              {
                onSuccess: (updatedCart) => {
                  setCart(updatedCart);
                  console.log("Cart updated successfully:", updatedCart);
                },
                onError: (error) => {
                  console.error("Failed to update cart:", error);
                },
              }
            );
          } else {
            // Create new cart using mutation
            console.log("Creating new cart for user:", user.id);
            createCartMutation.mutate(
              {
                userId: user.id,
                date: new Date().toISOString(),
                products: cartProducts,
              },
              {
                onSuccess: (newCart) => {
                  setCart(newCart);
                  console.log("Cart created successfully:", newCart);
                },
                onError: (error) => {
                  console.error("Failed to create cart:", error);
                },
              }
            );
          }
        } catch (apiError) {
          console.error("Failed to save cart to API:", apiError);
          // Cart is still saved locally, so operation continues
        }
      }
    } catch (error) {
      setError("Failed to add item to cart");
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const newCartItems = cartItems.filter((item) => item.id !== productId);
      setCartItems(newCartItems);

      // Always save to localStorage first
      saveLocalCart(newCartItems);

      if (isAuthenticated && user && cart) {
        try {
          const cartProducts: CartProduct[] = newCartItems.map((item) => ({
            productId: item.id, // Use productId for API compatibility
            title: item.title,
            price: item.price,
            description: item.description,
            category: item.category,
            image: item.image,
            quantity: item.quantity,
          }));

          const updatedCart = await apiService.updateCart(cart.id, {
            products: cartProducts,
          });
          setCart(updatedCart);
          console.log("Item removed from cart API:", updatedCart);
        } catch (apiError) {
          console.error("Failed to remove item from API cart:", apiError);
        }
      }
    } catch (error) {
      setError("Failed to remove item from cart");
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    productId: number,
    quantity: number
  ): Promise<void> => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newCartItems = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      setCartItems(newCartItems);

      // Always save to localStorage first
      saveLocalCart(newCartItems);

      if (isAuthenticated && user && cart) {
        try {
          const cartProducts: CartProduct[] = newCartItems.map((item) => ({
            productId: item.id, // Use productId for API compatibility
            title: item.title,
            price: item.price,
            description: item.description,
            category: item.category,
            image: item.image,
            quantity: item.quantity,
          }));

          const updatedCart = await apiService.updateCart(cart.id, {
            products: cartProducts,
          });
          setCart(updatedCart);
          console.log("Quantity updated in cart API:", updatedCart);
        } catch (apiError) {
          console.error("Failed to update quantity in API cart:", apiError);
        }
      }
    } catch (error) {
      setError("Failed to update item quantity");
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      setCartItems([]);

      if (isAuthenticated && user) {
        // Remove user-specific cart from localStorage
        const userCartKey = `cart_user_${user.id}`;
        localStorage.removeItem(userCartKey);

        // Also try to delete from API if cart exists
        if (cart) {
          try {
            await apiService.deleteCart(cart.id);
          } catch (apiError) {
            console.log("API cart deletion not available");
          }
          setCart(null);
        }
      } else {
        // Remove guest cart
        localStorage.removeItem("cart");
      }
    } catch (error) {
      setError("Failed to clear cart");
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = (): number => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const value: CartContextType = {
    cart,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    loading,
    error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
