FindItHere: Campus Lost & Found Portal
A MERN-stack microservice application (with Docker) for managing lost and found items at IIT Jodhpur.

Prerequisites
Before you begin, you will need:

Git (to clone the repository).

Docker Desktop (must be installed and running on your machine).

A .env file (see setup below).

1. Setup the .env file
In the main project folder (sde_major), create a file named .env and paste in your secret keys.

Code snippet


mongoURI=YOUR_MONGODB_CONNECTION_STRING


EMAIL_USER=YOUR_GMAIL_ADDRESS
EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD


CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
2. Run the Project (One Command)
Clone the repository:

Bash

git clone https://github.com/m25cse020-gif/Lost-and-Found-Docker-Version.git
Navigate to the project directory:

Bash

cd sde_major
Run Docker Compose: (Make sure Docker Desktop is open and running first!)

Bash

docker-compose up --build
3. Access the Application
That's it! Your entire application (all 3 services) is now running.

Frontend App: Open your browser to http://localhost:3000

To stop all services, just press Ctrl + C in your terminal.