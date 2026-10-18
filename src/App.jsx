import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import SubHeader from './components/SubHeader';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AiChatbot from './components/AiChatbot';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import './App.css';

function Home({ products, onSelectCategory }) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="main-content">
      <div className="banner">
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80" 
          alt="Amazon Banner" 
          className="banner-image"
        />
      </div>
      
      <div className="product-grid">
        {products.length === 0 ? (
          <h3 style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
            No products found matching your search.
          </h3>
        ) : (
          products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart} 
              onBuyNow={handleBuyNow}
              onSelectProduct={setSelectedProduct}
            />
          ))
        )}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart} 
        />
      )}
    </div>
  );
}

function MainLayout({ products, handleSearch, handleCategorySelect, handleVisualSearch }) {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  // Issue 1 Fix: Interval check for Instant Auto-Logout if deleted by Admin
  useEffect(() => {
    const checkUserStatus = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id && !isAdminPage) {
        axios.get('http://localhost:8080/api/users')
          .then(res => {
            const userExists = res.data.some(u => u.id === user.id);
            if (!userExists) {
              localStorage.removeItem('user');
              alert('Your account has been removed by the Admin.');
              window.location.href = '/login';
            }
          })
          .catch(err => console.error(err));
      }
    };

    checkUserStatus();
    const interval = setInterval(checkUserStatus, 3000); // Polls every 3 seconds
    return () => clearInterval(interval);
  }, [location.pathname, isAdminPage]);

  return (
    <div className="app">
      {!isAdminPage && (
        <Navbar 
          onSearch={handleSearch} 
          onVisualSearch={handleVisualSearch} 
        />
      )}
      {!isAdminPage && <SubHeader onSelectCategory={handleCategorySelect} />}

      <Routes>
        <Route path="/" element={<Home products={products} onSelectCategory={handleCategorySelect} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Floating AI Assistant Chatbot */}
      {!isAdminPage && <AiChatbot />}
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);

  const fetchAllProducts = () => {
    axios.get('http://localhost:8080/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleSearch = (searchTerm, category) => {
    if (!searchTerm && category === 'All') {
      fetchAllProducts();
      return;
    }

    if (searchTerm) {
      axios.get(`http://localhost:8080/api/products/search?query=${searchTerm}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    } else if (category !== 'All') {
      axios.get(`http://localhost:8080/api/products/category/${category}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }
  };

  const handleCategorySelect = (category) => {
    if (category === 'All') {
      fetchAllProducts();
    } else {
      axios.get(`http://localhost:8080/api/products/category/${category}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }
  };

  const handleVisualSearch = (filteredProducts) => {
    setProducts(filteredProducts);
  };

  return (
    <CartProvider>
      <WishlistProvider>
        <MainLayout 
          products={products} 
          handleSearch={handleSearch} 
          handleCategorySelect={handleCategorySelect} 
          handleVisualSearch={handleVisualSearch}
        />
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;