import Button from '@/components/ui/Button.tsx';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDownIcon, MenuIcon } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
      { label: 'Социальные проекты', href: '#social' },
      { label: 'Клиенты', href: '#clients' },
    ],
  },
  { label: 'Контакты', href: '#contact' },
];

const DropdownItem: FC<{ item: Extract<NavItem, { children: NonNullable<unknown> }> }> = ({ item }) => {
  const [open, setOpen] = useState(false);

  // Блокировка скролла
  useEffect(() => {
    const viewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]');
    if (open) {
      if (viewport) {
        viewport.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (viewport) {
        viewport.style.overflow = '';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (viewport) {
        viewport.style.overflow = '';
      } else {
        document.body.style.overflow = '';
      }
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 text-sm! transition-colors duration-150 ${open ? 'text-primary-500' : 'text-foreground hover:text-primary-500'}`}
      >
        {item.label}
        <ChevronDownIcon
          size={14}
          className={`mt-px transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                className="fixed inset-0 z-40 bg-foreground/80 backdrop-blur-[2px]"
                onClick={close}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Dropdown panel */}
              <motion.div
                key="panel"
                className="fixed left-1/2 -translate-x-1/2 top-[84px] z-50 w-[520px] bg-background rounded-2xl shadow-2xl p-4"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {item.children.map(child =>
                    child.href.startsWith('/') ? (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={close}
                        className="px-5 py-4 rounded-xl border border-border text-sm text-foreground hover:border-primary-500/40 hover:text-primary-500 transition-colors duration-150"
                      >
                        {child.label}
                      </Link>
                    ) : (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={close}
                        className="px-5 py-4 rounded-xl border border-border text-sm text-foreground hover:border-primary-500/40 hover:text-primary-500 transition-colors duration-150"
                      >
                        {child.label}
                      </a>
                    ),
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

const Header: FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-51 flex justify-center px-4 pt-4">
      <div
        className="flex w-full max-w-[1280px] items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-header">

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
