import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

function Unlinked() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState(null);
  const [toast, setToast] = useState("");

  const [filters, setFilters] = useState({
    date: "",
    shift: "",
    depot: "",
    search: "",
  });

  const duties = [
    {
      id: "D-101",
      shift: "08:00 - 12:00",
      duration: "4 hrs",
      depot: "Depot A",
      vehicle: "Mini Bus",
    },
  ];

  const requestDuty = (id) => {
    setSelectedDuty(id);
    setModalOpen(true);
  };

  const confirmRequest = () => {
    setModalOpen(false);
    setToast(`Duty ID ${selectedDuty} has been requested. Await approval.`);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const clearFilters = () => {
    setFilters({
      date: "",
      shift: "",
      depot: "",
      search: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-[600px] px-4 pb-12 pt-28 sm:px-6">
        <div className="mb-3 text-sm text-slate-600">
          Home &gt; Scheduling &gt; Unlinked Duty Scheduling
        </div>

        <h1 className="mb-4 text-3xl font-bold text-sky-700">
          Unlinked Duty Scheduling
        </h1>

        <p className="mb-6 rounded-xl border-l-4 border-sky-500 bg-sky-50 px-4 py-3 text-sm text-slate-700">
          ✅ "Unlinked Duties" refers to driver/conductor shifts or duties that
          are not yet assigned to a specific route or schedule.
        </p>

        <section className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
          <input
            className={`${inputClassName} sm:col-span-2`}
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />

          <select
            className={inputClassName}
            value={filters.shift}
            onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
          >
            <option value="">All Shifts</option>
            <option>Morning</option>
            <option>Evening</option>
            <option>Night</option>
          </select>

          <select
            className={inputClassName}
            value={filters.depot}
            onChange={(e) => setFilters({ ...filters, depot: e.target.value })}
          >
            <option value="">All Depots</option>
            <option>Depot A</option>
            <option>Depot B</option>
            <option>Depot C</option>
          </select>

          <input
            className={`${inputClassName} sm:col-span-2`}
            type="text"
            placeholder="Search by Duty ID, Route..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 sm:col-span-2"
          >
            Clear Filters
          </button>
        </section>

        <section className="space-y-4">
          {duties.map((duty) => (
            <div
              className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm shadow-slate-200/60"
              key={duty.id}
            >
              <h3 className="mb-3 text-lg font-bold text-slate-800">
                Duty ID: {duty.id}
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p>Shift Time: {duty.shift}</p>
                <p>Duration: {duty.duration}</p>
                <p>Depot: {duty.depot}</p>
                <p>Vehicle: {duty.vehicle}</p>
                <p>
                  Status: <span className="font-bold text-red-500">Unassigned</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => requestDuty(duty.id)}
                className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                Request Duty
              </button>
            </div>
          ))}
        </section>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
              <p className="text-base text-slate-700">
                Are you sure you want to request Duty ID {selectedDuty}?
              </p>

              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={confirmRequest}
                  className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 right-6 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg animate-pulse">
            {toast}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Unlinked;