

import React from 'react';

export const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
    <line x1="2" y1="10" x2="22" y2="10"></line>
  </svg>
);

export const SmartphoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

export const HandIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-4a2 2 0 1 1 0-4h4a4 4 0 0 0 4-4Z"></path>
  </svg>
);

export const RingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="8"></circle>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export const RulerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L3 8.4a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0L12 5.3"></path>
        <path d="m15 12-2-2"></path>
        <path d="m9 6 2 2"></path>
        <path d="m12 9 2 2"></path>
        <path d="m6 9 2 2"></path>
        <path d="m9 12 2 2"></path>
        <path d="m12 15 2 2"></path>
    </svg>
);

// Fix: Renamed HandOutlineIcon to HandSilhouetteIcon to match its usage in Camera.tsx.
export const HandSilhouetteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M342.3,133.4c-1.3-8.8-6.6-16.3-14.5-20.2c-12-5.9-26.2,0-32.2,12c-2.4,4.8-2.6,10.2-0.8,15.1l12.4,33.1 c-2.4-0.8-5-1.2-7.7-1.2c-15.1,0-27.4,12.3-27.4,27.4v48.6c0,15.1-12.3,27.4-27.4,27.4s-27.4-12.3-27.4-27.4V188 c0-15.1-12.3-27.4-27.4-27.4s-27.4,12.3-27.4,27.4v62.4c0,15.1-12.3,27.4-27.4,27.4s-27.4-12.3-27.4-27.4V201 c0-15.1-12.3-27.4-27.4-27.4S64,185.9,64,201v99.3c0,42.8,25.6,81,66.7,98.1c42,17.5,91-1.9,114.2-40.4 c13.4-22.3,16.5-49.3,9.4-74.4c-2.4-8.5-6.1-16.5-10.9-23.4c-11.8-17-31.2-27-52.1-27c-15.1,0-27.4,12.3-27.4,27.4 s12.3,27.4,27.4,27.4c7.9,0,15.1-3.4,20.1-8.9c2.8-3.1,4.9-6.7,6.2-10.6l11.4,30.3c6.9,18.4,24.8,30.1,44.7,28.8 c25.6-1.7,45.3-24.8,43.6-50.4l-11-177.8C344,142.6,343.6,137.9,342.3,133.4z" />
  </svg>
);
