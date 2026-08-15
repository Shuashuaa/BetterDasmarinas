import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const DESTINATIONS = [
  {
    label: 'City services',
    href: '/services',
    description:
      'Permits, clearances, health, education, waste collection and more.',
  },
  {
    label: 'Government',
    href: '/government/departments',
    description: 'Departments, offices, and the officials who run them.',
  },
  {
    label: 'Transparency documents',
    href: '/government/transparency-documents',
    description: 'Full disclosure reports, budgets, and FOI releases.',
  },
  {
    label: "What's rising",
    href: '/rising-dasmarinas',
    description: 'Infrastructure projects underway across the city.',
  },
];

export default function NotFound() {
  const location = useLocation();

  return (
    <>
      <SEO
        title="Page not found"
        description="The page you asked for is not on BetterDasmariñas.org. Browse city services, government offices, or transparency documents instead."
      />
      <section className="civic-hero border-b border-[color:var(--color-rule)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <p className="civic-eyebrow mb-4">Error 404</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-[color:var(--color-ink)] mb-4">
            We don&apos;t have a page at that address
          </h1>
          <p className="text-[color:var(--color-ink-soft)] text-base md:text-lg leading-relaxed max-w-prose mb-2">
            Nothing is published at{' '}
            <code className="font-mono text-sm bg-white border border-[color:var(--color-rule)] rounded px-1.5 py-0.5 break-all">
              {location.pathname}
            </code>
            {'. '}
            The link may be out of date, or the page may have moved as the
            portal grows.
          </p>
          <p className="text-[color:var(--color-ink-soft)] text-sm leading-relaxed max-w-prose mb-8">
            If you followed a link from elsewhere on this site, it&apos;s a bug
            worth reporting.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[color:var(--color-civic)] text-white font-bold text-sm rounded-[var(--radius-md)] shadow-soft-sm transition-[background-color,transform,box-shadow] duration-[var(--duration-fast)] hover:bg-primary-700 active:translate-y-px"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the home page
            </Link>
            <a
              href="https://github.com/Shuashuaa/betterdasmarinas/issues"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[color:var(--color-civic)] underline underline-offset-4 decoration-primary-200 hover:decoration-current transition-colors"
            >
              Report a broken link
            </a>
          </div>

          <p className="civic-eyebrow mb-4">Or start from one of these</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DESTINATIONS.map(item => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="group civic-card civic-card--interactive block h-full p-4"
                >
                  <span className="flex items-center gap-1.5 text-sm font-bold text-[color:var(--color-ink)] mb-1">
                    {item.label}
                    <ArrowRight className="h-3.5 w-3.5 text-[color:var(--color-civic)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-emphasized)] group-hover:translate-x-1" />
                  </span>
                  <span className="block text-xs text-[color:var(--color-ink-soft)] leading-relaxed">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
