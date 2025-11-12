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




app.use(cors()); // 2. App ko bataya ki CORS use karna hai
app.use(express.json()); // 3. App ko bataya ki JSON data (jo frontend se aayega) ko samajhna hai
app.use('/uploads', express.static('uploads'));


const mongoURI = "mongodb+srv://nishantchourasia:Nishant123@cluster0.ge5xjdc.mongodb.net/lostandfoundDB?appName=Cluster0";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Successfully connected to MongoDB!"))
.catch((err) => console.log("Failed to connect to MongoDB", err));



app.get('/', (req, res) => {
  res.send('Hello from the Backend! CORS is working.');
});


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Tell multer to save files in the 'uploads' folder
  },
  filename: function(req, file, cb) {

    cb(null, Date.now() + '-' + file.originalname); 
  }
});


const upload = multer({ storage: storage });







app.post('/api/auth/signup', async (req, res) => {
  

  const { name, email, mobile, password } = req.body;

  try {

    let user = await User.findOne({ email: email });
    if (user) {

      return res.status(400).json({ msg: 'User already exists with this email' });
    }


    user = new User({
      name,
      email,
      mobile,
      password, // Plain password for now

    });


    const salt = await bcrypt.genSalt(10); // Create a 'salt'
    user.password = await bcrypt.hash(password, salt); // Re-assign password as a hashed one


    await user.save();


    res.status(201).json({ msg: 'User registered successfully!' });

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




    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(400).json({ msg: 'Invalid credentials (password incorrect)' });
    }


    const payload = {
      user: {
        id: user.id, // This saves the user's unique DB id into the token
        role: user.role // We can also save their role (e.g., 'admin')
      }
    };




app.post('/api/items/report', auth, upload.single('itemImage'), async (req, res) => {
  try {

    const { itemName, category, location, description, itemType } = req.body;


    const userId = req.user.id;
    const userRole = req.user.role; // <-- Humne user ka role bhi nikaal liya


    const newItem = new Item({
      itemName,
      category,
      location,
      description,
      itemType, 
      user: userId,
      status: 'Pending' // Default 'Pending'
    });



    if (userRole === 'admin') {

      newItem.status = 'Approved';
      console.log('Admin reported an item. Auto-approving.');
    }



    if (req.file) {
      newItem.image = req.file.path; 
    }


    const savedItem = await newItem.save();


    res.status(201).json(savedItem);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



    jwt.sign(
      payload,
      'my-jwt-secret-key-12345', // <-- This is our secret key
      { expiresIn: '5h' }, // Token expires in 5 hours
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






app.get('/api/items/all', auth, async (req, res) => {




  
  try {

    const items = await Item.find({ 

      status: 'Approved' 
    })
    .sort({ date: -1 }); // Naye items sabse upar dikhenge


    res.json(items);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



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

      
      console.log("USER SAVED with OTP:", user.otp); 
    }
    


    const transporter = nodemailer.createTransport({
      service: 'gmail', // Hum Gmail use kar rahe hain
      auth: {
        user: process.env.EMAIL_USER, // Yeh .env file se email lega
        pass: process.env.EMAIL_PASS  // Yeh .env file se App Password lega
      }
    });


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


    await transporter.sendMail(mailOptions);

    console.log(`OTP email sent to ${email}`);


    res.status(201).json({ msg: 'OTP has been sent to your email. Please verify.' });

  } catch (err) {
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

    console.log("Database mein OTP:", user.otp);
    console.log("User ne daala OTP:", otp);
    console.log("Kya dono same hain?", user.otp === otp);


    if (user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP.' });
    }


    user.isVerified = true;
    user.otp = null; // OTP ka kaam ho gaya, use hata do
    await user.save();


    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    


    jwt.sign(
      payload,
      'my-jwt-secret-key-12345',
      { expiresIn: '5h' },
      (err, token) => {

        if (err) {
          console.error('JWT signing error:', err);
          return res.status(500).send('Server Error (Token Generation Failed)');
        }

        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});








app.get('/api/admin/pending-items', [auth, admin], async (req, res) => {





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




app.put('/api/admin/approve-item/:id', [auth, admin], async (req, res) => {
  try {

    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }


    item.status = 'Approved';
    await item.save();

    res.json({ msg: 'Item approved successfully', item });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




app.put('/api/admin/claim-item/:id', [auth, admin], async (req, res) => {
  try {

    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }


    item.status = 'Claimed';
    await item.save();


    res.json({ msg: 'Item marked as Claimed', item });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});








app.get('/api/items/my-reports', auth, async (req, res) => {
  try {

    const userId = req.user.id;


    const myItems = await Item.find({ user: userId }).sort({ date: -1 });


    res.json(myItems);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});