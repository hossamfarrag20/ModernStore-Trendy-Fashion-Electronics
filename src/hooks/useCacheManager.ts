import { useQueryClient } from '@tanstack/react-query';
import { productQueryKeys } from './useProductQueries';
import { userQueryKeys } from './useUserQueries';
import { cartQueryKeys } from './useCartQueries';

/**
 * Hook for managing cache invalidation and optimization strategies
 * This provides centralized cache management for the entire application
 */
export const useCacheManager = () => {
  const queryClient = useQueryClient();

  // Product cache management
  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
  };

  const invalidateProduct = (id: number) => {
    queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(id) });
  };

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: productQueryKeys.categories() });
  };

  const invalidateProductsByCategory = (category: string) => {
    queryClient.invalidateQueries({ queryKey: productQueryKeys.byCategory(category) });
  };

  // User cache management
  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
  };

  const invalidateUser = (id: number) => {
    queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(id) });
  };

  // Cart cache management
  const invalidateUserCarts = (userId: number) => {
    queryClient.invalidateQueries({ queryKey: cartQueryKeys.userCarts(userId) });
  };

  const invalidateCart = (cartId: number) => {
    queryClient.invalidateQueries({ queryKey: cartQueryKeys.detail(cartId) });
  };

  // Optimistic updates for better UX
  const optimisticUpdateProduct = (id: number, updatedProduct: any) => {
    queryClient.setQueryData(productQueryKeys.detail(id), updatedProduct);
  };

  const optimisticUpdateCart = (cartId: number, updatedCart: any) => {
    queryClient.setQueryData(cartQueryKeys.detail(cartId), updatedCart);
  };

  // Prefetch strategies for better performance
  const prefetchProduct = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: productQueryKeys.detail(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const prefetchUserCarts = (userId: number) => {
    queryClient.prefetchQuery({
      queryKey: cartQueryKeys.userCarts(userId),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Clear all cache (useful for logout)
  const clearAllCache = () => {
    queryClient.clear();
  };

  // Clear specific cache sections
  const clearProductCache = () => {
    queryClient.removeQueries({ queryKey: productQueryKeys.all });
  };

  const clearUserCache = () => {
    queryClient.removeQueries({ queryKey: userQueryKeys.all });
  };

  const clearCartCache = () => {
    queryClient.removeQueries({ queryKey: cartQueryKeys.all });
  };

  // Refresh strategies
  const refreshProducts = () => {
    queryClient.refetchQueries({ queryKey: productQueryKeys.all });
  };

  const refreshUserData = (userId: number) => {
    queryClient.refetchQueries({ queryKey: userQueryKeys.detail(userId) });
    queryClient.refetchQueries({ queryKey: cartQueryKeys.userCarts(userId) });
  };

  // Background refresh for keeping data fresh
  const backgroundRefreshProducts = () => {
    queryClient.refetchQueries({ 
      queryKey: productQueryKeys.all,
      type: 'active' // Only refetch if there are active observers
    });
  };

  return {
    // Product cache management
    invalidateProducts,
    invalidateProduct,
    invalidateCategories,
    invalidateProductsByCategory,
    
    // User cache management
    invalidateUsers,
    invalidateUser,
    
    // Cart cache management
    invalidateUserCarts,
    invalidateCart,
    
    // Optimistic updates
    optimisticUpdateProduct,
    optimisticUpdateCart,
    
    // Prefetch strategies
    prefetchProduct,
    prefetchUserCarts,
    
    // Clear cache
    clearAllCache,
    clearProductCache,
    clearUserCache,
    clearCartCache,
    
    // Refresh strategies
    refreshProducts,
    refreshUserData,
    backgroundRefreshProducts,
  };
};
