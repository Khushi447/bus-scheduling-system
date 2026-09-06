import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../api";
import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/users/me")
      .then((response) => setUser(response.data))
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#edf8ff,#eaf6ff,#dfeeff)]">
      <Navbar />

      <section className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-12 pt-28 md:px-6">
        <div
          data-reveal
          className="mb-10 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User"
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
          />
          <h2 className="m-0 text-2xl font-bold text-[#003d66]">{user?.name || "Loading profile..."}</h2>
          <p className="mt-1 text-base text-[#0077cc]">{user?.role || ""}</p>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <div
          data-reveal
          className="w-full max-w-2xl"
        >
          <details open className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
            <summary className="cursor-pointer list-none text-base font-bold text-[#004a70]">
              Personal Information
            </summary>
            <div className="mt-4 space-y-2 text-[#1f2937]">
              <p>
                <strong>Email:</strong> {user?.email || "Loading..."}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone || "Loading..."}
              </p>
              <p>
                <strong>Depot:</strong> {user?.depot || "Not assigned"}
              </p>
            </div>
          </details>

          <details className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
            <summary className="cursor-pointer list-none text-base font-bold text-[#004a70]">
              Recent Schedules
            </summary>
            <p className="mt-4 text-[#1f2937]">Schedules will appear here when assigned.</p>
          </details>

          <details className="overflow-hidden rounded-xl bg-white p-4 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
            <summary className="cursor-pointer list-none text-base font-bold text-[#004a70]">
              Preferences
            </summary>
            <p className="mt-4 text-[#1f2937]">No preferences have been saved.</p>
          </details>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Profile;