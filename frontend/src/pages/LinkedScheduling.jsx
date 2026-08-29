import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LinkedScheduling.css";

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

  const overlapExists = checkOverlap(
    startTime,
    endTime,
    "09:00",
    "13:00"
  );

  if (overlapExists) {
    setFeedbackColor("red");
    setFeedback(
      "❗ Overlapping shift detected. Please adjust timing or change Bus ID."
    );
  } else {
    setFeedbackColor("green");
    setFeedback("✅ Duty assigned successfully!");
  }
};

  return (
    <div className="page-wrapper">
      <Navbar />

   <main className="container">
    <section className="benefits">
      <h2>Benefits of Linked Duty Scheduling</h2>
      <ul>
        <li>✅ Better accountability</li>
        <li>✅ Reduced scheduling conflicts</li>
      </ul>
    </section>

    <h1>Linked Duty Scheduling</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="busId">Bus ID:</label>
      <input type="text" id="busId" required />

      <label htmlFor="driverId">Driver ID:</label>
      <input type="text" id="driverId" required />

      <label htmlFor="conductorId">Conductor ID:</label>
      <input type="text" id="conductorId" required />

      <label htmlFor="contact">Contact Details:</label>
      <input type="text" id="contact" required />

      <label htmlFor="shiftName">Shift Name:</label>
      <input type="text" id="shiftName" required />

      <label htmlFor="startTime">Start Time:</label>
      <input
        type="time"
        id="startTime"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />

      <label htmlFor="endTime">End Time:</label>
      <input
        type="time"
        id="endTime"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />

      <label htmlFor="breakTime">Break Times:</label>
      <input type="text" id="breakTime" placeholder="e.g., 1:00 PM - 1:30 PM" required />

      <button type="submit">Assign</button>
    </form>

    <p
        className="feedback"
        style={{ color: feedbackColor , marginTop: "20px",}}
        >       
        {feedback}
    </p>
  </main>

      <Footer />
    </div>
  );
}

export default LinkedScheduling;