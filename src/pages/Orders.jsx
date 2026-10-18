import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { Link } from 'react-router-dom';
import { FaBox, FaTruck, FaShippingFast, FaCheckCircle, FaTimesCircle, FaFileInvoice } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchUserOrders = () => {
    if (user && user.email) {
      axios.get(`${API_BASE_URL}/orders/user/${user.email}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`)
        .then(() => {
          alert('Order cancelled successfully!');
          fetchUserOrders();
        })
        .catch(() => alert('Failed to cancel order'));
    }
  };

  const handleDownloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const invoiceContent = `
      <html>
        <head>
          <title>Tax Invoice - Order #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .logo { font-size: 24px; font-weight: bold; color: #ff9900; }
            .details { margin: 20px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 40px; font-size: 12px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">amazon.in</div>
            <div><h2>Tax Invoice / Bill of Supply</h2></div>
          </div>
          <div class="details">
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
            <p><strong>Customer Name:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.userEmail}</p>
            <p><strong>Shipping Address:</strong> ${order.customerAddress}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${(order.orderItems || []).map(item => `
                <tr>
                  <td>${item.product ? item.product.name : 'Amazon Item'}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price}</td>
                  <td>₹${item.quantity * item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Grand Total: ₹${order.totalAmount}</div>
          <div class="footer">This is a computer-generated invoice for Amazon Clone.</div>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 1;
      case 'SHIPPED': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Please Sign In to View Your Orders</h2>
        <Link to="/login">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/">Start Shopping</Link>
        </div>
      ) : (
        orders.map(order => {
          const currentStep = getStepIndex(order.orderStatus);
          const isCancelled = order.orderStatus === 'CANCELLED';

          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-label">ORDER PLACED</span>
                  <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="order-label">TOTAL</span>
                  <p>₹{order.totalAmount}</p>
                </div>
                <div>
                  <span className="order-label">SHIP TO</span>
                  <p>{order.customerName}</p>
                </div>
                <div>
                  <span className="order-label">ORDER #</span>
                  <p>{order.id}</p>
                </div>
                <div>
                  <button className="btn-invoice" onClick={() => handleDownloadInvoice(order)}>
                    <FaFileInvoice /> Invoice
                  </button>
                </div>
              </div>

              <div className="order-body">
                <div className="order-items-summary">
                  <h4>Ordered Items:</h4>
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="order-products-list">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="ordered-product-row">
                          {item.product && (
                            <img src={item.product.imageUrl} alt={item.product.name} className="ordered-prod-img" />
                          )}
                          <div className="ordered-prod-details">
                            <span className="ordered-prod-name">{item.product ? item.product.name : 'Amazon Item'}</span>
                            <span className="ordered-prod-qty">Qty: {item.quantity} | Unit Price: ₹{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="order-status-box" style={{ marginTop: '15px' }}>
                  <p><b>Payment Method:</b> {order.paymentMethod}</p>
                  <p><b>Delivery Address:</b> {order.customerAddress}</p>
                </div>

                {!isCancelled ? (
                  <div className="tracking-progress-wrapper">
                    <div className="tracker-steps">
                      <div className={`step-item ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
                        <div className="step-icon"><FaBox /></div>
                        <span className="step-label">Order Placed</span>
                      </div>
                      <div className={`step-line ${currentStep >= 2 ? 'completed' : ''}`}></div>
                      <div className={`step-item ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
                        <div className="step-icon"><FaTruck /></div>
                        <span className="step-label">Shipped</span>
                      </div>
                      <div className={`step-line ${currentStep >= 3 ? 'completed' : ''}`}></div>
                      <div className={`step-item ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
                        <div className="step-icon"><FaShippingFast /></div>
                        <span className="step-label">Out for Delivery</span>
                      </div>
                      <div className={`step-line ${currentStep >= 4 ? 'completed' : ''}`}></div>
                      <div className={`step-item ${currentStep >= 4 ? 'completed' : ''} ${currentStep === 4 ? 'active' : ''}`}>
                        <div className="step-icon"><FaCheckCircle /></div>
                        <span className="step-label">Delivered</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="cancelled-status-banner">
                    <FaTimesCircle className="cancelled-icon" />
                    <span>This order was cancelled.</span>
                  </div>
                )}

                {!isCancelled && currentStep < 4 && (
                  <button className="btn-cancel-order" onClick={() => handleCancelOrder(order.id)}>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;