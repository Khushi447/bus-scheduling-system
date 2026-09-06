import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { apiFetch, setAuthSession } from "../api";

const inputClassName =
  "mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

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
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = { ...formData };
      delete registrationData.confirmPassword;
      const response = await apiFetch("/users/register", {
        method: "POST",
        body: JSON.stringify(registrationData),
      });
      setAuthSession(response.data);
      window.location.href = "/";
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-4 pb-10 pt-28 sm:px-6 lg:px-8">
        <section
          className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 sm:p-8"
          data-aos="fade-up"
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-sky-700">
              👤 Create Your Account
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Join our system to manage your duties and schedules efficiently.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                className={inputClassName}
                type="text"
                name="name"
                placeholder="Your full name"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                className={inputClassName}
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <input
                className={inputClassName}
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                className={inputClassName}
                type="password"
                name="password"
                placeholder="Create password"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <input
                className={inputClassName}
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-sky-200 bg-sky-50/60">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-sky-800 transition hover:bg-sky-100"
                onClick={() => setAccordionOpen(!accordionOpen)}
              >
                <span className="flex items-center gap-2">ℹ️ Additional Info</span>
                <span className="text-lg leading-none">
                  {accordionOpen ? "−" : "+"}
                </span>
              </button>

              {accordionOpen && (
                <div className="space-y-4 border-t border-sky-200 bg-sky-50/80 p-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Role
                    </label>
                    <select
                      className={`${inputClassName} appearance-none`}
                      name="role"
                      onChange={handleChange}
                      value={formData.role}
                    >
                      <option>Driver</option>
                      <option>Conductor</option>
                      <option>Scheduler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Depot
                    </label>
                    <input
                      className={inputClassName}
                      type="text"
                      name="depot"
                      placeholder="Depot name or ID"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-sky-600 px-4 py-3 text-base font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Signup;