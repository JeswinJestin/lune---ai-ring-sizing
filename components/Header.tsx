

import React, { useState, useEffect } from 'react';
import { MoonIcon } from './icons/MoonIcon';
import { MenuIcon, CloseIcon } from './icons/UtilIcons';
import type { AppState } from '../App';

interface HeaderProps {
    onNavigate: (page: AppState) => void;
    variant?: 'transparent' | 'opaque';
}

export const Header = ({ onNavigate, variant = 'transparent' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const isTransparent = variant === 'transparent';
  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent && !isScrolled ? 'bg-transparent border-b border-transparent' : 'bg-midnight-600/60 backdrop-blur-xl shadow-lg border-b border-platinum-300/10'}`;

  const navItems: { label: string, page: AppState }[] = [
      { label: 'Home', page: 'landing' },
      { label: 'Process', page: 'process'},
      { label: 'Features', page: 'features'},
      { label: 'About', page: 'about'},
      { label: 'Contact', page: 'contact'},
  ];

  const handleNavClick = (page: AppState) => {
    onNavigate(page);
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className={headerClasses}>
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-section-x">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <button onClick={() => handleNavClick('landing')} className="flex items-center gap-3 text-silver-200 hover:text-silver-50 transition-colors">
                <MoonIcon className="w-7 h-7 text-silver-300" />
                <span className="font-display text-3xl font-medium tracking-wide">LUNE</span>
              </button>
            </div>
            <nav className="hidden md:flex items-center space-x-10">
              {navItems.map((item) => (
                <button key={item.label} onClick={() => handleNavClick(item.page)} className="font-sans text-base font-medium text-silver-400 hover:text-silver-200 transition-colors relative group">
                  {item.label}
                  <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-silver-300 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </nav>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(true)} className="text-silver-300 hover:text-silver-100">
                <MenuIcon className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] bg-midnight-600/90 backdrop-blur-2xl transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="flex justify-between items-center h-20 px-4 sm:px-6 border-b border-platinum-300/10">
           <button onClick={() => handleNavClick('landing')} className="flex items-center gap-3 text-silver-200 hover:text-silver-50 transition-colors">
              <MoonIcon className="w-7 h-7 text-silver-300" />
              <span className="font-display text-3xl font-medium tracking-wide">LUNE</span>
            </button>
            <button onClick={() => setIsMenuOpen(false)} className="text-silver-300 hover:text-silver-100">
                <CloseIcon className="w-8 h-8"/>
            </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-[calc(100vh-80px)] space-y-8">
            {navItems.map((item) => (
              <button key={item.label} onClick={() => handleNavClick(item.page)} className="font-display text-4xl font-medium text-silver-300 hover:text-silver-100 transition-colors">
                {item.label}
              </button>
            ))}
        </nav>
      </div>
    </>
  );
};
