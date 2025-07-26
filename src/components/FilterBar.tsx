import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Filter, SortAsc, Sparkles } from "lucide-react";
import type { FilterState } from "../types";

interface FilterBarProps {
  categories: string[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalProducts: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  filters,
  onFilterChange,
  totalProducts,
}) => {
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filterBarRef.current) {
      gsap.fromTo(
        filterBarRef.current,
        {
          opacity: 0,
          y: -30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.5,
        }
      );
    }
  }, []);
  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: category === filters.category ? "" : category,
    });
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  };

  const handleSortChange = (sortBy: FilterState["sortBy"]) => {
    onFilterChange({
      ...filters,
      sortBy,
    });
  };

  return (
    <motion.div
      ref={filterBarRef}
      className="glass-card p-4 sm:p-6 mb-8 border border-white/20 dark:border-gray-700/50"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* Categories */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <Filter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-yellow-400 opacity-60" />
              </motion.div>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-lg">
              Categories
            </span>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={(e) => {
                handleButtonClick(e);
                handleCategoryChange("");
              }}
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 border backdrop-blur-sm
                ${
                  filters.category === ""
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 border-primary-400"
                    : "glass hover:bg-white/30 dark:hover:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-white/20 dark:border-gray-700/50 hover:border-white/40 dark:hover:border-gray-600/50"
                }
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              All
            </motion.button>

            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={(e) => {
                  handleButtonClick(e);
                  handleCategoryChange(category);
                }}
                className={`
                  px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 capitalize transform hover:scale-105 border backdrop-blur-sm
                  ${
                    filters.category === category
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 border-primary-400"
                      : "glass hover:bg-white/30 dark:hover:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-white/20 dark:border-gray-700/50 hover:border-white/40 dark:hover:border-gray-600/50"
                  }
                `}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                {category.replace(/'/g, "")}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sort and Results Count */}
        <motion.div
          className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6 lg:flex-shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.span
            className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center sm:text-left bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {totalProducts} products found
          </motion.span>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="flex items-center space-x-2">
              <SortAsc className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </span>
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleSortChange(e.target.value as FilterState["sortBy"])
              }
              className="
                px-4 py-2
                glass
                border border-white/20 dark:border-gray-700/50
                rounded-xl
                text-sm font-medium
                text-gray-900 dark:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-primary-500/50
                focus:border-primary-400/50
                hover:border-white/40 dark:hover:border-gray-600/50
                transition-all duration-300
                backdrop-blur-sm
                cursor-pointer
              "
            >
              <option value="name">Name A-Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
