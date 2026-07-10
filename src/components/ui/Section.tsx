import { cn } from '../../lib/utils';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  spacing?: 'compact' | 'default' | 'spacious';
  surface?: 'white' | 'muted';
};

const spacingMap = {
  compact: 'py-10 md:py-12',
  default: 'py-12 md:py-16 lg:py-20',
  spacious: 'py-16 md:py-20 lg:py-24',
};

const surfaceMap = {
  white: 'bg-white',
  muted: 'bg-gray-50',
};

export default function Section({
  children,
  className,
  innerClassName,
  id,
  spacing = 'default',
  surface = 'white',
}: SectionProps) {
  return (
    <section
      className={cn(spacingMap[spacing], surfaceMap[surface], className)}
      id={id}
    >
      <div className={cn('max-w-7xl mx-auto px-4 sm:px-6', innerClassName)}>
        {children}
      </div>
    </section>
  );
}
