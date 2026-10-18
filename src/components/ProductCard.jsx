import React from 'react';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onBuyNow, onSelectProduct }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isOutOfStock = product.stock <= 0;
  const inWishlist = isInWishlist(product.id);

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock-card' : ''}`}>
      <div className="product-card-top-row">
        <span className="product-category-tag">{product.category || 'Electronics'}</span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isOutOfStock ? (
            <span className="badge-out-of-stock">Out of Stock</span>
          ) : (
            <span className="badge-in-stock">In Stock ({product.stock})</span>
          )}

          {/* Clean Top-Right Wishlist Heart Icon */}
          <button 
            className="wishlist-toggle-btn" 
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {inWishlist ? <FaHeart color="#c40000" /> : <FaRegHeart color="#888" />}
          </button>
        </div>
      </div>

      <div onClick={() => onSelectProduct && onSelectProduct(product)} style={{ cursor: 'pointer' }}>
        <div className="product-image-box">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80";
            }}
          />
        </div>

        <h3 className="product-title">{product.name}</h3>
        <p className="product-description-text">{product.description}</p>

        <div className="product-rating-row">
          {[...Array(5)].map((_, index) => (
            <FaStar 
              key={index} 
              color={index < Math.floor(product.rating || 4) ? "#ffa41c" : "#e4e6e6"} 
              size={14}
            />
          ))}
          <span className="rating-number">({product.rating || 4.5})</span>
        </div>

        <div className="product-price-row">
          <span className="currency-symbol">₹</span>
          <span className="price-val">{product.price}</span>
          <span className="prime-badge">✓prime</span>
        </div>
      </div>

      <div className="product-card-actions">
        <button 
          className={`btn-add-cart-amazon ${isOutOfStock ? 'disabled-btn' : ''}`}
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>

        <button 
          className={`btn-buy-now-amazon ${isOutOfStock ? 'disabled-btn' : ''}`}
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            onBuyNow(product);
          }}
        >
          {isOutOfStock ? 'Unavailable' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;