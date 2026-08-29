import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

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

    <Navbar/>

    <div className="settings-page">
      {/* Hero Section */}
      <section className="settings-hero" data-aos="fade-down">
        <h1>
          <i className="fas fa-cogs"></i> Settings
        </h1>
        <p>Manage your profile, preferences, and security all in one place.</p>
      </section>

      {/* Settings Container */}
      <main className="settings-container">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => handleTabClick("profile")}
          >
            <i className="fas fa-user-circle"></i> Profile
          </button>

          <button
            className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => handleTabClick("preferences")}
          >
            <i className="fas fa-sliders-h"></i> Preferences
          </button>

          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => handleTabClick("security")}
          >
            <i className="fas fa-lock"></i> Security
          </button>

          {/* Profile Icon Dropdown */}
          <div className="profile-container">
            <div className="profile-icon" onClick={toggleDropdown}>
              👤
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <a href="/profile">View Profile</a>
                <a href="/settings">Settings</a>
                <a href="#">Logout</a>
              </div>
            )}
          </div>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "profile" && (
          <div className="tab-content active" data-aos="fade-up">
            <h2>Profile Settings</h2>
            <form>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />

              <label>Email</label>
              <input type="email" placeholder="john@example.com" />

              <label>Phone</label>
              <input type="tel" placeholder="+91 98765 43210" />

              <label>Profile Picture</label>
              <input type="file" />

              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="tab-content active" data-aos="fade-up">
            <h2>Preferences</h2>
            <form>
              <label>Theme</label>
              <select>
                <option>Light (Default)</option>
                <option>Dark</option>
              </select>

              <label>Language</label>
              <select>
                <option>English</option>
                <option>Hindi</option>
              </select>

              <label>Notification Settings</label>
              <div>
                <input type="checkbox" defaultChecked /> Email Alerts
              </div>
              <div>
                <input type="checkbox" defaultChecked /> SMS Alerts
              </div>

              <button type="submit" className="save-btn">
                Update Preferences
              </button>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div className="tab-content active" data-aos="fade-up">
            <h2>Security Settings</h2>
            <form>
              <label>Current Password</label>
              <input type="password" />

              <label>New Password</label>
              <input type="password" />

              <label>Confirm New Password</label>
              <input type="password" />

              <button type="submit" className="save-btn">
                Change Password
              </button>
            </form>
          </div>
        )}
      </main>
    </div>

<Footer/>

    </>
  );
}

export default Settings;