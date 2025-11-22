import React, { useState, useRef, useEffect } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
};

export const Button = ({
  variant = 'primary',
  children,
  className = '',
  isLoading = false,
  icon,
  disabled,
  ...props
}: ButtonProps) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setRipples([]), 1000);
    return () => clearTimeout(timer);
  }, [ripples]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipples((prev) => [...prev, { x, y, id: Date.now() }]);

    if (props.onClick) {
      props.onClick(event);
    }
  };

  const baseClasses = "relative overflow-hidden px-6 py-3 md:px-8 md:py-4 font-display font-medium text-base md:text-lg rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-midnight-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group";

  const variantClasses = {
    primary: "bg-gradient-to-r from-bronze-400 to-bronze-500 text-white shadow-[0_4px_20px_rgba(201,166,104,0.3)] hover:shadow-[0_8px_30px_rgba(201,166,104,0.4)] hover:-translate-y-0.5 active:translate-y-0 border border-white/10",
    secondary: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 active:translate-y-0",
    outline: "bg-transparent text-bronze-400 border-2 border-bronze-400/50 hover:border-bronze-400 hover:bg-bronze-400/10 hover:-translate-y-0.5 active:translate-y-0",
    ghost: "bg-transparent text-silver-300 hover:text-white hover:bg-white/5",
  };

  return (
    <button
      ref={buttonRef}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      onClick={createRipple}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <span className="relative z-10 flex items-center gap-2">
            {children}
            {icon && <span className="group-hover:translate-x-1 transition-transform duration-300">{icon}</span>}
          </span>
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: 'translate(-50%, -50%)',
                width: '200%',
                paddingBottom: '200%',
              }}
            />
          ))}
        </>
      )}
    </button>
  );
};
