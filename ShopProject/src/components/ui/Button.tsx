import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export default function Button({ 
  variant = 'primary', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "px-6 py-3 rounded-full font-bold transition-all duration-300 disabled:opacity-50 active:scale-95";
  
  const variants = {
    primary: "bg-black text-white hover:bg-black/80",
    secondary: "bg-[#F0F0F0] text-black hover:bg-[#E0E0E0]",
    outline: "border border-black/10 hover:border-black hover:bg-black hover:text-white",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}