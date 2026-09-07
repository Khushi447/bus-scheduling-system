import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../api";

const roles = ["Driver", "Conductor", "Scheduler", "Admin"];

function Admin() {
  const [users, setUsers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const response = await apiFetch("/users/admin/users");
      setUsers(response.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        const [usersResponse, messagesResponse] = await Promise.all([
          apiFetch("/users/admin/users"),
          apiFetch("/contacts"),
        ]);
        if (!cancelled) {
          setUsers(usersResponse.data);
          setContactMessages(messagesResponse.data);
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();
    return () => { cancelled = true; };
  }, []);

  const changeRole = async (userId, role) => {
    setError("");
    setMessage("");
    try {
      await apiFetch(`/users/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setMessage("User role updated successfully.");
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-12 pt-28 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-sky-700">Admin Role Management</h1>
        <p className="mb-6 text-slate-600">Manage access levels for registered users.</p>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {loading ? <p>Loading users...</p> : <div className="overflow-x-auto rounded-xl bg-white shadow"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-700"><tr><th className="p-4">User</th><th className="p-4">Email</th><th className="p-4">Depot</th><th className="p-4">Role</th></tr></thead><tbody>{users.map((user) => <tr key={user._id} className="border-t border-slate-200"><td className="p-4 font-semibold">{user.name}</td><td className="p-4">{user.email}</td><td className="p-4">{user.depot || "Not assigned"}</td><td className="p-4"><select className="rounded-lg border border-slate-300 px-3 py-2" value={user.role} onChange={(event) => changeRole(user._id, event.target.value)}>{roles.map((role) => <option key={role}>{role}</option>)}</select></td></tr>)}</tbody></table></div>}

        <section className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Contact Messages</h2>
          <div className="space-y-3">
            {contactMessages.map((contact) => (
              <article key={contact._id} className="rounded-lg border border-slate-200 p-4 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-semibold">{contact.name} &lt;{contact.email}&gt;</p>
                  <span className="text-slate-500">{new Date(contact.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-slate-700">{contact.message}</p>
                <p className="mt-2 text-xs font-semibold text-sky-700">Status: {contact.status}</p>
              </article>
            ))}
            {!contactMessages.length && <p className="text-sm text-slate-600">No contact messages yet.</p>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Admin;
