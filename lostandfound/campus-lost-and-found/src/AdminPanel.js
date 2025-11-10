import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemsList.css'; // We'll re-use the item card styling
import './StaticPage.css'; // We'll re-use the container styling

function AdminPanel() {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // This function fetches the pending items
  const fetchPendingItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in as an admin.');
        setLoading(false);
        return;
      }

      const config = {
        headers: { 'x-auth-token': token }
      };

      // 1. Call the new ADMIN API to get PENDING items
      const response = await axios.get(
        'http://localhost:5000/api/admin/pending-items',
        config
      );

      setPendingItems(response.data);
      setLoading(false);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg); // e.g., "Access denied. Not an admin."
      } else {
        setError('Failed to fetch pending items.');
      }
      setLoading(false);
    }
  };

  // Run the fetch function when the page loads
  useEffect(() => {
    fetchPendingItems();
  }, []); // Empty array means it runs once

  // --- THIS IS THE NEW APPROVE FUNCTION ---
  const handleApprove = async (itemId) => {
    if (!window.confirm('Are you sure you want to approve this item?')) {
      return; // Stop if the admin clicks 'Cancel'
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'x-auth-token': token }
      };

      // 2. Call the new ADMIN API to APPROVE the item
      const response = await axios.put(
        `http://localhost:5000/api/admin/approve-item/${itemId}`,
        {}, // No data needed in the body
        config
      );

      setSuccess(response.data.msg); // Show "Item approved successfully"
      
      // 3. Remove the item from the list on the screen
      setPendingItems(prevItems => 
        prevItems.filter(item => item._id !== itemId)
      );

    } catch (err) {
      setError('Failed to approve item.');
    }
  };

  return (
    <div className="static-page-container">
      <div className="static-content-box" style={{ maxWidth: '1000px' }}>
        <h2>Admin Panel: Pending Items</h2>
        <p>Review and approve new item reports here.</p>

        {loading && <p>Loading pending items...</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="items-list-container">
          {pendingItems.map(item => (
            <div className="item-card" key={item._id}>
              
              {item.image ? (
                <img 
                  src={`http://localhost:5000/${item.image.replace(/\\/g, '/')}`} 
                  alt={item.itemName} 
                  className="item-card-image" 
                />
              ) : (
                <div className="item-card-no-image">No Image</div>
              )}

              <div className="item-card-content">
                <span className={`item-tag ${item.itemType}`}>
                  {item.itemType}
                </span>
                <h3>{item.itemName}</h3>
                <p><strong>Reported by:</strong> {item.user.name} ({item.user.email})</p>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p>{item.description}</p>
                
                {/* --- NEW ADMIN BUTTON --- */}
                <button 
                  className="claim-button" 
                  style={{ backgroundColor: '#5cb85c' }} // Green color
                  onClick={() => handleApprove(item._id)}
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
          
          {!loading && pendingItems.length === 0 && (
            <p style={{ textAlign: 'center' }}>No pending items to review. Good job!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;