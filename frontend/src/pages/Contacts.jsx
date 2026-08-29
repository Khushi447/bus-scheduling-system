import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import "../styles/Contacts.css";
import AOS from "aos";
import "aos/dist/aos.css";

function Contacts() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "What is linked duty scheduling?",
      a: "Linked duty scheduling refers to assigning both driver and conductor as a team to a predefined shift and route."
    },
    {
      q: "How do I request an unlinked duty?",
      a: "Go to the Unlinked Duty Scheduling page, filter or browse available shifts, and click 'Request'."
    },
    {
      q: "Can I suggest a new route?",
      a: "Yes! Planners can use the 'Draw New Route' tool in the Route Management section."
    }
  ];

  return (
    <div className="contact-page">
        <Navbar/>

      {/* HERO */}
      <div className="contact-content">
      <section className="hero" data-aos="fade-down">
        <h1>Contact Us</h1>
        <p>
          We're here to help you with all your bus scheduling and route management needs.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <main className="contact-section">

        <div className="contact-form" data-aos="fade-up">
          <h2>📩 Send Us a Message</h2>

          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows="5" placeholder="Your Message" required />
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>

        <div className="contact-info" data-aos="fade-left">
          <h2>📞 Contact Info</h2>
          <p><strong>Email:</strong> support@busmanager.in</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Address:</strong> Bus Scheduling HQ, Patna City, Bihar</p>
        </div>

      </main>

      {/* FAQ SECTION */}
      <section className="faq" data-aos="fade-up">
        <h2>❓ Frequently Asked Questions</h2>

        <div className="accordion-container">
          {faqs.map((item, index) => (
            <div className="accordion-item" key={index}>
              
              <button
                className="accordion-btn"
                onClick={() => toggleAccordion(index)}
              >
                {item.q}
              </button>

              <div
                className="accordion-content"
                style={{
                  display: openIndex === index ? "block" : "none"
                }}
              >
                <p>{item.a}</p>
              </div>

            </div>
          ))}
        </div>
      </section>
        </div>
    <Footer/>
    </div>
  );
}

export default Contacts;