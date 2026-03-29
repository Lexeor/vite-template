import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:8000/api';

function useIsDesktop() {
  const [is, setIs] = useState(() => window.innerWidth >= 768);
  useEffect(() => {
    const check = () => setIs(window.innerWidth >= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return is;
}

interface PolaroidData {
  slot: number;
  photo: string | null;
  caption: string;
}

// Анимационные параметры строго по слоту (id = slot)
const POLAROIDS = [
  {
    id: 1,
    mx: -165,
    my: -150,
    dx: -490,
    dy: -170,
    rotate: -11,
    msx: -620,
    msy: -420,
    dsx: -1000,
    dsy: -500,
    threshold: 0.22,
  },
  {
    id: 2,
    mx: 150,
    my: -145,
    dx: 460,
    dy: -175,
    rotate: 10,
    msx: 580,
    msy: -420,
    dsx: 1000,
    dsy: -500,
    threshold: 0.27,
  },
  { id: 3, mx: -20, my: -230, dx: -50, dy: -310, rotate: 5, msx: -40, msy: -680, dsx: -80, dsy: -800, threshold: 0.31 },
  { id: 4, mx: 175, my: 15, dx: 560, dy: 20, rotate: -12, msx: 660, msy: 30, dsx: 1100, dsy: 40, threshold: 0.35 },
  { id: 5, mx: -175, my: 20, dx: -560, dy: 25, rotate: 14, msx: -660, msy: 45, dsx: -1100, dsy: 55, threshold: 0.39 },
  { id: 6, mx: 110, my: -195, dx: 255, dy: -270, rotate: 7, msx: 400, msy: -580, dsx: 640, dsy: -720, threshold: 0.43 },
  { id: 7, mx: -135, my: 180, dx: -410, dy: 235, rotate: 9, msx: -500, msy: 540, dsx: -860, dsy: 620, threshold: 0.48 },
  { id: 8, mx: 130, my: 175, dx: 390, dy: 230, rotate: -8, msx: 500, msy: 540, dsx: 860, dsy: 620, threshold: 0.52 },
  { id: 9, mx: 20, my: 240, dx: 50, dy: 315, rotate: -6, msx: 40, msy: 720, dsx: 80, dsy: 820, threshold: 0.57 },
  {
    id: 10,
    mx: -80,
    my: 215,
    dx: -210,
    dy: 290,
    rotate: -3,
    msx: -280,
    msy: 640,
    dsx: -520,
    dsy: 780,
    threshold: 0.62,
  },
];

const LAST_THRESHOLD = 0.66;

export default function CareerPolaroids() {
  const isDesktop = useIsDesktop();
  const [polaroids, setPolaroids] = useState<Map<number, PolaroidData>>(new Map());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const PW = isDesktop ? 280 : 140;
  const PH = isDesktop ? 324 : 162;
  const expandScale = isDesktop ? 2.2 : 1.8;

  const sectionRef = useRef<HTMLElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [maxProgress, setMaxProgress] = useState(0);
  const [allShown, setAllShown] = useState(false);

  useEffect(() => {
    fetch(`${API}/pages/career-polaroids/`)
      .then(r => r.json())
      .then(d => {
        const list: PolaroidData[] = Array.isArray(d) ? d : (d.results ?? []);
        setPolaroids(new Map(list.map(p => [p.slot, p])));
      });
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    if (!textVisible && latest > 0.1) setTextVisible(true);
    if (latest > maxProgress) {
      setMaxProgress(latest);
      if (!allShown && latest >= LAST_THRESHOLD) setAllShown(true);
    }
  });

  const captionH = Math.round(PW * 0.229);
  const imgH = Math.round(PW * 0.857);

  return (
    <motion.section
      ref={sectionRef}
      className="relative bg-background"
      animate={{ height: allShown ? '100vh' : '220vh' }}
      transition={{ duration: 1.4, ease: [0.25, 0, 0, 1] }}
      style={{ height: '220vh' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">

        {/* Overlay — click to close */}
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ zIndex: 40 }}
          initial={{ opacity: 0, pointerEvents: 'none' }}
          animate={selectedId !== null
            ? { opacity: 0.45, pointerEvents: 'auto' }
            : { opacity: 0, pointerEvents: 'none' }
          }
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={() => setSelectedId(null)}
        />

        {POLAROIDS.map((p) => {
          const visible = maxProgress >= p.threshold;
          const fx = isDesktop ? p.dx : p.mx;
          const fy = isDesktop ? p.dy : p.my;
          const sx = isDesktop ? p.dsx : p.msx;
          const sy = isDesktop ? p.dsy : p.msy;
          const data = polaroids.get(p.id);
          const isSelected = selectedId === p.id;
          const isHovered = hoveredId === p.id;

          return (
            <motion.div
              key={p.id}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                zIndex: isSelected ? 50 : isHovered ? 20 : 1,
                cursor: visible ? 'pointer' : 'default',
              }}
              initial={{ x: sx - PW / 2, y: sy - PH / 2, rotate: p.rotate * 1.6, scale: 1, opacity: 0 }}
              animate={
                isSelected ? {
                  x: -PW / 2,
                  y: -PH / 2,
                  rotate: 0,
                  scale: expandScale,
                  opacity: 1,
                } : visible ? {
                  x: fx - PW / 2,
                  y: fy - PH / 2,
                  rotate: p.rotate,
                  scale: isHovered ? 1.07 : 1,
                  opacity: 1,
                } : {
                  x: sx - PW / 2,
                  y: sy - PH / 2,
                  rotate: p.rotate * 1.6,
                  scale: 1,
                  opacity: 0,
                }
              }
              transition={
                isSelected
                  ? { duration: 0.55, ease: [0.25, 0, 0, 1] }
                  : isHovered
                    ? { duration: 0.2, ease: 'easeOut' }
                    : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
              }
              onHoverStart={() => {
                if (visible && !selectedId) setHoveredId(p.id);
              }}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => {
                if (visible) setSelectedId(isSelected ? null : p.id);
              }}
            >
              <div
                className="bg-white transition-shadow duration-300"
                style={{
                  width: PW,
                  padding: `${PW * 0.071}px ${PW * 0.071}px 0`,
                  boxShadow: isSelected
                    ? '0 24px 80px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.15)'
                    : isHovered
                      ? '0 12px 40px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)'
                      : '0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)',
                }}
              >
                {data?.photo
                  ? <img
                    src={data.photo}
                    alt={data.caption}
                    draggable={false}
                    style={{ width: '100%', height: imgH, objectFit: 'cover', display: 'block' }}
                  />
                  : <div className="bg-surface-elevated" style={{ width: '100%', height: imgH }} />
                }

                <div
                  className="flex items-center"
                  style={{ height: captionH, paddingInline: PW * 0.036 }}
                >
                  {data?.caption && (
                    <p
                      className="text-foreground text-center text-semibold leading-tight overflow-hidden"
                      style={{ fontSize: PW * 0.041, lineHeight: 1.2 }}
                    >
                      {data.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Текст — поверх */}
        <motion.div
          className="relative text-center pointer-events-none select-none"
          style={{ zIndex: 10 }}
          initial={{ opacity: 0, y: 14 }}
          animate={textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <p className="text-5xl font-[300] text-foreground tracking-tight">Work & Life</p>
          <p className="caveat text-6xl text-primary-500 leading-none mt-1">balance</p>
        </motion.div>

      </div>
    </motion.section>
  );
}
