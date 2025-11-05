Bilkul! Ek achhi README file project ke liye bahut zaroori hoti hai.

Yeh lijiye, aapke project ke liye ek complete README.md file. Ismein aapke saare features (OTP, Admin, Image Upload) shaamil hain.

Aap bas is poore text ko copy karke apne project folder mein README.md naam ki file bana kar paste kar sakte hain.

FindItHere: Campus Lost & Found Portal
A centralized digital solution for managing lost and found items at IIT Jodhpur using modern web technologies.

by Mangalton Okram, Nishant Chourasia Under the guidance of Prof. Sumit Kalra

🚀 Features
This portal is built with a complete MERN stack and includes robust features for users, and a full approval system for admins.

👤 User & Authentication
Secure Signup: New user registration with real email OTP verification (using Nodemailer).

JWT Authentication: Secure login using JSON Web Tokens (JWT) with 5-hour expiration.

Password Hashing: Passwords are never saved as plain text; they are hashed using bcryptjs.

Dynamic Navbar: The navigation bar intelligently changes, showing "Login/Signup" to guests and "My Reports/Logout" to logged-in users.

"My Reports" Page: A private page where users can track the status (Pending/Approved) of all items they have personally reported.

📦 Item & Reporting
Report Items: Logged-in users can report lost or found items through a dedicated, protected form.

Image Upload: Users can (optionally) upload an image of the item (multer for file handling).

View All Items: A central page to view all Approved items.

Search & Filter: Users can instantly search the "View All" list by name/description or filter by category (e.g., 'Electronics') and type ('Lost'/'Found').

Smart "Claim" Button: The 'View' page shows a different button and instructions depending on whether an item is 'Lost' or 'Found'.

👑 Admin Panel & Security
Role-Based Access: The system differentiates between student and admin roles.

Admin-Only Panel: A secure /admin route, protected by middleware, is only visible and accessible to admin users.

Approval System: Admins can view a list of all "Pending" items and click "Approve" to make them public.

Auto-Approval: Items reported by an admin are automatically approved to save time.

🛠️ Technology Stack
Frontend: React.js, React Router, Axios, jwt-decode

Backend: Node.js, Express.js

Database: MongoDB Atlas (connected with Mongoose)

Key Backend Packages:

jsonwebtoken & bcryptjs: For authentication & security.

nodemailer: For sending real email OTPs.

multer: For handling image file uploads.

cors, dotenv: For server configuration and security.

🏁 Getting Started
To run this project locally, you will need to set up both the backend server and the frontend client.

Prerequisites
Node.js (v14 or later)

NPM

A free MongoDB Atlas account

A Gmail account with a generated "App Password" (for nodemailer).

1. Backend Setup
Clone the repository (or use your folder)

Navigate to the backend folder:

Bash

cd backend
Install dependencies:

Bash

npm install
Create a .env file in the backend folder. This is the most important step. Paste the following and fill in your details:

Code snippet

# MongoDB Atlas Connection String
mongoURI=mongodb+srv://<your-username>:<your-password>@cluster...

# Nodemailer (Gmail) Credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password

# JWT Secret (Make this a long, random string)
JWT_SECRET=MY_PROJECT_IS_SECRET_12345
Update index.js and middleware/auth.js:

Find the line jwt.sign(...) in index.js and auth.js.

Replace the hardcoded secret 'my-jwt-secret-key-12345' with process.env.JWT_SECRET. This is much more secure.

Start the server:

Bash

npm start
The server will be running on http://localhost:5000.

2. Frontend Setup
Open a new terminal.

Navigate to the campus-lost-and-found (frontend) folder:

Bash

cd campus-lost-and-found
Install dependencies:

Bash

npm install
Start the client:

Bash

npm start
The React app will open on http://localhost:3000.

You can now use the fully functional application!