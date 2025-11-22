import React from 'react';

// Fix: Use a type intersection for component props to correctly include HTML attributes.
type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
};


export const Card = ({ children, className = '', onClick, disabled = false, ...props }: CardProps) => {
  const hoverClasses = disabled ? '' : 'hover:border-white/30 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:bg-white/10';
  const cursorClass = disabled ? 'cursor-not-allowed' : onClick ? 'cursor-pointer' : '';

  return (
    <div
      {...props}
      className={`
        group relative
        bg-white/5
        backdrop-blur-2xl border border-white/10 rounded-3xl
        p-6 md:p-8 transition-all duration-500 overflow-hidden
        shadow-[0_4px_24px_rgba(0,0,0,0.2)]
        ${hoverClasses} ${cursorClass} ${className}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Inner glow gradient */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-700
        pointer-events-none ${disabled ? 'hidden' : ''}
      `} />

      {/* Shine effect */}
      <div className={`
        absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine
        pointer-events-none ${disabled ? 'hidden' : ''}
      `} />

      <div className="relative z-10">
        {children}
      </div>
      {disabled && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl z-20 flex items-center justify-center"></div>}
    </div>
  );
};
