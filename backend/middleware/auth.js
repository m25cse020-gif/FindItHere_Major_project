const jwt = require('jsonwebtoken');

// Secret key (make sure it's the same as in index.js)
const JWT_SECRET = 'my-jwt-secret-key-12345';

// Middleware #1: Check if user is logged in
function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// Middleware #2: Check if user is an Admin
function admin(req, res, next) {
  // We assume 'auth' middleware ran first, so 'req.user' exists
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Not an admin.' });
  }
  // If user is an admin, let them pass
  next();
}

// Export both functions
module.exports = {
  auth,
  admin
};