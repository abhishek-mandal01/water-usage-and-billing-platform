import { useState } from 'react';
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
  UserCheck,
  Menu,
  X,
  PanelLeftClose
} from 'lucide-react';

function MainAdminSidebar() {
  const location = useLocation();
  const { isOpen, isCollapsed, toggle, close, toggleCollapse } = useSidebar();
  const { t } = useTranslation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { name: t('nav.dashboard', 'Dashboard'), path: '/main-admin-panel', icon: LayoutDashboard },
    { name: t('nav.verifications', 'Verifications'), path: '/main-admin/verifications', icon: UserCheck },
    { name: t('nav.communities', 'Communities'), path: '/admin/communities', icon: Home },
    { name: t('nav.analytics', 'System Analytics'), path: '/admin/analytics', icon: Activity },
    { name: t('nav.financials', 'Financials'), path: '/admin/financials', icon: CreditCard },
    { name: t('nav.systemTariffs', 'System Tariffs'), path: '/admin/tariffs', icon: Settings },
    { name: t('nav.supportTickets', 'Support Tickets'), path: '/admin/support', icon: Bell },
    { name: t('nav.reports', 'Reports'), path: '/admin/reports', icon: FileText },
  ];

const handleSidebarContainerClick = (e) => {
    const isInteractive = e.target.closest('a') || e.target.closest('button') || e.target.closest('.sidebar-link');
    if (!isInteractive) {
      toggleCollapse();
    }
  };
return (
    <>
      <button className="hamburger-btn" onClick={toggle} aria-label="Toggle menu">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--visible' : ''}`}
        onClick={close}
      />

      <div 
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        onClick={handleSidebarContainerClick}
        style={{ cursor: isCollapsed ? 'pointer' : 'default' }}
      >
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: isCollapsed ? 0 : 'var(--space-3)' }}>
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <button 
            className="sidebar-logout"
            title={isCollapsed ? t('nav.logout', 'Logout') : ""}
            onClick={() => setShowLogoutModal(true)}
            style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
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

export default MainAdminSidebar;


