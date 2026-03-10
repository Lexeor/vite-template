import type { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="py-8 px-4">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <span className="text-sm font-bold">Тамара Шаврадзе</span>
          <span className="ml-2 text-xs text-foreground/40">карьерный консультант</span>
        </div>
        <p className="text-xs text-foreground/30">
          © {new Date().getFullYear()} Все права защищены
        </p>
        <nav className="flex gap-4">
          {[
            { label: 'Обо мне', href: '#about' },
            { label: 'Услуги', href: '#services' },
            { label: 'Контакты', href: '#contact' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-foreground/40 hover:text-primary-600 transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
