import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './ItemsList.css'; // We'll re-use the item card styling
import './StaticPage.css'; // We'll re-use the container styling

function MyReportsPage() {
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // If no token, send to login
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        // 1. Call your NEW backend API
        const response = await axios.get(
          'http://localhost:5000/api/items/my-reports',
          config
        );

        setMyItems(response.data);
        setLoading(false);

      } catch (err) {
        setError('Failed to fetch your reports. Please try again.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [navigate]);

  return (
    <div className="static-page-container">
      <div className="static-content-box" style={{ maxWidth: '1000px' }}>
        <h2>My Reported Items</h2>
        <p>This is a list of all items you have reported, along with their status.</p>

        {loading && <p>Loading your items...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="items-list-container">
          {myItems.map(item => (
            <div className={`item-card item-card-${item.itemType}`} key={item._id}>
              
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
                
                {/* --- WE ADD THE STATUS --- */}
                <span 
                  className="item-tag" 
                  style={{ 
                    backgroundColor: item.status === 'Approved' ? '#5cb85c' : '#f0ad4e',
                    top: '15px',
                    right: '15px'
                  }}
                >
                  {item.status}
                </span>

                <h3>{item.itemName}</h3>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p>{item.description}</p>
                <p><strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{item.itemType}</span></p>
              </div>
            </div>
          ))}
          
          {!loading && myItems.length === 0 && (
            <p style={{ textAlign: 'center' }}>
              You have not reported any items yet. <Link to="/report-item">Report an item now</Link>!
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyReportsPage;