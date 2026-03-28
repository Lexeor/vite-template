interface SectionHeaderProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  if (!eyebrow && !title && !subtitle) return null;

  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-500">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight max-w-3xl">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-base text-foreground/50 leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
