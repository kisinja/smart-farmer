// cartReducer.ts
import { CartState, CartAction, CartItem } from "@/types";

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_CART":
      return { items: action.items };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
};