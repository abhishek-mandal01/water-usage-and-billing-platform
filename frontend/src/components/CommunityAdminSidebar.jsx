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
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

function CommunityAdminSidebar() {
  const location = useLocation();
  const { isOpen, isCollapsed, toggle, close, toggleCollapse } = useSidebar();
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'space-between', 
          padding: isCollapsed ? '0' : '0 12px 0 16px', 
          marginTop: '12px',
          width: '100%'
        }}>
          <BrandLogo 
            style={{ padding: isCollapsed ? '16px 0' : 0 }} 
            isCollapsed={isCollapsed} 
            onToggleCollapse={toggleCollapse} 
            logoSize={55} 
            textSize="20px" 
            subTextSize="10px" 
          />
          {!isCollapsed && (
            <button 
              onClick={toggleCollapse}
              title="Collapse sidebar"
              className="sidebar-collapse-btn"
            >
              <PanelLeftClose size={18} />
            </button>
          )}
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.name} 
                to={item.path}
                title={isCollapsed ? item.name : ""}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={close}
                style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: isCollapsed ? 0 : 'var(--space-3)' }}>
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
                {item.path === '/community/announcements' && unreadCount > 0 && (
                  <span className="badge" style={{ 
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

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <button 
            className="sidebar-logout"
            title={isCollapsed ? t('nav.logout', 'Logout') : ""}
            onClick={() => setShowLogoutModal(true)}
            style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <LogOut size={18} />
            <span>{t('nav.logout', 'Logout')}</span>
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)' }}>Confirm Logout</h2>
            <p style={{ margin: '0 0 25px 0', color: 'var(--text-secondary)' }}>Are you sure you want to log out of your account?</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowLogoutModal(false)} 
                style={{ padding: '10px 20px', border: '1px solid var(--border-default)', borderRadius: '6px', background: 'white', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  close();
                  window.location.href = '/login';
                }} 
                style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: 'var(--color-danger-500)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommunityAdminSidebar;
