import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import "../styles/Profile.css";

function Profile() {
  useEffect(() => {
    const reveals = document.querySelectorAll("[data-reveal]");

    const revealOnScroll = () => {
      reveals.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
        }
      });
    };

    // initial setup
    reveals.forEach((el) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(30px)";
      el.style.transition = "0.6s ease-out";
    });

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <div className="page-wrapper">

    <Navbar/>

    <section className="profile-container">
      <div className="profile-card" data-reveal>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="User"
          className="avatar"
        />
        <h2 className="username">Mr.XYZ</h2>
        <p className="role">Driver / Conductor</p>
      </div>

      <div className="profile-details" data-reveal>
        <details open>
          <summary>Personal Information</summary>
          <p><strong>Email:</strong> XYZ@example.com</p>
          <p><strong>Phone:</strong> +91 9876543210</p>
          <p><strong>Employee ID:</strong> BUS12345</p>
        </details>

        <details>
          <summary>Recent Schedules</summary>
          <ul>
            <li>Route 14A - 10th June | Morning Shift</li>
            <li>Route 7C - 12th June | Night Shift</li>
          </ul>
        </details>

        <details>
          <summary>Preferences</summary>
          <p>Prefers: Morning Shifts, Route 14B, Zone A</p>
        </details>
      </div>
    </section>
    <Footer/>
    </div>
  );
}

export default Profile;