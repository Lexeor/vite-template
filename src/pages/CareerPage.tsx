import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import CareerHero from '@/components/CareerHero.tsx';
import SectionHeader from '@/components/SectionHeader.tsx';

const CONTAINER = 'max-w-[1280px] mx-auto px-4';

function useIsDesktop() {
  const [is, setIs] = useState(() => window.innerWidth >= 768);
  useEffect(() => {
    const check = () => setIs(window.innerWidth >= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return is;
}

// threshold — scroll progress при котором поляроид вылетает
// m = mobile, d = desktop
const POLAROIDS = [
  { id: 1,  mx: -165, my: -150, dx: -490, dy: -170, rotate: -11, msx: -620, msy: -420, dsx: -1000, dsy: -500, threshold: 0.22 },
  { id: 2,  mx:  150, my: -145, dx:  460, dy: -175, rotate:  10, msx:  580, msy: -420, dsx:  1000, dsy: -500, threshold: 0.27 },
  { id: 3,  mx:  -20, my: -230, dx:  -50, dy: -310, rotate:   5, msx:  -40, msy: -680, dsx:   -80, dsy: -800, threshold: 0.31 },
  { id: 4,  mx:  175, my:   15, dx:  560, dy:   20, rotate: -12, msx:  660, msy:   30, dsx:  1100, dsy:   40, threshold: 0.35 },
  { id: 5,  mx: -175, my:   20, dx: -560, dy:   25, rotate:  14, msx: -660, msy:   45, dsx: -1100, dsy:   55, threshold: 0.39 },
  { id: 6,  mx:  110, my: -195, dx:  255, dy: -270, rotate:   7, msx:  400, msy: -580, dsx:   640, dsy: -720, threshold: 0.43 },
  { id: 7,  mx: -135, my:  180, dx: -410, dy:  235, rotate:   9, msx: -500, msy:  540, dsx:  -860, dsy:  620, threshold: 0.48 },
  { id: 8,  mx:  130, my:  175, dx:  390, dy:  230, rotate:  -8, msx:  500, msy:  540, dsx:   860, dsy:  620, threshold: 0.52 },
  { id: 9,  mx:   20, my:  240, dx:   50, dy:  315, rotate:  -6, msx:   40, msy:  720, dsx:    80, dsy:  820, threshold: 0.57 },
  { id: 10, mx:  -80, my:  215, dx: -210, dy:  290, rotate:  -3, msx: -280, msy:  640, dsx:  -520, dsy:  780, threshold: 0.62 },
];

const LAST_THRESHOLD = 0.66;

export default function CareerPage() {
  const isDesktop = useIsDesktop();

  // 2× bigger on desktop
  const PW = isDesktop ? 280 : 140;
  const PH = isDesktop ? 324 : 162;

  const sectionRef = useRef<HTMLElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [maxProgress, setMaxProgress] = useState(0);
  const [allShown, setAllShown] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">

      <section className="min-h-screen bg-surface">
        <div className={`${CONTAINER} pt-28 pb-16`}>
          <CareerHero />
        </div>
      </section>

      <motion.section
        ref={sectionRef}
        className="relative bg-background"
        animate={{ height: allShown ? '100vh' : '220vh' }}
        transition={{ duration: 1.4, ease: [0.25, 0, 0, 1] }}
        style={{ height: '220vh' }}
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">

          {/* Поляроиды — под текстом */}
          {POLAROIDS.map((p) => {
            const visible = maxProgress >= p.threshold;
            const fx = isDesktop ? p.dx : p.mx;
            const fy = isDesktop ? p.dy : p.my;
            const sx = isDesktop ? p.dsx : p.msx;
            const sy = isDesktop ? p.dsy : p.msy;
            return (
              <motion.div
                key={p.id}
                className="absolute"
                style={{ top: '50%', left: '50%' }}
                initial={{
                  x: sx - PW / 2,
                  y: sy - PH / 2,
                  rotate: p.rotate * 1.6,
                  opacity: 0,
                }}
                animate={visible ? {
                  x: fx - PW / 2,
                  y: fy - PH / 2,
                  rotate: p.rotate,
                  opacity: 1,
                } : {
                  x: sx - PW / 2,
                  y: sy - PH / 2,
                  rotate: p.rotate * 1.6,
                  opacity: 0,
                }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="bg-white"
                  style={{
                    width: PW,
                    padding: `${PW * 0.071}px ${PW * 0.071}px ${PW * 0.229}px`,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)',
                  }}
                >
                  <div
                    className="bg-surface-elevated"
                    style={{ width: '100%', height: Math.round(PW * 0.857) }}
                  />
                </div>
              </motion.div>
            );
          })}

          {/* Текст — поверх */}
          <motion.div
            className="relative z-10 text-center pointer-events-none select-none"
            initial={{ opacity: 0, y: 14 }}
            animate={textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p className="text-5xl font-[300] text-foreground tracking-tight">Work & Life</p>
            <p className="caveat text-6xl text-primary-500 leading-none mt-1">balance</p>
          </motion.div>

        </div>
      </motion.section>

      <section id="vacancies" className="w-full bg-surface mt-4">
        <div className={CONTAINER}>
          <div className="py-16 flex justify-center">
            <SectionHeader
              eyebrow="вакансии"
              title="Ждем именно тебя в нашей команде!"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
