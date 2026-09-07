import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';

const storedUser = JSON.parse(localStorage.getItem("user") || "null");
document.documentElement.classList.toggle("dark", storedUser?.preferences?.theme === "dark");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);