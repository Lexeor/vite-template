import type { FC, PropsWithChildren } from 'react';


const H2: FC<PropsWithChildren> = ({ children }) => {
  return (
    <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
      {children}
    </h2>
  );
};

export default H2;