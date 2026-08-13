import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from './LanguageSelector/useTranslation';
import { Bell } from 'lucide-react';

function Topbar() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUser = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setUser(u);
        
        // Fetch unread notifications
        fetch(`http://localhost:8081/api/notifications/unreadCount/${u.id}`)
          .then(res => res.json())
          .then(data => setUnreadCount(data))
          .catch(err => console.error(err));
      }
    };

    updateUser();

    window.addEventListener('storage', updateUser);
    window.addEventListener('user_profile_updated', updateUser);
    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('user_profile_updated', updateUser);
    };
  }, []);

  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-3.354 0-10 1.688-10 5v3h20v-3c0-3.312-6.646-5-10-5z'/%3E%3C/svg%3E";
  const avatarUrl = user?.avatarUrl || defaultAvatar;

  const getDashboardTitle = () => {
    if (!user) return '';
    switch (user.role) {
      case 'MAIN_ADMIN': return t('nav.mainAdmin', 'Main Admin');
      case 'COMMUNITY_ADMIN':
      case 'ADMIN': return t('nav.communityAdmin', 'Community Admin');
      default: return t('nav.resident', 'Resident');
    }
  };

  return (
    <div className="topbar">
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <h2 className="topbar-title" style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0 }}>
          <span style={{ color: 'var(--text-primary)' }}>{getDashboardTitle()}</span>
        </h2>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-5)' }}>
        {user && (
          <Link to="/notifications" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: 'var(--color-danger-500)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        )}
        <LanguageSelector />
        <ThemeToggle />
        
        {user && (
          <Link 
            to={user.role === 'ADMIN' || user.role === 'MAIN_ADMIN' || user.role === 'COMMUNITY_ADMIN' ? '/community/profile' : '/profile'} 
            className="topbar-profile"
          >
            <div className="topbar-profile-info">
              <span className="topbar-profile-name">{user.name}</span>
              <span className="topbar-profile-role">
                {user.role === 'MAIN_ADMIN'
                  ? t('auth.mainAdmin', 'MAIN ADMIN') 
                  : user.role === 'COMMUNITY_ADMIN' || user.role === 'ADMIN'
                  ? t('auth.communityAdmin', 'COMMUNITY ADMIN') 
                  : t('auth.resident', 'RESIDENT')}
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
