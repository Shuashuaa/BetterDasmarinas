import { cn } from '../../lib/utils';

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  tone?: 'primary' | 'success' | 'warning' | 'neutral';
  dot?: boolean;
};

const toneMap = {
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  neutral: 'bg-gray-100 text-gray-700',
};

const dotMap = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  neutral: 'bg-gray-400',
};

export function Badge({
  children,
  className,
  tone = 'neutral',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        toneMap[tone],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotMap[tone])} />}
      {children}
    </span>
  );
}
