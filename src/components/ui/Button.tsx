import { cn } from '@/lib/utils.ts';
import type { FC, PropsWithChildren } from 'react';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
}

const VARIANTS = {
  primary: {
    base: 'bg-primary-500 text-primary-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.15)] hover:bg-primary-600 active:bg-primary-600/90',
    stitch: 'border-primary-300/85',
  },
  secondary: {
    base: 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.1)] hover:bg-white/25',
    stitch: 'border-white/50',
  },
};

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  href,
  onClick,
  className,
  type = 'button',
  variant = 'primary',
  children,
}) => {
  const v = VARIANTS[variant];

  const base = cn(
    'relative inline-flex items-center gap-2 overflow-hidden rounded-md px-6 py-3.5',
    'grainy',
    'text-sm font-semibold',
    'transition-colors duration-150',
    v.base,
    className,
  );

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return <a href={href} className={base}>{content}</a>;
  }

  return (
    <button type={type} onClick={onClick} className={base}>
      {content}
    </button>
  );
};

export default Button;
