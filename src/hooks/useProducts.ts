// Re-export the React Query hooks to maintain backward compatibility
// This allows existing components to continue working without changes
export {
  useProducts,
  useCategories,
  useProduct,
  useProductsByCategory,
  useProductsWithLoading,
  useCategoriesWithLoading,
  productQueryKeys,
} from "./useProductQueries";
