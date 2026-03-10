import H2 from '@/components/Typography/H2.tsx';
import SectionLabel from '@/components/Typography/SectionLabel.tsx';
import Button from '@/components/ui/Button.tsx';
import { cn } from '@/lib/utils.ts';
import { ArrowUpRightIcon, ChevronDownIcon, SendIcon } from 'lucide-react';
import { type FC, useState } from 'react';

const SERVICE_OPTIONS = [
  'Создание резюме',
  'Стратегия поиска работы',
  'Подготовка к собеседованию',
  'Полное сопровождение',
  'Карьерный или рабочий кейс',
  'Пока не знаю — хочу поговорить',
];

const Select: FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex w-full items-center justify-between rounded-xl bg-background/80 px-4 py-3 text-sm shadow-xs transition-shadow duration-150',
          value ? 'text-foreground' : 'text-foreground/35',
          open && 'shadow-sm',
        )}
      >
        <span>{value || 'Выберите тему'}</span>
        <ChevronDownIcon
          size={16}
          className={cn('shrink-0 text-foreground/40 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl bg-background shadow-md">
          {SERVICE_OPTIONS.map(option => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={cn(
                  'w-full  px-4 py-2.5 text-left justify-start items-start text-sm transition-colors duration-100 hover:bg-primary-50 hover:text-primary-700',
                  value === option && 'bg-primary-50 font-semibold text-primary-700',
                )}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Contact: FC = () => {
  const [service, setService] = useState('');

  return (
    <section id="contact" className="py-24 px-4">
      <div className="mx-auto max-w-[1280px]">

        <div className="relative overflow-hidden rounded-3xl bg-primary-50/60 p-10 md:p-16 lg:p-20 grainy">
          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-start">

            {/* Left */}
            <div>
              <SectionLabel>Контакты</SectionLabel>
              <H2>
                Давайте<br />
                познакомимся
              </H2>
              <p className="mt-6 text-base text-foreground/60 leading-relaxed max-w-sm">
                Оставьте заявку — я отвечу в течение дня. Сначала просто поговорим: расскажете, что происходит, я скажу,
                чем могу помочь.
              </p>

              {/* Contact methods */}
              <div className="mt-10 flex flex-col gap-4">
                <a
                  href="https://t.me/"
                  className="flex items-center gap-3 hover:text-foreground transition-colors duration-150"
                >
                  <div
                    className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary-100 grainy">
                    <SendIcon size={16} className="relative z-10 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Telegram</p>
                    <p className="text-xs text-foreground/40">@tamara_shavradze</p>
                  </div>
                  <ArrowUpRightIcon size={14} className="ml-auto text-foreground/30" />
                </a>

                <a
                  href="https://linkedin.com/in/"
                  className="flex items-center gap-3 hover:text-foreground transition-colors duration-150"
                >
                  <div
                    className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary-100 grainy">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
                         className="relative z-10 text-primary-600">
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">LinkedIn</p>
                    <p className="text-xs text-foreground/40">Tamara Shavradze</p>
                  </div>
                  <ArrowUpRightIcon size={14} className="ml-auto text-foreground/30" />
                </a>
              </div>
            </div>

            {/* Right — form */}
            <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">Как вас
                    зовут?</label>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    className="rounded-xl bg-background/80 px-4 py-3 text-sm shadow-xs placeholder:text-foreground/30 focus:shadow-sm focus:outline-none transition-shadow duration-150"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">Как
                    связаться?</label>
                  <input
                    type="text"
                    placeholder="Telegram или телефон"
                    className="rounded-xl bg-background/80 px-4 py-3 text-sm shadow-xs placeholder:text-foreground/30 focus:shadow-sm focus:outline-none transition-shadow duration-150"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                  С чем хотите разобраться?
                </label>
                <Select value={service} onChange={setService} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">Расскажите чуть
                  подробнее</label>
                <textarea
                  rows={4}
                  placeholder="Что сейчас происходит? Что хотите изменить?"
                  className="rounded-xl bg-background/80 px-4 py-3 text-sm shadow-xs placeholder:text-foreground/30 focus:shadow-sm focus:outline-none transition-shadow duration-150 resize-none"
                />
              </div>

              <Button
                type="submit"
                className="relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white grainy hover:bg-primary-600 transition-colors duration-150"
              >
                <span className="relative z-10 flex items-center gap-2 text-white">
                  Отправить заявку
                  <ArrowUpRightIcon size={15} />
                </span>
              </Button>

              <p className="text-center text-xs text-foreground/30">
                Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных
              </p>
            </form>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
