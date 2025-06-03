/* eslint-disable react/prop-types */
// src/components/Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // For mobile dropdowns

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="flex justify-center bg-black">
      <div className="container w-[90%] md:w-[80%]">
        <header className="bg-black text-white">
          <div className="max-w-screen-xl mx-auto ">
            <nav className="flex justify-between items-center py-4">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src="/assets/image/eleedom-logo.PNG"
                  alt="Eleedom Logo"
                  className="h-12 w-32 object-contain"
                />
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex space-x-6 items-center font-semibold">
                <NavItem label="Home" to="/" />
                <Dropdown
                  label="About"
                  links={[
                    { label: "About Us", to: "/about/about-us" },
                    { label: "Mission & Vision", to: "/about/mission_vision" },
                    {
                      label: "Director Message",
                      to: "/about/director_message",
                    },
                  ]}
                />
                <Dropdown
                  label="Downloads"
                  links={[
                    { label: "Claim Form", to: "/downloads/claimform" },
                    // { label: "Proposal", to: "/downloads/purposal" },
                    // { label: "Brochure", to: "/downloads/brochure" },
                  ]}
                />
                <Dropdown
                  label="Claim"
                  links={[{ label: "Claim", to: "/claim" }]}
                />
                <Dropdown
                  label="Branch"
                  links={[
                    { label: "Branch", to: "/branch" },
                    // { label: "Track Request", to: "/branch/trackrequest" },
                  ]}
                />
                <NavItem label="Feedback" to="/feedback" />
                <NavItem label="Contact Us" to="/contact" />
                <NavItem label="Career" to="/career" />
                <Link
                  to="/login"
                  className="px-4 py-1  bg-blue-500 border-1 border-white rounded-md hover:bg-blue-700 transition"
                >
                  Log In
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                className="md:hidden text-white hover:text-red-500"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </nav>

            {/* Mobile Menu Dropdown (Accordion-style) */}
            {menuOpen && (
              <div className="lg:hidden space-y-1 pb-4 font-medium">
                <MobileLink label="Home" to="/" />
                <MobileDropdown
                  label="About"
                  menuKey="about"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  links={[
                    { label: "About Us", to: "/about/about-us" },
                    { label: "Mission & Vision", to: "/about/mission_vision" },
                    {
                      label: "Director Message",
                      to: "/about/director_message",
                    },
                  ]}
                />
                <MobileDropdown
                  label="Downloads"
                  menuKey="downloads"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  links={[
                    { label: "Claim Form", to: "/downloads/claimform" },
                    // { label: "Proposal", to: "/downloads/purposal" },
                    // { label: "Brochure", to: "/downloads/brochure" },
                  ]}
                />
                <MobileDropdown
                  label="Claim"
                  menuKey="claim"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  links={[{ label: "Claim", to: "/claim" }]}
                />
                <MobileDropdown
                  label="Branch"
                  menuKey="branch"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  links={[
                    { label: "Branch", to: "/branch" },
                    // { label: "Track Request", to: "/branch/trackrequest" },
                  ]}
                />
                <MobileLink label="Feedback" to="/feedback" />
                <MobileLink label="Contact Us" to="/contact" />
                <MobileLink label="Career" to="/career" />
                <MobileLink
                  label="Log In"
                  to="/login"
                  className="px-4 py-1 md:hidden bg-blue-700 border-white rounded-2xl hover:text-white-500 transition"
                />
              </div>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}

function NavItem({ label, to }) {
  return (
    <Link to={to} className="hover:text-red-500 transition ">
      {label}
    </Link>
  );
}

function Dropdown({ label, links }) {
  return (
    <div className="relative group">
      <span className="cursor-pointer hover:text-red-500 transition">
        {label}
      </span>
      <div className="absolute top-full left-0 bg-gray-800 border border-gray-700 rounded shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 z-50">
        {links.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="block px-4 py-2 text-white hover:bg-gray-700 whitespace-nowrap"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileLink({ label, to, className = "" }) {
  return (
    <Link
      to={to}
      className={`block px-4 py-2 text-sm text-white hover:bg-gray-700 transition ${className}`}
      onClick={() => window.scrollTo(0, 0)}
    >
      {label}
    </Link>
  );
}

function MobileDropdown({
  label,
  menuKey,
  openDropdown,
  toggleDropdown,
  links,
}) {
  return (
    <div>
      <button
        onClick={() => toggleDropdown(menuKey)}
        className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-700"
      >
        {label}
        <span>{openDropdown === menuKey ? "−" : "+"}</span>
      </button>
      {openDropdown === menuKey && (
        <div className="pl-6 bg-gray-800">
          {links.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="block px-2 py-2 text-sm text-white hover:bg-gray-700"
              onClick={() => window.scrollTo(0, 0)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Header;
