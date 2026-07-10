import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  ArrowRight,
  Users,
  Briefcase,
  Heart,
  GraduationCap,
  Trash2,
  MapPin,
  Home,
  TrendingUp,
  Construction,
  Train,
  Trophy,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { serviceCategories, loadCategoryIndex } from '../../data/yamlLoader';

interface ServicePage {
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
}

const POPULAR_CATEGORIES = [
  {
    labelKey: 'services.categories.business.name',
    label: 'Business',
    slug: 'business',
    icon: Briefcase,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    labelKey: 'services.categories.health-services.name',
    label: 'Health',
    slug: 'health-services',
    icon: Heart,
    color: 'text-red-500 bg-red-50',
  },
  {
    labelKey: 'services.categories.education.name',
    label: 'Education',
    slug: 'education',
    icon: GraduationCap,
    color: 'text-green-600 bg-green-50',
  },
  {
    labelKey: 'services.categories.garbage-waste-disposal.name',
    label: 'Waste',
    slug: 'garbage-waste-disposal',
    icon: Trash2,
    color: 'text-orange-500 bg-orange-50',
  },
  {
    labelKey: 'services.categories.tourism.name',
    label: 'Tourism',
    slug: 'tourism',
    icon: MapPin,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    labelKey: 'services.categories.housing-land-use.name',
    label: 'Housing',
    slug: 'housing-land-use',
    icon: Home,
    color: 'text-purple-600 bg-purple-50',
  },
];

const STATUS_BORDER: Record<string, string> = {
  'Finishing Stages': 'border-anim-finishing',
  'Under Construction': 'border-anim-construction',
  'Fully Operational': 'border-anim-operational',
};

const RISING_TOPICS = [
  {
    Icon: Construction,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    label: 'CALAX Subsection 3',
    sub: 'Silang–Dasmariñas (7.9 km)',
    status: 'Finishing Stages',
    dot: 'bg-green-400',
    href: '/government/reports-and-statistics/infrastructure-projects',
    desc: "Connects the Silang (Aguinaldo) Interchange to the Governor's Drive Interchange. As of 2026, lane markings and road signage are nearing completion. This section completes a key expressway link between Cavite's interior municipalities and Metro Manila via CAVITEX.",
    agency: 'DPWH / MPCALA',
    source: '2026 General Appropriations Act, MPCALA Project Updates',
  },
  {
    Icon: Train,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    label: 'LRT Line 6',
    sub: 'Niyog to Dasmariñas (19 km)',
    status: 'Under Construction',
    dot: 'bg-yellow-400',
    href: '/government/reports-and-statistics/infrastructure-projects',
    desc: "Extends LRT-1 from Bacoor (Niyog Station) southward to Dasmariñas City. The Governor's Drive Station is a key logistics hub for 2026. Right-of-way (ROW) acquisition is the current focus, with full operations targeted by 2028–2029.",
    agency: 'DOTr / LRTA',
    source: 'DOTr Infrastructure Updates, 2026 GAA',
  },
  {
    Icon: GraduationCap,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    label: 'University of the Philippines - Dasmariñas Tech Campus',
    sub: '6-Story R&D Facility',
    status: 'Under Construction',
    dot: 'bg-yellow-400',
    href: '/government/reports-and-statistics/infrastructure-projects',
    desc: 'A specialized 6-story research and development facility within the University of the Philippines Dasmariñas campus. Expected to complete structural work by late 2026, it will house technology innovation labs and collaborative research spaces for CALABARZON.',
    agency: 'UP / DPWH',
    source: 'UP Dasmariñas Announcements, DPWH Region IV-A',
  },
  {
    Icon: Trophy,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    label: 'Dasmariñas Arena & Sports Complex',
    sub: '4,500–5,000 Seat Capacity',
    status: 'Fully Operational',
    dot: 'bg-green-400',
    href: '/government/reports-and-statistics/infrastructure-projects',
    desc: "A world-class indoor arena hosting 16 sports disciplines. Now fully operational and serving as a venue for major collegiate leagues including NCRAA. The complex supports Dasmariñas' goal of becoming a regional sports hub in CALABARZON.",
    agency: 'City Government of Dasmariñas',
    source: 'City Government Official Announcements, NCRAA 2026',
  },
];

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-gray-900 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function HeroButterfly({
  n,
  width,
  height,
  style,
  children,
}: {
  n: number;
  width: number;
  height: number;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [flying, setFlying] = useState(false);
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 64 52"
      width={width}
      height={height}
      className={`hero-butterfly hero-butterfly--${n}${flying ? ' hero-butterfly--flyaway' : ''}`}
      style={style}
      onMouseEnter={() => setFlying(true)}
      onAnimationEnd={e => {
        if (e.animationName.startsWith('hero-flyaway')) setFlying(false);
      }}
    >
      {children}
    </svg>
  );
}

