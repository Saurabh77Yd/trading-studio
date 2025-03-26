import React from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  icon?: IconType;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  icon: Icon, 
  children, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;