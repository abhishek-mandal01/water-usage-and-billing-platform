import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useSidebar } from '../context/SidebarContext';
import { useTranslation } from './LanguageSelector/useTranslation';
import { 
  LayoutDashboard, 
  Droplet, 
  CreditCard, 
  Bell, 
  Lightbulb, 
  User, 
  LogOut,
  Menu,
  PieChart,
  X
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const { isOpen, toggle, close } = useSidebar();
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8081/api/notifications/unreadCount/${userId}`)
        .then(res => res.json())
        .then(data => setUnreadCount(data))
        .catch(err => console.error("Error fetching unread count:", err));
    }
  }, [userId]);

  const navItems = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.usageHistory'), path: '/usage', icon: Droplet },
    { name: t('nav.myBills'), path: '/bills', icon: CreditCard },
    { name: t('nav.reports', 'Reports'), path: '/reports', icon: PieChart },
    { name: t('nav.support'), path: '/support', icon: Lightbulb },
    { name: t('nav.notifications'), path: '/notifications', icon: Bell },
    { name: t('nav.profile'), path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile hamburger */}
      <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--visible' : ''}`}
        onClick={close}
      />

      <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div style={{ padding: '0 0 0 12px', marginTop: '12px', transform: 'scale(0.85)', transformOrigin: 'left center' }}>
          <BrandLogo style={{ borderBottom: 'none', padding: 0 }} />
        </div>
        
        <nav className="sidebar-nav" style={{ marginTop: 'var(--space-2)' }}>
          <div className="sidebar-section-label">{t('nav.navigation', 'Navigation')}</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={close}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
                {item.path === '/notifications' && unreadCount > 0 && (
                  <span style={{ 
                    backgroundColor: 'var(--color-danger-500)', 
                    color: 'var(--color-surface-0)', 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    padding: '2px 6px', 
                    borderRadius: 'var(--radius-full)' 
                  }}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <Link 
            to="/login"
            className="sidebar-logout"
            onClick={() => { localStorage.removeItem('user'); close(); }}
          >
            <LogOut size={18} />
            <span>{t('nav.logout')}</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;