import { type FC, type PropsWithChildren } from 'react';
import { cn } from '../lib/utils';

interface ContainerProps {
  className?: string;
}

const Container: FC<PropsWithChildren<ContainerProps>> = ({ className, children }) => {
  return (
    <div className={cn('relative max-w-[1280px] w-full p-7 pt-4 md:p-16 lg:p-18', className)}>
      {children}
    </div>
  );
};

export default Container;