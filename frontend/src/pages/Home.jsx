import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Navbar />

      <section className="relative min-h-screen overflow-hidden pt-[120px]">
        <div className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center brightness-110 blur-[8px]" />
        <div className="absolute inset-0 -z-10 bg-white/10" />

        <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold leading-[1.1] text-[#00e6e6] drop-shadow-[1px_1px_5px_rgba(0,0,0,0.8)] md:text-7xl">
            Automated Bus Scheduling & Route Management
          </h1>

          <p className="mb-10 max-w-3xl text-lg font-light text-slate-100 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)] md:text-[1.75rem]">
            Welcome, crew members! This platform simplifies route and schedule planning to ensure your workday runs smoothly and efficiently.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/CrewSelection"
              className="rounded-full bg-[#03a9f4] px-8 py-4 text-lg font-semibold text-white shadow-[0_3px_12px_rgba(3,169,244,0.5)] transition hover:bg-[#0288d1] hover:shadow-[0_4px_20px_rgba(2,136,209,0.7)]"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="rounded-full bg-[#03a9f4] px-8 py-4 text-lg font-semibold text-white shadow-[0_3px_12px_rgba(3,169,244,0.5)] transition hover:bg-[#0288d1] hover:shadow-[0_4px_20px_rgba(2,136,209,0.7)]"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
        <div className="rounded-xl bg-[#121225] p-8 text-white shadow-[0_6px_20px_rgba(0,0,0,0.85)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,188,212,0.7)]">
          <h3 className="mb-4 text-2xl font-bold text-[#00bcd4]">Linked Scheduling</h3>
          <p className="text-base leading-7 text-slate-300">
            Synchronize driver and conductor duties to streamline daily operations and boost coordination.
          </p>
        </div>

        <div className="rounded-xl bg-[#121225] p-8 text-white shadow-[0_6px_20px_rgba(0,0,0,0.85)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,188,212,0.7)]">
          <h3 className="mb-4 text-2xl font-bold text-[#00bcd4]">Unlinked Scheduling</h3>
          <p className="text-base leading-7 text-slate-300">
            Empower individual control by allowing separate, customized schedule management.
          </p>
        </div>

        <div className="rounded-xl bg-[#121225] p-8 text-white shadow-[0_6px_20px_rgba(0,0,0,0.85)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,188,212,0.7)]">
          <h3 className="mb-4 text-2xl font-bold text-[#00bcd4]">Route Management</h3>
          <p className="text-base leading-7 text-slate-300">
            Plan and manage bus routes easily with integrated maps and live status tracking.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 text-center text-lg text-sky-100">
        <p className="leading-8 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.8)]">
          This system is designed with comfort in mind for all crew members. Clean layouts, fast navigation, and intuitive tools make your daily tasks easier than ever.
        </p>
      </section>

      <Footer />
    </>
  );
}

export default Home;