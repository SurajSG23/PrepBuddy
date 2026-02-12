import React from "react";
import { Instagram, Linkedin, Github } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useDarkMode } from "../Custom/DarkModeContext";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { darkMode } = useDarkMode();

  return (
    <footer
      className={`w-full border-t transition-colors duration-500 ${
        darkMode
          ? "bg-slate-900 text-gray-300 border-slate-800"
          : "bg-gray-100 text-gray-700 border-gray-300"
      }`}
    >
      <div className="container mx-auto py-6 px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <h2
              className={`text-2xl font-extrabold tracking-wider ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="text-indigo-500">PrepBuddy</span>
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Your AI-powered study companion for exam preparation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3
              className={`font-semibold text-lg ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/homepage", label: "Practice Tests" },
                { href: "/notes", label: "Study Materials" },
                { href: "/score-board", label: "Leaderboard" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className={`hover:text-indigo-500 hover:pl-2 transition-all duration-300 ease-in-out cursor-pointer inline-block ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Connect
            </h3>
            <div className="flex space-x-3">
              {[
                {
                  href: "https://www.instagram.com/suraj_sg23/",
                  icon: <Instagram size={18} />,
                  label: "Instagram",
                },
                {
                  href: "https://www.linkedin.com/in/suraj-s-g-dhanva-995a23298/",
                  icon: <Linkedin size={18} />,
                  label: "LinkedIn",
                },
                {
                  href: "https://github.com/SurajSG23",
                  icon: <Github size={18} />,
                  label: "GitHub",
                },
              ].map((social, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="icon"
                  className={`rounded-full transform hover:scale-110 transition-all duration-300 ${
                    darkMode
                      ? "hover:bg-slate-800 hover:text-indigo-400"
                      : "hover:bg-gray-200 hover:text-indigo-500"
                  }`}
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`border-t pt-4 animate-fade-in transition-colors duration-500 ${
            darkMode ? "border-slate-800" : "border-gray-300"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p
              className={`text-sm opacity-80 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              &copy; {currentYear}{" "}
              <span className="text-indigo-500 font-semibold">PrepBuddy</span>.
              All rights reserved.
            </p>

            <div className="flex space-x-4 text-sm">
              {[
                { to: "/contact", label: "Contact us", type: "link" },
                { href: "#", label: "Privacy Policy", type: "a" },
                { href: "#", label: "Terms of Service", type: "a" },
              ].map((item, idx) =>
                item.type === "link" ? (
                  <Link
                    key={idx}
                    to={item.to!}
                    className={`transition-all duration-300 relative after:content-[''] after:block after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full ${
                      darkMode ? "text-gray-400 hover:text-indigo-500" : "text-gray-600 hover:text-indigo-500"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={item.href}
                    className={`transition-all duration-300 relative after:content-[''] after:block after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full ${
                      darkMode ? "text-gray-400 hover:text-indigo-500" : "text-gray-600 hover:text-indigo-500"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
