import { useQuery } from "@tanstack/react-query";
// import type { Product } from '../types'; // TODO: Use when implementing product mutations
import { apiService } from "../services/api";

// Query keys for consistent cache management
export const productQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...productQueryKeys.lists(), { filters }] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...productQueryKeys.details(), id] as const,
  categories: () => [...productQueryKeys.all, "categories"] as const,
  byCategory: (category: string) =>
    [...productQueryKeys.all, "category", category] as const,
};

// Hook to get all products with caching
export const useProducts = () => {
  const query = useQuery({
    queryKey: productQueryKeys.lists(),
    queryFn: () => apiService.getAllProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    products: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

// Hook to get categories with caching
export const useCategories = () => {
  const query = useQuery({
    queryKey: productQueryKeys.categories(),
    queryFn: () => apiService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    categories: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

// Hook to get a single product by ID with caching
export const useProduct = (id: number) => {
  const query = useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => apiService.getProductById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    product: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

// Hook to get products by category with caching
export const useProductsByCategory = (category: string) => {
  const query = useQuery({
    queryKey: productQueryKeys.byCategory(category),
    queryFn: () => apiService.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    products: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

// Enhanced hooks with additional utilities (maintaining backward compatibility)
export const useProductsWithLoading = () => {
  const { products, loading, error, isLoading, isFetching, refetch } =
    useProducts();

  return {
    products,
    loading,
    error,
    isLoading,
    isFetching,
    hasError: !!error,
    hasProducts: products.length > 0,
    isEmpty: !loading && products.length === 0,
    refetch,
  };
};

export const useCategoriesWithLoading = () => {
  const { categories, loading, error, isLoading, isFetching, refetch } =
    useCategories();

  return {
    categories,
    loading,
    error,
    isLoading,
    isFetching,
    hasError: !!error,
    hasCategories: categories.length > 0,
    isEmpty: !loading && categories.length === 0,
    refetch,
  };
};
