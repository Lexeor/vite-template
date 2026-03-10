import H2 from '@/components/Typography/H2.tsx';
import SectionLabel from '@/components/Typography/SectionLabel.tsx';
import Button from '@/components/ui/Button.tsx';
import { BriefcaseIcon, CompassIcon, FileTextIcon, LifeBuoyIcon, MicVocalIcon } from 'lucide-react';
import type { FC } from 'react';

const SERVICES = [
  {
    icon: FileTextIcon,
    title: 'Резюме, которое работает',
    description:
      'Поможем сделать резюме, которое не теряется в стопке и привлекает внимание с первых секунд. Больше приглашений — меньше молчания в ответ.',
  },
  {
    icon: CompassIcon,
    title: 'Стратегия поиска',
    description:
      'Разберёмся, где искать, как откликаться и как выйти на нужные компании напрямую. Перестанем тыкать наугад — начнём действовать точно.',
  },
  {
    icon: MicVocalIcon,
    title: 'Подготовка к собеседованию',
    description:
      'Разберём типичные вопросы, проработаем ваши ответы, потренируемся вживую. Вы придёте не «на удачу», а подготовленным.',
  },
  {
    icon: LifeBuoyIcon,
    title: 'Сопровождение от А до Я',
    description:
      'Работаем вместе на всём пути: от резюме до оффера. В ряде случаев позволяет найти работу в два раза быстрее, чем самостоятельно.',
  },
  {
    icon: BriefcaseIcon,
    title: 'Карьерные развилки и кейсы',
    description:
      'Сменить сферу, попросить повышение, разобраться в сложной рабочей ситуации — обсудим и найдём разумный выход вместе.',
  },
];

const Services: FC = () => {
  return (
    <section id="services" className="relative overflow-hidden py-24 px-4 bg-primary-50/60 grainy">
      <div className="relative z-10 mx-auto max-w-[1280px]">

        {/* Section header */}
        <SectionLabel>Услуги</SectionLabel>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-14">
          <H2>
            Чем я могу помочь
          </H2>
          <p className="max-w-sm text-sm text-foreground/50 md:text-right">
            Один формат или полное сопровождение — как вам удобнее
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="flex flex-col gap-4 rounded-2xl bg-background p-7 shadow-xs hover:shadow-sm transition-shadow duration-150"
              >
                {/* Number + Icon */}
                <div className="flex items-center justify-between">
                  <div
                    className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary-50 grainy">
                    <Icon size={20} className="relative z-10 text-primary-600" />
                  </div>
                  <span className="text-3xl font-black text-foreground/10">0{index + 1}</span>
                </div>

                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="text-sm text-foreground/55 leading-relaxed">{service.description}</p>
              </div>
            );
          })}

          {/* Last card — CTA */}
          <div
            className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-primary-500 p-7 grainy">
            <p className="relative z-10 text-lg font-bold text-white leading-snug">
              Не знаете, с чего начать?
            </p>
            <p className="relative z-10 text-sm text-white/75 leading-relaxed">
              Запишитесь на бесплатный 15-минутный разговор — вместе разберёмся, что нужно именно вам.
            </p>
            <Button
              href="#contact"
              variant="secondary"
              className="relative z-10 mt-auto px-5 py-2.5"
            >
              Давайте поговорим
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;
