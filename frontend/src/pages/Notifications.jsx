import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Bell, AlertTriangle, Info, Check, Trash2 } from 'lucide-react';

function Notifications({ role: propRole }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotif, setSelectedNotif] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const role = propRole || user?.role || 'RESIDENT';

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:8081/api/notifications/${userId}`);
        if (res.ok) {
          setNotifications(await res.json());
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/notifications/read/${id}`, { method: 'POST' });
      setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`http://localhost:8081/api/notifications/readAll/${userId}`, { method: 'POST' });
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/notifications/${id}`, { method: 'DELETE' });
    } catch (err) { console.error(err); }
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleDeleteAll = async () => {
    try {
      await fetch(`http://localhost:8081/api/notifications/deleteAll/${userId}`, { method: 'DELETE' });
    } catch (err) { console.error(err); }
    setNotifications([]);
    setCurrentPage(1);
  };

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      handleMarkAsRead(notif.id);
    }
    setSelectedNotif(notif);
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (!a.read && b.read) return -1;
    if (a.read && !b.read) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);
  const currentNotifications = sortedNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getIcon = (type) => {
    if (type === 'LEAK_WARNING') return <AlertTriangle size={24} color="var(--color-danger-600)" />;
    if (type === 'ALERT') return <Bell size={24} color="var(--color-warning-600)" />;
    return <Info size={24} color="var(--color-primary-600)" />;
  };

  const SidebarComponent = role === 'MAIN_ADMIN' ? MainAdminSidebar : (role === 'COMMUNITY_ADMIN' || role === 'ADMIN') ? CommunityAdminSidebar : Sidebar;

  return (
    <div className="dashboard-layout">
      {SidebarComponent && <SidebarComponent />}
      <div className="dashboard-main">
        <Topbar />
        
        {selectedNotif &&
        <div className="modal-overlay" onClick={() => setSelectedNotif(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-card-hover)', borderRadius: '50%' }}>
                  {getIcon(selectedNotif.type)}
                </div>
                <div>
                  <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '20px' }}>{selectedNotif.title || (selectedNotif.type === 'LEAK_WARNING' ? 'Leak Warning' : selectedNotif.type === 'ALERT' ? 'Threshold Alert' : 'Information')}</h2>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date(selectedNotif.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-card-hover)', borderRadius: '8px', border: '1px solid var(--border-default)', marginBottom: '25px' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                  {selectedNotif.message}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedNotif(null)} style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary-600)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{t("resident.close")}

              </button>
              </div>
            </div>
          </div>
        }
        
        <main className="dashboard-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ margin: 0 }}>{t("resident.notificationsAlerts")}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Stay updated on leak warnings, billing notices, and community announcements.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleMarkAllAsRead}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-600)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                <Check size={16} />{t("resident.markallasread")}
              </button>
              <button
                onClick={handleDeleteAll}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: 'var(--color-danger-50)', color: 'var(--color-danger-600)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                <Trash2 size={16} /> Delete All
              </button>
            </div>
          </div>

          {loading ?
          <p>{t("resident.loadingnotifications")}</p> :
          notifications.length === 0 ?
          <MagicCardGrid>
              <MagicCard style={{ padding: '40px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-secondary)' }}>{t("resident.nonotificationsfound")}</h3>
                <p style={{ color: 'var(--text-tertiary)' }}>{t("resident.youreallcaughtup")}</p>
              </MagicCard>
            </MagicCardGrid> :

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentNotifications.map((notif) =>
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--border-default)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '15px',
                opacity: notif.read ? 0.7 : 1,
                position: 'relative',
                cursor: 'pointer'
              }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-card-hover)', borderRadius: '50%' }}>
                    {getIcon(notif.type)}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
                        {notif.title || (notif.type === 'LEAK_WARNING' ? 'Leak Warning' : notif.type === 'ALERT' ? 'Threshold Alert' : 'Information')}
                        {!notif.read && <span style={{ marginLeft: '10px', backgroundColor: 'var(--color-danger-600)', color: 'white', fontSize: '12px', padding: '2px 6px', borderRadius: '4px' }}>{t("resident.new")}</span>}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date(notif.createdAt).toLocaleString()}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                          title="Delete notification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: '0', color: 'var(--text-secondary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {notif.message}
                    </p>
                    
                    {!notif.read &&
                <button
                  onClick={(e) => {e.stopPropagation();handleMarkAsRead(notif.id);}}
                  style={{ marginTop: '10px', padding: '6px 12px', backgroundColor: 'transparent', color: 'var(--color-primary-600)', border: '1px solid var(--color-primary-600)', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>{t("resident.markasread")}

                </button>
                }
                  </div>
                </div>
            )}
            
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedNotifications.length)} of {sortedNotifications.length}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{ padding: '6px 12px', border: '1px solid var(--border-default)', borderRadius: '6px', background: currentPage === 1 ? 'var(--bg-body)' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{ padding: '6px 12px', border: '1px solid var(--border-default)', borderRadius: '6px', background: currentPage === totalPages ? 'var(--bg-body)' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            </div>
          }
        </main>
      </div>
    </div>);

}

export default Notifications;