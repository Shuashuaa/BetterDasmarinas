import { useEffect, useRef, useState } from 'react';
import { Phone, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/Badge';

const OFFICIALS = [
  {
    initials: 'JB',
    name: 'Hon. Jennifer A. Barzaga',
    titleKey: 'leadership.cityMayor',
    badgeKey: 'leadership.electedMayor',
    phone: '0995 068 4326',
    tel: '09950684326',
    email: 'officeofthecitymayordc@gmail.com',
  },
  {
    initials: 'EB',
    name: 'Hon. Elpidio "Third" A. Barzaga III',
    titleKey: 'leadership.cityViceMayor',
    badgeKey: 'leadership.electedViceMayor',
    phone: '0917 132 9772',
    tel: '09171329772',
    email: 'officeofthevmdasma@gmail.com',
  },
];

interface OfficialCardProps {
  official: (typeof OFFICIALS)[number];
  index: number;
}

function OfficialCard({ official, index }: OfficialCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="civic-card civic-card--interactive overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : 'translateY(24px) scale(0.97)',
        transition: `opacity 0.55s ease ${index * 120}ms, transform 0.55s ease ${index * 120}ms, box-shadow 0.2s, translate 0.2s`,
      }}
    >
      {/* Top accent bar */}
      <div className="h-1.5 bg-primary-700 w-full" />

      <div className="p-4 sm:p-5 flex gap-3.5 sm:gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-100 text-primary-700 font-black text-base sm:text-lg flex items-center justify-center shrink-0">
          {official.initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Badge tone="primary" className="border border-primary-100 mb-1.5">
            {t(official.badgeKey)}
          </Badge>
          {/* Was `truncate`, which clipped the Vice Mayor's name on every
              phone. An official's name is the one thing here that must never
              be cut. */}
          <h3 className="font-black text-sm text-gray-900 leading-snug text-balance mb-0.5">
            {official.name}
          </h3>
          <p className="text-xs text-gray-500 mb-3">{t(official.titleKey)}</p>

          <div className="flex flex-col gap-0.5">
            <a
              href={`tel:${official.tel}`}
              className="-mx-1 flex min-h-[40px] items-center gap-2 rounded-[var(--radius-sm)] px-1 text-xs tabular text-gray-600 transition-colors hover:text-primary-700 active:bg-primary-50"
            >
              <Phone className="h-3.5 w-3.5 text-primary-500 shrink-0" />
              {official.phone}
            </a>
            {official.email && (
              <a
                href={`mailto:${official.email}`}
                className="-mx-1 flex min-h-[40px] items-center gap-2 rounded-[var(--radius-sm)] px-1 text-xs text-gray-600 transition-colors hover:text-primary-700 active:bg-primary-50"
              >
                <Mail className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                <span className="break-all">{official.email}</span>
              </a>
            )}
          </div>
        </div>

        {/* External link */}
        <Link
          to="/government/departments/executive"
          className="-m-1 grid h-11 w-11 shrink-0 self-start place-items-center rounded-[var(--radius-md)] text-[color:var(--color-civic)] transition-colors hover:text-primary-800 active:bg-primary-50"
          aria-label={t('leadership.viewProfile')}
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function LeadershipSection() {
  const { t } = useTranslation('common');
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-12 border-b border-[color:var(--color-rule)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          ref={headingRef}
          className="flex items-center justify-between mb-6"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? 'translateY(0)' : 'translateY(28px)',
            transition:
              'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h2 className="accent-heading text-xl font-black text-[color:var(--color-ink)]">
            {t('leadership.title')}
          </h2>
          <Link
            to="/government/departments/executive"
            className="shrink-0 -mr-2 rounded-[var(--radius-sm)] px-2 py-2.5 text-sm font-semibold text-[color:var(--color-civic)] transition-colors hover:text-primary-800 active:bg-primary-50"
          >
            {t('leadership.viewAll')}
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFICIALS.map((official, idx) => (
            <OfficialCard
              key={official.initials + idx}
              official={official}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
