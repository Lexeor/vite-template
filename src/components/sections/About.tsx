import H2 from '@/components/Typography/H2.tsx';
import SectionLabel from '@/components/Typography/SectionLabel.tsx';
import { motion } from 'motion/react';
import { AwardIcon, GlobeIcon, TrendingUpIcon, UsersIcon, ZapIcon } from 'lucide-react';
import type { FC, ReactNode } from 'react';

type CardType = 'stat' | 'text' | 'feature';

interface Card {
  type: CardType;
  value?: string;
  label?: string;
  detail?: string;
  text?: string;
  icon?: ReactNode;
  accent?: boolean;
}

const CARDS: Card[] = [
  {
    type: 'stat',
    value: '15+',
    label: 'лет в HR',
    detail: 'в крупных международных компаниях',
    accent: true,
  },
  {
    type: 'text',
    icon: <AwardIcon size={20} />,
    text: 'Сертифицированный карьерный консультант',
  },
  {
    type: 'stat',
    value: '5 000+',
    label: 'собеседований',
    detail: 'с кандидатами на позиции разного уровня',
  },
  {
    type: 'text',
    icon: <ZapIcon size={20} />,
    text: 'Выстраивала HR-процессы в компаниях с нуля',
  },
  {
    type: 'stat',
    value: '100+',
    label: 'тренингов',
    detail: 'для команд до 30 человек, онлайн и офлайн',
    accent: true,
  },
  {
    type: 'feature',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>,
    text: 'Эксперт LinkedIn',
    detail: 'Знаю, как сделать профиль, который замечают нужные люди — и помогу вам его настроить',
  },
  {
    type: 'text',
    icon: <GlobeIcon size={20} />,
    text: 'Свободный английский — работаю с вакансиями и компаниями на международном рынке',
  },
  {
    type: 'text',
    icon: <UsersIcon size={20} />,
    text: 'Хорошо ориентируюсь в рынке труда: знаю, где искать и как выходить на компании напрямую',
  },
  {
    type: 'feature',
    icon: <TrendingUpIcon size={20} />,
    text: 'Инициировала HR-изменения',
    detail: 'Умею двигать процессы вперёд даже там, где «всегда делали вот так»',
  },
];

/* Individual card  */
const CredentialCard: FC<Card> = ({ type, value, label, detail, text, icon, accent }) => {
  if (type === 'stat') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl p-6 grainy ${accent ? 'bg-primary-500' : 'bg-primary-50'}`}>
        <p className={`text-5xl font-black leading-none ${accent ? 'text-white' : 'text-primary-600'}`}>
          {value}
        </p>
        <p className={`text-base font-semibold ${accent ? 'text-white/90' : 'text-foreground'}`}>
          {label}
        </p>
        {detail && (
          <p className={`text-sm leading-tight ${accent ? 'text-white/60' : 'text-foreground/50'}`}>
            {detail}
          </p>
        )}
      </div>
    );
  }

  if (type === 'feature') {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 grainy">
        <p className="relative z-10 font-bold text-white text-lg leading-snug">{text}</p>
        {detail && (
          <p className="relative z-10 mt-2 text-sm text-white/55 leading-relaxed">{detail}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-background p-5 shadow-xs">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          {icon}
        </div>
        <p className="text-sm font-medium text-foreground/75 leading-snug">{text}</p>
      </div>
    </div>
  );
};

/* Section */

const About: FC = () => {
  return (
    <section id="about" className="py-24 px-4">
      <div className="mx-auto max-w-[1280px]">

        {/* Header */}
        <SectionLabel>Обо мне</SectionLabel>
        <div className="mt-0 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16 items-start">

          {/* Left — text */}
          <div className="lg:sticky lg:top-28">
            <H2>
              Я была по другую<br />
              сторону стола
            </H2>
            <p className="mt-6 text-base text-foreground/65 leading-relaxed">
              Больше 15 лет я решала, кого звать на интервью, кому делать оффер
              и почему одно резюме цепляет с первых строк, а другое — нет.
            </p>
            <p className="mt-4 text-base text-foreground/65 leading-relaxed">
              Теперь этот опыт работает на вас. Я помогу показать себя так,
              чтобы нужные компании сами хотели с вами познакомиться.
            </p>
          </div>

          {/* Right — grid */}
          <div className="[columns:1] sm:[columns:2]" style={{ columnGap: '1rem' }}>
            {CARDS.map((card, i) => (
              <motion.div
                key={i}
                style={{ breakInside: 'avoid', marginBottom: '1rem' }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: (i % 3) * 0.07 }}
              >
                <CredentialCard {...card} />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
