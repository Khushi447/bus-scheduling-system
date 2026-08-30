import Navbar from "../components/Navbar";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
    <div className="relative min-h-screen bg-slate-100">
      <Navbar />

      <div className="mt-20 flex h-[calc(100vh-80px)] w-full overflow-hidden">
        <aside className="w-full max-w-[250px] border-r border-sky-200 bg-sky-50 p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-sky-700">Route Options</h3>
          <ul className="space-y-2 text-sm text-sky-900">
            <li
              className="cursor-pointer rounded-md px-2 py-2 transition hover:bg-sky-100"
              onClick={showRouteList}
            >
              All Routes
            </li>
            <li
              className="cursor-pointer rounded-md px-2 py-2 transition hover:bg-sky-100"
              onClick={openNewRouteForm}
            >
              Add New Route
            </li>
            <li
              className="cursor-pointer rounded-md px-2 py-2 transition hover:bg-sky-100"
              onClick={showOptimizationHistory}
            >
              Optimization History
            </li>
          </ul>

          <button
            type="button"
            onClick={optimizeRoute}
            className="mt-6 w-full rounded-lg bg-sky-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Optimize Route
          </button>
        </aside>

        <div className="relative flex-1">
          <div id="map" className="h-full w-full min-h-[500px]" />

          <div className="absolute left-1/2 top-5 z-[500] w-[min(90%,420px)] -translate-x-1/2">
            <input
              type="text"
              placeholder="Search routes or stops..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-lg outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="absolute bottom-5 left-5 z-[500] rounded-xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 shadow-lg backdrop-blur-sm">
            <h4 className="mb-2 font-bold text-slate-800">Legend & Filters</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-sky-600" />
                High-frequency routes
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 accent-sky-600" />
                Overlapping routes
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 accent-sky-600" />
                Traffic density
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 accent-sky-600" />
                Demand zones
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={startDrawing}
            className="absolute right-5 top-20 z-[1000] rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
          >
            Draw New Route
          </button>
        </div>
      </div>
    </div>
  );
}

export default RouteManagement;