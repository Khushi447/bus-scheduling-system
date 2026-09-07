import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../api";

const inputClassName = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100";
const emptyFilters = { date: "", shift: "", depot: "", search: "" };

function Unlinked() {
  const [filters, setFilters] = useState(emptyFilters);
  const [duties, setDuties] = useState([]);
  const [selectedDuty, setSelectedDuty] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduler, setIsScheduler] = useState(false);
  const [crewMembers, setCrewMembers] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState({});

  useEffect(() => {
    apiFetch("/users/me")
      .then(async (response) => {
        const scheduler = response.data.role === "Scheduler";
        setIsScheduler(scheduler);
        if (scheduler) setCrewMembers((await apiFetch("/users/crew")).data);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const loadDuties = async () => {
    setIsLoading(true);
    setError("");
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });

    try {
      const response = await apiFetch(`/duties?${params.toString()}`);
      setDuties(response.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchDuties = async () => {
      setIsLoading(true);
      setError("");
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });

      try {
        const response = await apiFetch(`/duties?${params.toString()}`);
        if (!cancelled) setDuties(response.data);
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDuties();
    return () => { cancelled = true; };
  }, [filters]);

  const requestDuty = async () => {
    if (!selectedDuty) return;
    try {
      const response = await apiFetch(`/duties/${selectedDuty._id}/request`, { method: "POST" });
      setSelectedDuty(null);
      setToast(response.message);
      await loadDuties();
      window.setTimeout(() => setToast(""), 3000);
    } catch (requestError) {
      setSelectedDuty(null);
      setError(requestError.message);
    }
  };

  const updateDutyStatus = async (duty, status) => {
    try {
      await apiFetch(`/duties/${duty._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setToast(`Duty ${status.toLowerCase()} successfully.`);
      await loadDuties();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const assignDuty = async (duty) => {
    const member = crewMembers.find((crewMember) => crewMember._id === selectedCrew[duty._id]);
    if (!member) {
      setError("Select a crew member first.");
      return;
    }

    try {
      await apiFetch("/assignments", {
        method: "POST",
        body: JSON.stringify({ duty: duty._id, crewMember: member._id, role: member.role }),
      });
      setToast("Crew assigned successfully.");
      await loadDuties();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const clearFilters = () => setFilters(emptyFilters);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-[700px] px-4 pb-12 pt-28 sm:px-6">
        <div className="mb-3 text-sm text-slate-600">Home &gt; Scheduling &gt; Unlinked Duty Scheduling</div>
        <h1 className="mb-4 text-3xl font-bold text-sky-700">Unlinked Duty Scheduling</h1>
        <p className="mb-6 rounded-xl border-l-4 border-sky-500 bg-sky-50 px-4 py-3 text-sm text-slate-700">Browse unassigned duties and request an available shift.</p>

        <section className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
          <input className={inputClassName} type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} />
          <select className={inputClassName} value={filters.shift} onChange={(event) => setFilters({ ...filters, shift: event.target.value })}><option value="">All Shifts</option>{["Morning", "Afternoon", "Evening", "Night"].map((shift) => <option key={shift}>{shift}</option>)}</select>
          <input className={inputClassName} type="text" placeholder="Depot" value={filters.depot} onChange={(event) => setFilters({ ...filters, depot: event.target.value })} />
          <input className={inputClassName} type="text" placeholder="Search duty or vehicle" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
          <button type="button" onClick={clearFilters} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white sm:col-span-2">Clear Filters</button>
        </section>

        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {isLoading ? <p className="text-center text-slate-600">Loading duties...</p> : <section className="space-y-4">
          {duties.map((duty) => <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm" key={duty._id}>
            <h3 className="mb-3 text-lg font-bold text-slate-800">Duty ID: {duty.dutyId}</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <p>Date: {new Date(duty.serviceDate).toLocaleDateString()}</p>
              <p>Shift Time: {duty.startTime} - {duty.endTime}</p>
              <p>Shift: {duty.shift}</p><p>Depot: {duty.depot}</p><p>Vehicle: {duty.vehicle}</p>
              <p>Status: <span className="font-bold text-amber-600">{duty.status}</span></p>
            </div>
            {duty.status === "Unassigned" && <button type="button" onClick={() => setSelectedDuty(duty)} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white">Request Duty</button>}
            {isScheduler && duty.status === "Requested" && <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => updateDutyStatus(duty, "Approved")} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white">Approve</button>
              <button type="button" onClick={() => updateDutyStatus(duty, "Rejected")} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white">Reject</button>
            </div>}
            {isScheduler && duty.status === "Approved" && <div className="mt-4 flex gap-2">
              <select className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" value={selectedCrew[duty._id] || ""} onChange={(event) => setSelectedCrew({ ...selectedCrew, [duty._id]: event.target.value })}>
                <option value="">Select crew member</option>
                {crewMembers.map((member) => <option key={member._id} value={member._id}>{member.name} ({member.role})</option>)}
              </select>
              <button type="button" onClick={() => assignDuty(duty)} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white">Assign</button>
            </div>}
          </div>)}
          {!duties.length && <p className="text-center text-slate-600">No duties found.</p>}
        </section>}

        {selectedDuty && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"><p className="text-base text-slate-700">Request Duty ID {selectedDuty.dutyId}?</p><div className="mt-5 flex justify-center gap-3"><button type="button" onClick={requestDuty} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white">Confirm</button><button type="button" onClick={() => setSelectedDuty(null)} className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button></div></div></div>}
        {toast && <div className="fixed bottom-6 right-6 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">{toast}</div>}
      </main>
      <Footer />
    </div>
  );
}

export default Unlinked;
