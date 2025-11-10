import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Sahi import
import './ItemsList.css'; 
import './StaticPage.css';
import './LoginPage.css'; 

function ItemsListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [userRole, setUserRole] = useState('student'); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view items.');
          setLoading(false);
          navigate('/login');
          return;
        }

        try {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.user.role);
        } catch (err) {
          console.error("Invalid token");
        }

        const config = { headers: { 'x-auth-token': token } };
        const response = await axios.get('http://localhost:5000/api/items/all', config);
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch items. Please try again.');
        console.error(err);
        setLoading(false);
      }
    };
    fetchItems();
  }, [navigate]);

  // Filter logic
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = 
      itemTypeFilter === 'All' || item.itemType === itemTypeFilter;
    const matchesCategory = 
      categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Alert #1: Jab user 'FOUND' item ko 'CLAIM' karta hai
  const handleClaim = (item) => {
    alert(
      `--- How to Claim This Item ---\n\n` +
      `You are claiming the item: ${item.itemName}\n` +
      `Item ID: ${item._id}\n\n` +
      `Please visit the Main Security Office (Admin Block) with this Item ID and your student/staff ID card to claim it.`
    );
  };

  // Alert #2: Jab user 'LOST' item ko 'FOUND' karta hai
  const handleFoundIt = (item) => {
    alert(
      `--- You Found a Lost Item! ---\n\n` +
      `Item Name: ${item.itemName}\n` +
      `Item ID: ${item._id}\n\n` +
      `Thank you for helping! Please submit this item to the nearest Security Guard or the Main Security Office and show them this Item ID.`
    );
  };

  // Admin ke 'Claimed' mark karne ka function
  const handleAdminMarkClaimed = async (itemId) => {
    if (!window.confirm('Are you sure you want to mark this item as "Claimed"? It will be removed from this list.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.put(
        `http://localhost:5000/api/admin/claim-item/${itemId}`,
        {},
        config
      );
      setSuccess(response.data.msg);
      setItems(prevItems => prevItems.filter(item => item._id !== itemId));
    } catch (err) {
      setError('Failed to update item status.');
    }
  };

  return (
    <div className="static-page-container">
      <div className="static-content-box" style={{ maxWidth: '1000px' }}>
        <h2>All Approved Items</h2>
        <p>This is the list of all lost and found items that have been approved by an admin.</p>
        
        {/* Filter bar */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name or description..."
            className="filter-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            value={itemTypeFilter}
            onChange={(e) => setItemTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select 
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books / Notes</option>
            <option value="Apparel">Apparel / Bags</option>
            <option value="ID Cards">ID Cards / Keys</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {loading && <p>Loading items...</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="items-list-container">
          
          {filteredItems.map(item => (
            <div className={`item-card item-card-${item.itemType}`} key={item._id}>
              
              {/* Image Logic */}
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

                {/* Item Details */}
                <h3>{item.itemName}</h3>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p>{item.description}</p>
                
               {/* --- YEH POORA NAYA BUTTONS BLOCK HAI --- */}
<div className="item-card-buttons">

  {/* 1. Normal User Button (Claim/Found) */}
  {item.itemType === 'found' ? (
    <button 
      className="claim-button" 
      onClick={() => handleClaim(item)}
    >
      Claim This Item
    </button>
  ) : (
    <button 
      className="claim-button" 
      style={{ backgroundColor: '#f0ad4e' }}
      onClick={() => handleFoundIt(item)}
    >
      I Found This Item
    </button>
  )}

  {/* 2. Admin-Only "Remove" Button */}
  {userRole === 'admin' && (
    <button 
      className="claim-button remove-button"
      onClick={() => handleAdminMarkClaimed(item._id)}
    >
      Remove
    </button>
  )}
</div>
{/* --- NAYA BLOCK KHATAM --- */}
              </div>
            </div>
          ))}
          
          {/* Empty message logic */}
          {!loading && filteredItems.length === 0 && (
            <p style={{ textAlign: 'center' }}>
              {items.length === 0 
                ? "No approved items found at this time." 
                : "No items match your search filters."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemsListPage;