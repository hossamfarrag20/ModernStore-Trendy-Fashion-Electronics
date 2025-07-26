import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, LoginData, RegisterData, AuthContextType } from "../types";
import { apiService } from "../services/api";
import { useCacheManager } from "../hooks/useCacheManager";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearAllCache, prefetchUserCarts } = useCacheManager();

  // Check for stored user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (credentials: LoginData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login for:", credentials.username);

      // First, check if user exists in local registry (for registered users)
      const userRegistry = JSON.parse(
        localStorage.getItem("userRegistry") || "{}"
      );
      const localUser = userRegistry[credentials.username];

      if (localUser && localUser.password === credentials.password) {
        // User found in local registry with correct password
        const loggedInUser: User = {
          id: localUser.id,
          username: localUser.username,
          email: localUser.email,
        };

        console.log("Local user login successful:", loggedInUser);
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem(
          "token",
          `auth_token_${localUser.id}_${Date.now()}`
        );

        // Prefetch user's cart data for better UX
        prefetchUserCarts(loggedInUser.id);
        return;
      }

      // If not found locally, try FakeStore API for demo users
      try {
        console.log("Trying FakeStore API login...");
        const response = await apiService.loginUser(credentials);
        console.log("API login response:", response);

        // Try to get user data from FakeStore API
        const allUsers = await apiService.getAllUsers();
        const foundUser = allUsers.find(
          (user) => user.username === credentials.username
        );

        if (foundUser) {
          const loggedInUser: User = {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            name: foundUser.name,
            address: foundUser.address,
            phone: foundUser.phone,
          };

          console.log("API user login successful:", loggedInUser);
          setUser(loggedInUser);
          localStorage.setItem("user", JSON.stringify(loggedInUser));
          localStorage.setItem("token", response.token);

          // Prefetch user's cart data for better UX
          prefetchUserCarts(loggedInUser.id);
        } else {
          throw new Error("User not found");
        }
      } catch (apiError) {
        // If API login fails and user not in local registry
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Validate password confirmation

      // Register user with FakeStore API
      const newUser = await apiService.registerUser(userData);

      // Generate a unique ID for the user (FakeStore API returns same ID for all new users)
      // We'll create a more unique ID by combining the returned ID with timestamp
      const uniqueId = parseInt(
        `${newUser.id}${Date.now().toString().slice(-3)}`
      );

      // Create user object with the unique ID and form data
      const registeredUser: User = {
        id: uniqueId,
        username: userData.username,
        email: userData.email,
        // Don't store password for security
      };

      // Set user as logged in after successful registration
      setUser(registeredUser);
      localStorage.setItem("user", JSON.stringify(registeredUser));
      // Create a unique token for the session
      localStorage.setItem("token", `auth_token_${uniqueId}_${Date.now()}`);

      // Prefetch user's cart data for better UX
      prefetchUserCarts(uniqueId);

      // Store user in a local registry for future authentication
      const userRegistry = JSON.parse(
        localStorage.getItem("userRegistry") || "{}"
      );
      userRegistry[userData.username] = {
        id: uniqueId,
        username: userData.username,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("userRegistry", JSON.stringify(userRegistry));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear all cached data on logout for security and fresh start
    clearAllCache();

    // Note: Cart will be cleared by CartContext when user changes to null
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
