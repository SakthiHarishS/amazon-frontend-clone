import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="wishlist-page">
      <h2><FaHeart style={{ color: '#c40000', marginRight: '8px' }} /> Your Wish List ({wishlist.length})</h2>

      {wishlist.length === 0 ? (
        <div className="no-wishlist">
          <p>Your Wish List is currently empty.</p>
          <Link to="/" className="btn-primary-amazon" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '8px 16px' }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(product => (
            <div key={product.id} className="wishlist-card">
              <img src={product.imageUrl} alt={product.name} />
              <div className="wishlist-info">
                <h4>{product.name}</h4>
                <p className="wishlist-price">₹{product.price}</p>
                <div className="wishlist-actions">
                  <button className="btn-add-cart-amazon" onClick={() => handleMoveToCart(product)}>
                    <FaShoppingCart /> Move to Cart
                  </button>
                  <button className="btn-remove-wishlist" onClick={() => removeFromWishlist(product.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;