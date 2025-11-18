

import { useEffect } from 'react';

export const useCursor = () => {
  useEffect(() => {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    // Check if elements exist or if we're on a touch device
    if (!cursorDot || !cursorOutline || 'ontouchstart' in window) {
      return;
    }

    // Add class to body to enable custom cursor styles globally
    document.body.classList.add('custom-cursor-region');

    const moveCursor = (e: MouseEvent) => {
      const { clientX: posX, clientY: posY } = e;
      
      requestAnimationFrame(() => {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
      });
    };

    // Use event delegation for hover effects
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest('button, a, input, textarea, select')) {
        document.body.classList.add('cursor-pointer');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest('button, a, input, textarea, select')) {
        document.body.classList.remove('cursor-pointer');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);

    // Cleanup function to remove listeners and classes
    return () => {
      document.body.classList.remove('custom-cursor-region');
      document.body.classList.remove('cursor-pointer');
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount
};