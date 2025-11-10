import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      
      {/* 1. Left Side */}
      <div className="nav-left">
        <a href="#">Home</a>
      </div>
      
      {/* 2. Right Side */}
      <div className="nav-right">
        <a href="#">Report Lost Item</a>
        <a href="#">Report Found Item</a>
        <a href="#">View Items</a>
      </div>

    </nav>
  );
}

export default Navbar;