import Section from '../ui/Section';
import * as LucideIcons from 'lucide-react';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';

import { governmentCategories } from '../../data/yamlLoader';

interface Category {
  category: string;
  slug: string;
  description: string;
  icon: string;
}

interface GovernmentActivitySectionProps {
  title?: string;
  description?: string;
}

export default function GovernmentActivitySection({
  title,
  description,
}: GovernmentActivitySectionProps = {}) {
  const { t } = useTranslation();

  const getIcon = (iconName: string) => {
    const IconComponent = LucideIcons[
      iconName as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const displayedCategories = governmentCategories.categories as Category[];
  const headingRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section id="#government">
      <div ref={headingRef} className="reveal">
        <Heading level={2}>{title || t('governmentActivity.title')}</Heading>
        <Text className="text-gray-600 mb-6">
          {description || t('governmentActivity.description')}
        </Text>
      </div>

      <div
        ref={gridRef}
        className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {displayedCategories.map(category => (
          <Link
            key={category.slug}
            to={`/government/${category.slug}`}
            className="group block bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-200 p-5"
          >
            <div className="bg-primary-50 text-primary-700 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
              {getIcon(category.icon)}
            </div>
            <h3 className="text-sm font-bold mb-2 text-gray-900">
              {t(
                `governmentActivity.categories.${category.slug}.name`,
                category.category
              )}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              {t(
                `governmentActivity.categories.${category.slug}.description`,
                category.description
              )}
            </p>
            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">
              Government
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
