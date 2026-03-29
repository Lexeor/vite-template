export type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; href?: undefined; children: { label: string; href: string }[] };

export const NAV_LINKS: NavItem[] = [
  { label: 'Продукты', href: '#about' },
  { label: 'Мероприятия', href: '#services' },
  { label: 'Блог', href: '#directions' },
  {
    label: 'Компания',
    children: [
      { label: 'О компании', href: '#company' },
      { label: 'Карьера', href: '/career' },
      { label: 'Команда', href: '/team' },
      { label: 'Социальные проекты', href: '#social' },
      { label: 'Клиенты', href: '/clients' },
    ],
  },
  { label: 'Контакты', href: '/contacts' },
];
