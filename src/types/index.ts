export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterState {
  category: string;
  searchTerm: string;
  sortBy: "price-asc" | "price-desc" | "rating" | "name";
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  loading: boolean;
}

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Optional for security reasons
  name?: {
    firstname: string;
    lastname: string;
  };
  address?: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

// Cart types for API
export interface CartProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  quantity?: number;
}

export interface Cart {
  id: number;
  userId: number;
  date?: string;
  products: CartProduct[];
}

export interface CartContextType {
  cart: Cart | null;
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
