import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [categories, setCategories] = useState(['Electronics', 'Fashion', 'Home & Kitchen', 'Books']);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCatInput, setShowCustomCatInput] = useState(false);

  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rating: '4.5',
    stock: '10',
    imageUrl: '',
    category: 'Electronics'
  });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail === 'admin@amazon.com' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      loadAllData();
    } else {
      alert('Invalid Credentials! Use admin@amazon.com / admin123');
    }
  };

  const loadAllData = () => {
    axios.get('http://localhost:8080/api/products').then(res => setProducts(res.data)).catch(err => console.error(err));
    axios.get('http://localhost:8080/api/orders').then(res => setOrders(res.data)).catch(err => console.error(err));
    axios.get('http://localhost:8080/api/users').then(res => setUsers(res.data)).catch(err => console.error(err));
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAllData();
    }
  }, [isAdminLoggedIn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory)) {
      setCategories([...categories, customCategory]);
      setFormData({ ...formData, category: customCategory });
      setCustomCategory('');
      setShowCustomCatInput(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating),
      stock: parseInt(formData.stock, 10)
    };

    if (editingProductId) {
      // Edit / Modify Existing Product
      axios.put(`http://localhost:8080/api/products/${editingProductId}`, payload)
        .then(() => {
          alert('Product updated successfully!');
          resetForm();
          loadAllData();
        })
        .catch(err => console.error(err));
    } else {
      // Add New Product
      axios.post('http://localhost:8080/api/products', payload)
        .then(() => {
          alert('Product added successfully!');
          resetForm();
          loadAllData();
        })
        .catch(err => console.error(err));
    }
  };

  const resetForm = () => {
    setEditingProductId(null);
    setFormData({ name: '', description: '', price: '', rating: '4.5', stock: '10', imageUrl: '', category: categories[0] });
  };

  const handleEditClick = (p) => {
    setEditingProductId(p.id);
    setFormData({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      rating: p.rating || '4.5',
      stock: p.stock || '10',
      imageUrl: p.imageUrl || '',
      category: p.category || 'Electronics'
    });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Delete this product from catalog?')) {
      axios.delete(`http://localhost:8080/api/products/${id}`).then(() => loadAllData());
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    axios.put(`http://localhost:8080/api/orders/${orderId}/status`, { status: newStatus })
      .then(() => {
        alert(`Order #${orderId} status updated to ${newStatus}`);
        loadAllData();
      })
      .catch(err => alert('Failed to update status'));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`http://localhost:8080/api/users/${userId}`)
        .then(() => {
          alert('User deleted successfully!');
          loadAllData();
        })
        .catch(err => console.error(err));
    }
  };

  const calculateTotalRevenue = () => {
    return orders
      .filter(o => o.orderStatus !== 'CANCELLED')
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)
      .toFixed(2);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <h2>Amazon Seller Central Login</h2>
          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label>Admin Email</label>
              <input type="email" className="form-input" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@amazon.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-input" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="admin123" required />
            </div>
            <button type="submit" className="btn-primary-amazon">Sign In to Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <header className="seller-header">
        <div className="seller-nav-left">
          <span className="seller-logo">amazon</span>
          <span className="seller-badge">seller central</span>
        </div>
        <div className="seller-nav-right">
          <button className="btn-delete-action" onClick={() => setIsAdminLoggedIn(false)}>Sign Out</button>
          <Link className="store-link" to="/">Customer Store ↗</Link>
        </div>
      </header>

      <div className="admin-container">
        <div className="analytics-grid">
          <div className="stat-card">
            <p>Total Sales Revenue</p>
            <h3>₹{calculateTotalRevenue()}</h3>
          </div>
          <div className="stat-card">
            <p>Total Products</p>
            <h3>{products.length} Items</h3>
          </div>
          <div className="stat-card">
            <p>Customer Orders</p>
            <h3>{orders.length} Orders</h3>
          </div>
          <div className="stat-card">
            <p>Registered Users</p>
            <h3>{users.length} Users</h3>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            Manage Products
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            Customer Orders
          </button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Registered Users
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="admin-content">
            <div className="admin-card">
              <h2 className="admin-card-title">
                {editingProductId ? `Edit Product #${editingProductId}` : 'Add Product to Inventory'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" className="form-input" value={formData.category} onChange={handleChange}>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  
                  {!showCustomCatInput ? (
                    <button type="button" style={{ marginTop: '6px', fontSize: '11px', background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setShowCustomCatInput(true)}>
                      + Create Custom Category
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '5px', marginTop: '6px' }}>
                      <input type="text" placeholder="Category Name" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="form-input" />
                      <button type="button" onClick={handleAddCategory} className="btn-primary-amazon" style={{ width: 'auto', padding: '4px 10px', marginTop: 0 }}>Add</button>
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" name="price" className="form-input" value={formData.price} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input type="url" name="imageUrl" className="form-input" value={formData.imageUrl} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" className="form-input" value={formData.description} onChange={handleChange} rows="2" required />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-primary-amazon">
                    {editingProductId ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProductId && (
                    <button type="button" onClick={resetForm} className="btn-delete-action" style={{ marginTop: '10px' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h2 className="admin-card-title">Inventory Catalog ({products.length})</h2>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Preview</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td><img src={p.imageUrl} alt="" className="product-img-preview" /></td>
                      <td style={{ fontWeight: '600' }}>{p.name}</td>
                      <td><span className="badge-category">{p.category}</span></td>
                      <td style={{ fontWeight: '700' }}>₹{p.price}</td>
                      <td><b>{p.stock}</b></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-edit-action" onClick={() => handleEditClick(p)}>Edit</button>
                          <button className="btn-delete-action" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-card">
            <h2 className="admin-card-title">Customer Placed Orders ({orders.length})</h2>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>User Email</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td><b>{o.customerName}</b></td>
                    <td>{o.userEmail}</td>
                    <td>{o.paymentMethod}</td>
                    <td>
                      <select 
                        value={o.orderStatus} 
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="form-input"
                        style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-card">
            <h2 className="admin-card-title">Registered System Users ({users.length})</h2>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No Users Registered Yet</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td><b>{u.name}</b></td>
                      <td>{u.email}</td>
                      <td>
                        <button 
                          className="btn-delete-action" 
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Delete User
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;