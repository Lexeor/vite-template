import H2 from '@/components/Typography/H2.tsx';
import SectionLabel from '@/components/Typography/SectionLabel.tsx';
import { motion } from 'motion/react';
import type { FC } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Оставляете заявку',
    description:
      'Заполняете форму или пишете в Telegram — я отвечаю в течение дня. Коротко обсуждаем вашу ситуацию и договариваемся о времени первой встречи.',
  },
  {
    number: '02',
    title: 'Разбираемся вместе',
    description:
      'На первой сессии честно смотрим: где вы сейчас, куда хотите прийти и что мешает. Без оценок — просто разбираемся.',
  },
  {
    number: '03',
    title: 'Составляем план',
    description:
      'Делаем конкретный план под вашу ситуацию: что чинить в резюме, где искать, как выходить на компании, как готовиться к интервью.',
  },
  {
    number: '04',
    title: 'Идём по плану',
    description:
      'Я рядом на всём пути: готовлю материалы, разбираем каждый шаг, отвечаю на вопросы и подстраиваем план, если что-то меняется.',
  },
  {
    number: '05',
    title: 'Получаете оффер',
    description:
      'Оффер, который вас радует. И понимание, как двигаться дальше — уже самостоятельно и уверенно.',
  },
];

const Illustration: FC = () => (
  <div
    className="relative overflow-hidden rounded-2xl bg-primary-50 grainy flex flex-col items-center justify-center p-10 min-h-[320px] lg:min-h-0 lg:h-full">

    {/* Decorative concentric rings */}
    <div className="absolute inset-[8%]  rounded-full border border-primary-200/70" />
    <div className="absolute inset-[20%] rounded-full border border-primary-300/50" />
    <div className="absolute inset-[34%] rounded-full border border-primary-400/40" />
    <div className="absolute inset-[48%] rounded-full bg-primary-400/10" />

    {/* Step dots on outer ring — 5 dots evenly spaced */}
    {[0, 1, 2, 3, 4].map(i => {
      const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
      const r = 42; // percent from center
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      return (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary-400/60"
          style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
        />
      );
    })}

    {/* Center text */}
    <div className="relative z-10 text-center select-none">
      <p className="text-5xl font-black text-primary-500/25 leading-none">5</p>
      <p className="mt-2 text-sm font-semibold text-primary-700/70 leading-tight">
        шагов<br />к офферу
      </p>
    </div>
  </div>
);

const HowItWorks: FC = () => {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="mx-auto max-w-[1280px]">

        <SectionLabel>Как это работает</SectionLabel>
        <div className="mb-14 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <H2>Всё просто</H2>
          <p className="max-w-xs text-sm text-foreground/50 md:text-right">
            Никакой магии — понятные шаги и живое общение
          </p>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left — sticky illustration, desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-28 self-start">
              <Illustration />
            </div>
          </div>

          {/* Right — editorial list, all devices */}
          <div>
            {STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                className="group grid grid-cols-[48px_1fr] gap-x-5 gap-y-1 items-baseline border-t border-foreground/10 py-6 -mx-3 px-3 rounded-lg hover:bg-foreground/[0.025] transition-colors duration-200 cursor-default"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.07 }}
              >
                {/* Number */}
                <span
                  className="text-5xl caveat font-bold tabular-nums text-primary-500 group-hover:text-primary-600 transition-colors duration-200">
                  {step.number}
                </span>

                {/* Title */}
                <h3 className="text-base font-bold leading-snug">{step.title}</h3>

                {/* Description */}
                <p className="col-start-2 mt-0.5 text-sm leading-relaxed text-foreground/55">
                  {step.description}
                </p>
              </motion.div>
            ))}

            <div className="border-t border-foreground/10" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
