

import React from 'react';
import { MoonIcon } from './icons/MoonIcon';
import { GithubIcon, BehanceIcon, LinkedInIcon } from './icons/SocialIcons';
import type { AppState } from '../App';

interface FooterProps {
    onNavigate: (page: AppState) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-midnight-700 border-t border-platinum-300/10 text-silver-400 w-full">
      <div className="max-w-container mx-auto px-section-x-mobile md:px-section-x py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 text-silver-200 mb-4">
              <MoonIcon className="w-7 h-7 text-silver-300" />
              <span className="font-display text-3xl font-medium tracking-wide">LUNE</span>
            </button>
            <p className="text-sm max-w-xs">Your Perfect Fit, Captured in Light.</p>
          </div>
          <div>
            <h3 className="font-semibold text-silver-200 tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate('process')} className="hover:text-silver-200 transition-colors">Process</button></li>
              <li><button onClick={() => onNavigate('features')} className="hover:text-silver-200 transition-colors">Features</button></li>
              <li><button onClick={() => alert('AR Try-On is available after measurement.')} className="hover:text-silver-200 transition-colors">AR Try-On</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-silver-200 tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate('about')} className="hover:text-silver-200 transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-silver-200 transition-colors">Partners</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-silver-200 transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-silver-200 tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-silver-200 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-silver-200 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-platinum-300/10 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-silver-500">&copy; {new Date().getFullYear()} LUNE. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="https://github.com/JeswinJestin" target="_blank" rel="noopener noreferrer" className="text-silver-400 hover:text-silver-200 transition-colors"><GithubIcon /></a>
            <a href="https://www.behance.net/jeswinjestin" target="_blank" rel="noopener noreferrer" className="text-silver-400 hover:text-silver-200 transition-colors"><BehanceIcon /></a>
            <a href="https://www.linkedin.com/in/jeswin-thomas-jestin/" target="_blank" rel="noopener noreferrer" className="text-silver-400 hover:text-silver-200 transition-colors"><LinkedInIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};