export default function Hero() {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [allServices, setAllServices] = useState<ServicePage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<
    (typeof RISING_TOPICS)[number] | null
  >(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const cats = serviceCategories.categories as {
      category: string;
      slug: string;
    }[];
    Promise.all(
      cats.map(cat =>
        loadCategoryIndex(cat.slug).then(idx => ({
          cat,
          pages: idx.pages,
        }))
      )
    ).then(results => {
      const pages: ServicePage[] = [];
      for (const { cat, pages: catPages } of results) {
        for (const page of catPages) {
          pages.push({
            name: page.name,
            slug: page.slug,
            categorySlug: cat.slug,
            categoryName: cat.category,
          });
        }
      }
      setAllServices(pages);
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = query.trim()
    ? allServices
        .filter(
          s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.categoryName.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/services?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (page: ServicePage) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/services/${page.categorySlug}/${page.slug}`);
  };

  return (
    <div
      className="relative text-white overflow-hidden"
      style={{
        backgroundColor: '#003087',
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPositionY: `${scrollY * 0.35}px`,
      }}
    >
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/[0.03]" />
        <div className="absolute top-1/2 -right-20 w-[300px] h-[300px] rounded-full bg-blue-400/[0.05]" />
        <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-white/[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left — headline + CTAs */}
          <div>
            <p
              className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-1"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateX(-20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              {t('hero.welcome', 'WELCOME TO')}
            </p>
            {/* Title + clinging butterflies — wrapper is the positioning context */}
            <div
              className="relative mb-4"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateX(-24px)',
                transition:
                  'opacity 0.6s ease 100ms, transform 0.6s ease 100ms',
              }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-[54px] font-black leading-tight">
                {import.meta.env.VITE_GOVERNMENT_NAME}
              </h1>

              {/* Hero butterflies — toggle with VITE_BUTTERFLIES_ENABLED=true in .env */}
              {import.meta.env.VITE_BUTTERFLIES_ENABLED === 'true' && (
                <>
                  {/* Butterfly 1 — orange, resting on the "B" */}
                  <HeroButterfly
                    n={1}
                    width={48}
                    height={38}
                    style={{ top: '-4px', left: '-8px' }}
                  >
                    <g className="hero-butterfly__wing-l">
                      <path
                        d="M32,27 C28,18 10,10 6,18 C2,26 16,32 32,31 Z"
                        fill="#E8801A"
                      />
                      <ellipse
                        cx="17"
                        cy="18"
                        rx="4.5"
                        ry="3"
                        fill="rgba(255,200,80,0.45)"
                      />
                      <path
                        d="M32,31 C24,34 8,40 10,46 C12,50 26,44 32,38 Z"
                        fill="#C96010"
                      />
                    </g>
                    <g className="hero-butterfly__wing-r">
                      <path
                        d="M32,27 C36,18 54,10 58,18 C62,26 48,32 32,31 Z"
                        fill="#E8801A"
                      />
                      <ellipse
                        cx="47"
                        cy="18"
                        rx="4.5"
                        ry="3"
                        fill="rgba(255,200,80,0.45)"
                      />
                      <path
                        d="M32,31 C40,34 56,40 54,46 C52,50 38,44 32,38 Z"
                        fill="#C96010"
                      />
                    </g>
                    <ellipse cx="32" cy="31" rx="2.8" ry="9" fill="#2D1400" />
                    <circle cx="32" cy="21" r="2.8" fill="#2D1400" />
                    <line
                      x1="32"
                      y1="18"
                      x2="26"
                      y2="9"
                      stroke="#2D1400"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="32"
                      y1="18"
                      x2="38"
                      y2="9"
                      stroke="#2D1400"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <circle cx="25.5" cy="8.5" r="1.8" fill="#2D1400" />
                    <circle cx="38.5" cy="8.5" r="1.8" fill="#2D1400" />
                  </HeroButterfly>

                  {/* Butterfly 2 — blue-violet, resting near the "D" in Dasmariñas */}
                  <HeroButterfly
                    n={2}
                    width={40}
                    height={32}
                    style={{ top: '-8px', left: '44%' }}
                  >
                    <g className="hero-butterfly__wing-l">
                      <path
                        d="M32,27 C28,18 10,10 6,18 C2,26 16,32 32,31 Z"
                        fill="#6A72D8"
                      />
                      <ellipse
                        cx="16"
                        cy="18"
                        rx="4"
                        ry="2.8"
                        fill="rgba(200,220,255,0.4)"
                      />
                      <path
                        d="M32,31 C24,34 8,40 10,46 C12,50 26,44 32,38 Z"
                        fill="#4A50B8"
                      />
                    </g>
                    <g className="hero-butterfly__wing-r">
                      <path
                        d="M32,27 C36,18 54,10 58,18 C62,26 48,32 32,31 Z"
                        fill="#6A72D8"
                      />
                      <ellipse
                        cx="48"
                        cy="18"
                        rx="4"
                        ry="2.8"
                        fill="rgba(200,220,255,0.4)"
                      />
                      <path
                        d="M32,31 C40,34 56,40 54,46 C52,50 38,44 32,38 Z"
                        fill="#4A50B8"
                      />
                    </g>
                    <ellipse cx="32" cy="31" rx="2.6" ry="8.5" fill="#0D1440" />
                    <circle cx="32" cy="21" r="2.6" fill="#0D1440" />
                    <line
                      x1="32"
                      y1="18"
                      x2="26"
                      y2="9"
                      stroke="#0D1440"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <line
                      x1="32"
                      y1="18"
                      x2="38"
                      y2="9"
                      stroke="#0D1440"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <circle cx="25.5" cy="8.5" r="1.6" fill="#0D1440" />
                    <circle cx="38.5" cy="8.5" r="1.6" fill="#0D1440" />
                  </HeroButterfly>

                  {/* Butterfly 3 — teal-green, resting below the title near the center */}
                  <HeroButterfly
                    n={3}
                    width={44}
                    height={35}
                    style={{ top: '55%', left: '24%' }}
                  >
                    <g className="hero-butterfly__wing-l">
                      <path
                        d="M32,27 C28,18 10,10 6,18 C2,26 16,32 32,31 Z"
                        fill="#269C8A"
                      />
                      <ellipse
                        cx="16"
                        cy="18"
                        rx="4"
                        ry="2.8"
                        fill="rgba(180,255,230,0.35)"
                      />
                      <path
                        d="M32,31 C24,34 8,40 10,46 C12,50 26,44 32,38 Z"
                        fill="#1A7565"
                      />
                    </g>
                    <g className="hero-butterfly__wing-r">
                      <path
                        d="M32,27 C36,18 54,10 58,18 C62,26 48,32 32,31 Z"
                        fill="#269C8A"
                      />
                      <ellipse
                        cx="48"
                        cy="18"
                        rx="4"
                        ry="2.8"
                        fill="rgba(180,255,230,0.35)"
                      />
                      <path
                        d="M32,31 C40,34 56,40 54,46 C52,50 38,44 32,38 Z"
                        fill="#1A7565"
                      />
                    </g>
                    <ellipse cx="32" cy="31" rx="2.6" ry="8.5" fill="#082520" />
                    <circle cx="32" cy="21" r="2.6" fill="#082520" />
                    <line
                      x1="32"
                      y1="18"
                      x2="26"
                      y2="9"
                      stroke="#082520"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <line
                      x1="32"
                      y1="18"
                      x2="38"
                      y2="9"
                      stroke="#082520"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <circle cx="25.5" cy="8.5" r="1.6" fill="#082520" />
                    <circle cx="38.5" cy="8.5" r="1.6" fill="#082520" />
                  </HeroButterfly>

                  {/* Butterfly 4 — rose-pink, resting near the "ñ" */}
                  <HeroButterfly
                    n={4}
                    width={36}
                    height={28}
                    style={{ top: '-2px', left: '78%' }}
                  >
                    <g className="hero-butterfly__wing-l">
                      <path
                        d="M32,27 C28,18 10,10 6,18 C2,26 16,32 32,31 Z"
                        fill="#D45F7A"
                      />
                      <ellipse
                        cx="16"
                        cy="18"
                        rx="3.5"
                        ry="2.5"
                        fill="rgba(255,200,220,0.4)"
                      />
                      <path
                        d="M32,31 C24,34 8,40 10,46 C12,50 26,44 32,38 Z"
                        fill="#B04060"
                      />
                    </g>
                    <g className="hero-butterfly__wing-r">
                      <path
                        d="M32,27 C36,18 54,10 58,18 C62,26 48,32 32,31 Z"
                        fill="#D45F7A"
                      />
                      <ellipse
                        cx="48"
                        cy="18"
                        rx="3.5"
                        ry="2.5"
                        fill="rgba(255,200,220,0.4)"
                      />
                      <path
                        d="M32,31 C40,34 56,40 54,46 C52,50 38,44 32,38 Z"
                        fill="#B04060"
                      />
                    </g>
                    <ellipse cx="32" cy="31" rx="2.4" ry="8" fill="#3D0A18" />
                    <circle cx="32" cy="21" r="2.4" fill="#3D0A18" />
                    <line
                      x1="32"
                      y1="18"
                      x2="26"
                      y2="9"
                      stroke="#3D0A18"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <line
                      x1="32"
                      y1="18"
                      x2="38"
                      y2="9"
                      stroke="#3D0A18"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <circle cx="25.5" cy="8.5" r="1.5" fill="#3D0A18" />
                    <circle cx="38.5" cy="8.5" r="1.5" fill="#3D0A18" />
                  </HeroButterfly>
                </>
              )}
            </div>
            <p
              className="text-blue-100 text-base md:text-lg leading-relaxed mb-8 max-w-md"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateY(16px)',
                transition:
                  'opacity 0.6s ease 200ms, transform 0.6s ease 200ms',
              }}
            >
              {t('hero.subtitle')}
            </p>
            <div
              className="flex flex-wrap gap-3"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateY(16px)',
                transition:
                  'opacity 0.6s ease 320ms, transform 0.6s ease 320ms',
              }}
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                {t('hero.browseServices', 'Browse Services')}
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-white text-white font-bold text-sm rounded-lg hover:bg-white/10 transition-colors"
              >
                <Users className="h-4 w-4" />
                {t('hero.contactUs', 'Contact Us')}
              </a>
            </div>
          </div>

          {/* Right — search card */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translateX(32px)',
              transition: 'opacity 0.7s ease 150ms, transform 0.7s ease 150ms',
            }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <p className="text-gray-800 font-bold text-base mb-3">
                {t('hero.findService', 'Search Services')}
              </p>

              <div className="relative mb-5">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={e => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder={t(
                        'hero.searchPlaceholder',
                        'Search for a service...'
                      )}
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </form>

                {showDropdown && results.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    {results.map(page => (
                      <button
                        key={`${page.categorySlug}/${page.slug}`}
                        onMouseDown={e => {
                          e.preventDefault();
                          handleSelect(page);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-50 transition-colors flex items-center gap-2"
                      >
                        <Search className="h-3.5 w-3.5 text-primary-400 shrink-0" />
                        <span className="text-gray-800 flex-1">
                          {highlight(page.name, query)}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">
                          {page.categoryName}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {t('hero.popular', 'Popular Services')}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {POPULAR_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.slug}
                      to={`/services/${cat.slug}`}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all text-center group"
                    >
                      <div
                        className={`p-2 rounded-lg ${cat.color} group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 leading-tight">
                        {t(cat.labelKey, cat.label)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* What's Rising — horizontal card strip */}
        <div
          className="mt-8 pt-6 border-t border-white/10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 500ms, transform 0.6s ease 500ms',
          }}
        >
          {/* Strip header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-blue-300" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">
                What&apos;s Rising in Dasmariñas:
              </span>
            </div>
            <Link
              to="/government/reports-and-statistics/infrastructure-projects"
              className="text-blue-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Scrollable cards */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {RISING_TOPICS.map((topic, i) => (
              <button
                key={topic.label}
                onClick={() => setActiveProject(topic)}
                className={`flex-none w-[148px] rounded-lg p-3 flex flex-col gap-2.5 text-left cursor-pointer transition-colors ${STATUS_BORDER[topic.status] ?? 'border border-white/10'} ${
                  activeProject?.label === topic.label
                    ? 'bg-white/15'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: `opacity 0.5s ease ${600 + i * 120}ms`,
                }}
              >
                <topic.Icon className="h-4.5 w-4.5 text-white/50" />
                <span className="text-white/90 text-xs font-medium leading-snug">
                  {topic.label}
                </span>
                <div className="flex items-center gap-1.5 mt-auto">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${topic.dot}`}
                  />
                  <span className="text-[11px] text-white/40">
                    {topic.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Curved bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden leading-0">
        <svg
          viewBox="0 0 1440 56"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14"
          fill="white"
        >
          <path d="M0,56 C360,0 1080,56 1440,0 L1440,56 Z" />
        </svg>
      </div>

      {/* Project detail modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setActiveProject(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeProject.iconBg}`}
                >
                  <activeProject.Icon
                    className={`h-5 w-5 ${activeProject.iconColor}`}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {activeProject.label}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activeProject.sub}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-2 shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${activeProject.dot}`}
              />
              <span className="text-xs font-semibold text-gray-600">
                {activeProject.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              {activeProject.desc}
            </p>

            {/* Agency + Source */}
            <div className="border-t border-gray-100 pt-4 space-y-1.5">
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-600">Agency: </span>
                {activeProject.agency}
              </p>
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-600">Source: </span>
                {activeProject.source}
              </p>
            </div>

            {/* CTA */}
            <Link
              to={activeProject.href}
              onClick={() => setActiveProject(null)}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              See all infrastructure projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
