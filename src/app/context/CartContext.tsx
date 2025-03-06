"use client";
import React, {
  createContext,
  PropsWithChildren,
  useReducer,
  Dispatch,
} from "react";

// Define Cart State Type
interface CartState {
  cart: any[]; // Replace `any` with a proper type for your cart items
}

// Define Action Type
type CartAction =
  | { type: "ADD_TO_CART"; payload: any }
  | { type: "REMOVE_CART"; index: number }
  | { type: "RESET_CART" };

// Define Context Type
interface CartContextType {
  state: CartState;
  dispatch: Dispatch<CartAction>;
}

// Initial State
const initialState: CartState = { cart: [] };

// Reducer Function
const reducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const currCart = JSON.parse(JSON.stringify(state.cart));
      let isPresent = false;
      for (let i = 0; i < currCart.length; i++) {
        if (currCart[i].product_id === action.payload.product_id) {
          isPresent = true;
          currCart[i] = action.payload;
          break;
        }
      }
      if (isPresent) {
        return { ...state, cart: [...currCart] };
      } else {
        return { ...state, cart: [...state.cart, action.payload] };
      }
    case "REMOVE_CART":
      return {
        ...state,
        cart: state.cart.filter((_, i) => i !== action.index),
      };
    case "RESET_CART":
      return { ...state, cart: initialState.cart };
    default:
      return state;
  }
};

// Create Context with Correct Type
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

type CartProviderProps = {} & PropsWithChildren;
export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
