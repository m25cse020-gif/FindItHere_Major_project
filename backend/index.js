require('dotenv').config(); // .env file se password padhne ke liye
const nodemailer = require('nodemailer'); // nodemailer ko import karein
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Item = require('./models/Item'); 
const { auth, admin } = require('./middleware/auth');
const multer = require('multer');
const path = require('path');


const app = express();
const port = 5000;



// --- MIDDLEWARE (Yeh zaroori hai) ---
app.use(cors()); // 2. App ko bataya ki CORS use karna hai
app.use(express.json()); // 3. App ko bataya ki JSON data (jo frontend se aayega) ko samajhna hai
app.use('/uploads', express.static('uploads'));

// --- Database Connection (Yeh pehle jaisa hai) ---
const mongoURI = "mongodb+srv://nishantchourasia:Nishant123@cluster0.ge5xjdc.mongodb.net/lostandfoundDB?appName=Cluster0";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Successfully connected to MongoDB!"))
.catch((err) => console.log("Failed to connect to MongoDB", err));


// --- Test Route (Yeh pehle jaisa hai) ---
app.get('/', (req, res) => {
  res.send('Hello from the Backend! CORS is working.');
});

// --- MULTER CONFIG (for File Uploads) ---
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Tell multer to save files in the 'uploads' folder
  },
  filename: function(req, file, cb) {
    // Create a unique filename to avoid conflicts
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

// This 'upload' variable is our file-handling middleware
const upload = multer({ storage: storage });
// ----------------------------------------

// --- API ROUTES ---

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
app.post('/api/auth/signup', async (req, res) => {
  
  // 1. Get data from the React form (it comes in 'req.body')
  const { name, email, mobile, password } = req.body;

  try {
    // 2. Check if user already exists
    let user = await User.findOne({ email: email });
    if (user) {
      // If user exists, send an error
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // 3. If user is new, create a new User object
    user = new User({
      name,
      email,
      mobile,
      password, // Plain password for now
      // 'role' will use the 'default: student' from your model
    });

    // 4. Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Create a 'salt'
    user.password = await bcrypt.hash(password, salt); // Re-assign password as a hashed one

    // 5. Save the new user to the database
    await user.save();

    // 6. Send a success response
    res.status(201).json({ msg: 'User registered successfully!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
app.post('/api/auth/login', async (req, res) => {
  
  // 1. Get email and password from React form
  const { email, password } = req.body;

  try {
    // 2. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      // If user not found, send error
      return res.status(400).json({ msg: 'Invalid credentials (user not found)' });
    }

    // 3. If user is found, compare the passwords
    // 'password' = plain text from form
    // 'user.password' = hashed password from database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // If passwords don't match, send error
      return res.status(400).json({ msg: 'Invalid credentials (password incorrect)' });
    }

    // 4. If passwords match, create a JWT Token (the digital I-card)
    const payload = {
      user: {
        id: user.id, // This saves the user's unique DB id into the token
        role: user.role // We can also save their role (e.g., 'admin')
      }
    };

// @route   POST /api/items/report
// @desc    Report a new lost or found item
// @access  Private (Needs a token)
app.post('/api/items/report', auth, upload.single('itemImage'), async (req, res) => {
  try {
    // 1. Get the item details
    const { itemName, category, location, description, itemType } = req.body;

    // 2. Get user info from 'auth' middleware
    const userId = req.user.id;
    const userRole = req.user.role; // <-- Humne user ka role bhi nikaal liya

    // 3. Naya item blueprint se banaya
    const newItem = new Item({
      itemName,
      category,
      location,
      description,
      itemType, 
      user: userId,
      status: 'Pending' // Default 'Pending'
    });

    // 4. --- YEH HAI NAYA LOGIC ---
    // Check karein ki kya user ek admin hai
    if (userRole === 'admin') {
      // Agar admin hai, toh status ko 'Approved' kar dein
      newItem.status = 'Approved';
      console.log('Admin reported an item. Auto-approving.');
    }
    // ----------------------------

    // 5. Check karein ki file upload hui hai
    if (req.file) {
      newItem.image = req.file.path; 
    }

    // 6. Item ko database mein save karein
    const savedItem = await newItem.save();

    // 7. React ko success ka response bhejein
    res.status(201).json(savedItem);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

    // 5. Sign the token
    // We need a "secret" key. For now, we'll just type one.
    jwt.sign(
      payload,
      'my-jwt-secret-key-12345', // <-- This is our secret key
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        // 6. Send the token back to the React app!
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/items/all
// @desc    Get all APPROVED items
// @access  Private (Needs a token)

app.get('/api/items/all', auth, async (req, res) => {
  //  ^
  //  |
  //  NOTICE: Yeh 'GET' request hai (data lene ke liye)
  //  Yeh bhi 'auth' se protected hai, toh user ka login hona zaroori hai.
  
  try {
    // 1. Database mein 'Item' model ko dhoondho
    const items = await Item.find({ 
      // 2. SABSE ZAROORI: Sirf un items ko laao...
      status: 'Approved' 
    })
    .sort({ date: -1 }); // Naye items sabse upar dikhenge

    // 3. Saare 'Approved' items ko list mein bhej do
    res.json(items);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/request-otp
// @desc    Register user (unverified), generate OTP, and send email
app.post('/api/auth/request-otp', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email: email });
    if (user && user.isVerified) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }
    
    // 2. Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user) {
      // Update existing (but unverified) user
      user.name = name;
      user.mobile = mobile;
      user.password = hashedPassword;
      user.otp = otp;
      user.isVerified = false;
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        mobile,
        password: hashedPassword,
        otp: otp,
        isVerified: false
      });
      await user.save();

      
      console.log("USER SAVED with OTP:", user.otp); 
    }
    
    // 4. --- YAHAN HAI ASLI EMAIL BHEJNE KA CODE ---
    // Create a "transporter" (the mailman)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Hum Gmail use kar rahe hain
      auth: {
        user: process.env.EMAIL_USER, // Yeh .env file se email lega
        pass: process.env.EMAIL_PASS  // Yeh .env file se App Password lega
      }
    });

    // 5. Define the email (the letter)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // User ka email (jo form se aaya)
      subject: 'Your OTP for Lost and Found Portal',
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for registering with the IIT Jodhpur Lost and Found Portal.</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="color: blue;">${otp}</h1>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      `
    };

    // 6. Send the email
    await transporter.sendMail(mailOptions);

    console.log(`OTP email sent to ${email}`);

    // 7. Success response bhejo
    res.status(201).json({ msg: 'OTP has been sent to your email. Please verify.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


    // @route   POST /api/auth/verify-otp
// @desc    Verify user's OTP and activate account
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // 1. User ko email se dhoondho
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found.' });
    }

    // 2. Check karo ki user pehle se verified toh nahi hai
    if (user.isVerified) {
      return res.status(400).json({ msg: 'User is already verified.' });
    }

    console.log("Database mein OTP:", user.otp);
    console.log("User ne daala OTP:", otp);
    console.log("Kya dono same hain?", user.otp === otp);

    // 3. OTP match karo
    if (user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP.' });
    }

    // 4. Sab sahi hai! Account 'chalu' (activate) karo
    user.isVerified = true;
    user.otp = null; // OTP ka kaam ho gaya, use hata do
    await user.save();

    // 5. Token (I-card) banao
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    // 6. --- YEH HAI FIX ---
    // Token create karte waqt error ko sahi se handle karenge
    jwt.sign(
      payload,
      'my-jwt-secret-key-12345',
      { expiresIn: '5h' },
      (err, token) => {
        // Yahan bug tha. Ab fix ho gaya hai.
        if (err) {
          console.error('JWT signing error:', err);
          return res.status(500).send('Server Error (Token Generation Failed)');
        }
        // Token bhejo!
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ===================================
//      ADMIN ROUTES
// ===================================

// @route   GET /api/admin/pending-items
// @desc    Get all items with "Pending" status
// @access  Admin Only
app.get('/api/admin/pending-items', [auth, admin], async (req, res) => {
  //  ^
  //  |
  //  NOTICE: We use both guards. First 'auth' (Are they logged in?)
  //  then 'admin' (Are they an admin?).

  try {
    const pendingItems = await Item.find({ status: 'Pending' })
      .sort({ date: -1 })
      .populate('user', 'name email'); // Also get the user's name and email

    res.json(pendingItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/approve-item/:id
// @desc    Approve an item
// @access  Admin Only
app.put('/api/admin/approve-item/:id', [auth, admin], async (req, res) => {
  try {
    // Find the item by its ID
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Update its status
    item.status = 'Approved';
    await item.save();

    res.json({ msg: 'Item approved successfully', item });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ===================================
//      USER'S OWN REPORTS
// ===================================

// @route   GET /api/items/my-reports
// @desc    Get all items reported by the logged-in user
// @access  Private
app.get('/api/items/my-reports', auth, async (req, res) => {
  try {
    // 1. We get the user's ID from the 'auth' middleware (from their token)
    const userId = req.user.id;

    // 2. We find all items where the 'user' field matches that ID
    const myItems = await Item.find({ user: userId }).sort({ date: -1 });

    // 3. We send that list back to the frontend
    res.json(myItems);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Server Start (Yeh pehle jaisa hai) ---
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});