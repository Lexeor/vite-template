import { useEffect, useRef, useState } from 'react';

const PRODUCTS = [
  '«Фактор»', '«Единый клиент»', '«Единый адрес»', 'КУС', 'КУС AML',
  '«Экосистемный клиент»', '«Центр управления согласиями»', '«Маркетинговый комбайн»',
  '«Маскировщик»', 'Аудит', 'Перекодер', 'Подсказки',
];

const COMPANY = [
  'О компании', 'Команда', 'Клиенты', 'Карьера',
  'Социальные проекты', 'Мероприятия', 'Блог', 'Контакты',
];

function LinkList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map(item => (
        <li key={item}>
          <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ColLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-background/30 mb-4">
      {children}
    </p>
  );
}

function MobileSection({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-background/10">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-background/50">
          {label}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`text-background/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let prevHeight = el.offsetHeight;
    const observer = new ResizeObserver(() => {
      const newHeight = el.offsetHeight;
      document.documentElement.style.setProperty('--footer-height', `${newHeight}px`);
      if (newHeight > prevHeight) {
        window.scrollBy({ top: newHeight - prevHeight, behavior: 'instant' });
      }
      prevHeight = newHeight;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={ref} className="fixed bottom-0 left-0 right-0 z-0 bg-foreground">

      {/* Desktop layout */}
      <div className="hidden md:block max-w-[1280px] mx-auto px-8 pt-12 pb-8">
        <div className="grid grid-cols-4 gap-8">

          {/* Col 1 — Logo */}
          <div className="flex flex-col">
            <div className="w-14 h-14 border border-background/20 flex items-center justify-center mb-4">
              <span className="text-background text-2xl font-bold">H</span>
            </div>
            <p className="text-xs text-background/30 mt-auto pt-6">© 2025 HFLABS</p>
          </div>

          {/* Col 2 — Продукты */}
          <div>
            <ColLabel>Продукты</ColLabel>
            <LinkList items={PRODUCTS} />
          </div>

          {/* Col 3 — Компания */}
          <div>
            <ColLabel>Компания</ColLabel>
            <LinkList items={COMPANY} />
          </div>

          {/* Col 4 — Контакты + Telegram + Соц. сети */}
          <div className="space-y-8">
            <div>
              <ColLabel>Контакты</ColLabel>
              <div className="space-y-2.5">
                <a href="mailto:ask@hflabs.ru" className="block text-sm text-background/60 hover:text-background transition-colors">ask@hflabs.ru</a>
                <a href="tel:+74959288641" className="block text-sm text-background/60 hover:text-background transition-colors">+7 495 928-86-41</a>
              </div>
            </div>
            <div>
              <ColLabel>Мы в Telegram</ColLabel>
              <div className="space-y-2.5">
                <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">HFLabs Official</a>
                <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">HFLabs People</a>
                <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">HFLabs' Events</a>
              </div>
            </div>
            <div>
              <ColLabel>Соц. сети</ColLabel>
              <div className="space-y-2.5">
                <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">ВКонтакте</a>
                <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">YouTube</a>
                <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">Rutube</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden px-4 pt-8">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-14 h-14 border border-background/20 flex items-center justify-center mb-3">
            <span className="text-background text-2xl font-bold">H</span>
          </div>
          <p className="text-xs text-background/30">© 2025 HFLABS</p>
        </div>

        <MobileSection label="Продукты">
          <LinkList items={PRODUCTS} />
        </MobileSection>

        <MobileSection label="Компания">
          <LinkList items={COMPANY} />
        </MobileSection>

        <MobileSection label="Контакты">
          <div className="space-y-2.5">
            <a href="mailto:ask@hflabs.ru" className="block text-sm text-background/60 hover:text-background transition-colors">ask@hflabs.ru</a>
            <a href="tel:+74959288641" className="block text-sm text-background/60 hover:text-background transition-colors">+7 495 928-86-41</a>
          </div>
        </MobileSection>

        <MobileSection label="Мы в Telegram">
          <div className="space-y-2.5">
            <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">HFLabs Official</a>
            <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">HFLabs People</a>
            <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">HFLabs' Events</a>
          </div>
        </MobileSection>

        <MobileSection label="Соц. сети">
          <div className="space-y-2.5">
            <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">ВКонтакте</a>
            <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">YouTube</a>
            <a href="#" className="block text-sm text-background/60 hover:text-background transition-colors">Rutube</a>
          </div>
        </MobileSection>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10 mt-4 md:mt-0">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <a href="#" className="text-xs text-background/30 hover:text-background/60 transition-colors">
            Политика конфиденциальности
          </a>
          <span className="text-xs text-background/30 text-right">Разработка сайта: Redis x SNP</span>
        </div>
      </div>
    </footer>
  );
}
