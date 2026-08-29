import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const profileRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 w-full transition-all duration-700 z-[2000] shadow-[0_4px_10px_rgba(0,0,0,0.7)] ${
        isVisible
          ? "top-0 opacity-100 translate-y-0"
          : "-top-[100px] opacity-0 -translate-y-[15px]"
      } ${isScrolled ? "bg-[#001a33]" : "bg-[#001f3f]"}`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 text-[1.7rem] font-bold text-[#00bcd4]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[28px] w-[28px] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00bcd4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="7" width="18" height="10" rx="2" ry="2"></rect>
            <path d="M3 17h18"></path>
            <circle cx="7.5" cy="17.5" r="1.5"></circle>
            <circle cx="16.5" cy="17.5" r="1.5"></circle>
            <line x1="12" y1="7" x2="12" y2="3"></line>
            <line x1="9" y1="3" x2="15" y2="3"></line>
          </svg>

          BusScheduler
        </div>

        <nav className="flex items-center">
          <ul className="list-none flex items-center gap-7">
            <li>
              <Link
                to="/"
                className="rounded-md px-2.5 py-1.5 text-base font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(3,169,244,0.15)] hover:text-[#03a9f4] focus:bg-[rgba(3,169,244,0.15)] focus:text-[#03a9f4]"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/Contacts"
                className="rounded-md px-2.5 py-1.5 text-base font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(3,169,244,0.15)] hover:text-[#03a9f4] focus:bg-[rgba(3,169,244,0.15)] focus:text-[#03a9f4]"
              >
                Contacts
              </Link>
            </li>

            <li>
              <Link
                to="/Settings"
                className="rounded-md px-2.5 py-1.5 text-base font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(3,169,244,0.15)] hover:text-[#03a9f4] focus:bg-[rgba(3,169,244,0.15)] focus:text-[#03a9f4]"
              >
                Settings
              </Link>
            </li>

            <li>
              <Link
                to="/Signup"
                className="rounded-md px-2.5 py-1.5 text-base font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(3,169,244,0.15)] hover:text-[#03a9f4] focus:bg-[rgba(3,169,244,0.15)] focus:text-[#03a9f4]"
              >
                SignUp
              </Link>
            </li>

            <li className="relative flex items-center" ref={profileRef}>
              <div
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xl text-white"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤
              </div>

              {showDropdown && (
                <div className="absolute right-0 top-10 z-[9999] min-w-[160px] rounded-md bg-white shadow-[0_8px_16px_rgba(0,0,0,0.12)]">
                  <Link
                    to="/Profile"
                    className="block px-[15px] py-[10px] text-sm text-[#004d80] no-underline hover:bg-[#e6f5ff]"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/Settings"
                    className="block px-[15px] py-[10px] text-sm text-[#004d80] no-underline hover:bg-[#e6f5ff]"
                  >
                    Settings
                  </Link>
                  <a
                    href="#"
                    className="block px-[15px] py-[10px] text-sm text-[#004d80] no-underline hover:bg-[#e6f5ff]"
                  >
                    Logout
                  </a>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;