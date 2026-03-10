import { ArrowUpRightIcon } from 'lucide-react';
import type { FC } from 'react';

const STATS = [
  { value: '15+', label: 'лет в международных HR' },
  { value: '5 000+', label: 'проведённых собеседований' },
  { value: '100+', label: 'тренингов для команд' },
];

const Hero: FC = () => {
  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 pb-16">

      {/* Background decoration — easy to swap for gradient/image */}
      <div className="pointer-events-none absolute inset-0 bg-background" />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/60">
          HR-консультант · Карьерный коуч
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl">
          Тамара<br />
          <span className="text-foreground/30">Шаврадзе</span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 max-w-2xl text-lg text-foreground/60 md:text-xl">
          15 лет в HR международных компаний — теперь работаю на вас.
          Помогу построить карьеру, которую вы заслуживаете.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-xl bg-foreground px-7 py-3.5 text-sm font-semibold text-background hover:bg-foreground/80 transition-colors duration-150"
          >
            Записаться на консультацию
            <ArrowUpRightIcon size={16} />
          </a>
          <a
            href="#services"
            className="flex items-center gap-2 rounded-xl border border-foreground/15 px-7 py-3.5 text-sm font-semibold text-foreground/70 hover:border-foreground/30 hover:text-foreground transition-colors duration-150"
          >
            Мои услуги
          </a>
        </div>

        {/* Divider */}
        <div className="my-14 h-px w-full max-w-md bg-foreground/10" />

        {/* Stats */}
        <div className="grid w-full max-w-2xl grid-cols-3 gap-4">
          {STATS.map(stat => (
            <div key={stat.value} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black tracking-tight md:text-4xl">{stat.value}</span>
              <span className="text-xs text-foreground/50 leading-tight text-center">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;
