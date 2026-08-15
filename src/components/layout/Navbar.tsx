import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Menu,
  ChevronDown,
  Phone,
  Thermometer,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import type { LanguageType } from '../../types/index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function formatDatetime(): string {
  const now = new Date();
  const date = now.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  });
  const time = now.toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });
  return `${date} · ${time} PHT`;
}

const HOTLINES = [
  {
    labelKey: 'hotlines.police',
    label: 'PNP',
    number: '0956-800-3329',
    tel: '09568003329',
    allNumbers: ['0956-800-3329', '0998-598-5598', '0929-665-9533'],
  },
  {
    labelKey: 'hotlines.fire',
    label: 'BFP',
    number: '0995-336-9534',
    tel: '09953369534',
    allNumbers: ['0995-336-9534', '0992-448-7857'],
  },
  {
    labelKey: 'hotlines.mdrrmo',
    label: 'CDRRMO',
    number: '0908-818-5555',
    tel: '09088185555',
    allNumbers: ['0908-818-5555', '(046) 481-0555'],
  },
  {
    labelKey: 'hotlines.ambulance',
    label: 'Ambulance',
    number: '0998-566-5555',
    tel: '09985665555',
    allNumbers: ['0998-566-5555'],
  },
];

const TOTAL_HOTLINE_NUMBERS = HOTLINES.reduce(
  (n, h) => n + h.allNumbers.length,
  0
);

