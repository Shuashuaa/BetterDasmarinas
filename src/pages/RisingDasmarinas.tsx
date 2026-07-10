import {
  Construction,
  Train,
  GraduationCap,
  Trophy,
  HeartPulse,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* ─── Data ─────────────────────────────────────────────────────────────── */

const INFRASTRUCTURE_PROJECTS = [
  {
    id: 'calax-s3',
    icon: Construction,
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    badge: 'National Infrastructure',
    badgeColor: 'bg-orange-100 text-orange-700',
    title: 'CALAX Subsection 3 (Silang–Dasmariñas)',
    subtitle: '7.9-kilometer expressway segment',
    status: 'Finishing Stages',
    statusColor: 'bg-green-100 text-green-700',
    agency: 'DPWH / MPCALA',
    source: 'DPWH PPP Project Brief 2026',
    sourceLabel: 'DPWH PPP Project Brief 2026',
    description:
      "This 7.9-kilometer segment of the Cavite-Laguna Expressway (CALAX) connects the Silang (Aguinaldo) Interchange to the Governor's Drive Interchange in Dasmariñas City.",
    details: [
      'As of March 2026, the project is in its finishing stages — lane markings and road signage installation are ongoing.',
      'Once complete, this section will significantly cut travel time between Silang and key points in Dasmariñas.',
      'The expressway forms part of the larger CALAX corridor linking Carmona (South Luzon Expressway) to the Cavite-Tagaytay-Batangas corridor.',
    ],
  },
  {
    id: 'lrt6',
    icon: Train,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    badge: 'Transit',
    badgeColor: 'bg-blue-100 text-blue-700',
    title: 'LRT Line 6 (Niyog to Dasmariñas)',
    subtitle: '19-kilometer light rail extension',
    status: 'ROW Acquisition & Pre-Construction',
    statusColor: 'bg-yellow-100 text-yellow-700',
    agency: 'Department of Transportation (DOTr)',
    source: 'LRTA Project Status Report (March 2026)',
    sourceLabel: 'LRTA Status Report – June 2025',
    sourceUrl:
      'https://www.lrta.gov.ph/wp-content/uploads/2025/07/Status-of-LRT-Projects-as-of-June-30-2025.pdf',
    description:
      'LRT Line 6 is a 19-kilometer rail project extending from the LRT-1 terminal in Bacoor to Dasmariñas City, designed to ease road congestion along the heavily trafficked Cavite corridor.',
    details: [
      'Active right-of-way (ROW) acquisition and pre-construction activities are underway as of 2026.',
      "The Governor's Drive Station is a key logistics focus for 2026, with land negotiations and utility relocation progressing.",
      'The line will connect Dasmariñas directly to the broader LRT-1 network, enabling seamless access to Metro Manila.',
      'Future Phase 2 & 3 plans envision stations deeper into Dasmariñas and surrounding Cavite municipalities.',
    ],
  },
];

const EDUCATION_PROJECTS = [
  {
    id: 'up-dasma',
    icon: GraduationCap,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    badge: 'Education & Innovation',
    badgeColor: 'bg-purple-100 text-purple-700',
    title: 'UP-Dasmariñas Technology Innovation Campus',
    subtitle: '6-story R&D facility',
    status: 'Under Construction',
    statusColor: 'bg-yellow-100 text-yellow-700',
    agency: 'University of the Philippines (UP) / DPWH',
    source: 'UP Official Gazette – Infrastructure',
    description:
      'A specialized 6-story facility within the University of the Philippines Dasmariñas campus focused on research and development (R&D) across science, technology, and innovation disciplines.',
    details: [
      'Structural completion of the primary facility is expected by late 2026.',
      'The campus will house laboratories, incubation spaces, and collaborative research centers.',
      'Aimed at positioning UPD as a hub for technology-driven development in the CALABARZON region.',
    ],
  },
  {
    id: 'kld',
    icon: GraduationCap,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    badge: 'Education & Innovation',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    title: 'Kolehiyo ng Lungsod ng Dasmariñas (KLD) Expansion',
    subtitle: 'Additional classrooms and lab buildings',
    status: 'Ongoing Construction',
    statusColor: 'bg-yellow-100 text-yellow-700',
    agency: 'Dasmariñas City Government',
    source: 'JSLA Architects – Dasmariñas University Masterplan',
    sourceUrl:
      'https://www.jslaarchitects.com/project_uri/dasmarinas-university-arena/',
    description:
      "Additional academic facilities for the city's public university, designed to accommodate a rapidly growing student population under the city's academic master plan.",
    details: [
      'Ongoing classroom and laboratory building construction is underway.',
      "The expansion aligns with the city's long-term academic masterplan, as designed by JSLA Architects.",
      'Aims to improve student-to-facility ratios and expand course offerings for Dasmariñas residents.',
    ],
  },
];

const COMMUNITY_PROJECTS = [
  {
    id: 'dasma-arena',
    icon: Trophy,
    color: 'text-primary-700',
    bg: 'bg-primary-50',
    badge: 'Sports & Recreation',
    badgeColor: 'bg-primary-100 text-primary-700',
    title: 'Dasmariñas Arena & Sports Complex',
    subtitle: '4,500–5,000 seat capacity, 16 sports disciplines',
    status: 'Fully Operational / Phase 2 Planning',
    statusColor: 'bg-green-100 text-green-700',
    agency: 'Dasmariñas City Government',
    source: 'JSLA Architects – Project Details',
    sourceUrl:
      'https://www.jslaarchitects.com/project_uri/dasmarinas-university-arena/',
    description:
      'A world-class multi-purpose arena supporting 16 sports disciplines, currently operational and serving as a regional sports hub in CALABARZON.',
    details: [
      'Currently fully operational and hosting major collegiate leagues including the NCRAA.',
      'Seating capacity of 4,500 to 5,000 spectators for large-scale sporting events.',
      'Phase 2 planning includes secondary aquatic facilities and expanded outdoor courts.',
      "Integrated into the city's broader academic sports complex vision.",
    ],
  },
  {
    id: 'pagamutan',
    icon: HeartPulse,
    color: 'text-red-700',
    bg: 'bg-red-50',
    badge: 'Health',
    badgeColor: 'bg-red-100 text-red-700',
    title: 'Pagamutan ng Dasmariñas – Tertiary Expansion',
    subtitle: 'Public hospital modernization',
    status: 'Active Procurement (FY 2026)',
    statusColor: 'bg-yellow-100 text-yellow-700',
    agency: 'City Government of Dasmariñas',
    source: 'PhilGEPS Notice Abstract (Ref: 12715652)',
    sourceUrl: 'https://notices.philgeps.gov.ph',
    description:
      "Modernization of the city's primary public hospital, Pagamutan ng Dasmariñas, into a higher-tier tertiary care facility to better serve the city's growing population.",
    details: [
      'Procurement for new diagnostic equipment and additional medical wings is active for the 2026 fiscal year.',
      'The expansion targets upgraded pathology, radiology, and critical care capabilities.',
      'Part of a broader city health infrastructure roadmap to reduce patient referrals to Metro Manila hospitals.',
    ],
  },
];

const ROAD_PROJECTS = [
  {
    name: 'Bacoor–Dasmariñas National Road Asphalt Overlay',
    location: 'Various Sections',
    budget: '₱41.7 Million',
    status: 'Starting Feb/March 2026',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    name: 'Canal Lining & Flood Control',
    location: 'Brgy. Sampaloc IV',
    budget: 'TBD',
    status: 'Active Bidding',
    statusColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    name: 'Road & Drainage Rehabilitation',
    location: 'Brgy. Mabuhay City',
    budget: '₱74.5 Million',
    status: 'Under Construction',
    statusColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Gen. Evangelista Road Rehabilitation',
    location: 'Tertiary Road Sections',
    budget: 'Ongoing',
    status: 'Asset Preservation',
    statusColor: 'bg-gray-100 text-gray-700',
  },
];

/* ─── Sub-components ────────────────────────────────────────────────────── */

interface Project {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  agency: string;
  source: string;
  sourceLabel?: string;
  sourceUrl?: string;
  description: string;
  details: string[];
}

function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`shrink-0 w-12 h-12 rounded-xl ${project.bg} ${project.color} flex items-center justify-center`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${project.badgeColor}`}
            >
              {project.badge}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${project.statusColor}`}
            >
              {project.status}
            </span>
          </div>
          <h3 className="text-base font-black text-gray-900 leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{project.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Details list */}
      <ul className="space-y-2 mb-4">
        {project.details.map((detail, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <span
              className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${project.bg.replace('bg-', 'bg-').replace('-50', '-400')}`}
            />
            {detail}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-gray-500">
          Agency:{' '}
          <span className="font-semibold text-gray-700">{project.agency}</span>
        </span>
        {project.sourceUrl ? (
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-semibold transition-colors"
          >
            {project.sourceLabel ?? project.source}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-xs text-gray-400">{project.source}</span>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  label,
  title,
  desc,
}: {
  label: string;
  title: string;
  desc: string;
}) {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal mb-6">
      <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 mb-1">
        {label}
      </span>
      <h2 className="text-xl font-black text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function RisingDasmarinas() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const infraRef = useScrollReveal<HTMLDivElement>();
  const eduRef = useScrollReveal<HTMLDivElement>();
  const communityRef = useScrollReveal<HTMLDivElement>();
  const roadsRef = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <SEO
        title="What's Rising in Dasmariñas"
        description="Comprehensive overview of major 2026 government infrastructure, transit, education, health, and road projects in Dasmariñas City, Cavite — sourced from the 2026 GAA, DPWH, and DOTr."
        keywords="dasmariñas projects, CALAX, LRT Line 6, DPWH 2026, infrastructure dasmarinas, UP Dasmariñas, Pagamutan, KLD expansion"
      />

      <main className="flex-grow bg-gray-50">
        {/* Hero banner */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-700 font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div ref={heroRef} className="reveal">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">
                2026 Project Updates
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
                What&apos;s Rising in Dasmariñas
              </h1>
              <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
                Based on the latest{' '}
                <strong>2026 General Appropriations Act (GAA)</strong> and
                project updates from <strong>DPWH</strong> and{' '}
                <strong>DOTr</strong>, here is a comprehensive list of upcoming
                and active government projects shaping the future of Dasmariñas
                City, Cavite.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {[
                  {
                    label: 'National Infrastructure',
                    color: 'bg-orange-100 text-orange-700',
                  },
                  { label: 'Transit', color: 'bg-blue-100 text-blue-700' },
                  {
                    label: 'Education',
                    color: 'bg-purple-100 text-purple-700',
                  },
                  {
                    label: 'Sports & Health',
                    color: 'bg-green-100 text-green-700',
                  },
                  {
                    label: 'Roads & Flood Mitigation',
                    color: 'bg-gray-100 text-gray-700',
                  },
                ].map(tag => (
                  <span
                    key={tag.label}
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14">
          {/* Major National Infrastructure */}
          <div>
            <SectionHeader
              label="Major National Infrastructure"
              title="Expressway & Rail Projects"
              desc="Large-scale national government projects directly serving Dasmariñas City."
            />
            <div
              ref={infraRef}
              className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {INFRASTRUCTURE_PROJECTS.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <SectionHeader
              label="Education & Innovation"
              title="Academic & Research Facilities"
              desc="New and expanding campuses investing in the city's human capital and knowledge economy."
            />
            <div
              ref={eduRef}
              className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {EDUCATION_PROJECTS.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>

          {/* Sports, Health & Community */}
          <div>
            <SectionHeader
              label="Sports, Health & Community"
              title="Arena, Hospital & Civic Facilities"
              desc="Projects that directly serve the health, recreation, and daily well-being of Dasmariñas residents."
            />
            <div
              ref={communityRef}
              className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {COMMUNITY_PROJECTS.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>

          {/* Roads & Flood Mitigation */}
          <div>
            <SectionHeader
              label="2026 GAA: Roads & Flood Mitigation"
              title="Road Rehabilitation & Drainage Projects"
              desc="Funded under the 2026 National Budget for the Cavite 3rd District via the DPWH Annual Procurement Plan."
            />
            <div
              ref={roadsRef}
              className="reveal overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wide text-gray-500">
                <span>Project Name</span>
                <span>Location</span>
                <span>Budget</span>
                <span>Status</span>
              </div>
              {/* Rows */}
              {ROAD_PROJECTS.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-5 py-4 text-sm ${
                    i < ROAD_PROJECTS.length - 1
                      ? 'border-b border-gray-100'
                      : ''
                  }`}
                >
                  <span className="font-semibold text-gray-900">
                    {row.name}
                  </span>
                  <span className="text-gray-500">{row.location}</span>
                  <span className="text-gray-700 font-medium">
                    {row.budget}
                  </span>
                  <span>
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${row.statusColor}`}
                    >
                      {row.status}
                    </span>
                  </span>
                </div>
              ))}
              {/* Source footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
                Source:
                <a
                  href="https://www.dpwh.gov.ph/DPWH/sites/default/files/GAA/APP/fy_2026_final_annual_procurement_plan_app_non-common_use_supplies_and_equipment_non-cse_-_part_1.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary-600 hover:text-primary-800 transition-colors inline-flex items-center gap-1"
                >
                  DPWH FY 2026 Annual Procurement Plan (Part 1)
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500 leading-relaxed">
            <p>
              <strong className="text-gray-700">Disclaimer:</strong> Project
              statuses, budgets, and timelines are based on publicly available
              government sources (DPWH, DOTr, LRTA, PhilGEPS) and are accurate
              as of <strong className="text-gray-700">April 2026</strong>. For
              the most current updates, visit the official agency websites or
              the Dasmariñas City Government&apos;s official channels.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
