import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/CrewSelection.css";

function CrewSelection() {
  const navigate = useNavigate();

  return (
    
    <div className="page-wrapper">

      <Navbar />

      <main className="container">
        <h1>Hello Crew! 👋</h1>

        <p className="subtext">
          Choose what you'd like to do today. Everything’s set up to make your
          tasks easier.
        </p>

        <div className="options">

          <div
            className="card"
            onClick={() => navigate("/LinkedScheduling")}
            style={{ cursor: "pointer" }}
          >
            <h2>🔗 Linked Scheduling</h2>
            <p>
              View and manage your schedule linked with other team members.
              Perfect for connected routes and shifts.
            </p>
          </div>

          <div
            className="card"
            onClick={() => navigate("/Unlinked")}
            style={{ cursor: "pointer" }}
          >
            <h2>🔓 Unlinked Scheduling</h2>
            <p>
              Manage your personal schedule independently. Great for solo
              assignments or flexible shifts.
            </p>
          </div>

          <div
            className="card"
            onClick={() => navigate("/RouteManagement")}
            style={{ cursor: "pointer" }}
          >
            <h2>🗺️ Route Management</h2>
            <p>
              Organize or update your assigned routes and get insights for
              smoother journeys.
            </p>
          </div>

        </div>
      </main>

      <Footer />
      </div>
  );
}

export default CrewSelection;