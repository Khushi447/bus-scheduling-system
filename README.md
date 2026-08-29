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