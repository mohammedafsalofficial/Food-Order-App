/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";

// Create a context for the cart data
const CartContext = createContext({
  items: [],
  // eslint-disable-next-line no-unused-vars
  addItem: (item) => {},
  // eslint-disable-next-line no-unused-vars
  removeItem: (id) => {},
  clearCart: () => {},
});

// Reduder function to update the state
function cartReducer(state, action) {
  // To add a meal item
  if (action.type === "ADD_ITEM") {
    // Find if the item already exists in the state or not
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id);

    // Final updated items
    const updatedItems = [...state.items];

    // Update the quantity of the item if the item is already exists in the state
    // Otherwise, insert a new item into the state
    if (existingCartItemIndex > -1) {
      const existingCartItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
  }

  // To remove a meal item
  if (action.type === "REMOVE_ITEM") {
    // Find if the item is already exists in the state or not
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);

    // Remove a meal item only if it exists in the state
    if (existingCartItemIndex > -1) {
      const existingCartItem = state.items[existingCartItemIndex];

      // Final updated items
      const updatedItems = [...state.items];

      // If the item's quantity is equal to one, then remove the item from the state,
      // Otherwise, If the item's quantity is greater than one, then decrement the quantity
      if (existingCartItem.quantity === 1) {
        updatedItems.splice(existingCartItemIndex, 1);
      } else {
        const updatedItem = { ...existingCartItem, quantity: existingCartItem.quantity - 1 };
        updatedItems[existingCartItemIndex] = updatedItem;
      }

      return { ...state, items: updatedItems };
    }

    return state;
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  // Function that dispatch an action to add a meal item
  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item });
  }

  // Function that dispatch an action to remove a meal item
  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
  }

  // Context to provide to other components
  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>;
}

export default CartContext;
