import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Signup.css";

function Signup() {
  const [accordionOpen, setAccordionOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Driver",
    depot: "",
  });

  useEffect(() => {
    AOS.init();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Signup Data:", formData);
    alert("Account created successfully!");
  };

  return (

      <>
    <Navbar />

      <section className="signup-section" data-aos="fade-up">
        <h1>👤 Create Your Account</h1>
        <p>Join our system to manage your duties and schedules efficiently.</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={handleChange}
              required
            />
          </div>

          {/* ACCORDION */}
          <div className="accordion">
            <button
              type="button"
              className="accordion-btn"
              onClick={() => setAccordionOpen(!accordionOpen)}
            >
              ℹ️ Additional Info
            </button>

            {accordionOpen && (
              <div className="accordion-panel">
                <label>Role</label>
                <select
                  name="role"
                  onChange={handleChange}
                  value={formData.role}
                >
                  <option>Driver</option>
                  <option>Conductor</option>
                  <option>Scheduler</option>
                </select>

                <label>Depot</label>
                <input
                  type="text"
                  name="depot"
                  placeholder="Depot name or ID"
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
      </section>

      <Footer />

      </>

  );
}

export default Signup;