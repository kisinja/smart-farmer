"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import NavLink from "./NavLink";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import CustomDropdown from "./CustomDropdown";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { FiShoppingBag, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { state, dispatch } = useCart();
  const cartCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleClearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const userImg =
    user?.picture ||
    "https://i.pinimg.com/474x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg";

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(
          'button[aria-label="Mobile menu"]'
        )
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartOpen, mobileMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Mobile menu"
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>

          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Smart Farmer Logo"
              width={150}
              height={40}
              className="h-10 sm:h-12 object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Marketplace</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </div>

        {/* Search Button - Mobile */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          <FiSearch className="h-5 w-5 text-gray-700" />
        </button>

        {/* Desktop Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {/* Shopping Cart */}
              <div className="relative">
                <button
                  onClick={() => setCartOpen(!cartOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                  aria-label="Shopping cart"
                >
                  <FiShoppingBag className="text-xl text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown */}
                <AnimatePresence>
                  {cartOpen && (
                    <motion.div
                      ref={cartRef}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    >
                      {/* Cart Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white rounded-t-lg">
                        <h3 className="font-bold flex items-center gap-2">
                          <FiShoppingBag />
                          Your Cart ({cartCount})
                        </h3>
                      </div>

                      {/* Cart Items */}
                      <div className="max-h-96 overflow-y-auto p-3">
                        {state.items.length === 0 ? (
                          <div className="text-center py-4">
                            <FiShoppingBag className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-gray-600">Your cart is empty</p>
                            <Link
                              href="/products"
                              className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm"
                              onClick={() => setCartOpen(false)}
                            >
                              Browse products
                            </Link>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {state.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex gap-3 items-start border-b border-gray-100 pb-3"
                              >
                                <div className="relative">
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-cover rounded border border-gray-200"
                                  />
                                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {item.quantity}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">
                                    {item.title}
                                  </h4>
                                  <p className="text-gray-500 text-sm">
                                    KES {item.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <p className="font-semibold text-blue-600 text-sm">
                                    KES{" "}
                                    {(item.price * item.quantity).toFixed(2)}
                                  </p>
                                  <button
                                    onClick={() =>
                                      dispatch({
                                        type: "REMOVE_ITEM",
                                        productId: item.id,
                                      })
                                    }
                                    className="text-xs text-red-500 hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Cart Footer */}
                      {state.items.length > 0 && (
                        <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium">Subtotal:</span>
                            <span className="font-bold text-blue-600">
                              KES{" "}
                              {state.items
                                .reduce(
                                  (total, item) =>
                                    total + item.price * item.quantity,
                                  0
                                )
                                .toFixed(2)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={handleClearCart}
                              className="text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded px-3 py-2"
                            >
                              Clear All
                            </button>
                            <Link
                              href="/checkout"
                              onClick={() => setCartOpen(false)}
                              className="text-sm bg-blue-600 hover:bg-blue-700 text-white text-center rounded px-3 py-2"
                            >
                              Checkout
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Dropdown */}
              <CustomDropdown
                trigger={
                  <div className="w-8 h-8 relative rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                    <Image
                      src={userImg}
                      alt="User profile"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                }
              >
                <div className="py-2 px-3 w-48">
                  <div className="px-2 py-1 text-sm text-gray-500 border-b border-gray-100 mb-2">
                    Signed in as{" "}
                    <span className="font-medium text-gray-700">
                      {user.given_name}
                    </span>
                  </div>
                  <Link
                    href="/user/profile"
                    className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setCartOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/user/orders"
                    className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setCartOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/user/settings"
                    className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setCartOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <LogoutLink className="block px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded w-full text-left">
                      Sign Out
                    </LogoutLink>
                  </div>
                </div>
              </CustomDropdown>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <LoginLink
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Login
              </LoginLink>
              <RegisterLink
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Sign Up
              </RegisterLink>
            </div>
          )}
        </div>

        {/* Mobile Shopping Cart */}
        {user && (
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 relative"
            aria-label="Shopping cart"
          >
            <FiShoppingBag className="text-xl text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden mt-3 px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 top-16 bg-white z-30 md:hidden overflow-y-auto"
          >
            <div className="px-4 pt-4 pb-8 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-lg font-medium text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-lg font-medium text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  href="/dashboard"
                  className="text-lg font-medium text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user && (
                  <Link
                    href="/user/profile"
                    className="text-lg font-medium text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                )}
              </div>

              {/* User Section */}
              <div className="pt-6 border-t border-gray-200">
                {user ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-blue-500">
                        <Image
                          src={userImg}
                          alt="User profile"
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.given_name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <LogoutLink
                      className="w-full text-center bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 rounded-lg font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Out
                    </LogoutLink>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <LoginLink
                      className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </LoginLink>
                    <RegisterLink
                      className="w-full text-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </RegisterLink>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
