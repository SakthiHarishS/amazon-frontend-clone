import React, { useState, useRef } from 'react';
import { FaSearch, FaShoppingCart, FaMapMarkerAlt, FaCamera } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';
import API_BASE_URL from '../api';
import './Navbar.css';

const Navbar = ({ onSearch, onVisualSearch }) => {
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm, selectedCategory);
    }
    navigate('/');
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    if (onSearch) {
      onSearch(searchTerm, newCategory);
    }
    navigate('/');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      axios.post(`${API_BASE_URL}/ai/visual-search`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(res => {
        if (onVisualSearch) {
          onVisualSearch(res.data);
        }
        navigate('/');
      })
      .catch(err => console.error('Visual Search Error:', err));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="amazon-navbar-header">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <span className="logo-text">amazon</span>
          <span className="logo-domain">.in</span>
        </Link>
        
        <div className="nav-address">
          <FaMapMarkerAlt className="location-icon" />
          <div className="address-text">
            <span className="line-one">Deliver to</span>
            <span className="line-two">India</span>
          </div>
        </div>
      </div>

      <form className="nav-search" onSubmit={handleSearchSubmit}>
        <select 
          className="search-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="All">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Books">Books</option>
        </select>

        <input 
          type="text" 
          className="search-input" 
          placeholder="Search Amazon.in or upload image..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={handleImageUpload}
        />

        <button 
          type="button" 
          className="camera-search-btn" 
          onClick={() => fileInputRef.current.click()}
          title="Search by Photo (AI Visual Search)"
        >
          <FaCamera />
        </button>

        <button type="submit" className="search-btn" aria-label="Search">
          <FaSearch />
        </button>
      </form>

      <div className="nav-right">
        {user ? (
          <div className="nav-option" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <span className="line-one">Hello, {user.name}</span>
            <span className="line-two">Sign Out</span>
          </div>
        ) : (
          <Link to="/login" className="nav-option" style={{ color: 'white', textDecoration: 'none' }}>
            <span className="line-one">Hello, sign in</span>
            <span className="line-two">Account & Lists</span>
          </Link>
        )}

        <Link to="/wishlist" className="nav-option" style={{ color: 'white', textDecoration: 'none' }}>
          <span className="line-one">Your</span>
          <span className="line-two" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            Wish List
            {wishlist.length > 0 && (
              <span className="wishlist-badge-count">{wishlist.length}</span>
            )}
          </span>
        </Link>

        <Link to="/orders" className="nav-option" style={{ color: 'white', textDecoration: 'none' }}>
          <span className="line-one">Returns</span>
          <span className="line-two">& Orders</span>
        </Link>

        <Link to="/cart" className="nav-cart" style={{ color: 'white', textDecoration: 'none' }}>
          <div className="cart-icon-container">
            <FaShoppingCart className="cart-icon" />
            <span className="cart-count">{getCartCount()}</span>
          </div>
          <span className="cart-text">Cart</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;