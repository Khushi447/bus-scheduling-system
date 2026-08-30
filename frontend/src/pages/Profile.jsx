import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

function Profile() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#edf8ff,#eaf6ff,#dfeeff)]">
      <Navbar />

      <section className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-12 pt-28 md:px-6">
        <div
          data-reveal
          className={`mb-10 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-all duration-700 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User"
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
          />
          <h2 className="m-0 text-2xl font-bold text-[#003d66]">Mr.XYZ</h2>
          <p className="mt-1 text-base text-[#0077cc]">Driver / Conductor</p>
        </div>

        <div
          data-reveal
          className={`w-full max-w-2xl transition-all duration-700 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <details open className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
            <summary className="cursor-pointer list-none text-base font-bold text-[#004a70]">
              Personal Information
            </summary>
            <div className="mt-4 space-y-2 text-[#1f2937]">
              <p>
                <strong>Email:</strong> XYZ@example.com
              </p>
              <p>
                <strong>Phone:</strong> +91 9876543210
              </p>
              <p>
                <strong>Employee ID:</strong> BUS12345
              </p>
            </div>
          </details>

          <details className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
            <summary className="cursor-pointer list-none text-base font-bold text-[#004a70]">
              Recent Schedules
            </summary>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[#1f2937]">
              <li>Route 14A - 10th June | Morning Shift</li>
              <li>Route 7C - 12th June | Night Shift</li>
            </ul>
          </details>

          <details className="overflow-hidden rounded-xl bg-white p-4 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
            <summary className="cursor-pointer list-none text-base font-bold text-[#004a70]">
              Preferences
            </summary>
            <p className="mt-4 text-[#1f2937]">Prefers: Morning Shifts, Route 14B, Zone A</p>
          </details>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Profile;