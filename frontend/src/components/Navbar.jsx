import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const profileRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between px-4 py-3 sm:px-6 md:flex-nowrap md:px-8 md:py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-[1.35rem] font-bold text-[#00bcd4] no-underline sm:text-[1.5rem] md:text-[1.7rem]"
          onClick={() => setShowMobileMenu(false)}
        >
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
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border-0 bg-transparent text-2xl text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#03a9f4] md:hidden"
          aria-label={showMobileMenu ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={showMobileMenu}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? "×" : "☰"}
        </button>

        <nav className={`${showMobileMenu ? "flex" : "hidden"} basis-full items-center md:flex md:basis-auto`}>
          <ul className="flex w-full flex-col items-stretch gap-1 pt-3 md:w-auto md:flex-row md:items-center md:gap-7 md:pt-0">
            <li>
              <Link
                to="/"
                className="block rounded-md px-2.5 py-2 text-base font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(3,169,244,0.15)] hover:text-[#03a9f4] focus:bg-[rgba(3,169,244,0.15)] focus:text-[#03a9f4] md:py-1.5"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/Contacts"
                className="block rounded-md px-2.5 py-2 text-base font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(3,169,244,0.15)] hover:text-[#03a9f4] focus:bg-[rgba(3,169,244,0.15)] focus:text-[#03a9f4] md:py-1.5"
                onClick={() => setShowMobileMenu(false)}
              >
                Contacts
              </Link>
            </li>

            <li>
              <Link
                to="/Settings"
                className="block rounded-md px-2.5 py-2 text-base font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(3,169,244,0.15)] hover:text-[#03a9f4] focus:bg-[rgba(3,169,244,0.15)] focus:text-[#03a9f4] md:py-1.5"
                onClick={() => setShowMobileMenu(false)}
              >
                Settings
              </Link>
            </li>

            <li>
              <Link
                to="/Signup"
                className="block rounded-md px-2.5 py-2 text-base font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(3,169,244,0.15)] hover:text-[#03a9f4] focus:bg-[rgba(3,169,244,0.15)] focus:text-[#03a9f4] md:py-1.5"
                onClick={() => setShowMobileMenu(false)}
              >
                SignUp
              </Link>
            </li>

            <li className="relative flex items-center" ref={profileRef}>
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={showDropdown}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-xl text-white"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤
              </button>

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