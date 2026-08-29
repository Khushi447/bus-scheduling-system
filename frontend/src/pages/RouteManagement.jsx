import Navbar from "../components/Navbar";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/RouteManagement.css";

function RouteManagement() {
  const mapRef = useRef(null);

  const loadMockRoutes = () => {
    if (!mapRef.current) return;

    const route1 = L.polyline(
      [
        [25.5941, 85.1376],
        [25.6, 85.15],
        [25.605, 85.16],
      ],
      { color: "blue" }
    ).addTo(mapRef.current);

    route1.bindPopup("Route A");

    const route2 = L.polyline(
      [
        [25.5941, 85.1376],
        [25.59, 85.12],
        [25.585, 85.11],
      ],
      { color: "green" }
    ).addTo(mapRef.current);

    route2.bindPopup("Route B");
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([25.5941, 85.1376], 13);

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "&copy; OpenStreetMap contributors",
        }
      ).addTo(mapRef.current);

      loadMockRoutes();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const startDrawing = () => alert("Draw mode activated");
  const optimizeRoute = () => alert("Optimizing route...");
  const openNewRouteForm = () => alert("Add new route...");
  const showRouteList = () => alert("All routes...");
  const showOptimizationHistory = () => alert("History...");

  return (
    
  <div className="route-page">
    <Navbar />

    <div className="map-container">

      {/* Sidebar */}
      <div id="sidebar">
        <h3>Route Options</h3>
        <ul>
          <li onClick={showRouteList}>All Routes</li>
          <li onClick={openNewRouteForm}>Add New Route</li>
          <li onClick={showOptimizationHistory}>
            Optimization History
          </li>
        </ul>

        <button onClick={optimizeRoute}>Optimize Route</button>
      </div>

      {/* Map */}
      <div id="map"></div>

    </div>

    {/* Floating UI */}
    <div className="top-toolbar">
      <input type="text" placeholder="Search routes or stops..." />
    </div>

    <div className="legend-panel">
      <h4>Legend & Filters</h4>
      <label><input type="checkbox" defaultChecked /> High-frequency routes</label>
      <label><input type="checkbox" /> Overlapping routes</label>
      <label><input type="checkbox" /> Traffic density</label>
      <label><input type="checkbox" /> Demand zones</label>
    </div>

    <button className="draw-route-btn" onClick={startDrawing}>
      Draw New Route
    </button>
  </div>
);
}

export default RouteManagement;