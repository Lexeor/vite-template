import Button from '@/components/ui/Button.tsx';
import { motion } from 'motion/react';
import { ArrowUpRightIcon, ChevronRightIcon } from 'lucide-react';
import type { FC } from 'react';

const STATS = [
  { value: '15+', label: 'лет в международном HR' },
  { value: '5 000+', label: 'проведённых собеседований' },
  { value: '100+', label: 'тренингов для команд' },
  { value: '5', label: 'направлений работы' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut' as const, delay },
});

// Decorative dot grid
const DotGrid: FC<{ cols?: number; rows?: number }> = ({ cols = 5, rows = 5 }) => (
  <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
    {Array.from({ length: cols * rows }).map((_, i) => (
      <div key={i} className="h-1 w-1 rounded-full bg-primary-600/35" />
    ))}
  </div>
);

const Hero: FC = () => {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col overflow-hidden">

      {/* Gradient background — radial glow on the right where the photo is */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 72% 45%, #acd99a 0%, #d4eccb 35%, #eef6e8 60%, #f5f8f2 80%)',
        }}
      />

      {/* Main two-column layout */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col">
        <div className="grid flex-1 grid-cols-1 items-center gap-8 px-4 pt-28 pb-8 lg:grid-cols-2 lg:gap-0">

          {/* Left: text content */}
          <div className="flex flex-col items-start gap-5 lg:pr-12">

            {/* Badge */}
            <motion.div {...fadeUp(0.05)}
                        className="relative overflow-hidden rounded-full bg-primary-600/10 px-4 py-1.5 grainy">
              <span className="relative z-10 text-xs font-semibold uppercase tracking-widest text-primary-700">
                Карьерный консультант
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.12)}
              className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-[4.25rem]"
            >
              Помогу найти<br />
              <span className="text-primary-600">работу</span>, которая<br />
              вас радует
            </motion.h1>

            {/* Description */}
            <motion.p {...fadeUp(0.22)} className="max-w-sm text-base leading-relaxed text-foreground/60">
              15 лет в HR международных компаний — теперь работаю на вас.
              Резюме, стратегия поиска, подготовка к интервью — от А до оффера.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center gap-3">
              {/* Primary */}
              <Button
                href="#contact"
                className="relative z-10 px-5 py-2.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Записаться
                  <ArrowUpRightIcon size={15} />
                </span>
              </Button>
              {/* Outline */}
              <a
                href="#services"
                className="flex h-10 items-center gap-1.5 rounded-xl border border-foreground/20 px-6 py-3.5 text-sm font-semibold text-foreground/70 hover:border-foreground/40 hover:text-foreground transition-colors duration-150"
              >
                Узнать об услугах
                <ChevronRightIcon size={15} />
              </a>
            </motion.div>
          </div>

          {/* Right: photo area */}
          <motion.div
            className="relative flex items-end justify-center pb-0 lg:justify-end"
            style={{ minHeight: 440 }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            {/* Large decorative circle behind photo */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-primary-300/35 lg:left-auto lg:right-0 lg:translate-x-10 lg:h-[480px] lg:w-[480px]" />

            {/* Photo placeholder — portrait shape */}
            <div
              className="relative z-10 flex h-[420px] w-[260px] items-center justify-center overflow-hidden rounded-t-2xl rounded-b-2xl bg-primary-100/70 grainy lg:h-[480px] lg:w-[300px]">
              <span className="relative z-10 text-sm font-medium text-primary-500/50">Фото</span>
            </div>

            {/* Dot grid — bottom right corner */}
            <div className="absolute bottom-6 right-2 opacity-70 lg:bottom-8 lg:right-0">
              <DotGrid cols={5} rows={5} />
            </div>
          </motion.div>

        </div>

        {/* Stats bar */}
        <motion.div
          className="z-20 mx-4 mb-4 overflow-hidden rounded-2xl bg-background/65 backdrop-blur-md lg:mx-0 lg:mb-0 lg:rounded-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.45 }}
        >
          <div className="grid grid-cols-2 divide-x divide-foreground/8 lg:grid-cols-4">
            {STATS.map(stat => (
              <div key={stat.value} className="flex flex-col items-center gap-1 px-6 py-5 text-center">
                <span className="text-2xl font-black lg:text-3xl">{stat.value}</span>
                <span className="text-xs text-foreground/50">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
