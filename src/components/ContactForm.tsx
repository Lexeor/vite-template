import { cn } from '@/lib/utils.ts';
import type { FC } from 'react';

interface ContactFormProps {
}

const ContactForm: FC<ContactFormProps> = () => {
  return (
    <div
      className={cn('relative bg-gradient-to-r from-[#94b8ff] to-[#dfe8f5] grainy overflow-hidden rounded-md p-4',
        'flex flex-row justify-between text-white')}>
      <h2>Приступим скорее</h2>
      <div>
        <input placeholder="Hello" className="bg-white border-1 border-blue-200 p-2 rounded-md" />
      </div>
    </div>
  );
};

export default ContactForm;