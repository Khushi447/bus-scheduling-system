import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const toggleAccordion = (index) => {
    setActiveAccordion((current) => (current === index ? null : index));
  };

  return (
    <>
      <Navbar />

      <main className="mt-[120px] min-h-screen px-4 py-16 md:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h1
            className="mb-5 text-center text-3xl font-bold text-[#0ea5e9] md:text-4xl"
            data-aos="fade-down"
          >
            Learn More About Us
          </h1>

          <p
            className="mx-auto mb-10 max-w-4xl text-center text-base leading-relaxed text-[#1f2d3d] md:text-lg"
            data-aos="fade-up"
          >
            Welcome to the <strong>Automated Bus Scheduling and Route Management System</strong> — a smart and intuitive platform for public transport optimization in Patna.
          </p>

          <div className="overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <div className="border-t border-[#ddd] first:border-t-0" data-aos="fade-up">
              <button
                className="flex w-full items-center gap-2 bg-[#e0f2fe] px-5 py-4 text-left text-lg font-bold text-[#0f172a] transition-colors duration-200 hover:bg-[#bae6fd]"
                onClick={() => toggleAccordion(0)}
              >
                <i className="fas fa-link"></i> Linked Duty Scheduling
              </button>
              <div
                className="overflow-hidden px-5 py-5"
                style={{
                  display: activeAccordion === 0 ? "block" : "none",
                  animation: "fadeIn 0.3s ease-in-out",
                }}
              >
                <img src="images/linked-duty.jpg" alt="Linked Duty" className="mb-4 w-full rounded-lg" />
                <p className="mb-3 text-[#1f2d3d]">
                  Linked Duty Scheduling pairs drivers and conductors into coordinated shifts for seamless operations. It helps with:
                </p>
                <ul className="list-disc space-y-2 pl-5 text-[#1f2d3d]">
                  <li>Improved accountability</li>
                  <li>Fewer conflicts</li>
                  <li>Smoother crew communication</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#ddd] first:border-t-0" data-aos="fade-up">
              <button
                className="flex w-full items-center gap-2 bg-[#e0f2fe] px-5 py-4 text-left text-lg font-bold text-[#0f172a] transition-colors duration-200 hover:bg-[#bae6fd]"
                onClick={() => toggleAccordion(1)}
              >
                <i className="fas fa-unlink"></i> Unlinked Duty Scheduling
              </button>
              <div
                className="overflow-hidden px-5 py-5"
                style={{
                  display: activeAccordion === 1 ? "block" : "none",
                  animation: "fadeIn 0.3s ease-in-out",
                }}
              >
                <img src="images/unlinked-duty.jpg" alt="Unlinked Duty" className="mb-4 w-full rounded-lg" />
                <p className="mb-3 text-[#1f2d3d]">
                  Unlinked Duties are shifts not tied to specific routes. Crew can browse and request these duties. Benefits include:
                </p>
                <ul className="list-disc space-y-2 pl-5 text-[#1f2d3d]">
                  <li>Flexible shift claiming</li>
                  <li>Dynamic calendar and filtering</li>
                  <li>Duty tracking by crew</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#ddd] first:border-t-0" data-aos="fade-up">
              <button
                className="flex w-full items-center gap-2 bg-[#e0f2fe] px-5 py-4 text-left text-lg font-bold text-[#0f172a] transition-colors duration-200 hover:bg-[#bae6fd]"
                onClick={() => toggleAccordion(2)}
              >
                <i className="fas fa-map-signs"></i> Route Management
              </button>
              <div
                className="overflow-hidden px-5 py-5"
                style={{
                  display: activeAccordion === 2 ? "block" : "none",
                  animation: "fadeIn 0.3s ease-in-out",
                }}
              >
                <img src="images/route-management.jpg" alt="Route Map" className="mb-4 w-full rounded-lg" />
                <p className="mb-3 text-[#1f2d3d]">
                  Route Management helps visualize and optimize city-wide routes with tools like:
                </p>
                <ul className="list-disc space-y-2 pl-5 text-[#1f2d3d]">
                  <li>Interactive Patna map</li>
                  <li>Draw &amp; define new paths</li>
                  <li>AI-based route optimization</li>
                  <li>Conflict resolution for overlaps</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#ddd] first:border-t-0" data-aos="fade-up">
              <button
                className="flex w-full items-center gap-2 bg-[#e0f2fe] px-5 py-4 text-left text-lg font-bold text-[#0f172a] transition-colors duration-200 hover:bg-[#bae6fd]"
                onClick={() => toggleAccordion(3)}
              >
                <i className="fas fa-cogs"></i> Our Services
              </button>
              <div
                className="overflow-hidden px-5 py-5"
                style={{
                  display: activeAccordion === 3 ? "block" : "none",
                  animation: "fadeIn 0.3s ease-in-out",
                }}
              >
                <img src="images/services.jpg" alt="Services" className="mb-4 w-full rounded-lg" />
                <p className="mb-3 text-[#1f2d3d]">
                  We provide tools that streamline public transportation planning:
                </p>
                <ul className="list-disc space-y-2 pl-5 text-[#1f2d3d]">
                  <li>Smart shift and route allocation</li>
                  <li>Live optimization dashboards</li>
                  <li>User role and security control</li>
                  <li>Clean, accessible UI for all stakeholders</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default About;