import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  MapPin,
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

function getWeatherTheme(code: number): WeatherTheme {
  if (code === 0)
    return {
      label: 'Clear Sky',
      bg: 'linear-gradient(135deg, #1e90ff 0%, #87ceeb 60%, #fbbf24 100%)',
      icon: Sun,
      iconClass: 'text-yellow-300',
      textClass: 'text-white',
      subTextClass: 'text-blue-100',
    };
  if (code <= 2)
    return {
      label: 'Partly Cloudy',
      bg: 'linear-gradient(135deg, #3b82f6 0%, #93c5fd 60%, #e2e8f0 100%)',
      icon: Cloud,
      iconClass: 'text-white',
      textClass: 'text-white',
      subTextClass: 'text-blue-100',
    };
  if (code === 3)
    return {
      label: 'Overcast',
      bg: 'linear-gradient(135deg, #475569 0%, #94a3b8 100%)',
      icon: Cloud,
      iconClass: 'text-gray-200',
      textClass: 'text-white',
      subTextClass: 'text-slate-300',
    };
  if (code <= 49)
    return {
      label: 'Foggy',
      bg: 'linear-gradient(135deg, #64748b 0%, #cbd5e1 100%)',
      icon: Eye,
      iconClass: 'text-slate-200',
      textClass: 'text-white',
      subTextClass: 'text-slate-300',
    };
  if (code <= 59)
    return {
      label: 'Drizzle',
      bg: 'linear-gradient(135deg, #0369a1 0%, #7dd3fc 100%)',
      icon: CloudDrizzle,
      iconClass: 'text-blue-200',
      textClass: 'text-white',
      subTextClass: 'text-blue-200',
    };
  if (code <= 69)
    return {
      label: 'Rain',
      bg: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
      icon: CloudRain,
      iconClass: 'text-blue-300',
      textClass: 'text-white',
      subTextClass: 'text-blue-200',
    };
  if (code <= 84)
    return {
      label: 'Rain Showers',
      bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #93c5fd 100%)',
      icon: CloudRain,
      iconClass: 'text-blue-200',
      textClass: 'text-white',
      subTextClass: 'text-blue-200',
    };
  if (code <= 94)
    return {
      label: 'Thunderstorm',
      bg: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #7c3aed 100%)',
      icon: CloudLightning,
      iconClass: 'text-yellow-300',
      textClass: 'text-white',
      subTextClass: 'text-purple-200',
    };
  if (code <= 79)
    return {
      label: 'Snow',
      bg: 'linear-gradient(135deg, #bfdbfe 0%, #e0f2fe 100%)',
      icon: CloudSnow,
      iconClass: 'text-blue-300',
      textClass: 'text-blue-900',
      subTextClass: 'text-blue-600',
    };
  return {
    label: 'Thunderstorm',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #7c3aed 100%)',
    icon: CloudLightning,
    iconClass: 'text-yellow-300',
    textClass: 'text-white',
    subTextClass: 'text-purple-200',
  };
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

  const theme = weather ? getWeatherTheme(weather.weathercode) : null;
  const WeatherIcon = theme?.icon ?? Cloud;

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900">
            {t('glance.title', 'Dasmariñas at a Glance')}
          </h2>
          <Link
            to="/government/departments/executive"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
          >
            {t('glance.viewProfile', 'View City Profile')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {STATS.map(stat => (
            <div
              key={stat.labelKey}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <div className="text-2xl font-black text-primary-700 leading-none mb-1">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather */}
          <div
            className="rounded-xl p-5 flex flex-col justify-between min-h-48 relative overflow-hidden transition-all duration-700"
            style={{
              background:
                theme?.bg ??
                'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
            }}
          >
            {/* Decorative icon — right half only */}
            <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center pointer-events-none z-0">
              <WeatherIcon
                className={`h-32 w-32 opacity-20 ${theme?.iconClass ?? 'text-white'}`}
              />
            </div>

            {/* Left-to-right gradient so text area stays readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none z-[1]" />

            {/* Header */}
            <div className="flex items-center gap-2 mb-4 relative z-[2]">
              <WeatherIcon
                className={`h-5 w-5 ${theme?.iconClass ?? 'text-white'}`}
              />
              <span className="text-sm font-semibold text-white">
                {t('glance.weather', 'Weather')}
              </span>
            </div>

            {/* Content */}
            <div className="relative z-[2]">
              <div className="text-xs text-white/70 mb-0.5">
                Dasmariñas City, Cavite
              </div>
              <div className="text-xs text-white/70 mb-4">
                14.3294° N, 120.9367° E
              </div>

              {weather && theme ? (
                <>
                  <div className="text-5xl font-black leading-none mb-1 text-white">
                    {weather.temperature}°C
                  </div>
                  <div className="text-sm font-semibold mb-4 text-white/90">
                    {theme.label}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <Wind className="h-3.5 w-3.5" />
                      {weather.windspeed} km/h
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5" />
                      {t('glance.caviteProvince', 'Province of Cavite')}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-3xl font-black text-white opacity-50">
                  --°C
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div
            className="lg:col-span-2 rounded-xl overflow-hidden border border-gray-200 shadow-sm h-64 lg:h-auto"
            style={{ isolation: 'isolate' }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
              <MapPin className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-gray-700">
                {t('glance.location', 'Location')}
              </span>
            </div>
            <div className="h-56 lg:h-[calc(100%-36px)] relative z-0">
              <MapContainer
                center={DASMARINAS_COORDS}
                zoom={12}
                scrollWheelZoom={false}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
