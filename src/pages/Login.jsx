import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api'; // Import helper API base URL
import './Login.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const endpoint = isSignup 
      ? `${API_BASE_URL}/users/register` 
      : `${API_BASE_URL}/users/login`;

    axios.post(endpoint, formData)
      .then(res => {
        alert(isSignup ? 'Registration Successful! Please Sign In.' : 'Logged In Successfully!');
        if (!isSignup) {
          localStorage.setItem('user', JSON.stringify(res.data));
          navigate('/');
          window.location.reload();
        } else {
          setIsSignup(false);
        }
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.message || 'Authentication Failed! Check credentials.');
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>{isSignup ? 'Create Account' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary-amazon">
            {isSignup ? 'Create Your Amazon Account' : 'Sign In'}
          </button>
        </form>

        <button className="toggle-auth-btn" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Sign In' : 'New to Amazon? Create an account'}
        </button>
      </div>
    </div>
  );
};

export default Login;