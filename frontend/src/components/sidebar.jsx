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
  LifeBuoy,
  User, 
  LogOut,
  Menu,
  PieChart,
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

function Sidebar() {
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
    { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.usageHistory'), path: '/usage', icon: Droplet },
    { name: t('nav.myBills'), path: '/bills', icon: CreditCard },
    { name: t('nav.reports', 'Reports'), path: '/reports', icon: PieChart },
    { name: t('nav.waterTips', 'Water Tips'), path: '/water-tips', icon: Lightbulb },
    { name: t('nav.support'), path: '/support', icon: LifeBuoy },
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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'space-between', 
          padding: isCollapsed ? '0' : '0 12px 0 16px', 
          marginTop: '12px',
          width: '100%'
        }}>
          <BrandLogo 
            style={{ borderBottom: 'none', padding: isCollapsed ? '16px 0' : 0 }} 
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
        
        <nav className="sidebar-nav" style={{ marginTop: 'var(--space-2)' }}>
          <div className="sidebar-section-label">{t('nav.navigation', 'Navigation')}</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
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
                {item.path === '/notifications' && unreadCount > 0 && (
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
            title={isCollapsed ? t('nav.logout') : ""}
            onClick={() => setShowLogoutModal(true)}
            style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <LogOut size={18} />
            <span>{t('nav.logout')}</span>
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

export default Sidebar;