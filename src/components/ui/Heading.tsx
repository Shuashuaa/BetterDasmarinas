import React from 'react';
import { cn } from '../../lib/utils';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  eyebrow?: string;
  spacing?: boolean;
}

const headingStyles = {
  1: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
  2: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight',
  3: 'text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-snug',
  4: 'text-lg md:text-xl lg:text-2xl font-bold leading-snug',
  5: 'text-base md:text-lg lg:text-xl font-semibold leading-snug',
  6: 'text-sm md:text-base lg:text-lg font-semibold leading-snug',
};

export function Heading({
  level = 1,
  children,
  className,
  eyebrow,
  spacing = true,
}: HeadingProps) {
  const combinedClasses = cn(
    headingStyles[level],
    spacing && 'mb-4',
    className
  );

  const HeadingTag = `h${level}`;
  const heading = React.createElement(
    HeadingTag,
    { className: combinedClasses },
    children
  );

  if (!eyebrow) return heading;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">
        {eyebrow}
      </p>
      {heading}
    </div>
  );
}
