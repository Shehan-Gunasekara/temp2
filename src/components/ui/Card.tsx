import React from 'react';
import { cn } from '../../utils/classNames';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn(
      "rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg",
      className
    )}>
      {children}
    </div>
  );
}