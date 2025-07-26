import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export const CartPage: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    loading,
    error,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: number) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart ({getTotalItems()} items)
          </h1>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
        </div>

        {!isAuthenticated && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-md mb-6">
            <p className="font-medium">Guest Cart</p>
            <p className="text-sm mt-1">
              You're shopping as a guest.{" "}
              <Link
                to="/login"
                className="underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                Log in
              </Link>{" "}
              or{" "}
              <Link
                to="/register"
                className="underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                register
              </Link>{" "}
              to save your cart and access additional features.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul className="border-t border-b border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
                              {item.title}
                            </span>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500 dark:text-gray-400">
                            {item.category}
                          </p>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                          ${(item.price || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={loading || item.quantity <= 1}
                            className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="flex-1 text-center py-1 text-sm font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={loading}
                            className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="absolute top-0 right-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loading}
                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Remove</span>
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 flex text-sm text-gray-700 dark:text-gray-300 space-x-2">
                      <span>
                        Subtotal: $
                        {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleClearCart}
                disabled={loading}
                className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Cart
              </button>
            </div>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 bg-white dark:bg-gray-800 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900 dark:text-white"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  Subtotal
                </dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  ${(getTotalPrice() || 0).toFixed(2)}
                </dd>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                <dt className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  Free
                </dd>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                <dt className="flex text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax estimate</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  ${((getTotalPrice() || 0) * 0.08).toFixed(2)}
                </dd>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-gray-900 dark:text-white">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">
                  ${((getTotalPrice() || 0) * 1.08).toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="button"
                className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800"
              >
                Checkout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
