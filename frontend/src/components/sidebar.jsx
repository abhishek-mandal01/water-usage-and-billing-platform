import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useSidebar } from '../context/SidebarContext';
import { 
  LayoutDashboard, 
  Droplet, 
  CreditCard, 
  Bell, 
  Lightbulb, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

function Sidebar() {
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
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Usage & History', path: '/usage', icon: Droplet },
    { name: 'Billing & Payments', path: '/bills', icon: CreditCard },
    { name: 'Support / Concerns', path: '/support', icon: Bell },
    { name: 'Notifications & Tips', path: '/notifications', icon: Lightbulb },
    { name: 'Profile', path: '/profile', icon: User },
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
        <BrandLogo />
        
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
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
                {item.name === 'Notifications & Tips' && unreadCount > 0 && (
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
            to="/login"
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

export default Sidebar;