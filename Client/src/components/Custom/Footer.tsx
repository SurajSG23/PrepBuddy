
import React from 'react';
import {  Instagram, Linkedin, Github } from 'lucide-react';
import { Button } from '../ui/button';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-black text-gray-300">
      <div className="container mx-auto py-2 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="text-indigo-400">PrepBuddy</span>
            </h2>
            <p className="text-sm mt-2 text-gray-400 max-w-md">
              Helping you prepare for your next big test with confidence and ease.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-white mb-2">Connect with me</h3>
            <div className="flex space-x-4">

              <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-indigo-400" asChild>
                <a href="https://www.instagram.com/suraj_sg23/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              </Button>
              
              
              <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-indigo-400" asChild>
                <a href="https://www.linkedin.com/in/suraj-s-g-dhanva-995a23298/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </Button>
              
              <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-indigo-400" asChild>
                <a href="https://github.com/SurajSG23" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github size={20} />
                </a>
              </Button>
            </div>
          </div>
        </div>
          <p className="text-sm text-center">
            &copy; {currentYear} <span className="text-indigo-400">PrepBuddy</span>. All rights reserved.
          </p>

      </div>
    </footer>
  );
};

export default Footer;
