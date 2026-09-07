import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { apiFetch } from "../api";

function Contacts() {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    setIsSubmitting(true);

    try {
      await apiFetch("/contacts", { method: "POST", body: JSON.stringify(formData) });
      setFormData({ name: "", email: "", message: "" });
      setStatus("Your message was sent successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "What is linked duty scheduling?",
      a: "Linked duty scheduling refers to assigning both driver and conductor as a team to a predefined shift and route.",
    },
    {
      q: "How do I request an unlinked duty?",
      a: "Go to the Unlinked Duty Scheduling page, filter or browse available shifts, and click 'Request'.",
    },
    {
      q: "Can I suggest a new route?",
      a: "Yes! Planners can use the 'Draw New Route' tool in the Route Management section.",
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#dfeeff,#bfe3ff,#8fd1ff)]">
      <Navbar />

      <div className="flex flex-1 flex-col gap-8 px-5 pb-10 pt-28 md:px-8">
        <section
          className="rounded-2xl bg-[#e0f2fe] px-6 py-10 text-center shadow-[0_8px_20px_rgba(14,116,144,0.08)]"
          data-aos="fade-down"
        >
          <h1 className="mb-3 text-3xl font-bold text-[#0f5d93] md:text-4xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-2xl text-base text-[#1f2d3d] md:text-lg">
            We&apos;re here to help you with all your bus scheduling and route management needs.
          </p>
        </section>

        <main className="mx-auto flex w-full max-w-6xl flex-wrap gap-10 px-0 py-4">
          <div className="min-w-[300px] flex-1 rounded-2xl bg-white/80 p-6 shadow-[0_8px_20px_rgba(0,0,0,0.06)]" data-aos="fade-up">
            <h2 className="mb-5 text-2xl font-bold text-[#004d80]">📩 Send Us a Message</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              {status && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{status}</p>}
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-3 text-base text-[#0f172a] outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#bae6fd]"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-3 text-base text-[#0f172a] outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#bae6fd]"
              />
              <textarea
                rows="5"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-3 text-base text-[#0f172a] outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#bae6fd]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#0099cc] px-6 py-3 font-semibold text-white transition hover:bg-[#0284c7]"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>

          <div className="min-w-[300px] flex-1 rounded-2xl bg-white/80 p-6 shadow-[0_8px_20px_rgba(0,0,0,0.06)]" data-aos="fade-left">
            <h2 className="mb-5 text-2xl font-bold text-[#004d80]">📞 Contact Info</h2>
            <div className="space-y-3 text-base text-[#1f2d3d]">
              <p>
                <strong>Email:</strong> support@busmanager.in
              </p>
              <p>
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p>
                <strong>Address:</strong> Bus Scheduling HQ, Patna City, Bihar
              </p>
            </div>
          </div>
        </main>

        <section className="w-full bg-white/20 px-4 py-10" data-aos="fade-up">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#0f5d93]">
            ❓ Frequently Asked Questions
          </h2>

          <div className="mx-auto max-w-4xl space-y-3">
            {faqs.map((item, index) => (
              <div key={index} className="rounded-xl bg-white/80 shadow-sm">
                <button
                  className="w-full rounded-xl bg-white/90 px-5 py-4 text-left text-base font-semibold text-[#0f172a] transition hover:bg-[#d4f0ff]"
                  onClick={() => toggleAccordion(index)}
                >
                  {item.q}
                </button>

                <div
                  className="rounded-b-xl bg-[#f0faff] px-5 py-4 text-[#1f2d3d]"
                  style={{
                    display: openIndex === index ? "block" : "none",
                  }}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Contacts;