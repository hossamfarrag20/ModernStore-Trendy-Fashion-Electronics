import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Cart } from "../types";
import { apiService } from "../services/api";

// Query keys for cart-related data
export const cartQueryKeys = {
  all: ["carts"] as const,
  lists: () => [...cartQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...cartQueryKeys.lists(), { filters }] as const,
  details: () => [...cartQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...cartQueryKeys.details(), id] as const,
  userCarts: (userId: number) =>
    [...cartQueryKeys.all, "user", userId] as const,
};

// Hook to get user's carts with caching
export const useUserCarts = (userId: number) => {
  const query = useQuery({
    queryKey: cartQueryKeys.userCarts(userId),
    queryFn: () => apiService.getUserCart(userId),
    enabled: !!userId && userId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes (cart data should be fresher)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    carts: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

// Hook to get a single cart by ID with caching
export const useCart = (cartId: number) => {
  const query = useQuery({
    queryKey: cartQueryKeys.detail(cartId),
    queryFn: () => apiService.getCartById(cartId),
    enabled: !!cartId && cartId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    cart: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

// Mutation hook for creating a new cart
export const useCreateCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cart: Omit<Cart, "id">) => apiService.createCart(cart),
    onSuccess: (data, variables) => {
      // Invalidate user carts to refresh the list
      queryClient.invalidateQueries({
        queryKey: cartQueryKeys.userCarts(variables.userId),
      });

      // Add the new cart to the cache
      queryClient.setQueryData(cartQueryKeys.detail(data.id), data);

      console.log("Cart created successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to create cart:", error);
    },
  });
};

// Mutation hook for updating a cart
export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, cart }: { cartId: number; cart: Partial<Cart> }) =>
      apiService.updateCart(cartId, cart),
    onSuccess: (data, variables) => {
      // Update the cart in cache
      queryClient.setQueryData(cartQueryKeys.detail(variables.cartId), data);

      // Invalidate user carts to refresh the list
      if (data.userId) {
        queryClient.invalidateQueries({
          queryKey: cartQueryKeys.userCarts(data.userId),
        });
      }

      console.log("Cart updated successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to update cart:", error);
    },
  });
};

// Mutation hook for deleting a cart
export const useDeleteCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: number) => apiService.deleteCart(cartId),
    onSuccess: (data, cartId) => {
      // Remove the cart from cache
      queryClient.removeQueries({ queryKey: cartQueryKeys.detail(cartId) });

      // Invalidate user carts to refresh the list
      if (data.userId) {
        queryClient.invalidateQueries({
          queryKey: cartQueryKeys.userCarts(data.userId),
        });
      }

      console.log("Cart deleted successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to delete cart:", error);
    },
  });
};

// Hook to prefetch cart data (useful for optimistic loading)
export const usePrefetchCart = () => {
  const queryClient = useQueryClient();

  const prefetchCart = (cartId: number) => {
    queryClient.prefetchQuery({
      queryKey: cartQueryKeys.detail(cartId),
      queryFn: () => apiService.getCartById(cartId),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchUserCarts = (userId: number) => {
    queryClient.prefetchQuery({
      queryKey: cartQueryKeys.userCarts(userId),
      queryFn: () => apiService.getUserCart(userId),
      staleTime: 2 * 60 * 1000,
    });
  };

  return { prefetchCart, prefetchUserCarts };
};

// Hook to invalidate cart cache (useful for manual refresh)
export const useInvalidateCartCache = () => {
  const queryClient = useQueryClient();

  const invalidateUserCarts = (userId: number) => {
    queryClient.invalidateQueries({
      queryKey: cartQueryKeys.userCarts(userId),
    });
  };

  const invalidateCart = (cartId: number) => {
    queryClient.invalidateQueries({ queryKey: cartQueryKeys.detail(cartId) });
  };

  const clearCartCache = () => {
    queryClient.removeQueries({ queryKey: cartQueryKeys.all });
  };

  return {
    invalidateUserCarts,
    invalidateCart,
    clearCartCache,
  };
};
