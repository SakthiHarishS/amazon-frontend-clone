import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SubHeader.css';

const SubHeader = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books'];

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    // Home page-kku redirect panni filtered products-a kaattum
    navigate('/');
  };

  return (
    <div className="subheader">
      <div 
        className="subheader-option subheader-all" 
        onClick={() => handleCategoryClick('All')}
        style={{ cursor: 'pointer' }}
      >
        <FaBars />
        <span>All</span>
      </div>

      {categories.filter(c => c !== 'All').map((cat) => (
        <div 
          key={cat} 
          className="subheader-option"
          onClick={() => handleCategoryClick(cat)}
          style={{ cursor: 'pointer' }}
        >
          {cat}
        </div>
      ))}
    </div>
  );
};

export default SubHeader;