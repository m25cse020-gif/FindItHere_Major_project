import React from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css'; // Wahi CSS file istemaal karenge

function HelpPage() {
  return (
    <div className="static-page-container">
      <div className="static-content-box">
        
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <h2>Help & FAQ</h2>
        
        <p>
          Welcome to the help section. Here are some frequently asked questions (FAQs) 
          about how the Lost and Found portal works.
        </p>
        
        <h3>How do I report a lost item?</h3>
        <p>
          Click on the "Report Lost Item" button on the homepage. You will need to 
          fill out a form with details like what the item is, where you last 
          saw it, and a description.
        </p>
        
        <h3>How do I report a found item?</h3>
        <p>
          Click on "Report Found Item". Fill in the details of the item you found. 
          As per our policy, you must submit the item to the **Main Security Office** for verification. Once security approves your report, the item will be 
          listed publicly on the portal.
        </p>
        
        <h3>I found my item on the list. What do I do?</h3>
        <p>
          If you see your lost item listed, you can claim it by contacting the 
          Main Security Office. You will need to provide proof of ownership 
          (like a description, serial number, or your ID card) to claim it.
        </p>
        
      </div>
    </div>
  );
}

export default HelpPage;