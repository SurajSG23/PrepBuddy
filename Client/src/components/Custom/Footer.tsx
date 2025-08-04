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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Brand Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">
              <span className="text-indigo-400">PrepBuddy</span>
            </h2>
            <p className="text-sm text-gray-400">
              Your AI-powered study companion for exam preparation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/homepage" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Practice Tests
                </a>
              </li>
              <li>
                <a href="/notes" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Study Materials
                </a>
              </li>
              <li>
                <a href="/score-board" className="text-gray-400 hover:text-indigo-400 transition-colors">
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
                className="hover:bg-slate-800 hover:text-indigo-400" 
                asChild
              >
                <a href="https://www.instagram.com/suraj_sg23/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-slate-800 hover:text-indigo-400" 
                asChild
              >
                <a href="https://www.linkedin.com/in/suraj-s-g-dhanva-995a23298/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-slate-800 hover:text-indigo-400" 
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
        <div className="border-t border-slate-800 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} <span className="text-indigo-400 font-semibold">PrepBuddy</span>. All rights reserved.
            </p>
            
            <div className="flex space-x-4 text-sm">
               <Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">
                Contact us
              </Link>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
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
