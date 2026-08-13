import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useSidebar } from '../context/SidebarContext';
import { useTranslation } from './LanguageSelector/useTranslation';
import { 
  LayoutDashboard, 
  Home, 
  Activity, 
  CreditCard, 
  Settings, 
  Bell, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

function MainAdminSidebar() {
  const location = useLocation();
  const { isOpen, toggle, close } = useSidebar();
  const { t } = useTranslation();

  const navItems = [
    { name: t('nav.dashboard', 'Dashboard'), path: '/main-admin-panel', icon: LayoutDashboard },
    { name: t('nav.communities', 'Communities / Apartments'), path: '/admin/communities', icon: Home },
    { name: t('nav.analytics', 'System Analytics'), path: '/admin/analytics', icon: Activity },
    { name: t('nav.financials', 'Financials'), path: '/admin/financials', icon: CreditCard },
    { name: t('nav.systemTariffs', 'System Tariffs'), path: '/admin/tariffs', icon: Settings },
    { name: t('nav.supportTickets', 'Support Tickets'), path: '/admin/support', icon: Bell },
    { name: t('nav.reports', 'Reports'), path: '/admin/reports', icon: FileText },
  ];

  return (
    <>
      <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--visible' : ''}`}
        onClick={close}
      />

      <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div style={{ padding: '0 0 0 12px', marginTop: '12px', transform: 'scale(0.85)', transformOrigin: 'left center' }}>
          <BrandLogo style={{ padding: 0 }} />
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={close}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link 
            to="/"
            className="sidebar-logout"
            onClick={() => { localStorage.removeItem('user'); close(); }}
          >
            <LogOut size={18} />
            <span>{t('nav.logout', 'Logout')}</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default MainAdminSidebar;
