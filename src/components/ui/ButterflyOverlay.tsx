import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import paroParo from '/paroparo.webp';

const BUTTERFLY_COUNT = 12;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Butterfly {
  id: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  flapSpeed: number;
  size: number;
}

function generateButterflies(): Butterfly[] {
  return Array.from({ length: BUTTERFLY_COUNT }, (_, i) => {
    const angle = (i / BUTTERFLY_COUNT) * 360 * (Math.PI / 180);
    const distance = randomBetween(30, 55);

    return {
      id: i,
      endX: Math.cos(angle) * distance,
      endY: Math.sin(angle) * distance,
      duration: randomBetween(4.5, 7.5),
      delay: randomBetween(0, 1.2),
      flapSpeed: randomBetween(0.4, 0.7),
      size: randomBetween(32, 52),
    };
  });
}

export default function ButterflyOverlay() {
  const { pathname } = useLocation();
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setButterflies(generateButterflies());
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!visible || butterflies.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {butterflies.map(b => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={
              {
                '--end-x': `${b.endX}vw`,
                '--end-y': `${b.endY}vh`,
                animation: [
                  `butterflyDrift ${b.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${b.delay}s both`,
                  `butterflyFade ${b.duration + 1}s ease ${b.delay}s both`,
                ].join(', '),
              } as React.CSSProperties
            }
          >
            <div
              style={{
                animation: `wingFlap ${b.flapSpeed}s ease-in-out infinite alternate`,
              }}
            >
              <img
                src={paroParo}
                alt=""
                style={{
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
