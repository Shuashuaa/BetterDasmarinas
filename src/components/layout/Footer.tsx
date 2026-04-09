import React from 'react';
import {
  Facebook,
  Github,
  MessageCircle,
  Mail,
  ExternalLink,
  Box,
  Heart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const QUICK_LINKS = [
  { label: 'About the Portal', href: '/about' },
  { label: 'Sitemap', href: '/sitemap' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Community Discord', href: 'https://discord.gg/', external: true },
  { label: 'Contact Us', href: '/about' },
];

const RESOURCE_LINKS = [
  { label: 'Open Data', href: 'https://data.gov.ph', external: true },
  {
    label: 'Freedom of Information',
    href: 'https://www.foi.gov.ph',
    external: true,
  },
  {
    label: 'LGU Dasmariñas Facebook',
    href: import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com',
    external: true,
  },
  { label: 'Sangguniang Panlungsod', href: '/legislative' },
  {
    label: 'DILG Full Disclosure',
    href: 'https://fdp.dilg.gov.ph',
    external: true,
  },
  { label: 'DTI CMCI', href: 'https://cmci.dti.gov.ph', external: true },
  { label: 'BLGF', href: 'https://blgf.gov.ph', external: true },
];

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 pt-12 pb-8">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Brand */}
          <div>
            <img
              src="/logo-clear.svg"
              alt={t('site_name')}
              className="h-12 w-auto max-w-[180px] object-contain mb-4"
              onError={e => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              A free, open-source community portal for residents of Dasmariñas,
              Cavite. Access government services, officials, and public
              information.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={
                  import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com'
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/bettergovph/bettergov"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-600 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800 text-gray-400 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(link =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Col 3 — Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map(link =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Col 4 — Cost / Contribute */}
          <div>
            <div
              className="inline-flex items-baseline gap-2 bg-green-900/40 border border-green-700/50 rounded-xl px-4 py-3 mb-5"
              role="status"
              aria-label="Cost to the People of Dasmariñas: Zero Pesos"
            >
              <span className="text-sm text-green-300 font-medium">
                Cost to the People of Dasmariñas
              </span>
              <span className="text-2xl font-black text-green-400">₱0</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://bettergov.ph/join-us"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-primary-700 hover:text-white text-sm font-semibold transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                Volunteer with Us
              </a>
              <a
                href="https://github.com/bettergovph/bettergov"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white text-sm font-semibold transition-colors"
              >
                <Github className="h-4 w-4 shrink-0" />
                Contribute at GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>&copy; {currentYear} BetterDasmariñas</span>
              <span className="hidden sm:inline text-gray-700">·</span>
              <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
                <a
                  href="https://creativecommons.org/publicdomain/zero/1.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC0 1.0 Universal License
                </a>
              </span>
              <span className="hidden sm:inline text-gray-700">·</span>
              <span className="text-gray-600">
                Not an official government website.
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-gray-600">
              <Heart className="h-3.5 w-3.5" />
              <span className="font-mono">Built by the community</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-gray-600">
              <Box className="h-3.5 w-3.5" />
              <span className="font-mono">v0.3.1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
