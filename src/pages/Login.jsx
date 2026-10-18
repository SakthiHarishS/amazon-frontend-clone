import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? 'signup' : 'login';
    const payload = isSignup ? { name, email, password } : { email, password };

    try {
      const response = await axios.post(`http://localhost:8080/api/auth/${endpoint}`, payload);
      
      if (response.data && response.data.email) {
        // Token illamal direct user details local storage-la save panrom
        localStorage.setItem('user', JSON.stringify({ name: response.data.name, email: response.data.email }));
        alert(`${isSignup ? 'Account Created' : 'Logged in'} Successfully!`);
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      alert(error.response?.data || 'Authentication failed! Check credentials.');
    }
  };

  return (
    <div className="login-container">
      <Link to="/" className="login-logo">
        <span className="logo-text-dark">amazon</span>
        <span className="logo-domain-dark">.in</span>
      </Link>

      <div className="login-box">
        <h2>{isSignup ? 'Create Account' : 'Sign in'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <label>Your name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="login-submit-btn">
            {isSignup ? 'Create your Amazon account' : 'Sign in'}
          </button>
        </form>

        <p className="terms-text">
          By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.
        </p>

        <hr />

        <button 
          type="button"
          className="toggle-auth-btn" 
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Already have an account? Sign in' : 'Create your Amazon account'}
        </button>
      </div>
    </div>
  );
};

export default Login;