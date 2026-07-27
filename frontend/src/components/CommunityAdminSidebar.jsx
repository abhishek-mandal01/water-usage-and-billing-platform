import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useSidebar } from '../context/SidebarContext';
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
  Menu,
  X
} from 'lucide-react';

function CommunityAdminSidebar() {
  const location = useLocation();
  const { isOpen, toggle, close } = useSidebar();
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
    { name: 'Dashboard', path: '/admin-panel', icon: LayoutDashboard },
    { name: 'Households Directory', path: '/community/households', icon: Home },
    { name: 'Meter Readings', path: '/community/meter', icon: Activity },
    { name: 'Billing Management', path: '/community/billing', icon: CreditCard },
    { name: 'Bulk Purchases', path: '/community/bulk-purchases', icon: Package },
    { name: 'Support / Concerns', path: '/community/support', icon: Users },
    { name: 'Tariff Plans', path: '/community/tariffs', icon: Settings },
    { name: 'Announcements', path: '/community/announcements', icon: Bell },
    { name: 'Profile', path: '/community/profile', icon: User },
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
        <BrandLogo />
        
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
                {item.name === 'Notifications & Alerts' && unreadCount > 0 && (
                  <span style={{ 
                    backgroundColor: '#ef4444', 
                    color: 'white', 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    padding: '2px 6px', 
                    borderRadius: '10px' 
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
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default CommunityAdminSidebar;
