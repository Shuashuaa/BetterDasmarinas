import React from 'react';
import { cn } from '../../lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className,
  as = 'div',
  interactive = false,
  padding = 'md',
}: CardProps) {
  return React.createElement(
    as,
    {
      className: cn(
        'card-surface rounded-[var(--radius-lg)]',
        paddingMap[padding],
        // Matches .civic-card--interactive so both card families lift, tint,
        // and settle identically.
        interactive &&
          'transition-[box-shadow,transform,border-color] duration-[var(--duration-base)] ease-[var(--ease-emphasized)] hover:shadow-soft-lg hover:-translate-y-0.5 hover:border-primary-200 active:translate-y-0 active:shadow-soft-sm active:duration-75',
        className
      ),
    },
    children
  );
}
