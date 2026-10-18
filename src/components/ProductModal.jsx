import React, { useState, useEffect } from 'react';
import { FaTimes, FaRobot, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../api';
import './ProductModal.css';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [aiSummary, setAiSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
  const [loadingAi, setLoadingAi] = useState(true);

  const fetchReviewsAndSummary = () => {
    setLoadingAi(true);
    axios.get(`${API_BASE_URL}/ai/review-summary/${product.id}`)
      .then(res => setAiSummary(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoadingAi(false));

    axios.get(`${API_BASE_URL}/reviews/product/${product.id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (product && product.id) {
      fetchReviewsAndSummary();
    }
  }, [product]);

  const handleAddReview = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const payload = {
      productId: product.id,
      userName: user ? user.name : (newReview.userName || 'Verified Buyer'),
      userEmail: user ? user.email : 'buyer@amazon.com',
      rating: parseFloat(newReview.rating),
      comment: newReview.comment
    };

    axios.post(`${API_BASE_URL}/reviews`, payload)
      .then(() => {
        alert('Review submitted successfully!');
        setNewReview({ userName: '', rating: 5, comment: '' });
        fetchReviewsAndSummary();
      })
      .catch(err => console.error(err));
  };

  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-container">
        <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>

        <div className="modal-grid">
          <div className="modal-image-col">
            <img src={product.imageUrl} alt={product.name} />
          </div>

          <div className="modal-info-col">
            <h2 className="modal-product-title">{product.name}</h2>
            <p className="modal-category-badge">{product.category}</p>

            <div className="modal-price-row">
              <span className="price-symbol">₹</span>
              <span className="price-amount">{product.price}</span>
            </div>

            <p className="modal-description">{product.description}</p>

            <div className="ai-summary-card">
              <div className="ai-summary-header">
                <FaRobot className="ai-icon" />
                <span>AI Review Insights</span>
                {aiSummary && <span className="sentiment-tag">{aiSummary.sentiment}</span>}
              </div>

              {loadingAi ? (
                <p style={{ fontSize: '12px', color: '#666' }}>AI is analyzing buyer feedback...</p>
              ) : (
                aiSummary && (
                  <div className="ai-summary-body">
                    <p className="summary-text">{aiSummary.summary}</p>
                    
                    <div className="pros-cons-grid">
                      <div className="pros-box">
                        <span className="box-title"><FaThumbsUp /> Pros</span>
                        <ul>
                          {aiSummary.pros && aiSummary.pros.map((p, idx) => <li key={idx}>{p}</li>)}
                        </ul>
                      </div>

                      <div className="cons-box">
                        <span className="box-title"><FaThumbsDown /> Cons</span>
                        <ul>
                          {aiSummary.cons && aiSummary.cons.map((c, idx) => <li key={idx}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <button className="btn-add-cart-amazon" onClick={() => onAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>

        <div className="modal-reviews-section">
          <h3>Customer Reviews ({reviews.length})</h3>

          <form className="add-review-form" onSubmit={handleAddReview}>
            <h4>Write a Review</h4>
            <div className="form-row-compact">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={newReview.userName} 
                onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })} 
                required 
              />
              <select 
                value={newReview.rating} 
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              >
                <option value="5">5 ⭐ - Excellent</option>
                <option value="4">4 ⭐ - Very Good</option>
                <option value="3">3 ⭐ - Average</option>
                <option value="2">2 ⭐ - Poor</option>
                <option value="1">1 ⭐ - Terrible</option>
              </select>
            </div>
            <textarea 
              placeholder="What did you like or dislike about this product?" 
              value={newReview.comment} 
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} 
              rows="2" 
              required 
            />
            <button type="submit" className="btn-submit-review">Submit Review</button>
          </form>

          <div className="reviews-list">
            {reviews.map((r, idx) => (
              <div key={idx} className="review-item-card">
                <div className="review-user-row">
                  <b>{r.userName}</b>
                  <span className="review-stars">{"⭐".repeat(r.rating || 5)}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;