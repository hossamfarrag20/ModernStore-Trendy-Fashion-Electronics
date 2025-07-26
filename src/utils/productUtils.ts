import type { Product, FilterState } from "../types";

export const filterAndSortProducts = (
  products: Product[],
  filters: FilterState
): Product[] => {
  let filteredProducts = [...products];

  // Filter by category
  if (filters.category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === filters.category
    );
  }

  // Filter by search term
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating.rate - a.rating.rate;
      case "name":
      default:
        return a.title.localeCompare(b.title);
    }
  });

  return filteredProducts;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
