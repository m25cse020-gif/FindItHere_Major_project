# FindItHere: Campus Lost & Found Portal

FindItHere is a centralized digital solution designed for managing lost and found items at IIT Jodhpur. It leverages modern web technologies to provide a secure, reliable, and user-friendly platform for the campus community.

## Features

### User & Authentication

 * Secure Signup: Registration is restricted to the @iitj.ac.in email domain.
 * Real-Time OTP Verification: Prevents fake accounts by verifying email ownership via OTP sent using Nodemailer.
 * Secure Login: Uses JSON Web Tokens (JWT) for session management with a 5-hour expiration.
 * Password Security: User passwords are securely hashed using bcryptjs.
 * Dynamic Navbar: The interface adapts based on user login status and role (Student/Admin).
 * "My Reports" Page: Users can track the status (Pending/Approved) of their own reported items.

   
### Item Reporting & Management

 * Report Items: A protected form allows users to report "Lost" or "Found" items.
 * Image Upload: Users can upload images of items, which are stored securely on Cloudinary.
 * Search & Filter: A powerful search bar and category filters help users find items quickly.
 * Smart "Claim" Button: The UI changes based on item type ("Claim This Item" for Found, "I Found This Item" for Lost).
   
### Admin Panel & Approval System

 * Role-Based Access Control (RBAC): Distinct roles for Student and Admin.
 * Admin Approval Workflow: All user-reported items are saved as "Pending" and are invisible to the public until approved by an Admin.
 * Auto-Approval: Items reported by Admins are automatically approved.
 * Claim Verification: Admins can verify user claims and mark items as "Claimed," removing them from the public list but keeping a record.
   
### Tech Stack

 * Frontend: React.js, Tailwind CSS (or custom CSS)
 * Backend: Node.js, Express.js
 * Database: MongoDB Atlas
 * Authentication: JWT, Bcrypt.js
 * Email Service: Nodemailer (Gmail SMTP)
 * File Storage: Cloudinary
 * Containerization: Docker, Docker Compose
   
## Getting Started

Follow these instructions to set up the project locally using Docker.

Prerequisites

 * Git installed on your machine.
   
 * Docker Desktop installed and running.
   
1. Clone the Repository
```
git clone [https://github.com/m25cse020-gif/Lost-and-Found-Docker-Version.git](https://github.com/m25cse020-gif/Lost-and-Found-Docker-Version.git)
cd Lost-and-Found-Docker-Version
```

(Or navigating to your sde_major folder if you already have it)
2. Configure Environment Variables
Create a ```.env``` file in the root directory of the project and add your secrets:
### Database (MongoDB Atlas)
```
mongoURI=mongodb+srv://<username>:<password>@cluster...
```

### Nodemailer (Gmail) Credentials
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
```
### Cloudinary Credentials
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### JWT Secret
```
JWT_SECRET=your_super_secret_key
```

3. Run with Docker
Start the entire application (Frontend, Auth Service, Item Service) with a single command:
```
docker-compose up --build
```

Once the build is complete and the services are running, open your browser and go to:
```
http://localhost:3000
```
To stop the application, press ``` Ctrl + C ``` in the terminal.

##  Project Structure


The project follows a Microservices Architecture:

 * auth-service/: Handles user registration, login, and OTP verification. (Port 5001)
 * item-service/: Handles item reporting, image uploads, and retrieval. (Port 5002)
 * campus-lost-and-found/: The React frontend application served via NGINX. (Port 3000)
## Contributors
 * Mangalton Okram
 * Nishant Chourasia
