import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../api";

const inputClassName = "mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
const emptySchedule = { route: "", serviceDate: "", shift: "Morning", startTime: "", endTime: "", busNumber: "" };
const emptyAssignment = { schedule: "", crewMember: "", role: "Driver" };

function LinkedScheduling() {
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]);
  const [scheduleForm, setScheduleForm] = useState(emptySchedule);
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignment);
  const [isScheduler, setIsScheduler] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    const [routeResponse, scheduleResponse] = await Promise.all([apiFetch("/routes"), apiFetch("/schedules")]);
    setRoutes(routeResponse.data);
    setSchedules(scheduleResponse.data);
  };

  useEffect(() => {
    Promise.all([apiFetch("/users/me"), apiFetch("/routes"), apiFetch("/schedules")])
      .then(async ([userResponse, routeResponse, scheduleResponse]) => {
        const scheduler = userResponse.data.role === "Scheduler";
        setIsScheduler(scheduler);
        setRoutes(routeResponse.data);
        setSchedules(scheduleResponse.data);
        if (scheduler) setCrewMembers((await apiFetch("/users/crew")).data);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const updateForm = (setter) => (event) => setter((current) => ({ ...current, [event.target.name]: event.target.value }));

  const createSchedule = async (event) => {
    event.preventDefault();
    setError("");
    setFeedback("");
    try {
      await apiFetch("/schedules", { method: "POST", body: JSON.stringify(scheduleForm) });
      setScheduleForm(emptySchedule);
      await loadData();
      setFeedback("Schedule created successfully.");
    } catch (requestError) { setError(requestError.message); }
  };

  const assignCrew = async (event) => {
    event.preventDefault();
    setError("");
    setFeedback("");
    try {
      await apiFetch("/assignments", { method: "POST", body: JSON.stringify(assignmentForm) });
      setAssignmentForm(emptyAssignment);
      setFeedback("Crew member assigned successfully.");
    } catch (requestError) { setError(requestError.message); }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#edf8ff,#f4fbff,#e6f7ff)]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-28">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">Linked Scheduling</h1>
        <p className="mb-8 text-center text-slate-600">Manage schedules and assign crew using backend records.</p>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {feedback && <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{feedback}</p>}

        {isScheduler && <section className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={createSchedule} className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Create Schedule</h2>
            <label className="block text-sm font-medium">Route
              <select className={inputClassName} name="route" value={scheduleForm.route} onChange={updateForm(setScheduleForm)} required><option value="">Select a route</option>{routes.map((route) => <option key={route._id} value={route._id}>{route.code} - {route.name}</option>)}</select>
            </label>
            <label className="mt-4 block text-sm font-medium">Service date<input className={inputClassName} type="date" name="serviceDate" value={scheduleForm.serviceDate} onChange={updateForm(setScheduleForm)} required /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="mt-4 block text-sm font-medium">Shift<select className={inputClassName} name="shift" value={scheduleForm.shift} onChange={updateForm(setScheduleForm)}>{["Morning", "Afternoon", "Evening", "Night"].map((shift) => <option key={shift}>{shift}</option>)}</select></label>
              <label className="mt-4 block text-sm font-medium">Bus number<input className={inputClassName} name="busNumber" value={scheduleForm.busNumber} onChange={updateForm(setScheduleForm)} /></label>
              <label className="block text-sm font-medium">Start time<input className={inputClassName} type="time" name="startTime" value={scheduleForm.startTime} onChange={updateForm(setScheduleForm)} required /></label>
              <label className="block text-sm font-medium">End time<input className={inputClassName} type="time" name="endTime" value={scheduleForm.endTime} onChange={updateForm(setScheduleForm)} required /></label>
            </div>
            <button className="mt-5 w-full rounded-lg bg-sky-600 px-4 py-3 font-semibold text-white">Create Schedule</button>
          </form>

          <form onSubmit={assignCrew} className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Assign Crew</h2>
            <label className="block text-sm font-medium">Schedule<select className={inputClassName} name="schedule" value={assignmentForm.schedule} onChange={updateForm(setAssignmentForm)} required><option value="">Select a schedule</option>{schedules.map((schedule) => <option key={schedule._id} value={schedule._id}>{schedule.route?.code || "Route"} - {new Date(schedule.serviceDate).toLocaleDateString()}</option>)}</select></label>
            <label className="mt-4 block text-sm font-medium">Role<select className={inputClassName} name="role" value={assignmentForm.role} onChange={updateForm(setAssignmentForm)}><option>Driver</option><option>Conductor</option></select></label>
            <label className="mt-4 block text-sm font-medium">Crew member<select className={inputClassName} name="crewMember" value={assignmentForm.crewMember} onChange={updateForm(setAssignmentForm)} required><option value="">Select a crew member</option>{crewMembers.filter((member) => member.role === assignmentForm.role).map((member) => <option key={member._id} value={member._id}>{member.name} ({member.role})</option>)}</select></label>
            <button className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white">Assign Crew</button>
          </form>
        </section>}

        {!isScheduler && !error && <p className="rounded-lg bg-amber-50 p-4 text-center text-sm text-amber-800">Only Scheduler accounts can create schedules or assign crew.</p>}
        <section className="mt-8 rounded-xl bg-white p-6 shadow"><h2 className="mb-4 text-xl font-bold text-slate-800">Schedules</h2><div className="space-y-3">{schedules.map((schedule) => <div key={schedule._id} className="rounded-lg border border-slate-200 p-4 text-sm"><p className="font-semibold">{schedule.route?.code || "Route"} - {schedule.route?.name || ""}</p><p>{new Date(schedule.serviceDate).toLocaleDateString()} | {schedule.shift} | {schedule.startTime} - {schedule.endTime}</p><p>Status: {schedule.status}</p></div>)}{!schedules.length && <p className="text-sm text-slate-600">No schedules found.</p>}</div></section>
      </main>
      <Footer />
    </div>
  );
}

export default LinkedScheduling;
