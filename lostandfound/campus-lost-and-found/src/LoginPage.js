import React, { useState } from 'react'; // 1. useState ko import kiya
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 2. axios ko import kiya
import './LoginPage.css'; 

function LoginPage() {
  
  // 3. Email aur Password ko yaad rakhne ke liye State banaye
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 4. Page badalne ke liye useNavigate
  const navigate = useNavigate();

  // 5. Form submit hone par yeh function chalega
  const handleLoginSubmit = async (event) => {
    event.preventDefault(); // Page ko refresh hone se roka
    setError(''); // Puraane error saaf kiye

    try {
      // 6. Backend API ko call kiya
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );

      // 7. Agar login safal hua, toh backend 'token' bhejega
      const token = response.data.token;
      
      // 8. Token ko browser ki memory (localStorage) mein save kiya
      // (Taaki user baad mein bhi login rahe)
      localStorage.setItem('token', token);

      console.log('Login successful! Token saved:', token);
      
      // 9. User ko Homepage par bhej diya
      navigate('/'); 

    } catch (err) {
      // 10. Agar backend se error aaya (jaise "Invalid credentials")
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
        
        {/* 11. Form mein 'onSubmit' joda */}
        <form onSubmit={handleLoginSubmit}>
          
          <div className="input-group">
            <label htmlFor="email">Email</label> {/* 'username' ko 'email' kiya */}
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
          
          {/* Error message dikhane ke liye */}
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
        
        <div className="other-logins">
        <a href="#">Staff Login</a> | <a href="#">Security Login</a>
        </div>
        
      </div>
    </div>
  );
}

export default LoginPage;