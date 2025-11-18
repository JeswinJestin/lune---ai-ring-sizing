

import React from 'react';
import { Button } from './Button';
import { ArrowRightIcon } from './icons/UtilIcons';

interface AboutPageProps {
  onGetStarted: () => void;
}

export const AboutPage = ({ onGetStarted }: AboutPageProps) => {
  return (
    <div className="w-full animate-[fadeInUp_0.5s_ease-out] py-section">
      <div className="max-w-container mx-auto px-section-x-mobile md:px-section-x">
        
        <div className="text-center">
            <h1 className="font-display text-display-md md:text-display-lg text-silver-100">Our Mission</h1>
            <p className="mt-6 text-xl md:text-2xl text-silver-300 max-w-3xl mx-auto leading-relaxed font-light">
                To make online ring shopping as <span className="text-bronze-400 italic">confident and joyful</span> as an in-store experience, one perfect fit at a time.
            </p>
        </div>
        
        <div className="my-24 h-px bg-gradient-to-r from-transparent via-platinum-300/20 to-transparent"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="aspect-square bg-midnight-500 rounded-2xl overflow-hidden">
                <img src="https://picsum.photos/seed/lune-about/800/800" alt="Jewelry crafting" className="w-full h-full object-cover opacity-80"/>
            </div>
            <div>
                <h2 className="font-display text-display-sm md:text-display-md text-silver-100 mb-6">The Story of LUNE</h2>
                <div className="space-y-6 text-silver-400 leading-relaxed">
                    <p>
                        LUNE was born from a simple, frustrating experience: buying a ring online. The uncertainty of sizing, the hassle of returns, and the fear of getting it wrong for a special gift—these were problems crying out for a modern solution.
                    </p>
                    <p>
                        We envisioned a tool that was not only accurate but also elegant and effortless. By harnessing the power of AI and the cameras we carry every day, we set out to eliminate the guesswork. LUNE, named after the moon for its symbolism of precision and cycles, is the result of that vision.
                    </p>
                     <p>
                        We are a small team of engineers and designers passionate about using technology to solve real-world problems. We believe that buying something as personal as a ring should be a moment of excitement, not anxiety.
                    </p>
                </div>
            </div>
        </div>
        
        <div className="text-center mt-24 bg-gradient-to-br from-midnight-500 to-midnight-700/50 border border-platinum-300/10 rounded-3xl py-16 px-8">
            <h2 className="font-display text-3xl md:text-4xl text-silver-100 mb-4">Ready to Find Your Size?</h2>
            <p className="text-silver-400 max-w-xl mx-auto mb-8">Join thousands of happy customers who found their perfect fit with LUNE. The experience is free, fast, and accurate.</p>
            <Button onClick={onGetStarted} className="px-8 py-4 text-lg">
                Get Started Now <ArrowRightIcon className="inline ml-2"/>
            </Button>
        </div>
      </div>
    </div>
  );
};