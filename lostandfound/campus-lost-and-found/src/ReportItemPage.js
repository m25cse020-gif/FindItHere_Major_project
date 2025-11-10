import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StaticPage.css'; // We'll re-use the same CSS
import './LoginPage.css'; // Re-use this for form styles

function ReportItemPage() {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Electronics',
    location: '',
    description: '',
    itemType: 'found'
  });
  
  // Create a separate state for the image file
  const [imageFile, setImageFile] = useState(null); 
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // --- HANDLERS ---
  
  // This handles changes for text fields, dropdowns
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // This handles the file input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Get the first file
  };

  // Form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('Submitting...');

    // 1. Get the token (I-card)
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to report an item.');
      return;
    }

    // 2. Create FormData
    // This is required for sending files
    const dataToSubmit = new FormData();
    
    // Add all the text data
    dataToSubmit.append('itemName', formData.itemName);
    dataToSubmit.append('category', formData.category);
    dataToSubmit.append('location', formData.location);
    dataToSubmit.append('description', formData.description);
    dataToSubmit.append('itemType', formData.itemType);
    
    // 3. Add the image file (if one was selected)
    // The name 'itemImage' MUST match the backend: upload.single('itemImage')
    if (imageFile) {
      dataToSubmit.append('itemImage', imageFile);
    }

    try {
      // 4. Set headers for file upload
      const config = {
        headers: {
          // 'Content-Type' is set to 'multipart/form-data' by axios automatically
          // when we send FormData. We just need to send the token.
          'x-auth-token': token
        }
      };

      // 5. Send the FormData to the backend
      const response = await axios.post(
        'http://localhost:5000/api/items/report',
        dataToSubmit, // Send the FormData object
        config
      );

      // 6. Handle success
      console.log(response.data);
      setSuccess('Item reported successfully! Status is Pending.');
      setError('');
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      // 7. Handle errors
      setSuccess('');
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Failed to report item. Please try again.');
      }
    }
  };

  // --- RENDER ---
  return (
    <div className="static-page-container">
      <div className="static-content-box" style={{ maxWidth: '600px' }}>
        <h2>Report an Item</h2>
        <p>Fill out the details of the item you lost or found.</p>

        {/* Note the 'encType' is NOT needed when using axios */}
        <form onSubmit={handleSubmit} className="login-box" style={{ padding: 0, boxShadow: 'none' }}>
          
          <div className="input-group">
            <label>I... (Lost or Found?)</label>
            <select name="itemType" value={formData.itemType} onChange={handleChange} required>
              <option value="found">Found an Item</option>
              <option value="lost">Lost an Item</option>
            </select>
          </div>

          <div className="input-group">
            <label>Item Name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g., Blue Water Bottle"
              required
            />
          </div>
          
          <div className="input-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books / Notes</option>
              <option value="Apparel">Apparel / Bags</option>
              <option value="ID Cards">ID Cards / Keys</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Library, 2nd Floor"
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any other details (color, brand, etc.)"
              rows="4"
            ></textarea>
          </div>

          {/* --- THIS IS THE NEW FILE INPUT --- */}
          <div className="input-group">
            <label>Upload Image (Optional)</label>
            <input
              type="file"
              name="itemImage"
              onChange={handleFileChange}
              style={{ padding: '10px' }} // Add some basic styling
            />
          </div>
          {/* ---------------------------------- */}

          {error && <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>}
          {success && <p className="success-message" style={{ textAlign: 'center' }}>{success}</p>}

          <button type="submit" className="login-button" style={{ width: '100%', marginTop: '10px' }}>
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportItemPage;