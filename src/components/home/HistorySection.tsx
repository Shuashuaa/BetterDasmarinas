import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const EVENT_KEYS = [
  'precolonial',
  'spanish',
  'revolution',
  'american',
  'industrial',
  'cityhood',
  'conversion',
  'present',
];

interface TimelineItemProps {
  year: string;
  title: string;
  text: string;
  isLast: boolean;
  index: number;
}

function TimelineItem({ year, title, text, isLast, index }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex gap-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
    >
      {/* Node + connector */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-3.5 h-3.5 rounded-full bg-primary-700 border-2 border-white ring-2 ring-primary-200 shrink-0 mt-1" />
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1 bg-gradient-to-b from-primary-300 to-primary-100 min-h-6" />
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 flex-1 hover:shadow-md transition-shadow">
        <span className="inline-block text-xs font-black text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-2.5 py-0.5 mb-2">
          {year}
        </span>
        <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function HistorySection() {
  const { t } = useTranslation('common');
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const rightRef = useRef<HTMLDivElement>(null);
  const [rightVisible, setRightVisible] = useState(false);

  useEffect(() => {
    const observe = (
      el: HTMLElement | null,
      setter: (v: boolean) => void,
      threshold = 0.15
    ) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            observer.disconnect();
          }
        },
        { threshold }
      );
      observer.observe(el);
      return () => observer.disconnect();
    };

    const c1 = observe(headingRef.current, setHeadingVisible);
    const c2 = observe(rightRef.current, setRightVisible);
    return () => {
      c1?.();
      c2?.();
    };
  }, []);

  return (
    <section className="bg-gray-50 py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div
          ref={headingRef}
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? 'translateY(0)' : 'translateY(28px)',
            transition:
              'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h2 className="text-xl font-black text-gray-900 mb-8">
            {t('history.title', 'Brief History of Dasmariñas City')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — timeline */}
          <div>
            {EVENT_KEYS.map((key, idx) => (
              <TimelineItem
                key={key}
                year={t(`history.events.${key}.year`)}
                title={t(`history.events.${key}.title`)}
                text={t(`history.events.${key}.text`)}
                isLast={idx === EVENT_KEYS.length - 1}
                index={idx}
              />
            ))}
          </div>

          {/* Right — feature cards (desktop only) */}
          <div
            ref={rightRef}
            className="hidden lg:flex flex-col gap-6 justify-center"
            style={{
              opacity: rightVisible ? 1 : 0,
              transform: rightVisible ? 'translateX(0)' : 'translateX(32px)',
              transition:
                'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 200ms',
            }}
          >
            {/* Cityhood card — butterfly resting at top-right */}
            <div className="bg-primary-700 text-white rounded-2xl p-8 shadow-lg relative overflow-visible">
              {/* Butterfly — toggle with VITE_BUTTERFLIES_ENABLED */}
              {import.meta.env.VITE_BUTTERFLIES_ENABLED === 'true' && (
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 64 52"
                  width="42"
                  height="34"
                  className="history-card-butterfly absolute top-3 right-3 pointer-events-none opacity-80"
                >
                  <g className="hero-butterfly__wing-l">
                    <path
                      d="M32,27 C28,18 10,10 6,18 C2,26 16,32 32,31 Z"
                      fill="#FF6B00"
                    />
                    <ellipse
                      cx="17"
                      cy="18"
                      rx="4"
                      ry="2.8"
                      fill="rgba(255,220,150,0.45)"
                    />
                    <path
                      d="M32,31 C24,34 8,40 10,46 C12,50 26,44 32,38 Z"
                      fill="#CC4E00"
                    />
                  </g>
                  <g className="hero-butterfly__wing-r">
                    <path
                      d="M32,27 C36,18 54,10 58,18 C62,26 48,32 32,31 Z"
                      fill="#FF6B00"
                    />
                    <ellipse
                      cx="47"
                      cy="18"
                      rx="4"
                      ry="2.8"
                      fill="rgba(255,220,150,0.45)"
                    />
                    <path
                      d="M32,31 C40,34 56,40 54,46 C52,50 38,44 32,38 Z"
                      fill="#CC4E00"
                    />
                  </g>
                  <ellipse cx="32" cy="31" rx="2.6" ry="8.5" fill="#1a0c00" />
                  <circle cx="32" cy="21" r="2.6" fill="#1a0c00" />
                  <line
                    x1="32"
                    y1="18"
                    x2="26"
                    y2="9"
                    stroke="#1a0c00"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                  <line
                    x1="32"
                    y1="18"
                    x2="38"
                    y2="9"
                    stroke="#1a0c00"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                  <circle cx="25.5" cy="8.5" r="1.6" fill="#1a0c00" />
                  <circle cx="38.5" cy="8.5" r="1.6" fill="#1a0c00" />
                </svg>
              )}

              <div className="text-5xl font-black mb-1">
                {t('history.cityhoodYear', '1998')}
              </div>
              <div className="text-lg font-semibold mb-3">
                {t('history.cityhoodLabel', 'Year Chartered as a City')}
              </div>
              <p className="text-primary-100 text-sm leading-relaxed">
                {t(
                  'history.cityhoodDesc',
                  'Dasmariñas was converted from a municipality to a component city via Republic Act No. 8506, signed on May 1, 1998.'
                )}
              </p>
            </div>

            {/* Founded card — chrysalis hanging at bottom-right */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm relative overflow-visible">
              <div className="text-5xl font-black text-primary-700 mb-1">
                {t('history.foundedYear', '1742')}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-3">
                {t('history.foundedLabel', 'Year Founded')}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t(
                  'history.foundedDesc',
                  'Named after Gómez Pérez Dasmariñas, the 7th Governor-General of the Philippines, the municipality was formally established in 1742.'
                )}
              </p>

              {/* Chrysalis — toggle with VITE_BUTTERFLIES_ENABLED */}
              {import.meta.env.VITE_BUTTERFLIES_ENABLED === 'true' && (
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 22 54"
                  width="22"
                  height="54"
                  className="history-card-cocoon absolute pointer-events-none"
                  style={{ top: '100%', right: '28px' }}
                >
                  {/* Silk thread */}
                  <line
                    x1="11"
                    y1="0"
                    x2="11"
                    y2="8"
                    stroke="#8B6B1E"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  {/* Attachment nub */}
                  <circle cx="11" cy="8" r="1.4" fill="#8B6B1E" />
                  {/* Chrysalis body */}
                  <path
                    d="M11,8 C7,10 4,17 4,27 C4,37 7,46 11,50 C15,46 18,37 18,27 C18,17 15,10 11,8 Z"
                    fill="#C8A044"
                  />
                  {/* Silk wrap texture lines */}
                  <path
                    d="M5.5,18 Q11,16.5 16.5,18"
                    stroke="#9A7820"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.7"
                  />
                  <path
                    d="M4.5,24 Q11,22.5 17.5,24"
                    stroke="#9A7820"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.7"
                  />
                  <path
                    d="M4.5,30 Q11,28.5 17.5,30"
                    stroke="#9A7820"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.7"
                  />
                  <path
                    d="M4.5,36 Q11,34.5 17.5,36"
                    stroke="#9A7820"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.7"
                  />
                  <path
                    d="M5.5,42 Q11,40.5 16.5,42"
                    stroke="#9A7820"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.7"
                  />
                  {/* Subtle highlight */}
                  <path
                    d="M9,13 C8,16 7.5,22 8,28"
                    stroke="rgba(255,220,120,0.4)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
