import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import {
  Construction,
  Train,
  GraduationCap,
  Trophy,
  ArrowRight,
} from 'lucide-react';

const HIGHLIGHT_PROJECTS = [
  {
    icon: Construction,
    badge: 'Infrastructure',
    title: 'CALAX Subsection 3',
    subtitle: 'Silang–Dasmariñas (7.9 km)',
    status: 'Finishing Stages',
    statusDot: 'bg-green-500',
    desc: "Connects Silang (Aguinaldo) Interchange to Governor's Drive Interchange — lane markings and road signage nearing completion.",
    agency: 'DPWH / MPCALA',
  },
  {
    icon: Train,
    badge: 'Transit',
    title: 'LRT Line 6',
    subtitle: 'Niyog to Dasmariñas (19 km)',
    status: 'ROW Acquisition',
    statusDot: 'bg-yellow-400',
    desc: "Extends LRT-1 from Bacoor to Dasmariñas. Governor's Drive Station is a key 2026 logistics focus.",
    agency: 'DOTr / LRTA',
  },
  {
    icon: GraduationCap,
    badge: 'Education',
    title: 'UP-Dasmariñas Tech Innovation Campus',
    subtitle: '6-Story R&D Facility',
    status: 'Under Construction',
    statusDot: 'bg-yellow-400',
    desc: 'Specialized research and development facility expected to complete structural work by late 2026.',
    agency: 'UP / DPWH',
  },
  {
    icon: Trophy,
    badge: 'Sports',
    title: 'Dasmariñas Arena & Sports Complex',
    subtitle: '4,500–5,000 Seat Capacity',
    status: 'Fully Operational',
    statusDot: 'bg-green-500',
    desc: 'World-class arena hosting 16 sports disciplines. Now hosting major collegiate leagues (NCRAA).',
    agency: 'City Government',
  },
];

export default function RisingDasmarinasSection() {
  const headingRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();
  const ctaRef = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="rising-dasmarinas"
      className="py-14 bg-white border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          ref={headingRef}
          className="reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10"
        >
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">
              2026 Projects
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              What&apos;s Rising in Dasmariñas
            </h2>
            <p className="text-sm text-gray-500 mt-1.5 max-w-lg leading-relaxed">
              Major infrastructure, transit, education, and community projects
              shaping the city&apos;s future — sourced from the{' '}
              <span className="text-gray-600">
                2026 General Appropriations Act
              </span>
              , DPWH, and DOTr updates.
            </p>
          </div>
          <Link
            to="/government/reports-and-statistics/infrastructure-projects"
            className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all projects
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Cards */}
        <div
          ref={gridRef}
          className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100"
        >
          {HIGHLIGHT_PROJECTS.map(project => {
            const Icon = project.icon;
            return (
              <div
                key={project.title}
                className="bg-white p-5 flex flex-col gap-3 hover:bg-gray-50 transition-colors"
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <Icon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs lg:text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                    {project.badge}
                  </span>
                </div>

                {/* Title + subtitle */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {project.subtitle}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${project.statusDot}`}
                  />
                  <span className="text-xs text-gray-500">
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed flex-1">
                  {project.desc}
                </p>

                {/* Agency */}
                <p className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="text-gray-500 font-medium">
                    {project.agency}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="reveal mt-6 text-center">
          <Link
            to="/government/reports-and-statistics/infrastructure-projects"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            See Complete Project Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
