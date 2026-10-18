import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [loading, setLoading] = useState(false);

  const placeOrderInBackend = async (method) => {
    const orderPayload = {
      customerName: customerName,
      userEmail: user ? user.email : 'guest@amazon.com',
      customerAddress: address,
      paymentMethod: method,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await axios.post('http://localhost:8080/api/orders', orderPayload);
      alert(`Order Placed Successfully via ${method}! Order ID: #${response.data.id}`);
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to record order.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customerName || !address) {
      alert('Please fill in your name and delivery address!');
      return;
    }

    setLoading(true);

    if (paymentMethod === 'RAZORPAY') {
      try {
        // 1. Get Razorpay Order details from Spring Boot Backend
        const rzpResponse = await axios.post('http://localhost:8080/api/orders/create-razorpay-order', {
          amount: getCartTotal()
        });

        const { orderId, amount, currency, keyId } = rzpResponse.data;

        // 2. Open Razorpay Checkout Window
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "Amazon Clone",
          description: "Order Payment",
          order_id: orderId, // Real Razorpay Backend Order ID
          handler: function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            placeOrderInBackend("RAZORPAY (Paid)");
          },
          prefill: {
            name: customerName,
            email: user ? user.email : "customer@example.com"
          },
          theme: {
            color: "#febd69"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert("Payment Failed: " + response.error.description);
          setLoading(false);
        });
        rzp.open();

      } catch (err) {
        console.error("Razorpay Integration Error:", err);
        alert("Could not initialize Razorpay payment. Please check server logs.");
        setLoading(false);
      }
    } else {
      placeOrderInBackend(paymentMethod);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-container">
        
        <div className="checkout-form">
          <h3>1. Select a delivery address</h3>
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                rows="3"
                required 
              />
            </div>

            <h3>2. Select Payment Method</h3>
            <div className="payment-options">
              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="RAZORPAY" 
                  checked={paymentMethod === 'RAZORPAY'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                <span>Razorpay (UPI / Credit Card / Debit Card / Netbanking)</span>
              </label>

              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                <span>Cash on Delivery / Pay on Delivery</span>
              </label>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Place Your Order'}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>Items Total: <span>₹{getCartTotal().toFixed(2)}</span></p>
          <p>Delivery Fee: <span>₹0.00 (FREE)</span></p>
          <hr />
          <h4 className="order-total">Order Total: <span>₹{getCartTotal().toFixed(2)}</span></h4>
        </div>

      </div>
    </div>
  );
};

export default Checkout;