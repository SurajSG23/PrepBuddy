import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useDarkMode } from "../Custom/DarkModeContext";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const CONTACT_DATA = [
  { label: "Address", value: "12 Private sector , India", icon: MapPin },
  { label: "Call us", value: "0000000xyz", icon: Phone, link: "tel:000000xyz" },
  { label: "Email", value: "xyz@example.com", icon: Mail, link: "mailto:helpxyz.com" },
];

const Contact: React.FC = () => {
  const { darkMode } = useDarkMode();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in the fields!");
      return;
    } else {
      setError("");
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  // Dynamic color classes based on darkMode
  const bgColor = darkMode ? "bg-black" : "bg-white";
  const textColor = darkMode ? "text-gray-300" : "text-gray-600";
  const inputBorder = darkMode ? "border-gray-700" : "border-gray-400";
  const inputText = darkMode ? "text-gray-300" : "text-gray-800";
  const iconBg = darkMode ? "bg-gray-800" : "bg-gray-100";
  const hoverBg = darkMode ? "hover:bg-indigo-800/20" : "hover:bg-indigo-500/10";

  return (
    <div className={`max-w-7xl w-full ${bgColor} p-4 flex flex-col justify-around items-start lg:flex-row md:flex-row`}>
      {/* Contact Info */}
      <div className="contact-info p-2 w-full mx-auto flex flex-col items-center">
        <h1 className={`text-2xl md:text-3xl text-center font-bold ${darkMode ? "text-indigo-400" : "text-indigo-500"} mb-4`}>
          Contact us
        </h1>

        <div className="mx-auto mb-4">
          {CONTACT_DATA.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex gap-6 items-center px-4 py-3 rounded-md shadow-md backdrop-blur-lg transition-colors mt-2 ${hoverBg}`}
              >
                <span className={`flex items-center justify-center rounded-md h-12 w-12 ${iconBg} text-center text-gray-400`}>
                  <Icon />
                </span>
                <div className="flex flex-col justify-center gap-2 items-start">
                  <h2 className={`font-bold ${textColor} text-lg`}>{item.label}</h2>
                  <p className={`text-sm cursor-pointer ${textColor} hover:text-indigo-500`}>
                    {item.link ? (
                      <a href={item.link} className={`text-sm cursor-pointer ${textColor} hover:text-indigo-500`}>
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Form */}
      <div className="p-2 w-full">
        <h1 className={`text-2xl md:text-3xl text-center font-bold ${textColor} mb-4`}>Get in Touch</h1>
        <form
          className="w-full mx-auto flex flex-col justify-center items-center gap-6 px-4 py-4 font-medium"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Enter your name"
            className={`w-full max-w-[100%] px-6 py-2 rounded-lg bg-transparent border-2 ${inputBorder} ${inputText} outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            className={`w-full max-w-[100%] px-6 py-2 rounded-lg bg-transparent border-2 ${inputBorder} ${inputText} outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            value={formData.message}
            placeholder="Type Message here..."
            rows={4}
            className={`w-full max-w-[100%] px-6 py-4 rounded-lg bg-transparent border-2 ${inputBorder} ${inputText} outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            className="w-[100%] max-w-[100%] mx-auto bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl cursor-pointer border-none font-medium transition duration-300 text-white"
          >
            Send Message
          </button>
        </form>

        {error && <p className="text-red-500 text-xl text-center mt-4">{error}</p>}
        {submitted && (
          <h2 className={`font-medium text-center p-4 text-2xl ${darkMode ? "text-indigo-400" : "text-black"}`}>
            Thank You for contacting us
          </h2>
        )}
      </div>
    </div>
  );
};

export default Contact;
