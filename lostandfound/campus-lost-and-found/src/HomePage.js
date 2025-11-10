import React from 'react';
// 1. 'useNavigate' ko import karein
import { useNavigate } from 'react-router-dom'; 
import './App.css'; 

function HomePage() {
  
  // 2. 'useNavigate' ko setup karein
  const navigate = useNavigate();

  // Is function ka naam bhi badal dete hain
const handleReportClick = () => {
  // User ko naye page par bhej do
  navigate('/report-item');
};
 
const handleViewClick = () => {
  navigate('/view-items');
};
  return (
    <>
      {/* 3. MAIN CONTENT */}
      <main className="main-content">

        {/* Image Section */}
        <section className="hero-image-container">
          <img 
            src="/iit jodhpur.webp" 
            alt="IIT Jodhpur Campus"
          />
        </section>

        {/* About Section */}
        <section className="about-section" id="about-portal">
          <h2>About This Portal</h2>
          <p>
            Welcome to the official Lost and Found portal for the **IIT Jodhpur** campus. 
            This platform is designed to help students and staff report items they have lost 
            or found within the campus premises. Our goal is to create a reliable and 
            centralized system to reunite people with their belongings.
          </p>
          <p>FindItHere: Campus Lost & Found Portal A centralized digital solution for managing lost and found items at IIT Jodhpur using modern web technologies by Mangalton Okram, Nishant Chourasia Under the guidance of Prof. Sumit Kalra.</p>
        </section>

        {/* 4. 'onClick' ko teeno buttons mein add karein */}
        <section className="actions-section">
          <div className="action-card">
            <h3>Report Lost Item</h3>
            <p>Misplaced something? Report it here so others can find you.</p>
            <button onClick={handleReportClick}>Report Lost</button>
          </div>
          <div className="action-card">
            <h3>Report Found Item</h3>
            <p>Found something? Help it get back to its owner.</p>
            <button onClick={handleReportClick}>Report Found</button>
          </div>
          <div className="action-card">
            <h3>View All Items</h3>
            <p>Browse the list of all lost and found items reported.</p>
            <button onClick={handleViewClick}>View List</button>
          </div>
        </section>

      </main>

      {/* 4. FOOTER */}
      <footer className="footer">
  {/* 1. Left Side Logo */}
  <img 
    src="/logo.png" 
    alt="Project Logo" 
    className="footer-logo" 
  />
  
  {/* 2. Center Copyright Text */}
  <div className="footer-text">
    <p>A dedicated portal to help reconnect lost items with their owners at IIT Jodhpur.</p>
    <p>Created by: Mangalton Okram, Nishant Chourasia </p>
    <p>© 2025 IIT Jodhpur. All rights reserved.</p>
  </div>

  {/* 3. Right Side Logo */}
  <img 
    src="/kn_tree.png" 
    alt="Knowledge Tree Logo" 
    className="footer-logo" 
  />
</footer>
    </>
  );
}

export default HomePage;