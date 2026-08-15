import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Wind,
  Droplets,
  Eye,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  CloudDrizzle,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Bundled with the app rather than pulled from a CDN in index.html, so the
// stylesheet is no longer a render-blocking cross-origin request.
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons broken by bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DASMARINAS_COORDS: [number, number] = [14.3294, 120.9367];

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

type WeatherTheme = {
  label: string;
  bg: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  textClass: string;
  subTextClass: string;
};

// Every weather ground is mixed from the site's own primary / accent / gray
// ramps, so the card still reads as weather without importing a second colour
// system (the old thunderstorm indigo→violet in particular sat outside it).
const THUNDERSTORM: WeatherTheme = {
  label: 'Thunderstorm',
  bg: 'radial-gradient(120% 120% at 15% 0%, #00295e 0%, #00142f 55%, #351d00 100%)',
  icon: CloudLightning,
  iconClass: 'text-accent-300',
  textClass: 'text-white',
  subTextClass: 'text-accent-100',
};

function getWeatherTheme(code: number): WeatherTheme {
  if (code === 0)
    return {
      label: 'Clear Sky',
      bg: 'radial-gradient(120% 120% at 20% 0%, #0066eb 0%, #3385ef 55%, #f7a133 100%)',
      icon: Sun,
      iconClass: 'text-accent-200',
      textClass: 'text-white',
      subTextClass: 'text-primary-100',
    };
  if (code <= 2)
    return {
      label: 'Partly Cloudy',
      bg: 'radial-gradient(120% 120% at 20% 0%, #0052bc 0%, #3385ef 60%, #99c2f7 100%)',
      icon: Cloud,
      iconClass: 'text-white',
      textClass: 'text-white',
      subTextClass: 'text-primary-100',
    };
  if (code === 3)
    return {
      label: 'Overcast',
      bg: 'radial-gradient(120% 120% at 20% 0%, #3a4356 0%, #4e5868 55%, #6b7789 100%)',
      icon: Cloud,
      iconClass: 'text-gray-200',
      textClass: 'text-white',
      subTextClass: 'text-gray-200',
    };
  if (code <= 49)
    return {
      label: 'Foggy',
      bg: 'radial-gradient(120% 120% at 20% 0%, #4e5868 0%, #6b7789 55%, #97a3b6 100%)',
      icon: Eye,
      iconClass: 'text-gray-100',
      textClass: 'text-white',
      subTextClass: 'text-gray-100',
    };
  if (code <= 59)
    return {
      label: 'Drizzle',
      bg: 'radial-gradient(120% 120% at 20% 0%, #00295e 0%, #0052bc 60%, #66a3f3 100%)',
      icon: CloudDrizzle,
      iconClass: 'text-primary-200',
      textClass: 'text-white',
      subTextClass: 'text-primary-100',
    };
  if (code <= 69)
    return {
      label: 'Rain',
      bg: 'radial-gradient(120% 120% at 20% 0%, #00295e 0%, #00142f 55%, #0052bc 100%)',
      icon: CloudRain,
      iconClass: 'text-primary-200',
      textClass: 'text-white',
      subTextClass: 'text-primary-100',
    };
  if (code <= 79)
    return {
      label: 'Snow',
      bg: 'radial-gradient(120% 120% at 20% 0%, #99c2f7 0%, #cce0fb 55%, #e6f0fd 100%)',
      icon: CloudSnow,
      iconClass: 'text-primary-600',
      textClass: 'text-primary-900',
      subTextClass: 'text-primary-800',
    };
  if (code <= 84)
    return {
      label: 'Rain Showers',
      bg: 'radial-gradient(120% 120% at 20% 0%, #00295e 0%, #0052bc 55%, #66a3f3 100%)',
      icon: CloudRain,
      iconClass: 'text-primary-200',
      textClass: 'text-white',
      subTextClass: 'text-primary-100',
    };
  if (code <= 94) return THUNDERSTORM;
  return THUNDERSTORM;
}

