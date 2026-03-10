import { ArrowUpRightIcon, MenuIcon } from 'lucide-react';
import type { FC } from 'react';

const NAV_LINKS = [
  { label: 'Обо мне', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Направления', href: '#directions' },
  { label: 'Как я работаю', href: '#how-it-works' },
  { label: 'Контакты', href: '#contact' },
];

const Header: FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div className="flex w-full max-w-[1280px] items-center justify-between rounded-xl border border-foreground/10 bg-background/80 px-4 py-3 backdrop-blur-md">

        {/* Logo */}
        <a href="#" className="flex flex-col leading-none">
          <span className="text-sm font-bold tracking-tight">Тамара Шаврадзе</span>
          <span className="text-xs text-foreground/50 font-medium">HR-консультант</span>
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/80 transition-colors duration-150"
          >
            Записаться
            <ArrowUpRightIcon size={14} />
          </a>
          {/* Mobile menu icon placeholder */}
          <button className="md:hidden p-2 rounded-lg border border-foreground/10" aria-label="Меню">
            <MenuIcon size={18} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
