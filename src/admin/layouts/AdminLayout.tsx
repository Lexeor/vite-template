import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { NavGroup } from '../data/nav';
import { ADMIN_NAV, isGroup, isSection } from '../data/nav';
import { useAuth } from '../hooks/useAuth';

function NavGroupItem({ item }: { item: NavGroup }) {
  const { pathname } = useLocation();
  const anyChildActive = item.children.some(
    c => !isSection(c) && pathname.startsWith(c.to),
  );

  return (
    <div>
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
          anyChildActive ? 'text-background' : 'text-background/50'
        }`}
      >
        {item.icon}
        {item.label}
      </div>
      <div className="ml-6 pl-3 space-y-0.5">
        {item.children.map((child, i) =>
          isSection(child) ? (
            <p key={i}
               className="px-2 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-widest text-background/30">
              {child.section}
            </p>
          ) : (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `block px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-background/50 hover:bg-background/10 hover:text-background'
                }`
              }
            >
              {child.label}
            </NavLink>
          ),
        )}
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar — dark */}
      <aside className="w-56 flex-shrink-0 bg-foreground flex flex-col">
        {/* Logo */}
        <div className="h-14">
          <div className="flex w-full h-full px-4 items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-background font-semibold text-sm">Админ-панель</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {ADMIN_NAV.map(item =>
            isGroup(item) ? (
              <NavGroupItem key={item.label} item={item} />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-background/50 hover:bg-background/10 hover:text-background'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-background/50 hover:bg-background/10 hover:text-background transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-background flex items-center px-6 flex-shrink-0">
          <span className="text-sm text-foreground/50">Управление контентом сайта</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
