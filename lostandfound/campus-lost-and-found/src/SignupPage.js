import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; // We need axios to call the backend
import './LoginPage.css';

function SignupPage() { 
  
  const navigate = useNavigate(); 

  // --- States for the form data (to remember them) ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verification, setVerification] = useState('');
  
  // --- State for the OTP input ---
  const [otp, setOtp] = useState('');

  // --- State for the two-step process ---
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  // --- State for all error messages ---
  const [error, setError] = useState('');
  // --- State for success messages (like "OTP sent!") ---
  const [success, setSuccess] =
    useState('');

  // --- This function runs when you click "Sign Up" ---
  const handleRequestOtp = async (event) => {
    event.preventDefault(); 

    // --- Frontend Checks ---
    if (password !== confirmPassword) {
      setError('Error: Passwords do not match.');
      return;
    }
    if (verification !== '8') { 
      setError('Error: The verification answer (5 + 3) is incorrect.');
      return;
    }
    if (!email.endsWith('@iitj.ac.in')) {
      setError('Error: Please use your official @iitj.ac.in email address.');
      return; 
    }
    
    setError(''); // Clear old errors
    setSuccess('Sending OTP... Please wait.'); // Show loading message

    // Create the user object to send
    const newUser = { name, email, mobile, password };

    try {
      // Call the first API
      const response = await axios.post(
        'http://localhost:5000/api/auth/request-otp', 
        newUser
      );

      // If it works:
      setSuccess(response.data.msg); // Show "OTP has been sent..."
      setError('');
      setIsOtpSent(true); // Show the OTP form

    } catch (err) {
      // If backend sends an error
      setSuccess('');
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg); // Show backend error (e.g., "User already exists")
      } else {
        setError('Could not request OTP. Please try again.');
      }
    }
  };

  // --- This function runs when you click "Submit OTP" ---
  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    setError('');
    setSuccess('Verifying OTP...');

    try {
      // Call the second API
      const response = await axios.post(
        'http://localhost:5000/api/auth/verify-otp',
        { email: email, otp: otp } // Send email (from state) and the new OTP
      );

      // If it works, the backend sends a token
      console.log('Verification successful!', response.data.token);
      
      // We'll just show an alert for now. Later we will save this token.
      alert('Account verified successfully! You can now log in.');
      navigate('/login'); // Send user to login page

    } catch (err) {
      // If backend sends an error
      setSuccess('');
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg); // Show backend error (e.g., "Invalid OTP")
      } else {
        setError('Verification failed. Please try again.');
      }
    }
  };

  // --- Render the OTP Form ---
  const renderOtpForm = () => {
    return (
      <form className="otp-form-container" onSubmit={handleVerifyOtp}>
        <h4>Verify Your Email</h4>
        <p>An OTP has been sent to <strong>{email}</strong>. Please enter it below.</p>
        
        <div className="input-group">
          <label htmlFor="otp">Enter OTP</label>
          <input 
            type="text" 
            id="otp" 
            placeholder="Enter 6-digit OTP" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        
        {/* Show error or success messages */}
        {error && <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>}
        {success && <p className="success-message" style={{ textAlign: 'center' }}>{success}</p>}

        <button type="submit" className="login-button">Submit OTP</button>
        
        <div className="otp-options">
          {/* This button just flips the switch back to 'false' */}
          <button type="button" className="back-button" onClick={() => {
            setIsOtpSent(false);
            setError('');
            setSuccess('');
          }}>
            ← Back (Edit Details)
          </button>
        </div>
      </form>
    );
  };

  // --- Render the Main Signup Form ---
  const renderSignupForm = () => {
    return (
      <form onSubmit={handleRequestOtp}> 
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" id="name" placeholder="Enter your full name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="email-username">Email / Username (IITJ Email)</label>
          <input 
            type="email" id="email-username" placeholder="e.g., user@iitj.ac.in" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="mobile">Mobile No.</label>
          <input 
            type="tel" id="mobile" placeholder="Enter your 10-digit number" 
            value={mobile} 
            onChange={(e) => setMobile(e.target.value)} 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" id="password" placeholder="Create a password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input 
            type="password" id="confirm-password" placeholder="Confirm your password"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div className="input-group verification-group">
          <label htmlFor="verification">Verify you are human: <strong>What is 5 + 3 ?</strong></label>
          <input 
            type="text" id="verification" placeholder="Enter your answer" 
            value={verification} 
            onChange={(e) => setVerification(e.target.value)} 
            required 
          />
        </div>

        {/* Show error or success messages */}
        {error && <p className="error-message" style={{ textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
        {success && <p className="success-message" style={{ textAlign: 'center', marginBottom: '10px' }}>{success}</p>}

        <button type="submit" className="login-button">Send OTP</button>
      </form>
    );
  };

  // --- Main Component Return ---
  return (
    <div className="login-page-container">
      <div className="login-box" style={{ width: '400px' }}> 
        
        {!isOtpSent && <Link to="/" className="back-link">← Back to Home</Link>}
        
        <h2>{isOtpSent ? 'Verify Your Account' : 'Create Account'}</h2>
        
        {/* This logic decides which form to show */}
        {isOtpSent ? renderOtpForm() : renderSignupForm()}
        
        {!isOtpSent && (
          <div className="signup-link">
            <p>Already have an account? <Link to="/login">Log in here</Link></p>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default SignupPage;