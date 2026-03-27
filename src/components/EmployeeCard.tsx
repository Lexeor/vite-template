import type { FC } from 'react';

interface EmployeeCardProps {
  name: string;
  title: string;
  description: string;
  photo: string | null;
}

const EmployeeCard: FC<EmployeeCardProps> = ({ name, title, description, photo }) => {
  return (
    <div className="flex overflow-hidden rounded-2xl bg-surface min-h-56">
      {/* Photo */}
      <div className="w-56 flex-shrink-0 bg-surface-elevated">
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl font-bold text-foreground/20 select-none">
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-start gap-1.5 px-6 py-5">
        <p className="text-lg text-foreground leading-tight">{name}</p>
        <p className="text-sm text-foreground/40">{title}</p>
        <div className="grow" />
        {description && (
          <p className="mt-1 text-sm text-foreground/70 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
