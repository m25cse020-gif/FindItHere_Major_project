import React, { useState } from 'react'; // 1. useState ko import kiya
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 2. axios ko import kiya
import './LoginPage.css'; 

function LoginPage() {
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const navigate = useNavigate();


  const handleLoginSubmit = async (event) => {
    event.preventDefault(); // Page ko refresh hone se roka
    setError(''); // Puraane error saaf kiye

    try {

      const response = await axios.post(
        '/api/auth/login',
        { email, password }
      );


      const token = response.data.token;
      


      localStorage.setItem('token', token);

      console.log('Login successful! Token saved:', token);
      

      navigate('/'); 

    } catch (err) {

      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg); // Backend ka error dikhaya
      } else {
        setError('Login failed. Please try again.');
        console.error(err);
      }
    }
  };


  return (
    <div className="login-page-container">
      <div className="login-box">
        
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <h2>Login</h2>
        
        {}
        <form onSubmit={handleLoginSubmit}>
          
          <div className="input-group">
            <label htmlFor="email">Email</label> {}
            <input 
              type="email" // 'text' ko 'email' kiya
              id="email" 
              placeholder="Enter your email" 
              value={email} // State se joda
              onChange={(e) => setEmail(e.target.value)} // State se joda
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password} // State se joda
              onChange={(e) => setPassword(e.target.value)} // State se joda
              required
            />
          </div>
          
          {}
          {error && (
            <p className="error-message" style={{ textAlign: 'center', marginBottom: '10px' }}>
              {error}
            </p>
          )}

          <button type="submit" className="login-button">Login</button>
        </form>
        
        <div className="signup-link">
          <p>New user? <Link to="/signup">Sign up here</Link></p>
        </div>
        
        {}
        <div className="other-logins">
          <a href="#">Staff Login</a> | <a href="#">Security Login</a>
        </div>
        
      </div>
    </div>
  );
}

export default LoginPage;