import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  ArrowRight,
  Users,
  Briefcase,
  Heart,
  GraduationCap,
  Trash2,
  TreePine,
  Home,
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
    labelKey: 'services.categories.environment.name',
    label: 'Environment',
    slug: 'environment',
    icon: TreePine,
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

export default function Hero() {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [allServices, setAllServices] = useState<ServicePage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [scrollY, setScrollY] = useState(0);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left — headline + CTAs */}
          <div>
            <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-1">
              {t('hero.welcome', 'WELCOME TO')}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4">
              {import.meta.env.VITE_GOVERNMENT_NAME}
            </h1>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
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
          <div>
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
      </div>
    </div>
  );
}
