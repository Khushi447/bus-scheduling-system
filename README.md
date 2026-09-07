# 🚌 Bus Scheduling and Route Management System

A full-stack web application designed to streamline bus scheduling, route optimization, and crew assignment operations. Built with a modern React frontend and a scalable Node.js/Express backend architecture.

---

## 📌 Features

* **Route Management:** Add, configure, and manage dynamic transit routes.
* **Smart Scheduling:** Linked and unlinked trip scheduling tools.
* **Crew Assignment:** Manage driver and conductor allocations across routes.
* **Modern UI/UX:** Responsive interface built with React, React Router, and Tailwind CSS.
* **User Profiles & Settings:** Account personalization and customizable system settings.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React, Vite, JavaScript (ES6+)
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM

### Backend *(In Progress / Ready)*
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose)

---

## 📂 Repository Structure

```text
bus-scheduling-system/
├── frontend/               # React + Vite client
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/          # View pages (Home, RouteManagement, CrewSelection, etc.)
│   │   ├── App.jsx         # App routing & setup
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                # Express API server (Controllers, Routes, Models)
├── .gitignore
└── README.md
```

## Local Development

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=<strong-secret>
JWT_ACCESS_EXPIRY=1d
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

Start the API with `npm run dev`. It runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start the frontend with `npm run dev`. It runs at `http://localhost:5173`.

## Deployment

The recommended setup is:

* **Backend:** Render Web Service
* **Frontend:** Vercel or Netlify
* **Database:** MongoDB Atlas
* **File uploads:** Cloudinary

### Deploy the backend

Create a Render Web Service connected to this repository:

```text
Root Directory: backend
Build Command: npm install
Start Command: node src/index.js
```

Add these environment variables in Render:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>
CORS_ORIGIN=https://<your-frontend-domain>
JWT_SECRET=<strong-secret>
JWT_ACCESS_EXPIRY=1d
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

Render provides `PORT` automatically. The backend connects to the `busscheduler` database defined in `backend/src/constants.js`. In MongoDB Atlas, create a database user and allow access from the deployed backend.

### Deploy the frontend

Create a Vercel project connected to this repository:

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Add this Vercel environment variable:

```env
VITE_API_URL=https://<your-backend-domain>/api/v1
```

After the frontend domain is available, update the backend `CORS_ORIGIN` value to that exact domain and redeploy the backend.

### Security notes

* Never commit `.env` files or put secrets in frontend variables.
* Revoke and regenerate any credentials that have been exposed before deployment.
* `VITE_API_URL` is visible in the browser bundle, so it should contain only the public API URL.