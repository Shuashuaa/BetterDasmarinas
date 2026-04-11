import type { NavigationItem } from '../types';
import { serviceCategories as servicesData } from './yamlLoader';

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  category: string;
  slug: string;
  subcategories: Subcategory[];
}

export const mainNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: [
      ...(servicesData.categories as Category[]).map(category => ({
        label: category.category,
        href: `/services/${category.slug}`,
      })),
    ],
  },
  {
    label: 'Government',
    href: '/government',
    children: [
      { label: 'Departments & Officials', href: '/government/departments' },
      {
        label: 'Legislative (City Council)',
        href: '/government/legislative',
      },
      {
        label: 'Local Officials Directory',
        href: '/government/departments/officials',
      },
    ],
  },
  {
    label: 'Transparency',
    href: '/transparency',
    children: [
      { label: 'Full Disclosure Policy', href: '/transparency' },
      {
        label: 'Transparency Documents',
        href: '/government/transparency-documents',
      },
      { label: 'Annual Budget', href: '/government/transparency-documents' },
      {
        label: 'SALN',
        href: '/government/transparency-documents/saln',
      },
      { label: 'Freedom of Information', href: 'https://www.foi.gov.ph' },
    ],
  },
  {
    label: 'Statistics',
    href: '/government/reports-and-statistics',
    children: [
      {
        label: 'City Profile',
        href: '/government/reports-and-statistics/city-profile',
      },
      {
        label: 'DTI CMCI Profile',
        href: '/government/reports-and-statistics/dti-cmci-profile',
      },
      {
        label: 'Annual Report',
        href: '/government/reports-and-statistics/annual-report',
      },
      {
        label: 'Infrastructure Projects',
        href: '/government/reports-and-statistics/infrastructure-projects',
      },
      { label: 'Open Data PH', href: 'https://data.gov.ph' },
    ],
  },
  { label: 'Contact', href: '/#contact' },
];

export const footerNavigation = {
  mainSections: [
    {
      title: 'About',
      links: [
        { label: 'About the Portal', href: '/about' },
        { label: 'Accessibility', href: '/accessibility' },
        { label: 'Contact Us', href: '/about' },
        { label: 'Community Discord', href: '/discord' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'All Services', href: '/services' },
        ...(servicesData.categories as Category[])
          .slice(0, 6)
          .map(category => ({
            label: category.category,
            href: `/services/${category.slug}`,
          })),
        { label: 'Hotlines', href: '/philippines/hotlines' },
        { label: 'Holidays', href: '/philippines/holidays' },
      ],
    },
    {
      title: 'Government',
      links: [
        { label: 'Departments & Officials', href: '/government/departments' },
        {
          label: 'Legislative (City Council)',
          href: '/government/legislative',
        },
        {
          label: 'Local Officials Directory',
          href: '/government/departments/officials',
        },
        {
          label: 'Transparency Documents',
          href: '/government/transparency-documents',
        },
        { label: 'Freedom of Information', href: 'https://www.foi.gov.ph' },
      ],
    },
  ],
  socialLinks: [
    {
      label: 'Facebook',
      href: import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com',
    },
  ],
};
