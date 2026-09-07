import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiFetch } from "../api";

const inputClassName = "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
const emptyRoute = { name: "", code: "", origin: "", destination: "", distanceKm: "", estimatedDurationMinutes: "30", stops: "" };

function RouteManagement() {
  const mapRef = useRef(null);
  const routeLayersRef = useRef([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(emptyRoute);
  const [search, setSearch] = useState("");
  const [isScheduler, setIsScheduler] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadRoutes = async (searchValue = search) => {
    const query = searchValue ? `?search=${encodeURIComponent(searchValue)}` : "";
    const response = await apiFetch(`/routes${query}`);
    setRoutes(response.data);
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([25.5941, 85.1376], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(mapRef.current);
    }

    let cancelled = false;
    const fetchInitialData = async () => {
      try {
        const [userResponse, routeResponse] = await Promise.all([apiFetch("/users/me"), apiFetch("/routes")]);
        if (!cancelled) {
          setIsScheduler(userResponse.data.role === "Scheduler");
          setRoutes(routeResponse.data);
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      }
    };
    fetchInitialData();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    routeLayersRef.current.forEach((layer) => layer.remove());
    routeLayersRef.current = [];

    const bounds = [];
    routes.forEach((route, index) => {
      const coordinates = (route.stops || [])
        .filter((stop) => typeof stop.latitude === "number" && typeof stop.longitude === "number")
        .sort((first, second) => first.sequence - second.sequence)
        .map((stop) => [stop.latitude, stop.longitude]);

      if (coordinates.length < 2) return;
      const line = L.polyline(coordinates, { color: ["#0284c7", "#059669", "#dc2626", "#7c3aed"][index % 4], weight: 5 })
        .bindPopup(`${route.code} - ${route.name}`)
        .addTo(mapRef.current);
      routeLayersRef.current.push(line);
      bounds.push(...coordinates);
    });

    if (bounds.length > 1) mapRef.current.fitBounds(bounds, { padding: [24, 24] });
  }, [routes]);

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const createRoute = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSaving(true);
    const stops = form.stops.split(",").map((value, index) => {
      const [name, latitude, longitude] = value.split("|").map((part) => part.trim());
      return {
        name,
        sequence: index + 1,
        ...(latitude && longitude ? { latitude: Number(latitude), longitude: Number(longitude) } : {}),
      };
    }).filter((stop) => stop.name);

    try {
      await apiFetch("/routes", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          code: form.code,
          origin: form.origin,
          destination: form.destination,
          stops,
          distanceKm: form.distanceKm ? Number(form.distanceKm) : undefined,
          estimatedDurationMinutes: Number(form.estimatedDurationMinutes),
        }),
      });
      setForm(emptyRoute);
      await loadRoutes();
      setStatus("Route created successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deactivateRoute = async (routeId) => {
    try {
      await apiFetch(`/routes/${routeId}`, { method: "DELETE" });
      await loadRoutes();
      setStatus("Route deactivated successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearch(value);
    try {
      await loadRoutes(value);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-sky-700">Route Management</h1>
        <p className="mb-6 text-slate-600">Browse and manage routes stored in the backend.</p>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {status && <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{status}</p>}

        {isScheduler && <form onSubmit={createRoute} className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Add New Route</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Route name<input className={inputClassName} name="name" value={form.name} onChange={updateForm} required /></label>
            <label className="text-sm font-semibold text-slate-700">Code<input className={inputClassName} name="code" value={form.code} onChange={updateForm} placeholder="PAT-001" required /></label>
            <label className="text-sm font-semibold text-slate-700">Origin<input className={inputClassName} name="origin" value={form.origin} onChange={updateForm} required /></label>
            <label className="text-sm font-semibold text-slate-700">Destination<input className={inputClassName} name="destination" value={form.destination} onChange={updateForm} required /></label>
            <label className="text-sm font-semibold text-slate-700">Stops<input className={inputClassName} name="stops" value={form.stops} onChange={updateForm} placeholder="Name|latitude|longitude, Stop 2|lat|lng" /></label>
            <label className="text-sm font-semibold text-slate-700">Distance (km)<input className={inputClassName} type="number" min="0" step="0.1" name="distanceKm" value={form.distanceKm} onChange={updateForm} /></label>
            <label className="text-sm font-semibold text-slate-700">Duration (minutes)<input className={inputClassName} type="number" min="1" name="estimatedDurationMinutes" value={form.estimatedDurationMinutes} onChange={updateForm} required /></label>
          </div>
          <button disabled={isSaving} className="mt-5 rounded-lg bg-sky-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{isSaving ? "Saving..." : "Create Route"}</button>
        </form>}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold text-slate-800">Routes</h2><input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Search routes" value={search} onChange={handleSearch} /></div>
            <div className="space-y-3">{routes.map((route) => <article key={route._id} className="rounded-lg border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-slate-800">{route.code} - {route.name}</h3><p className="text-sm text-slate-600">{route.origin} to {route.destination}</p></div><span className={`rounded-full px-2 py-1 text-xs font-semibold ${route.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{route.isActive ? "Active" : "Inactive"}</span></div><p className="mt-2 text-sm text-slate-600">{route.distanceKm} km | {route.estimatedDurationMinutes} minutes</p><p className="mt-1 text-xs text-slate-500">Stops: {route.stops?.map((stop) => stop.name).join(", ") || "None"}</p>{isScheduler && route.isActive && <button type="button" onClick={() => deactivateRoute(route._id)} className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">Deactivate</button>}</article>)}{!routes.length && <p className="text-sm text-slate-600">No routes found.</p>}</div>
          </div>
          <div id="map" className="min-h-[420px] overflow-hidden rounded-xl shadow" />
        </section>
      </main>
    </div>
  );
}

export default RouteManagement;
