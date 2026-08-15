import React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'link';
type Size = 'sm' | 'md' | 'lg';

const variantMap: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-soft-sm',
  secondary:
    'bg-secondary-500 text-white hover:bg-secondary-600 shadow-soft-sm',
  ghost: 'text-primary-700 hover:bg-primary-50',
  outline:
    'border border-[color:var(--color-rule)] bg-white text-primary-700 hover:border-primary-300 hover:bg-primary-50',
  // Tertiary — carries an action without adding another filled or bordered box.
  link: 'text-[color:var(--color-civic)] underline underline-offset-4 decoration-primary-200 hover:decoration-current px-0 py-0',
};

const sizeMap: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

// eslint-disable-next-line react-refresh/only-export-components
export function buttonClasses(variant: Variant = 'primary', size: Size = 'md') {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-bold',
    'transition-[background-color,border-color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
    // Pressed state — a small settle so the click registers physically.
    'active:translate-y-px active:duration-75',
    'disabled:pointer-events-none disabled:opacity-50',
    variantMap[variant],
    variant === 'link' ? '' : sizeMap[size]
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
