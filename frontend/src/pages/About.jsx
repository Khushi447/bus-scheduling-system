import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/About.css";

function About() {
    const [activeAccordion, setActiveAccordion] = useState(null);

useEffect(() => {
    AOS.init({
        duration: 800,
        once: true,
    });
}, []);

const toggleAccordion = (index) => {
    if (activeAccordion === index) {
        setActiveAccordion(null);
    } else {
        setActiveAccordion(index);
    }
};

    return (
        <>
            <Navbar />

            <main className="about-container">
    <h1 data-aos="fade-down">Learn More About Us</h1>
    <p class="intro" data-aos="fade-up">
      Welcome to the <strong>Automated Bus Scheduling and Route Management System</strong> — a smart and intuitive platform for public transport optimization in Patna.
    </p>

    <div className="accordion-container">
      {/* Linked Duty */}
      <div className="accordion-item" data-aos="fade-up">
        <button className="accordion-btn" onClick={() => toggleAccordion(0)}>
          <i className="fas fa-link"></i> Linked Duty Scheduling
        </button>
        <div
    className="accordion-content"
    style={{
        display: activeAccordion === 0 ? "block" : "none",
    }}
>
          <img src="images/linked-duty.jpg" alt="Linked Duty" />
          <p>Linked Duty Scheduling pairs drivers and conductors into coordinated shifts for seamless operations. It helps with:</p>
          <ul>
            <li>Improved accountability</li>
            <li>Fewer conflicts</li>
            <li>Smoother crew communication</li>
          </ul>
        </div>
      </div>

      {/* Unlinked Duty */}
      <div className="accordion-item" data-aos="fade-up">
        <button className="accordion-btn" onClick={() => toggleAccordion(1)}>
          <i className="fas fa-unlink"></i> Unlinked Duty Scheduling
        </button>
        <div
    className="accordion-content"
    style={{
        display: activeAccordion === 1 ? "block" : "none",
    }}
>
          <img src="images/unlinked-duty.jpg" alt="Unlinked Duty" />
          <p>Unlinked Duties are shifts not tied to specific routes. Crew can browse and request these duties. Benefits include:</p>
          <ul>
            <li>Flexible shift claiming</li>
            <li>Dynamic calendar and filtering</li>
            <li>Duty tracking by crew</li>
          </ul>
        </div>
      </div>

      {/* Route Management */}
      <div className="accordion-item" data-aos="fade-up">
        <button className="accordion-btn" onClick={() => toggleAccordion(2)}>
          <i className="fas fa-map-signs"></i> Route Management
        </button>
        <div
    className="accordion-content"
    style={{
        display: activeAccordion === 2 ? "block" : "none",
    }}
>
          <img src="images/route-management.jpg" alt="Route Map" />
          <p>Route Management helps visualize and optimize city-wide routes with tools like:</p>
          <ul>
            <li>Interactive Patna map</li>
            <li>Draw & define new paths</li>
            <li>AI-based route optimization</li>
            <li>Conflict resolution for overlaps</li>
          </ul>
        </div>
      </div>

      {/* Services */}
      <div className="accordion-item" data-aos="fade-up">
        <button className="accordion-btn" onClick={() => toggleAccordion(3)}>
          <i className="fas fa-cogs"></i> Our Services
        </button>
        <div
    className="accordion-content"
    style={{
        display: activeAccordion === 3 ? "block" : "none",
    }}
>
          <img src="images/services.jpg" alt="Services" />
          <p>We provide tools that streamline public transportation planning:</p>
          <ul>
            <li>Smart shift and route allocation</li>
            <li>Live optimization dashboards</li>
            <li>User role and security control</li>
            <li>Clean, accessible UI for all stakeholders</li>
          </ul>
        </div>
      </div>
    </div>
  </main>

            <Footer />
        </>
    );
}

export default About;