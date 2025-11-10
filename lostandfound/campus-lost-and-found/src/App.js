import React, { useState, useEffect } from 'react';
// 1. Dhyan dein 'jwtDecode' mein {} nahi hai
import{ jwtDecode }from 'jwt-decode'; 
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

// -- Humare saare pages --
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ContactPage from './ContactPage';
import HelpPage from './HelpPage';
import ReportItemPage from './ReportItemPage'; 
import ItemsListPage from './ItemsListPage';   
import AdminPanel from './AdminPanel';         
import MyReportsPage from './MyReportsPage';

import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <AppContent /> 
    </BrowserRouter>
  );
}

function AppContent() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.user.role); 
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); 
    setUserRole(null);
    navigate('/login');
  };

  return (
    <>
      <header className="top-header">
  <div className="header-content">
    <img src="/logo.png" alt="Project Logo" className="header-logo" />
    <h1>FindItHere - IITJ Portal</h1>
  </div>
</header>

      {/* --- NAVIGATION BAR --- */}
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/">Home</Link>
          <a href="/#about-portal">About</a>
          <Link to="/contact">Contact Us</Link>
          <Link to="/help">Help</Link>
        </div>
        
        <div className="nav-right">
          {isLoggedIn ? (
            // Agar user Logged In hai:
            <>
              {/* --- NEW "MY REPORTS" LINK --- */}
              <Link to="/my-reports" className="my-reports-link">My Reports</Link>

              {userRole === 'admin' && (
                <Link to="/admin" className="admin-link">Admin Panel</Link>
              )}
              <a href="#" onClick={handleLogout} className="logout-link">Logout</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>

      {/* --- 2. YAHAN AAPKI GALTI THI --- */}
      {/* Check karein ki yeh saare routes maujood hain */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpPage />} />
        
        {/* --- YEH ROUTES AAPKE MISSING THE --- */}
        <Route path="/report-item" element={<ReportItemPage />} />
        <Route path="/view-items" element={<ItemsListPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/my-reports" element={<MyReportsPage />} />
      </Routes>
    </>
  );
}

export default App;