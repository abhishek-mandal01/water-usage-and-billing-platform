/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  // Mobile open state
  const [isOpen, setIsOpen] = useState(false);
  
  // Desktop collapsed state, persisting preference
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('sidebar_collapsed', newState);
      return newState;
    });
  }, []);

  // Sync collapsed state with body class for CSS to handle gracefully
  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u && u.id) {
            fetch(`http://localhost:8081/api/notifications/unreadCount/${u.id}`)
              .then(res => {
                if (res.ok) return res.json();
                return 0;
              })
              .then(data => setUnreadCount(data || 0))
              .catch(err => console.error("Error fetching unread count:", err));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchUnreadCount();
    window.addEventListener('storage', fetchUnreadCount);
    window.addEventListener('user_profile_updated', fetchUnreadCount);
    return () => {
      window.removeEventListener('storage', fetchUnreadCount);
      window.removeEventListener('user_profile_updated', fetchUnreadCount);
    };
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, isCollapsed, toggle, close, toggleCollapse, unreadCount, setUnreadCount }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
  return context;
}