const STATS = [
  {
    value: '703,141',
    labelKey: 'glance.residents',
    label: 'Residents',
    subKey: 'glance.census2020',
    sub: '2020 census population',
  },
  {
    value: '75',
    labelKey: 'glance.barangays',
    label: 'Barangays',
    subKey: 'glance.adminVillages',
    sub: 'Administrative villages',
  },
  {
    value: '1st Class City',
    labelKey: 'glance.incomeClass',
    label: 'Income Classification',
    subKey: 'glance.incomeClassSub',
    sub: 'Income classification',
  },
  {
    value: '90.36',
    labelKey: 'glance.landArea',
    label: 'km²',
    subKey: 'glance.totalLandArea',
    sub: 'Total land area',
  },
];

export default function CityGlanceSection() {
  const { t } = useTranslation('common');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    const cachedTemp = localStorage.getItem('bd_weather_full');
    const cachedTime = localStorage.getItem('bd_weather_full_time');
    if (
      cachedTemp &&
      cachedTime &&
      Date.now() - parseInt(cachedTime) < 1_800_000
    ) {
      setWeather(JSON.parse(cachedTemp));
      return;
    }
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=14.3294&longitude=120.9367&current_weather=true'
    )
      .then(r => r.json())
      .then(data => {
        if (data?.current_weather) {
          const w: WeatherData = {
            temperature: Math.round(data.current_weather.temperature),
            windspeed: Math.round(data.current_weather.windspeed),
            weathercode: data.current_weather.weathercode,
          };
          localStorage.setItem('bd_weather_full', JSON.stringify(w));
          localStorage.setItem('bd_weather_full_time', String(Date.now()));
          setWeather(w);
        }
      })
      .catch(() => {});
  }, []);

  // A full-bleed Leaflet map on a phone swallows the vertical swipe that was
  // meant to scroll the page. On coarse pointers the map becomes a static
  // locator with a link out to full-screen maps, which is what someone on a
  // phone actually wants anyway.
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const sync = () => setIsCoarsePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const theme = weather ? getWeatherTheme(weather.weathercode) : null;
  const WeatherIcon = theme?.icon ?? Cloud;
  // Snow is the one pale ground; its type and scrim have to invert.
  const isLightGround = theme?.label === 'Snow';
  const textClass = theme?.textClass ?? 'text-white';
  const subTextClass = isLightGround
    ? (theme?.subTextClass ?? 'text-primary-800')
    : 'text-white/70';

  return (
    <section className="bg-white border-b border-[color:var(--color-rule)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        {/* Header */}
        <div
          className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 mb-6 sm:mb-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateX(-20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div>
            <span className="civic-eyebrow mb-2">
              {t('glance.eyebrow', 'City Profile')}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[color:var(--color-ink)] tracking-tight">
              {t('glance.title', 'Dasmariñas at a Glance')}
            </h2>
          </div>
          <Link
            to="/government/departments/executive"
            className="-mr-2 inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-sm)] px-2 py-2.5 text-sm font-semibold text-[color:var(--color-civic)] transition-colors hover:text-primary-900 active:bg-primary-50"
          >
            {t('glance.viewProfile', 'View City Profile')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {STATS.map((stat, idx) => (
            <div
              key={stat.labelKey}
              className="civic-card civic-card--rule p-3.5 sm:p-4"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateY(16px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: `${100 + idx * 80}ms`,
              }}
            >
              <div className="tabular text-2xl md:text-3xl font-black tracking-tight text-[color:var(--color-civic)] leading-none mb-1 mt-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-gray-800">
                {t(stat.labelKey, stat.label)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {t(stat.subKey, stat.sub)}
              </div>
            </div>
          ))}
        </div>

        {/* Weather + Map row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Weather */}
          <div
            className="rounded-[var(--radius-lg)] p-5 flex flex-col justify-between min-h-44 sm:min-h-48 relative overflow-hidden transition-all duration-700"
            style={{
              background:
                theme?.bg ??
                'radial-gradient(120% 120% at 20% 0%, #00295e 0%, #00142f 55%, #0052bc 100%)',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translateX(-28px)',
              transition:
                'background 0.7s ease, opacity 0.6s ease 420ms, transform 0.6s ease 420ms',
            }}
          >
            {/* Decorative icon — right half only */}
            <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center pointer-events-none z-0">
              <WeatherIcon
                className={`h-32 w-32 opacity-20 ${theme?.iconClass ?? 'text-white'}`}
              />
            </div>

            {/* Scrim on the text side only — strength follows the ground, so
                the pale snow gradient isn't needlessly darkened. */}
            <div
              className={`absolute inset-0 bg-gradient-to-r to-transparent pointer-events-none z-[1] ${
                isLightGround
                  ? 'from-white/40 via-white/10'
                  : 'from-black/30 via-black/10'
              }`}
            />

            {/* Header */}
            <div className="flex items-center gap-2 mb-4 relative z-[2]">
              <WeatherIcon
                className={`h-5 w-5 ${theme?.iconClass ?? 'text-white'}`}
              />
              <span className={`text-sm font-semibold ${textClass}`}>
                {t('glance.weather', 'Weather')}
              </span>
            </div>

            {/* Content */}
            <div className="relative z-[2]">
              <div className={`text-xs mb-0.5 ${subTextClass}`}>
                Dasmariñas City, Cavite
              </div>
              <div className={`tabular text-xs mb-4 ${subTextClass}`}>
                14.3294° N, 120.9367° E
              </div>

              {weather && theme ? (
                <>
                  <div
                    className={`tabular text-5xl font-black leading-none tracking-tight mb-1 ${textClass}`}
                  >
                    {weather.temperature}°C
                  </div>
                  <div className={`text-sm font-semibold mb-4 ${textClass}`}>
                    {theme.label}
                  </div>
                  <div
                    className={`flex items-center gap-4 text-xs ${subTextClass}`}
                  >
                    <span className="flex items-center gap-1">
                      <Wind className="h-3.5 w-3.5" />
                      <span className="tabular">{weather.windspeed} km/h</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5" />
                      {t('glance.caviteProvince', 'Province of Cavite')}
                    </span>
                  </div>
                </>
              ) : (
                <div className={`tabular text-3xl font-black ${subTextClass}`}>
                  --°C
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div
            className="relative lg:col-span-2 rounded-[var(--radius-lg)] overflow-hidden border border-[color:var(--color-rule)] h-56 sm:h-64 lg:h-auto lg:min-h-[15rem]"
            style={{
              isolation: 'isolate',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translateY(16px)',
              transition: 'opacity 0.7s ease 500ms, transform 0.7s ease 500ms',
            }}
          >
            <MapContainer
              center={DASMARINAS_COORDS}
              zoom={12}
              scrollWheelZoom={false}
              dragging={!isCoarsePointer}
              touchZoom={!isCoarsePointer}
              zoomControl={!isCoarsePointer}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={DASMARINAS_COORDS}>
                <Popup>
                  <strong>Dasmariñas City</strong>
                  <br />
                  Cavite, Philippines
                </Popup>
              </Marker>
            </MapContainer>

            {/* With panning disabled on touch, this is how you still get to a
                real map — and it doubles as the tap target the static map
                otherwise lacks. */}
            {isCoarsePointer && (
              <a
                href="https://maps.google.com/?q=Dasmari%C3%B1as+City+Hall+Cavite"
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 right-3 z-[var(--z-raised)] inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-md)] border border-[color:var(--color-rule)] bg-white/95 px-3.5 text-sm font-semibold text-[color:var(--color-civic)] shadow-soft-md backdrop-blur-sm active:bg-primary-50"
              >
                {t('glance.openInMaps', 'Open in Maps')}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
