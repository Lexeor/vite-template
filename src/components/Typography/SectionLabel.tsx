import type { FC, PropsWithChildren } from 'react';

const SectionLabel: FC<PropsWithChildren> = ({ children }) => {
  return (
    <p className="-mb-2 font-caveat font-semibold text-4xl text-primary-500 md:text-5xl">
      {children}
    </p>
  );
};

export default SectionLabel;
