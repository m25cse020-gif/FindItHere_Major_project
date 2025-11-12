
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const port = 5001; 
const JWT_SECRET = 'my-jwt-secret-key-12345'; // Humara secret (ise .env mein daal sakte hain)


mongoose.connect(process.env.mongoURI, {  })
  .then(() => console.log('Auth-Service: MongoDB Connected!'))
  .catch(err => console.error(err));





app.post('/api/auth/request-otp', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user && user.isVerified) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`--- DEBUG: OTP for ${email} is: ${otp} ---`);
    if (user) {
      user.name = name;
      user.mobile = mobile;
      user.password = hashedPassword;
      user.otp = otp;
      user.isVerified = false;
      await user.save();
    } else {
      user = new User({
        name,
        email,
        mobile,
        password: hashedPassword,
        otp: otp,
        isVerified: false
      });
      await user.save();
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 5000, 
      socketTimeout: 5000      
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Lost and Found Portal',
      html: `<h3>Hello ${name},</h3><p>Your One-Time Password (OTP) is:</p><h1 style="color: blue;">${otp}</h1><p>This OTP is valid for 10 minutes.</p>`
    };

    console.log("Sending email... (Connecting to Gmail)");
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");

    res.status(201).json({ msg: 'OTP has been sent to your email. Please verify.' });

  } catch (err) {
    if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKET') {
      console.error('Nodemailer Error: Connection timed out. Check network/firewall.');
      return res.status(500).json({ msg: 'Could not send OTP. Server timed out.' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ msg: 'User is already verified.' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP.' });
    }

    user.isVerified = true;
    user.otp = null; 
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      JWT_SECRET, // Wahi secret use karein
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});





app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials (user not found)' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Account not verified. Please check your email for OTP.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (password incorrect)' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET, // Wahi secret use karein
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




app.get('/api/auth/verify-token', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET); 
    res.json(decoded.user); 
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});



app.listen(port, () => {
  console.log(`Auth-Service (Microservice 1) running on http://localhost:${port}`);
});