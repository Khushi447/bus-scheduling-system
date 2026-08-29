import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import "../styles/Unlinked.css";

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

    <div className="page-wrapper">
      <Navbar />
      <main className="container">
        <div className="breadcrumb">
          Home &gt; Scheduling &gt; Unlinked Duty Scheduling
        </div>

        <h1>Unlinked Duty Scheduling</h1>

        <p className="definition">
          ✅ "Unlinked Duties" refers to driver/conductor shifts or duties that
          are not yet assigned to a specific route or schedule.
        </p>

        {/* FILTERS */}
        <section className="filter-panel">
          <input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
          />

          <select
            value={filters.shift}
            onChange={(e) =>
              setFilters({ ...filters, shift: e.target.value })
            }
          >
            <option value="">All Shifts</option>
            <option>Morning</option>
            <option>Evening</option>
            <option>Night</option>
          </select>

          <select
            value={filters.depot}
            onChange={(e) =>
              setFilters({ ...filters, depot: e.target.value })
            }
          >
            <option value="">All Depots</option>
            <option>Depot A</option>
            <option>Depot B</option>
            <option>Depot C</option>
          </select>

          <input
            type="text"
            placeholder="Search by Duty ID, Route..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />

          <button onClick={clearFilters}>Clear Filters</button>
        </section>

        {/* DUTY LIST */}
        <section className="duty-list">
          {duties.map((duty) => (
            <div className="duty-card" key={duty.id}>
              <h3>Duty ID: {duty.id}</h3>
              <p>Shift Time: {duty.shift}</p>
              <p>Duration: {duty.duration}</p>
              <p>Depot: {duty.depot}</p>
              <p>Vehicle: {duty.vehicle}</p>
              <p>
                Status: <span className="status unassigned">Unassigned</span>
              </p>

              <button onClick={() => requestDuty(duty.id)}>
                Request Duty
              </button>
            </div>
          ))}
        </section>

        {/* MODAL */}
        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <p>
                Are you sure you want to request Duty ID {selectedDuty}?
              </p>

              <button onClick={confirmRequest}>Confirm</button>
              <button onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && <div className="toast">{toast}</div>}

      </main>
      <Footer />
      </div>
  );
}

export default Unlinked;