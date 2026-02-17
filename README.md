# Smart CCTV Service - Starter

## Prereqs
- Node.js
- MongoDB (local or Atlas)

## Setup backend
cd backend
npm install
Create a .env with:
PORT=5000
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<a_secret>

Start server:
npm run dev   (if nodemon installed) or npm start

## Frontend
Open frontend/index.html in browser. The frontend files call the backend at http://localhost:5000/api
You can also serve frontend via a static server, but opening files directly is fine for demo.

## Notes
- Create an admin user by registering then manually changing role to 'admin' in DB, or insert directly:
  In Mongo shell or MongoDB Compass, set user's role to 'admin'.