import React from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css'; // Hum in pages ke liye ek alag CSS banayenge

function ContactPage() {
  return (
    <div className="static-page-container">
      <div className="static-content-box">
        
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <h2>Contact Us</h2>
        
        <p>
          If you have any issues with the portal, found a bug, or have a suggestion 
          for a new feature, please feel free to reach out to us. We are a small 
          team of students managing this portal and will do our best to get back 
          to you.
        </p>
        <p>
          For immediate assistance regarding a lost or found item, please contact 
          the **IIT Jodhpur Main Security Office** directly, as they are the 
          central authority for all items.
        </p>
        
        <h3>Email Us:</h3>
        <p>
  For technical support: 
  <a href="mailto:M25CSE020@iitj.ac.in">support-lostfound</a> 
  &nbsp;&nbsp; 
  (<a href="mailto:M25CSE020@iitj.ac.in">M25CSE020@iitj.ac.in</a>)
  <br/>
  
  For general inquiries: 
  <a href="mailto:M25CSE018@iitj.ac.in">admin-lostfound</a> 
  &nbsp;&nbsp; 
  (<a href="mailto:M25CSE018@iitj.ac.in">M25CSE018@iitj.ac.in</a>)
</p>
        
      </div>
    </div>
  );
}

export default ContactPage;