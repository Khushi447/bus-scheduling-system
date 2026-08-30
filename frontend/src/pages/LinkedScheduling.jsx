import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LinkedScheduling() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("green");

  function checkOverlap(start1, end1, start2, end2) {
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);

    return s1 < e2 && e1 > s2;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const overlapExists = checkOverlap(startTime, endTime, "09:00", "13:00");

    if (overlapExists) {
      setFeedbackColor("red");
      setFeedback("❗ Overlapping shift detected. Please adjust timing or change Bus ID.");
    } else {
      setFeedbackColor("green");
      setFeedback("✅ Duty assigned successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#edf8ff,#f4fbff,#e6f7ff)]">
      <Navbar />

      <main className="mx-auto max-w-[600px] px-4 pb-12 pt-28">
        <section className="mb-8 rounded-xl border-l-[5px] border-[#0077cc] bg-[#eaf6ff] p-5">
          <h2 className="mb-2 text-lg font-bold text-[#0f172a]">
            Benefits of Linked Duty Scheduling
          </h2>
          <ul className="space-y-1 text-[#1f2937]">
            <li>✅ Better accountability</li>
            <li>✅ Reduced scheduling conflicts</li>
          </ul>
        </section>

        <h1 className="mb-6 text-center text-3xl font-bold text-[#0f172a]">
          Linked Duty Scheduling
        </h1>

        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-[0_0_18px_rgba(0,0,0,0.05)]">
          <label htmlFor="busId" className="mt-4 block font-medium text-[#1f2937] first:mt-0">
            Bus ID:
          </label>
          <input
            type="text"
            id="busId"
            required
            className="mt-2 w-full rounded-md border border-[#cbd5e1] bg-[#f9fcff] px-3 py-2.5 outline-none transition focus:border-[#0077cc] focus:ring-2 focus:ring-[#bfdbfe]"
          />

          <label htmlFor="driverId" className="mt-4 block font-medium text-[#1f2937]">
            Driver ID:
          </label>
          <input
            type="text"
            id="driverId"
            required
            className="mt-2 w-full rounded-md border border-[#cbd5e1] bg-[#f9fcff] px-3 py-2.5 outline-none transition focus:border-[#0077cc] focus:ring-2 focus:ring-[#bfdbfe]"
          />

          <label htmlFor="conductorId" className="mt-4 block font-medium text-[#1f2937]">
            Conductor ID:
          </label>
          <input
            type="text"
            id="conductorId"
            required
            className="mt-2 w-full rounded-md border border-[#cbd5e1] bg-[#f9fcff] px-3 py-2.5 outline-none transition focus:border-[#0077cc] focus:ring-2 focus:ring-[#bfdbfe]"
          />

          <label htmlFor="contact" className="mt-4 block font-medium text-[#1f2937]">
            Contact Details:
          </label>
          <input
            type="text"
            id="contact"
            required
            className="mt-2 w-full rounded-md border border-[#cbd5e1] bg-[#f9fcff] px-3 py-2.5 outline-none transition focus:border-[#0077cc] focus:ring-2 focus:ring-[#bfdbfe]"
          />

          <label htmlFor="shiftName" className="mt-4 block font-medium text-[#1f2937]">
            Shift Name:
          </label>
          <input
            type="text"
            id="shiftName"
            required
            className="mt-2 w-full rounded-md border border-[#cbd5e1] bg-[#f9fcff] px-3 py-2.5 outline-none transition focus:border-[#0077cc] focus:ring-2 focus:ring-[#bfdbfe]"
          />

          <label htmlFor="startTime" className="mt-4 block font-medium text-[#1f2937]">
            Start Time:
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="mt-2 w-full rounded-md border border-[#cbd5e1] bg-[#f9fcff] px-3 py-2.5 outline-none transition focus:border-[#0077cc] focus:ring-2 focus:ring-[#bfdbfe]"
          />

          <label htmlFor="endTime" className="mt-4 block font-medium text-[#1f2937]">
            End Time:
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="mt-2 w-full rounded-md border border-[#cbd5e1] bg-[#f9fcff] px-3 py-2.5 outline-none transition focus:border-[#0077cc] focus:ring-2 focus:ring-[#bfdbfe]"
          />

          <label htmlFor="breakTime" className="mt-4 block font-medium text-[#1f2937]">
            Break Times:
          </label>
          <input
            type="text"
            id="breakTime"
            placeholder="e.g., 1:00 PM - 1:30 PM"
            required
            className="mt-2 w-full rounded-md border border-[#cbd5e1] bg-[#f9fcff] px-3 py-2.5 outline-none transition focus:border-[#0077cc] focus:ring-2 focus:ring-[#bfdbfe]"
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-[#0077cc] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#005fa3]"
          >
            Assign
          </button>
        </form>

        <p className="mt-5 text-center font-bold" style={{ color: feedbackColor }}>
          {feedback}
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default LinkedScheduling;