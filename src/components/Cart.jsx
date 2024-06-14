import { useContext } from "react";

import { currencyFormatter } from "../util/formatting";

import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import CartItem from "./CartItem";

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  // Get the total price of all the meal item in the cart
  const cartTotalPrice = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  // Function to set the user's progress to close(hide) the cart
  function handleCloseCart() {
    userProgressCtx.hideCart();
  }

  // Function to set the user's progress to open(show) the checkout
  function handleGoToCheckout() {
    userProgressCtx.showCheckout();
  }

  // Function to increase the quantity of the cart item
  function handleIncrease(item) {
    cartCtx.addItem(item);
  }

  // Function to decrease the quantity of the cart item
  function handleDecrease(id) {
    cartCtx.removeItem(id);
  }

  return (
    // Show the modal only if the user's progress is equal to cart
    <Modal
      className="cart"
      open={userProgressCtx.progress === "cart"}
      onClose={userProgressCtx.progress === "cart" ? handleCloseCart : null}
    >
      <h2>You Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            {...item}
            onIncrease={() => handleIncrease(item)}
            onDecrease={() => handleDecrease(item.id)}
          />
        ))}
      </ul>

      <p className="cart-total">{currencyFormatter.format(cartTotalPrice)}</p>

      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          Close
        </Button>
        {cartCtx.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
