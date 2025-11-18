import React from 'react';

// Fix: Use a type intersection for component props to correctly include HTML attributes.
type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
};


export const Card = ({ children, className = '', onClick, disabled = false, ...props }: CardProps) => {
  const hoverClasses = disabled ? '' : 'hover:border-platinum-300/40 hover:shadow-[0_8px_32px_rgba(200,205,213,0.08)] hover:-translate-y-2';
  const cursorClass = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <div 
      {...props}
      className={`
        group relative
        bg-gradient-to-br from-midnight-400/40 to-midnight-500/60
        backdrop-blur-xl border border-platinum-300/20 rounded-2xl
        p-8 transition-all duration-500 overflow-hidden
        ${hoverClasses} ${cursorClass} ${className}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      <div className={`
        absolute inset-0 bg-gradient-to-br from-silver-200/0 via-silver-200/5 to-silver-200/0
        opacity-0 group-hover:opacity-100 transition-opacity duration-700
        pointer-events-none ${disabled ? 'hidden' : ''}
      `} />
      <div className="relative z-10">
        {children}
      </div>
       {disabled && <div className="absolute inset-0 bg-midnight-700/50 backdrop-blur-xs"></div>}
    </div>
  );
};
