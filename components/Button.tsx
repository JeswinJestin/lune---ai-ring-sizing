import React from 'react';

// Fix: Use a type intersection for component props to correctly include HTML attributes.
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseClasses = "px-6 py-3 font-semibold text-base rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-midnight-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variantClasses = {
    primary: "bg-bronze-400 text-silver-50 shadow-[0_4px_16px_rgba(201,166,104,0.25)] hover:bg-bronze-500 hover:shadow-[0_6px_24px_rgba(201,166,104,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_8px_rgba(201,166,104,0.3)] focus:ring-bronze-400",
    secondary: "bg-transparent text-silver-200 border-2 border-platinum-300/40 hover:border-platinum-300/60 hover:bg-platinum-300/5 hover:-translate-y-0.5 active:translate-y-0 focus:ring-platinum-300",
    ghost: "bg-transparent text-silver-300 font-medium hover:text-silver-200 hover:bg-midnight-400/40",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
