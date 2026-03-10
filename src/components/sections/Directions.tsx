import H2 from '@/components/Typography/H2.tsx';
import SectionLabel from '@/components/Typography/SectionLabel.tsx';
import { motion } from 'framer-motion';
import type { FC } from 'react';

const DIRECTIONS = [
  {
    title: 'Производство и инжиниринг',
    description: 'От мастера участка до директора завода — понимаю эту среду и знаю, как в ней двигаться вперёд.',
    photo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=340&fit=crop&auto=format&q=75',
  },
  {
    title: 'HR и административный сегмент',
    description: 'Свои — помогаю коллегам по цеху находить компанию, где будет по-настоящему хорошо.',
    photo: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=340&fit=crop&auto=format&q=75',
  },
  {
    title: 'Продажи, маркетинг, PR',
    description: 'Умеете продавать? Поможем продать себя так же убедительно, как вы продаёте продукт.',
    photo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop&auto=format&q=75',
  },
  {
    title: 'Финансовая сфера',
    description: 'Аналитики, финансисты, бухгалтеры — строгий и чёткий подход к поиску работы вам только в плюс.',
    photo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=340&fit=crop&auto=format&q=75',
  },
];

const Directions: FC = () => {
  return (
    <section id="directions" className="relative overflow-hidden py-24 px-4 bg-primary-50/60 grainy">
      <div className="relative z-10 mx-auto max-w-[1280px]">

        <SectionLabel>Направления</SectionLabel>
        <div className="mb-14 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <H2>Кому я лучше всего помогу</H2>
          <p className="max-w-xs text-sm text-foreground/50 md:text-right">
            Работаю со специалистами разного уровня и из разных отраслей
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DIRECTIONS.map((dir, i) => (
            <motion.div
              key={dir.title}
              className="group overflow-hidden rounded-2xl bg-background shadow-xs hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: (i % 3) * 0.08 }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dir.photo}
                  alt={dir.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Primary tint overlay */}
                <div className="absolute inset-0 bg-primary-600/20 mix-blend-multiply" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-base leading-snug">{dir.title}</h3>
                <p className="mt-2 text-sm text-foreground/55 leading-relaxed">{dir.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Directions;
