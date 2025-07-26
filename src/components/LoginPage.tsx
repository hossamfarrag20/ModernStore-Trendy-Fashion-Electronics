import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useAuth } from "../contexts/AuthContext";
import type { LoginData } from "../types";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ShoppingBag,
  Sparkles,
  LogIn,
} from "lucide-react";
import { AnimatedBackground } from "./AnimatedBackground";

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<LoginData>>(
    {}
  );

  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Refs for animations
  const formRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Enhanced animations on mount
  useEffect(() => {
    const tl = gsap.timeline();

    if (headerRef.current) {
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: -50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }

    if (cardRef.current) {
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<LoginData> = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name as keyof LoginData]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      // Error is handled by the context
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div
          ref={headerRef}
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="flex justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <ShoppingBag className="h-16 w-16 text-primary-500 drop-shadow-lg" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h2
            className="mt-8 text-center text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Sign in to your account
          </motion.h2>

          <motion.p
            className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Or{" "}
            <Link
              to="/register"
              className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors duration-300 hover:underline"
            >
              create a new account
            </Link>
          </motion.p>
        </motion.div>

        <motion.div
          ref={cardRef}
          className="mt-12 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="glass-card p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

            <form
              ref={formRef}
              className="space-y-6 relative z-10"
              onSubmit={handleSubmit}
            >
              {error && (
                <motion.div
                  className="glass border border-red-300/50 dark:border-red-600/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`
                      appearance-none block w-full pl-12 pr-4 py-3
                      glass border rounded-xl shadow-sm
                      placeholder-gray-400 dark:placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50
                      text-gray-900 dark:text-white
                      transition-all duration-300
                      hover:shadow-lg hover:border-primary-300/50
                      ${
                        validationErrors.username
                          ? "border-red-300/50 dark:border-red-600/50 focus:ring-red-500/50"
                          : "border-white/20 dark:border-gray-700/50"
                      }
                    `}
                    placeholder="Enter your username"
                  />
                </div>
                {validationErrors.username && (
                  <motion.p
                    className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                    <span>{validationErrors.username}</span>
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`
                      appearance-none block w-full pl-12 pr-12 py-3
                      glass border rounded-xl shadow-sm
                      placeholder-gray-400 dark:placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50
                      text-gray-900 dark:text-white
                      transition-all duration-300
                      hover:shadow-lg hover:border-primary-300/50
                      ${
                        validationErrors.password
                          ? "border-red-300/50 dark:border-red-600/50 focus:ring-red-500/50"
                          : "border-white/20 dark:border-gray-700/50"
                      }
                    `}
                    placeholder="Enter your password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-500 focus:outline-none transition-colors duration-300 z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
                {validationErrors.password && (
                  <motion.p
                    className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                    <span>{validationErrors.password}</span>
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <div className="text-sm">
                  <motion.a
                    href="#"
                    className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors duration-300 hover:underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    Forgot your password?
                  </motion.a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="
                    group relative w-full flex justify-center items-center py-4 px-6
                    bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500
                    hover:from-primary-600 hover:via-purple-600 hover:to-pink-600
                    text-white font-semibold rounded-xl shadow-lg hover:shadow-xl
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300 transform hover:scale-[1.02]
                    overflow-hidden
                  "
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative flex items-center space-x-2">
                    {loading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>Sign in</span>
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20 dark:border-gray-600/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 glass text-gray-600 dark:text-gray-300 rounded-lg">
                      Demo credentials
                    </span>
                  </div>
                </div>
                <motion.div
                  className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300 space-y-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <p className="glass px-3 py-2 rounded-lg inline-block">
                    Username:{" "}
                    <span className="font-mono text-primary-600 dark:text-primary-400">
                      johnd
                    </span>
                  </p>
                  <br />
                  <p className="glass px-3 py-2 rounded-lg inline-block">
                    Password:{" "}
                    <span className="font-mono text-primary-600 dark:text-primary-400">
                      m38rmF$
                    </span>
                  </p>
                </motion.div>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
