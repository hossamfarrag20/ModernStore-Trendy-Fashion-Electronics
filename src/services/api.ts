import type { Product, User, RegisterData, LoginData, Cart } from "../types";

const BASE_URL = "https://fakestoreapi.com";

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return this.fetchWithErrorHandling<Product[]>(`${BASE_URL}/products`);
  }

  async getProductById(id: number): Promise<Product> {
    return this.fetchWithErrorHandling<Product>(`${BASE_URL}/products/${id}`);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.fetchWithErrorHandling<Product[]>(
      `${BASE_URL}/products/category/${category}`
    );
  }

  async getCategories(): Promise<string[]> {
    return this.fetchWithErrorHandling<string[]>(
      `${BASE_URL}/products/categories`
    );
  }

  // User Authentication Methods
  async registerUser(userData: RegisterData): Promise<{ id: number }> {
    const { confirmPassword, ...userDataToSend } = userData;
    return this.fetchWithErrorHandling<{ id: number }>(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDataToSend),
    });
  }

  async loginUser(credentials: LoginData): Promise<{ token: string }> {
    return this.fetchWithErrorHandling<{ token: string }>(
      `${BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );
  }

  async getUserById(id: number): Promise<User> {
    return this.fetchWithErrorHandling<User>(`${BASE_URL}/users/${id}`);
  }

  async getAllUsers(): Promise<User[]> {
    return this.fetchWithErrorHandling<User[]>(`${BASE_URL}/users`);
  }

  // Cart Methods
  async getUserCart(userId: number): Promise<Cart[]> {
    return this.fetchWithErrorHandling<Cart[]>(
      `${BASE_URL}/carts/user/${userId}`
    );
  }

  async createCart(cart: Omit<Cart, "id">): Promise<Cart> {
    return this.fetchWithErrorHandling<Cart>(`${BASE_URL}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });
  }

  async updateCart(cartId: number, cart: Partial<Cart>): Promise<Cart> {
    return this.fetchWithErrorHandling<Cart>(`${BASE_URL}/carts/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });
  }

  async deleteCart(cartId: number): Promise<Cart> {
    return this.fetchWithErrorHandling<Cart>(`${BASE_URL}/carts/${cartId}`, {
      method: "DELETE",
    });
  }

  async getCartById(cartId: number): Promise<Cart> {
    return this.fetchWithErrorHandling<Cart>(`${BASE_URL}/carts/${cartId}`);
  }
}

export const apiService = new ApiService();
