import React from 'react';
import { useThemeSelector } from '../../store/hooks';
import { Instagram, Linkedin, Github } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  return (
    <footer className={`w-full border-t transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-gray-300 border-slate-800' : 'bg-white text-gray-700 border-gray-200'}`}>
      <div className="container mx-auto py-6 px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-6 md:ml-25">
          {/* Brand Section */}
          <div className="space-y-3">
            <h2 className={`text-2xl font-extrabold tracking-wider ${darkMode ? 'text-white' : 'text-indigo-700'}`}>
              <span>PrepBuddy</span>
            </h2>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your AI-powered study companion for exam preparation.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-indigo-700'}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/homepage" className={`hover:text-indigo-400 hover:pl-2 transition-all duration-300 ease-in-out cursor-pointer inline-block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Practice Tests</a>
              </li>
              <li>
                <a href="/notes" className={`hover:text-indigo-400 hover:pl-2 transition-all duration-300 ease-in-out cursor-pointer inline-block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Study Materials</a>
              </li>
              <li>
                <a href="/score-board" className={`hover:text-indigo-400 hover:pl-2 transition-all duration-300 ease-in-out cursor-pointer inline-block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Leaderboard</a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-indigo-700'}`}>Connect</h3>
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`transition-all duration-300 rounded-full transform hover:scale-110 ${darkMode ? 'hover:bg-slate-800 hover:text-indigo-400 hover:shadow-indigo-500/30' : 'hover:bg-gray-200 hover:text-indigo-600 hover:shadow-indigo-200/30'}`}
                asChild
              >
                <a href="https://www.instagram.com/suraj_sg23/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className={`transition-all duration-300 rounded-full transform hover:scale-110 ${darkMode ? 'hover:bg-slate-800 hover:text-indigo-400 hover:shadow-indigo-500/30' : 'hover:bg-gray-200 hover:text-indigo-600 hover:shadow-indigo-200/30'}`}
                asChild
              >
                <a href="https://www.linkedin.com/in/suraj-s-g-dhanva-995a23298/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className={`transition-all duration-300 rounded-full transform hover:scale-110 ${darkMode ? 'hover:bg-slate-800 hover:text-indigo-400 hover:shadow-indigo-500/30' : 'hover:bg-gray-200 hover:text-indigo-600 hover:shadow-indigo-200/30'}`}
                asChild
              >
                <a href="https://github.com/SurajSG23" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github size={18} />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`pt-4 animate-fade-in border-t ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className={`text-sm opacity-80 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              &copy; {currentYear} <span className="text-indigo-800 font-semibold">PrepBuddy</span>. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link to="/contact" className={`transition-all duration-300 relative after:content-[''] after:block after:w-0 after:h-0.5 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>Contact us</Link>
              <a href="#" className={`transition-all duration-300 relative after:content-[''] after:block after:w-0 after:h-0.5 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>Privacy Policy</a>
              <a href="#" className={`transition-all duration-300 relative after:content-[''] after:block after:w-0 after:h-0.5 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}>Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
