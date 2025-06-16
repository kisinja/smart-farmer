/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartState, CartAction, CartItem } from "@/types";
import { cartReducer } from "@/cartReducer";

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (productId: string) => Promise<void>;
  incrementQty: (productId: string) => Promise<void>;
  decrementQty: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
} | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const fetchAndSetCart = async () => {
    const res = await fetch("/api/user/cart");
    const data = await res.json();
    const items: CartItem[] =
      data.cart?.[0]?.cartItems.map(({ product, quantity }: any) => ({
        ...product,
        quantity,
      })) || [];

    dispatch({ type: "SET_CART", items });
  };

  useEffect(() => {
    fetchAndSetCart().catch(console.error);
  }, []);

  const addItem = async (productId: string) => {
    await fetch("/api/user/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    await fetchAndSetCart();
  };

  const incrementQty = async (productId: string) => {
    const item = state.items.find((i) => i.id === productId);
    const newQty = (item?.quantity || 1) + 1;

    await fetch("/api/user/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: newQty }),
    });
    await fetchAndSetCart();
  };

  const decrementQty = async (productId: string) => {
    const item = state.items.find((i) => i.id === productId);
    if (!item) return;

    if (item.quantity <= 1) {
      await removeItem(productId);
    } else {
      const newQty = item.quantity - 1;
      await fetch("/api/user/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQty }),
      });
      await fetchAndSetCart();
    }
  };

  const removeItem = async (productId: string) => {
    await fetch("/api/user/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    await fetchAndSetCart();
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        incrementQty,
        decrementQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
