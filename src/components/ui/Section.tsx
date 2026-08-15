import { cn } from '../../lib/utils';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  spacing?: 'compact' | 'default' | 'spacious';
  surface?: 'white' | 'muted';
};

// Bottom padding runs slightly larger than top — optically even, since a
// section's heading sits tight to its rule while its content ends ragged.
const spacingMap = {
  compact: 'pt-10 pb-12 md:pt-12 md:pb-14',
  default: 'pt-12 pb-14 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24',
  spacious: 'pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28',
};

const surfaceMap = {
  white: 'bg-[color:var(--color-canvas)]',
  // The civic band, not a neutral gray — keeps every surface in one hue family.
  muted: 'bg-[color:var(--color-surface-muted)]',
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
