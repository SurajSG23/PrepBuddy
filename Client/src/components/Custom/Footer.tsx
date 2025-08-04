import React from 'react';
import { Instagram, Linkedin, Github } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-slate-900 text-gray-300 border-t border-slate-800">
      <div className="container mx-auto py-6 px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-white tracking-wider">
              <span className="text-indigo-400">PrepBuddy</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your AI-powered study companion for exam preparation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/homepage" className="text-gray-400 hover:text-indigo-400 hover:pl-2 transition-all duration-300 ease-in-out cursor-pointer inline-block">
                  Practice Tests
                </a>
              </li>
              <li>
                <a href="/notes" className="text-gray-400 hover:text-indigo-400 hover:pl-2 transition-all duration-300 ease-in-out cursor-pointer inline-block">
                  Study Materials
                </a>
              </li>
              <li>
                <a href="/score-board" className="text-gray-400 hover:text-indigo-400 hover:pl-2 transition-all duration-300 ease-in-out cursor-pointer inline-block">
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Connect</h3>
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-slate-800 hover:text-indigo-400 hover:shadow-indigo-500/30 transition-all duration-300 rounded-full transform hover:scale-110" 
                asChild
              >
                <a href="https://www.instagram.com/suraj_sg23/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-slate-800 hover:text-indigo-400 hover:shadow-indigo-500/30 transition-all duration-300 rounded-full transform hover:scale-110" 
                asChild
              >
                <a href="https://www.linkedin.com/in/suraj-s-g-dhanva-995a23298/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-slate-800 hover:text-indigo-400 hover:shadow-indigo-500/30 transition-all duration-300 rounded-full transform hover:scale-110" 
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
        <div className="border-t border-slate-800 pt-4 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400 opacity-80">
              &copy; {currentYear} <span className="text-indigo-400 font-semibold">PrepBuddy</span>. All rights reserved.
            </p>
            
            <div className="flex space-x-4 text-sm">
               <Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">
                Contact us
              </Link>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-all duration-300 relative after:content-[''] after:block after:w-0 after:h-0.5 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-all duration-300 relative after:content-[''] after:block after:w-0 after:h-0.5 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
