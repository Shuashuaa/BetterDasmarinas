import React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const variantMap: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
  ghost: 'text-primary-700 hover:bg-primary-50',
  outline: 'border-2 border-current text-primary-700 hover:bg-primary-50',
};

const sizeMap: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

// eslint-disable-next-line react-refresh/only-export-components
export function buttonClasses(variant: Variant = 'primary', size: Size = 'md') {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-bold transition-colors duration-[var(--duration-fast)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    variantMap[variant],
    sizeMap[size]
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(buttonClasses(variant, size), className)} {...props}>
      {children}
    </button>
  );
}
