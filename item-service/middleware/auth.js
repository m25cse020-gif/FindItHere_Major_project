
const axios = require('axios');



async function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {

    const response = await axios.get('http://auth-service:5001/api/auth/verify-token', {
      headers: { 'x-auth-token': token }
    });


    req.user = response.data; // { id: '...', role: 'admin' }
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

module.exports = { auth, admin };