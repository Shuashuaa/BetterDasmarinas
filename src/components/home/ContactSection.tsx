import { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CONTACTS = [
  {
    icon: Phone,
    labelKey: 'contact.phoneLabel',
    primary: '0995 068 4326',
    secondaryKey: 'contact.phoneHours',
    href: 'tel:09950684326',
    color: 'text-primary-700',
    bg: 'bg-primary-50',
    external: false,
  },
  {
    icon: Mail,
    labelKey: 'contact.emailLabel',
    primary: 'officeofthecitymayordc@gmail.com',
    secondaryKey: 'contact.emailResponse',
    href: 'mailto:officeofthecitymayordc@gmail.com',
    color: 'text-green-700',
    bg: 'bg-green-50',
    external: false,
  },
  {
    icon: MapPin,
    labelKey: 'contact.addressLabel',
    primary: 'contact.addressLine1',
    secondaryKey: 'contact.addressLine2',
    href: 'https://maps.google.com/?q=Dasmariñas+City+Hall+Cavite',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    external: true,
  },
];

interface ContactCardProps {
  contact: (typeof CONTACTS)[number];
  index: number;
}

function ContactCard({ contact, index }: ContactCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('common');
  const Icon = contact.icon;

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
    <a
      ref={ref}
      href={contact.href}
      {...(contact.external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : 'translateY(24px) scale(0.97)',
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms, box-shadow 0.2s, translate 0.2s`,
      }}
    >
      {/* Icon box */}
      <div
        className={`w-11 h-11 rounded-xl ${contact.bg} ${contact.color} flex items-center justify-center shrink-0`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">
          {t(contact.labelKey)}
        </span>
        <span
          className={`font-bold text-sm ${contact.color} group-hover:underline truncate`}
        >
          {contact.external ? t(contact.primary) : contact.primary}
        </span>
        <span className="text-xs text-gray-500 mt-0.5">
          {t(contact.secondaryKey)}
        </span>
      </div>
    </a>
  );
}

export default function ContactSection() {
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
    <section id="contact" className="bg-gray-50 py-12 border-b border-gray-100">
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
          <h2 className="text-xl font-black text-gray-900">
            {t('contact.title')}
          </h2>
          <Link
            to="/government/departments"
            className="text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
          >
            {t('contact.viewAll')}
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONTACTS.map((contact, idx) => (
            <ContactCard key={contact.labelKey} contact={contact} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
