import React, { ReactNode } from 'react';

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, className = '' }) => {
  const baseClasses = 'transition-colors duration-200';
  
  return (
    <a 
      href={href} 
      className={`${baseClasses} ${className}`}
    >
      {children}
    </a>
  );
};