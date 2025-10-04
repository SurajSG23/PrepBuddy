import React, { useState } from "react";
import {
  Instagram,
  Linkedin,
  Github,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useDarkMode } from "../Custom/DarkModeContext";
import { toast } from "react-hot-toast";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { darkMode } = useDarkMode();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    console.log("Submitting email:", email);

    toast.success("🎉 Successfully subscribed to our newsletter!", {
      duration: 4000,
      position: "top-right",
    });

    setEmail("");
  };

  return (
    <footer
      className={`w-full border-t transition-colors duration-500 ${
        darkMode
          ? "bg-slate-900 text-gray-300 border-slate-800"
          : "bg-gray-100 text-gray-700 border-gray-300"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-10">
          {/* Brand Section */}
          <div className="space-y-3">
            <h2
              className={`text-2xl font-extrabold tracking-wide ${
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
                { href: "/about", label: "About Us" }, // ✅ Add this line
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className={`hover:text-indigo-500 transition-colors duration-300 cursor-pointer inline-block ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3 md:ml-[-70px]">
            <h3
              className={`font-semibold text-lg ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Connect
            </h3>
            <div className="flex space-x-3.5">
              {[
                {
                  href: "https://www.instagram.com/suraj_sg23/",
                  icon: <Instagram size={20} />,
                  label: "Instagram",
                },
                {
                  href: "https://www.linkedin.com/in/suraj-s-g-dhanva-995a23298/",
                  icon: <Linkedin size={20} />,
                  label: "LinkedIn",
                },
                {
                  href: "https://github.com/SurajSG23",
                  icon: <Github size={20} />,
                  label: "GitHub",
                },
                {
                  href: "https://twitter.com/yourhandle",
                  icon: <Twitter size={20} />,
                  label: "Twitter",
                },
                {
                  href: "https://youtube.com/@yourchannel",
                  icon: <Youtube size={20} />,
                  label: "YouTube",
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

          {/* Newsletter Section */}
          <div className="space-y-3">
            <h3
              className={`font-semibold text-lg ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Newsletter
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Subscribe to get updates on new features and study tips.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 px-3 py-2 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`border-t pt-5 transition-colors duration-500 ${
            darkMode ? "border-slate-800" : "border-gray-300"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              &copy; {currentYear}{" "}
              <span className="text-indigo-500 font-semibold">PrepBuddy</span>.
              All rights reserved.
            </p>

            <div className="flex space-x-6 text-sm">
              {[
                { to: "/contact", label: "Contact us", type: "link" },
                { href: "#", label: "Privacy Policy", type: "a" },
                { href: "#", label: "Terms of Service", type: "a" },
              ].map((item, idx) =>
                item.type === "link" ? (
                  <Link
                    key={idx}
                    to={item.to!}
                    className={`transition-all duration-300 hover:text-indigo-500 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={item.href}
                    className={`transition-all duration-300 hover:text-indigo-500 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
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
