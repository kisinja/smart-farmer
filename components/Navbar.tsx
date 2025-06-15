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
import { FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close cart modal when clicking outside
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
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Desktop NavLinks */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/" className="flex items-center">
            {/* <h1 className="text-2xl sm:text-3xl font-semibold">
              Smart
              <span className="text-blue-500 font-bold">Farmer</span>
            </h1> */}
            <Image
              src="/logo.png"
              alt="Smart Farmer Logo"
              width={150}
              height={40}
              className="h-10 sm:h-12 object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Marketplace</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
          </div>

          <SearchBar />
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Mobile menu"
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>

        {/* Authenticated Section */}
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
                  {state.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {cartOpen && (
                    <motion.div
                      ref={cartRef}
                      key="cart-modal"
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                      className="absolute top-6 right-0 w-96 bg-white shadow-2xl rounded-xl border border-gray-100 z-50"
                    >
                      {/* Cart Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            <FiShoppingBag className="text-white" />
                            Your Shopping Cart
                          </h3>
                          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">
                            {cartCount} {cartCount === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="max-h-96 overflow-y-auto">
                        {state.items.length === 0 ? (
                          <div className="p-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                              <FiShoppingBag className="text-blue-500 text-2xl" />
                            </div>
                            <p className="text-gray-600 font-medium">
                              Your cart is empty
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Start shopping to add items
                            </p>
                            <Link
                              href="/products"
                              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              onClick={() => setCartOpen(false)}
                            >
                              Browse Products
                            </Link>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {state.items.map((item) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-4 p-4 hover:bg-blue-50/50 transition-colors"
                              >
                                <div className="relative w-16 h-16 flex-shrink-0">
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                                  />
                                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {item.quantity}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate">
                                    {item.title}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    KES {item.price.toFixed(2)} each
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="font-semibold text-blue-600">
                                    KES{" "}
                                    {(item.price * item.quantity).toFixed(2)}
                                  </span>
                                  <button
                                    onClick={() =>
                                      dispatch({
                                        type: "REMOVE_ITEM",
                                        productId: item.id,
                                      })
                                    }
                                    className="text-xs text-red-500 hover:text-red-700 mt-1"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Cart Footer */}
                      {state.items.length > 0 && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-medium text-gray-700">
                              Subtotal:
                            </span>
                            <span className="font-bold text-lg text-blue-600">
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
                          <div className="flex justify-between gap-3">
                            <button
                              onClick={handleClearCart}
                              className="flex-1 bg-white hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg border border-gray-300 text-sm font-medium transition-colors"
                            >
                              Clear All
                            </button>
                            <Link
                              href="/checkout"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors"
                              onClick={() => setCartOpen(false)}
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
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                }
              >
                <div className="py-2 px-4 flex flex-col gap-2">
                  <h3 className="text-sm">
                    Signed in as{" "}
                    <span className="font-medium">{user.given_name}</span>
                  </h3>
                  <LogoutLink
                    className={buttonVariants({
                      variant: "destructive",
                      size: "sm",
                    })}
                  >
                    Logout
                  </LogoutLink>
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

        {/* Mobile Shopping Cart (visible on mobile) */}
        {user && (
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 relative"
            aria-label="Shopping cart"
          >
            <FiShoppingBag className="text-xl text-gray-700" />
            {state.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 top-16 bg-white z-30 md:hidden overflow-y-auto"
          >
            <div className="px-4 pt-2 pb-8 space-y-4">
              <div className="flex flex-col space-y-2">
                <NavLink
                  href="/"
                  mobile
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  href="/dashboard"
                  mobile
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  href="/products"
                  mobile
                  onClick={() => setMobileMenuOpen(false)}
                >
                  MarketPlace
                </NavLink>
                <NavLink
                  href="/my-products"
                  mobile
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Products
                </NavLink>
              </div>

              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-blue-500">
                      <Image
                        src={userImg}
                        alt="User profile"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{user.given_name}</p>
                      <LogoutLink className="text-sm text-red-500 hover:text-red-700">
                        Logout
                      </LogoutLink>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <LoginLink
                      className={buttonVariants({ variant: "default" })}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </LoginLink>
                    <RegisterLink
                      className={buttonVariants({ variant: "outline" })}
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

      {/* Mobile Cart Modal */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end md:hidden"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              ref={cartRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-sm bg-white h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile cart content (same as desktop but full height) */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-1 rounded-full hover:bg-white/20"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FiShoppingBag className="text-white" />
                    Your Cart
                  </h3>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              {/* Cart Items */}
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {state.items.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <FiShoppingBag className="text-blue-500 text-2xl" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Start shopping to add items
                    </p>
                    <Link
                      href="/products"
                      className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => setCartOpen(false)}
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {state.items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-4 p-4 hover:bg-blue-50/50 transition-colors"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            KES {item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-blue-600">
                            KES {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() =>
                              dispatch({
                                type: "REMOVE_ITEM",
                                productId: item.id,
                              })
                            }
                            className="text-xs text-red-500 hover:text-red-700 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {state.items.length > 0 && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 sticky bottom-0">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-700">Subtotal:</span>
                    <span className="font-bold text-lg text-blue-600">
                      KES{" "}
                      {state.items
                        .reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <button
                      onClick={handleClearCart}
                      className="flex-1 bg-white hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg border border-gray-300 text-sm font-medium transition-colors"
                    >
                      Clear All
                    </button>
                    <Link
                      href="/checkout"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors"
                      onClick={() => setCartOpen(false)}
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
