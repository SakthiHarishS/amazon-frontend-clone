import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();

  const handleProceedToBuy = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate('/checkout'); // Direct navigation function
  };

  return (
    <div className="cart-page">
      <div className="cart-left">
        <h2>Shopping Cart</h2>
        <span className="deselect-all">Deselect all items</span>
        <hr />

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h3>Your Amazon Cart is empty.</h3>
            <Link to="/">Shop today's deals</Link>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h4 className="cart-item-title">{item.name}</h4>
                <p className="in-stock">In stock</p>
                <p className="free-shipping">Eligible for FREE Shipping</p>

                <div className="cart-item-actions">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  >
                    {[...Array(10).keys()].map((n) => (
                      <option key={n + 1} value={n + 1}>
                        Qty: {n + 1}
                      </option>
                    ))}
                  </select>
                  <span className="divider">|</span>
                  <button onClick={() => removeFromCart(item.id)}>Delete</button>
                </div>
              </div>
              <div className="cart-item-price">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subtotal Box on Right Side */}
      {cart.length > 0 && (
        <div className="cart-right">
          <div className="subtotal-box">
            <p>
              Subtotal ({getCartCount()} items): <strong>₹{getCartTotal().toFixed(2)}</strong>
            </p>
            <button className="proceed-btn" onClick={handleProceedToBuy}>
              Proceed to Buy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;