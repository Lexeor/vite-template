import Button from '@/components/ui/Button.tsx';
import { ChevronDownIcon, MenuIcon } from 'lucide-react';
import { type FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; href?: undefined; children: { label: string; href: string }[] };

const NAV_LINKS: NavItem[] = [
  { label: 'Продукты', href: '#about' },
  { label: 'Мероприятия', href: '#services' },
  { label: 'Блог', href: '#directions' },
  {
    label: 'Компания',
    children: [
      { label: 'О компании', href: '#company' },
      { label: 'Карьера', href: '#career' },
      { label: 'Команда', href: '/team' },
    ],
  },
  { label: 'Контакты', href: '#contact' },
];

const DropdownItem: FC<{ item: Extract<NavItem, { children: NonNullable<unknown> }> }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-sm! text-foreground hover:text-primary-500 transition-colors duration-150"
      >
        {item.label}
        <ChevronDownIcon
          size={14}
          className={`mt-px transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-surface rounded-xl shadow-lg border border-border py-1 z-50">
          {/* Arrow */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-l border-t border-border rotate-45" />

          {item.children.map(child =>
            child.href.startsWith('/') ? (
              <Link
                key={child.href}
                to={child.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-foreground hover:text-primary-500 hover:bg-background transition-colors duration-150"
              >
                {child.label}
              </Link>
            ) : (
              <a
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-foreground hover:text-primary-500 hover:bg-background transition-colors duration-150"
              >
                {child.label}
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
};

const Header: FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div
        className="flex w-full max-w-[1280px] items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-md">

        {/* Logo */}
        <a href="#" className="flex flex-col leading-none">
          <img src="/images/logo.svg" alt="Logo" className="h-6 sm:h-7" />
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link =>
            link.children ? (
              <DropdownItem key={link.label} item={link} />
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-foreground hover:text-primary-500 transition-colors duration-150"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Button href="#contact" className="hidden sm:inline-flex px-4 py-2">
            Оставить заявку
          </Button>
          <button className="md:hidden p-2 rounded-lg bg-primary-500 text-surface!" aria-label="Меню">
            <MenuIcon size={22} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
