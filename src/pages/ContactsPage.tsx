import { useState } from 'react';

const CONTAINER = 'max-w-[1280px] mx-auto px-4';

// ── Icons ──────────────────────────────────────────────────────────────────────

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconTelegram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.47c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.215-3.053 5.56-5.023c.242-.215-.054-.334-.373-.12L6.26 14.4l-2.95-.92c-.64-.2-.654-.64.136-.948l11.527-4.446c.535-.193 1.002.13.59.162z" />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconVK() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.714-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.566c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1-.728 1.982-1.812 3.304-.898 1.11-.898 1.076.289 2.167.796.729 1.457 1.389 1.541 1.93.102.543-.271.82-.813.82z" />
    </svg>
  );
}

// ── Contact block ──────────────────────────────────────────────────────────────

function ContactBlock({ icon, label, children }: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-500">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.1em] text-foreground/40 mb-1">{label}</p>
        {children}
      </div>
    </div>
  );
}

// ── Contact form ───────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up to backend
    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-surface rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[320px]">
        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 mb-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-lg font-medium text-foreground">Заявка отправлена</p>
        <p className="text-sm text-foreground/50">Мы свяжемся с вами в ближайшее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6 sm:p-8 space-y-4">
      <p className="text-xl font-medium text-foreground mb-2">Оставить заявку</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-foreground/50 mb-1.5">Имя</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Иван Иванов"
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-foreground/50 mb-1.5">Телефон</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+7 (___) ___-__-__"
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-foreground/50 mb-1.5">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="you@company.ru"
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-foreground/50 mb-1.5">Сообщение</label>
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Расскажите о вашей задаче..."
          rows={4}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:border-primary-500 transition-colors resize-none"
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        <button
          type="submit"
          disabled={!form.name.trim() || !form.email.trim()}
          className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 flex-shrink-0"
        >
          Отправить
        </button>
        <p className="text-xs text-foreground/30 leading-relaxed">
          Отправляя форму, вы соглашаетесь с&nbsp;обработкой персональных данных
          в&nbsp;соответствии с&nbsp;ФЗ-152
        </p>
      </div>
    </form>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="w-full pt-28 pb-0">
        <div className={CONTAINER}>
          <div className="bg-surface p-6 grid grid-cols-1 md:grid-cols-2 min-h-64 rounded-xl gap-6 items-center">
            <p className="text-5xl font-[500]">Контакты</p>
            <p className="text-foreground/60 leading-relaxed">
              Готовы обсудить вашу задачу. Напишите или позвоните&nbsp;— поможем разобраться,
              как наши продукты решают задачи с&nbsp;клиентскими данными.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="w-full py-6">
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-6 items-start">

            {/* Left — contact details */}
            <div className="space-y-4">

              {/* Contacts card */}
              <div className="bg-surface rounded-xl p-6 sm:p-8 space-y-6">
                <ContactBlock icon={<IconPhone />} label="Телефон">
                  <a href="tel:+74959288641"
                     className="text-base font-medium text-foreground hover:text-primary-500 transition-colors">
                    +7 495 928-86-41
                  </a>
                </ContactBlock>

                <ContactBlock icon={<IconMail />} label="Email">
                  <div className="space-y-1.5">
                    <div>
                      <a href="mailto:ask@hflabs.ru"
                         className="text-base font-medium text-foreground hover:text-primary-500 transition-colors">
                        ask@hflabs.ru
                      </a>
                      <p className="text-xs text-foreground/40 mt-0.5">общие вопросы</p>
                    </div>
                    <div>
                      <a href="mailto:dreamjob@hflabs.ru"
                         className="text-base font-medium text-foreground hover:text-primary-500 transition-colors">
                        dreamjob@hflabs.ru
                      </a>
                      <p className="text-xs text-foreground/40 mt-0.5">работа у нас</p>
                    </div>
                  </div>
                </ContactBlock>

                <ContactBlock icon={<IconPin />} label="Адрес">
                  <p className="text-base font-medium text-foreground leading-snug">
                    119034, Москва,<br />
                    Тёрчанинов переулок, 6с2
                  </p>
                  <p className="text-sm text-foreground/50 mt-1">
                    Бизнес-центр «Крымский мост», 1 этаж
                  </p>
                </ContactBlock>

                <ContactBlock icon={<IconClock />} label="Режим работы">
                  <p className="text-base font-medium text-foreground">Пн–Пт, 9:00–18:30</p>
                  <p className="text-xs text-foreground/40 mt-0.5">московское время</p>
                </ContactBlock>
              </div>

              {/* Social links */}
              <div className="bg-surface rounded-xl p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.1em] text-foreground/40 mb-4">Мы в соцсетях</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: <IconTelegram />, label: 'Telegram', href: '#' },
                    { icon: <IconYouTube />, label: 'YouTube', href: '#' },
                    { icon: <IconVK />, label: 'ВКонтакте', href: '#' },
                  ].map(({ icon, label, href }) => (
                    <a key={label} href={href}
                       className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-foreground/70 hover:text-primary-500 hover:border-primary-500/40 transition-colors">
                      {icon}
                      {label}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Right — form */}
            <div>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="w-full py-6 pb-12">
        <div className={CONTAINER}>
          <div className="bg-surface rounded-xl overflow-hidden h-72 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-surface-elevated/50" />
            <div className="relative z-10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center mx-auto">
                <IconPin />
              </div>
              <p className="text-sm font-medium text-foreground">Тёрчанинов переулок, 6с2</p>
              <a
                href="https://yandex.ru/maps/?text=Тёрчанинов+переулок+6+строение+2+Москва"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-primary-500 hover:text-primary-600 transition-colors"
              >
                Открыть в Яндекс Картах →
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
