import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import CrewSelection from "./pages/CrewSelection";

import LinkedScheduling from "./pages/LinkedScheduling";
import Unlinked from "./pages/Unlinked";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import RouteManagement from "./pages/RouteManagement";
import Profile from "./pages/Profile";
import Contacts from "./pages/Contacts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/CrewSelection" element={<CrewSelection />} />
        <Route path="/LinkedScheduling" element={<LinkedScheduling />} />
        <Route path="/Unlinked" element={<Unlinked />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/RouteManagement" element={<RouteManagement />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Contacts" element={<Contacts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;