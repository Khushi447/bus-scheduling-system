import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function CrewSelection() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Linked Scheduling",
      emoji: "🔗",
      text: "View and manage your schedule linked with other team members. Perfect for connected routes and shifts.",
      route: "/LinkedScheduling",
    },
    {
      title: "Unlinked Scheduling",
      emoji: "🔓",
      text: "Manage your personal schedule independently. Great for solo assignments or flexible shifts.",
      route: "/Unlinked",
    },
    {
      title: "Route Management",
      emoji: "🗺️",
      text: "Organize or update your assigned routes and get insights for smoother journeys.",
      route: "/RouteManagement",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#e0f2ff,#dfeeff,#cfe9ff)]">
      <Navbar />

      <main className="flex w-full flex-1 items-center justify-center px-4 pb-12 pt-24 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1100px]">
          <h1 className="mb-3 text-center text-3xl font-bold text-[#1f2937] md:text-5xl">
            Hello Crew! 👋
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-center text-base text-[#4b5563] md:text-lg">
            Choose what you&apos;d like to do today. Everything&apos;s set up to make your tasks easier.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {cards.map(({ title, emoji, text, route }) => (
              <div
                key={title}
                className="group cursor-pointer rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)]"
                onClick={() => navigate(route)}
              >
                <h2 className="mb-3 text-xl font-bold text-[#1e3a8a]">
                  {emoji} {title}
                </h2>
                <p className="text-base leading-relaxed text-[#4b5563]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CrewSelection;