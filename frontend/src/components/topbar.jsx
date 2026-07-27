import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Topbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(userStr));
    }
  }, []);

  const avatarUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-3.354 0-10 1.688-10 5v3h20v-3c0-3.312-6.646-5-10-5z'/%3E%3C/svg%3E";

  return (
    <div className="topbar">
      <div style={{ flex: 1 }}></div>
      
      <h2 className="topbar-title" style={{ flex: 1, textAlign: 'center' }}>
        Water Monitoring System
      </h2>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-3)' }}>
        <ThemeToggle />
        
        {user && (
          <Link 
            to={user.role === 'ADMIN' || user.role === 'COMMUNITY_ADMIN' ? '/community/profile' : '/profile'} 
            className="topbar-profile"
          >
            <div className="topbar-profile-info">
              <span className="topbar-profile-name">{user.name}</span>
              <span className="topbar-profile-role">
                {user.role === 'ADMIN' || user.role === 'COMMUNITY_ADMIN' ? 'COMMUNITY ADMIN' : user.role?.replace('_', ' ')}
              </span>
            </div>
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className="topbar-avatar"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Topbar;