const CURRENCIES = ['USD', 'EUR', 'JPY', 'GBP', 'SGD'] as const;
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
  SGD: 'S$',
};

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hotlinesOpen, setHotlinesOpen] = useState(false);
  const [hotlinePopover, setHotlinePopover] = useState<{
    label: string;
    rect: DOMRect;
  } | null>(null);
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();

  const navRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const scrollYRef = useRef(0);
  const isAnimatingRef = useRef(false);

  // ── Info bar state ─────────────────────────────────────────────
  const [rates, setRates] = useState<Record<string, string>>({});
  const [currencyIdx, setCurrencyIdx] = useState(0);
  const [forexVisible, setForexVisible] = useState(true);
  const [temp, setTemp] = useState('--');
  const [datetime, setDatetime] = useState(formatDatetime());

  const activeCurrency = CURRENCIES[currencyIdx];
  const forexDisplay = rates[activeCurrency]
    ? `${CURRENCY_SYMBOLS[activeCurrency]}1 ${activeCurrency} = ₱${rates[activeCurrency]}`
    : `1 ${activeCurrency} = ₱--`;

  useEffect(() => {
    const timer = setInterval(() => setDatetime(formatDatetime()), 60_000);

    const cached = localStorage.getItem('bd_rates');
    const cachedTime = localStorage.getItem('bd_rates_time');
    if (cached && cachedTime && Date.now() - parseInt(cachedTime) < 3_600_000) {
      setRates(JSON.parse(cached));
    } else {
      fetch('https://open.er-api.com/v6/latest/PHP')
        .then(r => r.json())
        .then(data => {
          if (data?.rates) {
            const phpRates = data.rates as Record<string, number>;
            const computed: Record<string, string> = {};
            for (const cur of ['USD', 'EUR', 'JPY', 'GBP', 'SGD']) {
              if (phpRates[cur]) {
                computed[cur] = (1 / phpRates[cur]).toFixed(2);
              }
            }
            localStorage.setItem('bd_rates', JSON.stringify(computed));
            localStorage.setItem('bd_rates_time', String(Date.now()));
            setRates(computed);
          }
        })
        .catch(() => {});
    }

    const currencyTimer = setInterval(() => {
      setForexVisible(false);
      setTimeout(() => {
        setCurrencyIdx(i => (i + 1) % CURRENCIES.length);
        setForexVisible(true);
      }, 300);
    }, 3_000);

    // Dasmariñas coordinates: 14.3294, 120.9367
    const cachedTemp = localStorage.getItem('bd_temp');
    const cachedTempTime = localStorage.getItem('bd_temp_time');
    if (
      cachedTemp &&
      cachedTempTime &&
      Date.now() - parseInt(cachedTempTime) < 1_800_000
    ) {
      setTemp(cachedTemp);
    } else {
      fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=14.3294&longitude=120.9367&current_weather=true'
      )
        .then(r => r.json())
        .then(data => {
          if (data?.current_weather?.temperature !== undefined) {
            const t = `${Math.round(data.current_weather.temperature)}°C`;
            localStorage.setItem('bd_temp', t);
            localStorage.setItem('bd_temp_time', String(Date.now()));
            setTemp(t);
          }
        })
        .catch(() => {});
    }

    return () => {
      clearInterval(timer);
      clearInterval(currencyTimer);
    };
  }, []);

  // ── Body scroll lock ────────────────────────────────────────────
  const lockBodyScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = '100%';
  }, []);

  const unlockBodyScroll = useCallback(() => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollYRef.current);
  }, []);

  const closeMenu = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    unlockBodyScroll();
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 320);
  }, [unlockBodyScroll]);

  // Close on route change
  useEffect(() => {
    isAnimatingRef.current = false;
    closeMenu();
    setHotlinesOpen(false);
    setHotlinePopover(null);
  }, [location.pathname, closeMenu]);

  // Cleanup scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen, closeMenu]);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (hotlinePopover) return setHotlinePopover(null);
      if (hotlinesOpen) return setHotlinesOpen(false);
      if (mobileMenuOpen) {
        closeMenu();
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileMenuOpen, closeMenu, hotlinesOpen, hotlinePopover]);

  // Dismiss the desktop hotline popover on any outside press
  useEffect(() => {
    if (!hotlinePopover) return;
    const handler = () => setHotlinePopover(null);
    document.addEventListener('scroll', handler, true);
    return () => document.removeEventListener('scroll', handler, true);
  }, [hotlinePopover]);

  // Close on resize to desktop
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.innerWidth >= 1024 && mobileMenuOpen) {
          isAnimatingRef.current = false;
          closeMenu();
        }
      }, 150);
    };
    window.addEventListener('resize', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handler);
    };
  }, [mobileMenuOpen, closeMenu]);

  const changeLanguage = (lang: LanguageType) => {
    i18n.changeLanguage(lang);
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    if (!location.pathname.startsWith(href)) return false;
    return !mainNavigation.some(
      item =>
        item.href !== href &&
        item.href.startsWith(href) &&
        location.pathname.startsWith(item.href)
    );
  };

  const handleContactClick = (e: React.MouseEvent, href: string) => {
    if (href === '/#contact') {
      e.preventDefault();
      if (location.pathname === '/') {
        document
          .getElementById('contact')
          ?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(
          () =>
            document
              .getElementById('contact')
              ?.scrollIntoView({ behavior: 'smooth' }),
          300
        );
      }
    }
  };

  // Language detection resolves to region tags like "en-US", so an exact
  // match against "en" was always false and neither button ever showed as
  // selected. Compare the base subtag.
  const activeLang = (i18n.resolvedLanguage || i18n.language || 'en').split(
    '-'
  )[0];

  const langButtons = (size: 'sm' | 'lg') =>
    (['en', 'fil'] as LanguageType[]).map((lang, idx) => (
      <button
        key={lang}
        type="button"
        onClick={() => changeLanguage(lang)}
        aria-pressed={activeLang === lang}
        aria-label={`Switch to ${lang === 'en' ? 'English' : 'Filipino'}`}
        className={`font-bold uppercase transition-colors ${
          size === 'lg'
            ? 'flex-1 px-4 py-3 text-sm'
            : 'px-3 py-2 text-xs min-h-[36px]'
        } ${
          activeLang === lang
            ? 'bg-[color:var(--color-civic)] text-white'
            : 'bg-white text-[color:var(--color-ink-soft)] hover:bg-primary-50'
        } ${idx === 0 ? '' : 'border-l border-[color:var(--color-rule)]'}`}
      >
        {lang === 'en' ? 'EN' : 'FIL'}
      </button>
    ));

  return (
    <nav className="sticky top-0 z-[var(--z-nav)]">
      {/* ── Emergency hotlines ──────────────────────────────────
          Below lg the four services will not fit on one line, and the old
          horizontal scroll strip buried three of the four behind a swipe —
          the wrong trade for the most urgent content on a civic site. Small
          screens get a disclosure instead: one tap opens every number as a
          full-width dial target. */}
      <div className="bg-red-600 text-white">
        {/* Compact disclosure — below lg */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setHotlinesOpen(o => !o)}
            aria-expanded={hotlinesOpen}
            aria-controls="emergency-hotlines-panel"
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left min-h-[44px] transition-colors active:bg-red-700"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wide">
              {t('hotlines.barLabel', 'Emergency hotlines')}
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-red-100">
              {t('hotlines.count', {
                count: TOTAL_HOTLINE_NUMBERS,
                defaultValue: `${TOTAL_HOTLINE_NUMBERS} numbers`,
              })}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-[var(--duration-base)] ${
                  hotlinesOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </span>
          </button>

          {hotlinesOpen && (
            <div
              id="emergency-hotlines-panel"
              className="border-t border-red-500/60 bg-red-700 pb-1"
            >
              {HOTLINES.map(h => (
                <div key={h.label} className="border-b border-red-500/40">
                  <p className="px-4 pt-2.5 pb-1 text-xs font-bold uppercase tracking-widest text-red-200">
                    {t(h.labelKey, h.label)}
                  </p>
                  {h.allNumbers.map(num => (
                    <a
                      key={num}
                      href={`tel:${num.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-2.5 px-4 py-2.5 min-h-[44px] text-sm font-semibold tabular transition-colors active:bg-red-800"
                    >
                      <Phone
                        className="h-3.5 w-3.5 shrink-0 text-red-200"
                        aria-hidden="true"
                      />
                      {num}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inline row — lg and up, where all four fit without scrolling */}
        <div className="hidden lg:flex items-center px-6 py-2 gap-1 max-w-7xl mx-auto">
          <Phone className="h-3.5 w-3.5 mr-3 shrink-0 opacity-90" />
          <span className="text-xs font-bold uppercase tracking-wide opacity-80 mr-3">
            {t('hotlines.barLabel', 'Emergency hotlines')}
          </span>
          {HOTLINES.map((h, i) => (
            <React.Fragment key={h.label}>
              <div className="relative px-3 py-1">
                <a
                  href={`tel:${h.tel}`}
                  className="hover:underline transition-opacity hover:opacity-80 text-xs"
                >
                  <span className="font-bold">{t(h.labelKey, h.label)}:</span>{' '}
                  <span className="opacity-90 tabular">{h.number}</span>
                </a>
                {h.allNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={e => {
                      const rect = (
                        e.currentTarget as HTMLElement
                      ).getBoundingClientRect();
                      setHotlinePopover(prev =>
                        prev?.label === h.label
                          ? null
                          : { label: h.label, rect }
                      );
                    }}
                    aria-expanded={hotlinePopover?.label === h.label}
                    aria-label={`Show all ${t(h.labelKey, h.label)} numbers`}
                    className="ml-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[11px] font-bold leading-none opacity-80 transition-opacity hover:bg-white/25 hover:opacity-100"
                  >
                    +{h.allNumbers.length - 1}
                  </button>
                )}
              </div>
              {i < HOTLINES.length - 1 && (
                <span className="opacity-30 select-none" aria-hidden="true">
                  |
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Info bar ────────────────────────────────────────────
          Ambient, not navigational: an exchange-rate ticker earns no space on
          a phone, and the weather it duplicates already has a card on the home
          page. It appears from md up, where the room is free. */}
      <div className="hidden md:block bg-[color:var(--color-ink)] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-end gap-6">
          {/* Fixed min-width keeps the row from collapsing between ticks. */}
          <span className="flex items-center gap-1.5 opacity-90 min-w-[10.5rem] justify-end">
            <span
              className="tabular font-semibold transition-opacity duration-300"
              style={{ opacity: forexVisible ? 1 : 0 }}
            >
              {forexDisplay}
            </span>
          </span>
          <span className="text-white/25" aria-hidden="true">
            |
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <Thermometer className="h-3 w-3 opacity-70" aria-hidden="true" />
            <span className="text-gray-300">Dasmariñas</span>
            <span className="tabular font-semibold">{temp}</span>
          </span>
          <span className="hidden lg:inline text-white/25" aria-hidden="true">
            |
          </span>
          <span className="hidden lg:flex items-center gap-1.5 opacity-90">
            <Clock className="h-3 w-3 opacity-70" aria-hidden="true" />
            <span className="tabular font-semibold">{datetime}</span>
          </span>
        </div>
      </div>

      {/* ── Main Navbar ───────────────────────────────────── */}
      <div className="bg-white shadow-soft-sm border-b border-[color:var(--color-rule)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo — scaled to the bar it sits in at each size */}
            <Link
              to="/"
              className="shrink-0 flex items-center"
              aria-label={`${import.meta.env.VITE_GOVERNMENT_NAME} — home`}
            >
              <img
                src="/logo.png"
                alt={import.meta.env.VITE_GOVERNMENT_NAME}
                className="h-10 sm:h-12 lg:h-16 w-auto max-w-[190px] sm:max-w-[220px] object-contain"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavigation.map(item => (
                <div key={item.label} className="relative group">
                  {item.children ? (
                    <>
                      <button
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive(item.href)
                            ? 'text-[color:var(--color-civic)] bg-primary-50'
                            : 'text-[color:var(--color-ink)] hover:text-[color:var(--color-civic)] hover:bg-primary-50'
                        }`}
                        aria-haspopup="true"
                        aria-expanded={false}
                      >
                        {t(
                          `navbar.${item.label.replace(' ', '').toLowerCase()}`,
                          item.label
                        )}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-[var(--radius-lg)] shadow-soft-lg border border-[color:var(--color-rule)] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 z-[var(--z-dropdown)]">
                        <div className="py-1">
                          {item.children.map(child =>
                            child.href.startsWith('http') ? (
                              <a
                                key={child.label}
                                href={child.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-[color:var(--color-ink-soft)] hover:bg-primary-50 hover:text-[color:var(--color-civic)] transition-colors"
                              >
                                {child.label}
                              </a>
                            ) : (
                              <Link
                                key={child.label}
                                to={child.href}
                                className="block px-4 py-2 text-sm text-[color:var(--color-ink-soft)] hover:bg-primary-50 hover:text-[color:var(--color-civic)] transition-colors"
                              >
                                {child.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={e => handleContactClick(e, item.href)}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'text-[color:var(--color-civic)] bg-primary-50'
                          : 'text-[color:var(--color-ink)] hover:text-[color:var(--color-civic)] hover:bg-primary-50'
                      }`}
                    >
                      {t(
                        `navbar.${item.label.replace(' ', '').toLowerCase()}`,
                        item.label
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Language (lg only — it moves into the drawer below that) */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center border border-[color:var(--color-rule)] rounded-md overflow-hidden">
                {langButtons('sm')}
              </div>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => {
                  if (isAnimatingRef.current) return;
                  if (mobileMenuOpen) {
                    closeMenu();
                  } else {
                    isAnimatingRef.current = true;
                    setMobileMenuOpen(true);
                    lockBodyScroll();
                    setTimeout(() => {
                      isAnimatingRef.current = false;
                    }, 320);
                  }
                }}
                className="lg:hidden -mr-2 grid place-items-center h-11 w-11 rounded-md text-[color:var(--color-ink)] transition-colors active:bg-primary-50"
                aria-label={
                  mobileMenuOpen ? 'Close navigation' : 'Open navigation'
                }
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ──────────────────────────────────
            A scrollable sheet rather than a list that pushes the page down:
            the whole menu is reachable with a thumb, and every row clears the
            44px target floor. */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            ref={navRef}
            className="lg:hidden border-t border-[color:var(--color-rule)] bg-white overflow-y-auto overscroll-contain"
            style={{ maxHeight: 'calc(100dvh - var(--nav-offset))' }}
          >
            <div className="px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              {mainNavigation.map(item => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(prev =>
                            prev === item.label ? null : item.label
                          )
                        }
                        className="w-full flex justify-between items-center gap-3 px-3 py-3 min-h-[48px] text-base font-semibold text-[color:var(--color-ink)] rounded-[var(--radius-md)] transition-colors active:bg-primary-50"
                        aria-expanded={openDropdown === item.label}
                      >
                        {t(
                          `navbar.${item.label.replace(' ', '').toLowerCase()}`,
                          item.label
                        )}
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-[color:var(--color-civic)] transition-transform duration-[var(--duration-base)] ${
                            openDropdown === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="mb-1 ml-3 border-l-2 border-[color:var(--color-rule)] pl-2">
                          {item.children.map(child =>
                            child.href.startsWith('http') ? (
                              <a
                                key={child.label}
                                href={child.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-2 px-3 py-2.5 min-h-[44px] text-sm text-[color:var(--color-ink-soft)] rounded-[var(--radius-md)] transition-colors active:bg-primary-50"
                              >
                                {child.label}
                                <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
                              </a>
                            ) : (
                              <Link
                                key={child.label}
                                to={child.href}
                                className="flex items-center justify-between gap-2 px-3 py-2.5 min-h-[44px] text-sm text-[color:var(--color-ink-soft)] rounded-[var(--radius-md)] transition-colors active:bg-primary-50"
                              >
                                {child.label}
                                <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={e => handleContactClick(e, item.href)}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={`block px-3 py-3 min-h-[48px] text-base font-semibold rounded-[var(--radius-md)] transition-colors ${
                        isActive(item.href)
                          ? 'text-[color:var(--color-civic)] bg-primary-50'
                          : 'text-[color:var(--color-ink)] active:bg-primary-50'
                      }`}
                    >
                      {t(
                        `navbar.${item.label.replace(' ', '').toLowerCase()}`,
                        item.label
                      )}
                    </Link>
                  )}
                </div>
              ))}

              {/* Language lives here below lg — it used to vanish entirely
                  under the sm breakpoint, stranding Filipino readers on
                  phones. */}
              <div className="mt-3 border-t border-[color:var(--color-rule)] px-3 pt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                  {t('navbar.language', 'Language')}
                </p>
                <div className="flex items-stretch overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-rule)]">
                  {langButtons('lg')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop hotline popover — click-driven, so it works for touch users
          on hybrid laptops too. Portalled to escape the bar's own bounds. */}
      {hotlinePopover &&
        (() => {
          const h = HOTLINES.find(x => x.label === hotlinePopover.label);
          if (!h) return null;
          const { rect } = hotlinePopover;
          return createPortal(
            <div
              style={{
                position: 'fixed',
                top: rect.bottom + 8,
                left: rect.left + rect.width / 2,
                transform: 'translateX(-50%)',
                zIndex: 'var(--z-tooltip)' as unknown as number,
              }}
            >
              <div className="rounded-[var(--radius-lg)] bg-gray-900 p-3 text-xs text-white shadow-soft-lg min-w-max">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-red-300">
                  {t(h.labelKey, h.label)}
                </p>
                {h.allNumbers.map(num => (
                  <a
                    key={num}
                    href={`tel:${num.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-2 py-1.5 tabular transition-colors hover:text-red-300"
                  >
                    <Phone className="h-3 w-3 shrink-0 opacity-60" />
                    {num}
                  </a>
                ))}
              </div>
            </div>,
            document.body
          );
        })()}
    </nav>
  );
};

export default Navbar;
