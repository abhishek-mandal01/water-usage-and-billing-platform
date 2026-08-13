import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useSidebar } from '../context/SidebarContext';
import { useTranslation } from './LanguageSelector/useTranslation';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  Activity, 
  CreditCard, 
  Settings, 
  Bell, 
  User, 
  LogOut,
  Package,
  AlertTriangle,
  PieChart,
  Menu,
  X
} from 'lucide-react';

function CommunityAdminSidebar() {
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
    { name: t('nav.dashboard', 'Dashboard'), path: '/admin-panel', icon: LayoutDashboard },
    { name: t('nav.householdsDir', 'Households Directory'), path: '/community/households', icon: Home },
    { name: t('nav.meterReadings', 'Meter Readings'), path: '/community/meter', icon: Activity },
    { name: t('nav.billingMgmt', 'Billing Management'), path: '/community/billing', icon: CreditCard },
    { name: t('nav.bulkPurchases', 'Bulk Purchases'), path: '/community/bulk-purchases', icon: Package },
    { name: t('nav.reports', 'Reports & Analytics'), path: '/community/reports', icon: PieChart },
    { name: t('nav.waterLeakage', 'Water Leakage'), path: '/community/leakage', icon: AlertTriangle },
    { name: t('nav.support', 'Support / Concerns'), path: '/community/support', icon: Users },
    { name: t('nav.tariffPlans', 'Tariff Plans'), path: '/community/tariffs', icon: Settings },
    { name: t('nav.announcements', 'Announcements'), path: '/community/announcements', icon: Bell },
    { name: t('nav.profile', 'Profile'), path: '/community/profile', icon: User },
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
                {item.path === '/community/announcements' && unreadCount > 0 && (
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

export default CommunityAdminSidebar;
