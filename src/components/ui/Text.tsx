import { cn } from '../../lib/utils';

const sizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const transformClasses = {
  none: '',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
};

export function Text({
  size = 'md',
  transform = 'none',
  className = '',
  children,
}: {
  size?: 'sm' | 'md' | 'lg';
  transform?: 'none' | 'uppercase' | 'lowercase';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn(sizeMap[size], transformClasses[transform], className)}>
      {children}
    </p>
  );
}
