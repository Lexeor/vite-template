import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export interface StepItem {
  id: number;
  stepNumber: string;   // "01", "02" …
  title: string;
  body: string;         // plain text; double-newline = paragraph break
  image: string | null; // URL or null for placeholder
}

interface StickyStepsProps {
  items: StepItem[];
}

function StepImage({ src }: { src: string | null }) {
  return src ? (
    <img src={src} alt="" className="w-full h-full object-contain" />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-2xl bg-border" />
    </div>
  );
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').filter(Boolean).map((p, i) => (
        <p key={i} className="text-base text-foreground/40 leading-relaxed whitespace-pre-line">
          {p}
        </p>
      ))}
    </>
  );
}

export default function StickySteps({ items }: StickyStepsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { rootMargin: '-45% 0px -45% 0px' },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [items]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">

      {/* Left — sticky image (desktop only) */}
      <div
        className="hidden md:flex sticky top-4 self-start h-[calc(100vh-4rem)] items-center justify-center border-r border-border px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="w-full h-48"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <StepImage src={items[activeIndex]?.image ?? null} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right — scrollable steps */}
      <div>
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={el => {
              itemRefs.current[index] = el;
            }}
            className="py-16 px-8 md:px-12 border-b border-border last:border-b-0"
          >
            {/* Image on mobile */}
            <div className="md:hidden flex items-center justify-center h-56 mb-8">
              <StepImage src={item.image} />
            </div>

            <p className="text-sm text-primary-500 mb-3 tabular-nums">
              {item.stepNumber}
            </p>
            <h3 className="text-2xl sm:text-3xl text-foreground leading-snug mb-6">
              {item.title}
            </h3>
            <div className="space-y-3">
              <Paragraphs text={item.body} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
