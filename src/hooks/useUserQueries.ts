import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginData, RegisterData } from "../types";
import { apiService } from "../services/api";

// Query keys for user-related data
export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...userQueryKeys.lists(), { filters }] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...userQueryKeys.details(), id] as const,
};

// Hook to get all users with caching
export const useUsers = () => {
  const query = useQuery({
    queryKey: userQueryKeys.lists(),
    queryFn: () => apiService.getAllUsers(),
    staleTime: 10 * 60 * 1000, // 10 minutes (user data changes less frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    users: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

// Hook to get a single user by ID with caching
export const useUser = (id: number) => {
  const query = useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => apiService.getUserById(id),
    enabled: !!id && id > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    user: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

// Mutation hook for user login
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginData) => apiService.loginUser(credentials),
    onSuccess: (data) => {
      // Invalidate user queries to refresh user data
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });

      // You can add additional success logic here if needed
      console.log("Login successful:", data);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

// Mutation hook for user registration
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => apiService.registerUser(userData),
    onSuccess: (data) => {
      // Invalidate user queries to refresh user data
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });

      console.log("Registration successful:", data);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

// Hook to prefetch user data (useful for optimistic loading)
export const usePrefetchUser = () => {
  const queryClient = useQueryClient();

  const prefetchUser = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: userQueryKeys.detail(id),
      queryFn: () => apiService.getUserById(id),
      staleTime: 10 * 60 * 1000,
    });
  };

  return { prefetchUser };
};

// Hook to invalidate user cache (useful for logout or data refresh)
export const useInvalidateUserCache = () => {
  const queryClient = useQueryClient();

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
  };

  const invalidateUser = (id: number) => {
    queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(id) });
  };

  const clearUserCache = () => {
    queryClient.removeQueries({ queryKey: userQueryKeys.all });
  };

  return {
    invalidateUsers,
    invalidateUser,
    clearUserCache,
  };
};
