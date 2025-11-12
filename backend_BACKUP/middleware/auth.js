const jwt = require('jsonwebtoken');


const JWT_SECRET = 'my-jwt-secret-key-12345';


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


function admin(req, res, next) {

  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Not an admin.' });
  }

  next();
}


module.exports = {
  auth,
  admin
};