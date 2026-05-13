import React from 'react';
import { cn } from './Card';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          {
            'bg-surface hover:bg-elevated text-tx-primary border border-border': variant === 'primary',
            'bg-elevated hover:bg-border text-tx-primary': variant === 'secondary',
            'border-2 border-gold text-gold hover:bg-gold/10': variant === 'outline',
            'hover:bg-elevated text-tx-secondary hover:text-tx-primary': variant === 'ghost',
            'bg-gold hover:bg-gold-hover text-[#111110] font-bold border-none': variant === 'gold',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
            'h-10 w-10 p-2': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
