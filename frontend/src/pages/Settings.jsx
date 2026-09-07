import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { apiFetch } from "../api";
import { setLanguage, useLanguage } from "../i18n";

const inputClassName =
  "mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition duration-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

const tabButtonClass =
  "rounded-xl border px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-200";

function Settings() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({ name: "", phone: "", depot: "", profileImage: "" });
  const [preferences, setPreferences] = useState({ theme: "light", language: "en", emailAlerts: true, smsAlerts: true });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    AOS.init();

    apiFetch("/users/me")
      .then((response) => {
        const user = response.data;
        setProfile({
          name: user.name || "",
          phone: user.phone || "",
          depot: user.depot || "",
          email: user.email || "",
          profileImage: user.profileImage || "",
        });
        const savedPreferences = user.preferences || { theme: "light", language: "en", emailAlerts: true, smsAlerts: true };
        setPreferences(savedPreferences);
        setLanguage(savedPreferences.language);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", preferences.theme === "dark");
  }, [preferences.theme]);

  const handleProfileChange = (event) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    setError("");
    setMessage("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", selectedImage);
      const response = await apiFetch("/users/profile/image", {
        method: "POST",
        body: formData,
      });
      setProfile((currentProfile) => ({ ...currentProfile, ...response.data }));
      setSelectedImage(null);
      setMessage("Profile picture uploaded successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const response = await apiFetch("/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          depot: profile.depot,
        }),
      });
      setProfile((currentProfile) => ({ ...currentProfile, ...response.data }));
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferencesChange = (event) => {
    const { name, value, type, checked } = event.target;
    setPreferences((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    if (name === "language") setLanguage(value);
  };

  const handlePreferencesSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await apiFetch("/users/preferences", {
        method: "PATCH",
        body: JSON.stringify(preferences),
      });
      setPreferences(response.data.preferences);
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, preferences: response.data.preferences }));
      setMessage("Preferences updated successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handlePasswordChange = (event) => {
    setPasswords((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      await apiFetch("/users/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl" data-aos="fade-down">
          <div className="mb-8 rounded-2xl border border-sky-100 bg-sky-50 px-6 py-8 text-center shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight text-sky-700">
              ⚙️ Settings
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Manage your profile, preferences, and security all in one place.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className={`${tabButtonClass} ${
                    activeTab === "profile"
                      ? "border-sky-300 bg-sky-100 text-sky-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => handleTabClick("profile")}
                >
                  👤 Profile
                </button>

                <button
                  type="button"
                  className={`${tabButtonClass} ${
                    activeTab === "preferences"
                      ? "border-sky-300 bg-sky-100 text-sky-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => handleTabClick("preferences")}
                >
                  ⚙️ Preferences
                </button>

                <button
                  type="button"
                  className={`${tabButtonClass} ${
                    activeTab === "security"
                      ? "border-sky-300 bg-sky-100 text-sky-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => handleTabClick("security")}
                >
                  🔒 Security
                </button>
              </div>

              <div className="relative ml-auto">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-lg text-sky-700 shadow-sm transition hover:bg-sky-200"
                  onClick={toggleDropdown}
                >
                  👤
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                    >
                      View Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 md:p-8">
              {activeTab === "profile" && (
                <div data-aos="fade-up">
                  <h2 className="mb-5 text-2xl font-bold text-slate-800">
                        {t("profileSettings")}
                  </h2>
                  <form className="space-y-4" onSubmit={handleProfileSubmit}>
                    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                    {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
                    {profile.profileImage && <img src={profile.profileImage} alt="Profile" className="h-24 w-24 rounded-full object-cover" />}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">Profile Picture</label>
                      <input className="mt-2 block w-full text-sm" type="file" accept="image/*" onChange={(event) => setSelectedImage(event.target.files?.[0] || null)} />
                      <button type="button" onClick={handleImageUpload} disabled={!selectedImage || isUploading} className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isUploading ? "Uploading..." : "Upload Picture"}</button>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("fullName")}
                      </label>
                      <input className={inputClassName} type="text" name="name" value={profile.name} onChange={handleProfileChange} required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("email")}
                      </label>
                      <input
                        className={inputClassName}
                        type="email"
                        value={profile.email || ""}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("phone")}
                      </label>
                      <input
                        className={inputClassName}
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("depot")}
                      </label>
                      <input className={inputClassName} type="text" name="depot" value={profile.depot} onChange={handleProfileChange} placeholder="Depot name or ID" />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 inline-flex rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
                    >
                      {isSaving ? t("loading") : t("saveChanges")}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "preferences" && (
                <div data-aos="fade-up">
                  <h2 className="mb-5 text-2xl font-bold text-slate-800">
                    {t("preferences")}
                  </h2>
                  <form className="space-y-4" onSubmit={handlePreferencesSubmit}>
                    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                    {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("theme")}
                      </label>
                      <select className={`${inputClassName} appearance-none`} name="theme" value={preferences.theme} onChange={handlePreferencesChange}>
                        <option value="light">Light (Default)</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("language")}
                      </label>
                      <select className={`${inputClassName} appearance-none`} name="language" value={preferences.language} onChange={handlePreferencesChange}>
                        <option value="en">{t("english")}</option>
                        <option value="hi">{t("hindi")}</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-700">
                        Notification Settings
                      </label>

                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" name="emailAlerts" checked={preferences.emailAlerts} onChange={handlePreferencesChange} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                        {t("emailAlerts")}
                      </label>

                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" name="smsAlerts" checked={preferences.smsAlerts} onChange={handlePreferencesChange} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                        {t("smsAlerts")}
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 inline-flex rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
                    >
                      {t("updatePreferences")}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div data-aos="fade-up">
                  <h2 className="mb-5 text-2xl font-bold text-slate-800">
                    {t("security")}
                  </h2>
                  <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                    {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("currentPassword")}
                      </label>
                      <input className={inputClassName} type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("newPassword")}
                      </label>
                      <input className={inputClassName} type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} minLength={8} required />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("confirmNewPassword")}
                      </label>
                      <input className={inputClassName} type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} minLength={8} required />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 inline-flex rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
                    >
                      {t("changePassword")}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Settings;