import { Facebook, Github, Heart, MessageCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

function useVisitCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const SESSION_KEY = 'bdas_visited';
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY);
    const url = alreadyCounted ? '/api/visits' : '/api/visits?up=1';

    fetch(url)
      .then(r => r.json())
      .then(data => {
        const n = data?.count ?? null;
        if (n != null) {
          setCount(Number(n));
          if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, '1');
        }
      })
      .catch(() => setCount(0));
  }, []);

  return count;
}

const QUICK_LINKS = [
  { labelKey: 'navbar.services', href: '/services' },
  { labelKey: 'navbar.government', href: '/government/departments' },
  {
    labelKey: 'navbar.transparency',
    href: '/government/transparency-documents',
  },
  {
    labelKey: 'footer.fullDisclosure',
    href: '/government/transparency-documents/full-disclosure',
  },
  {
    labelKey: 'footer.foiReleases',
    href: '/government/transparency-documents/foi-releases',
  },
  { labelKey: 'contact.title', href: '#contact' },
];

const RESOURCES = [
  { label: 'Open Data Philippines', href: 'https://data.gov.ph' },
  { label: 'Freedom of Information', href: 'https://www.foi.gov.ph' },
  {
    label: 'Dasmariñas City Hall',
    href: 'https://www.facebook.com/officeofthecitymayordc',
  },
  { label: 'DILG FDP Portal', href: 'https://fdpp.blgs.gov.ph' },
  { label: 'PhilGEPS', href: 'https://www.philgeps.gov.ph' },
  { label: 'Official Gov.ph', href: 'https://www.gov.ph' },
];

export default function Footer() {
  const { t } = useTranslation('common');
  const visitCount = useVisitCount();

  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        {/* Cost banner — full width top row */}
        <div className="flex items-center justify-center gap-3 w-full border border-green-800 bg-green-900/20 rounded-xl px-6 py-4 mb-10">
          <span className="text-green-400 text-sm font-semibold">
            {t('footer.costLabel')}
          </span>
          <span className="text-3xl font-black text-yellow-300">₱0</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <img
                src="/logo.png"
                alt="BetterDasmariñas"
                className="h-20 w-auto"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {t('footer.mission')}
            </p>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.facebook.com/1023346407535869"
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/Shuashuaa/betterdasmarinas"
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://discord.gg/bettergovph"
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            {/* BetterGov.ph logo */}
            <a
              href="https://bettergov.ph"
              target="_blank"
              rel="noreferrer"
              className="inline-block opacity-50 hover:opacity-80 transition-opacity"
            >
              <img
                src="https://bettersolano.org/assets/images/logo/bettergov-footer.svg"
                alt="BetterGov.ph"
                className="h-10 w-auto brightness-0 invert"
              />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-2.5">
              {RESOURCES.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/Shuashuaa/betterdasmarinas"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 px-4 py-2.5 rounded-lg transition-colors"
              >
                <Heart className="h-4 w-4" />
                {t('footer.volunteer')}
              </a>
              <a
                href="https://github.com/Shuashuaa/betterdasmarinas"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-lg transition-colors"
              >
                <Github className="h-4 w-4" />
                {t('footer.contribute')}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-2 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>
            © {new Date().getFullYear()} BetterDasmariñas.org
            <span className="mx-2 opacity-40">|</span>
            MIT | CC BY 4.0
            <span className="mx-2 opacity-40">|</span>
            {t('footer.attribution')}
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <Eye className="h-3 w-3" />
            <span>
              {visitCount != null ? visitCount.toLocaleString() : '—'} visits
            </span>
          </span>
          <a
            href="https://github.com/Shuashuaa"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-300 transition-colors group"
          >
            <Heart className="h-3 w-3 text-gray-600 group-hover:text-red-400 group-hover:fill-red-400 transition-colors" />
            <span>
              {t('footer.builtBy')}{' '}
              <span className="text-gray-400 group-hover:text-white transition-colors font-medium">
                Joshua Tania
              </span>
            </span>
          </a>
          <span className="flex items-center gap-1.5 opacity-60">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            Ver. 1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
