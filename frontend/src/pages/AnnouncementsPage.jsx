import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Megaphone, Plus, Trash2, Calendar } from 'lucide-react';

function AnnouncementsPage({ role = 'COMMUNITY_ADMIN' }) {const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', category: 'GENERAL' });
  const [msg, setMsg] = useState('');

  const adminId = JSON.parse(localStorage.getItem('user'))?.id || 1;

  const fetchAnnouncements = async () => {
    try {
      const url = role === 'COMMUNITY_ADMIN' ?
      `http://localhost:8081/api/announcements/community/${adminId}` :
      `http://localhost:8081/api/announcements/all`;
      const res = await fetch(url);
      if (res.ok) {
        setAnnouncements(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg('Publishing announcement...');
    try {
      const res = await fetch('http://localhost:8081/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityAdminId: adminId,
          title: formData.title,
          message: formData.message,
          category: formData.category
        })
      });

      if (res.ok) {
        setMsg('Announcement published!');
        setFormData({ title: '', message: '', category: 'GENERAL' });
        setShowModal(false);
        fetchAnnouncements();
      } else {
        setMsg('Failed to publish announcement.');
      }
    } catch (err) {
      console.error(err);
      setMsg('Error publishing announcement.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`http://localhost:8081/api/announcements/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const SidebarComponent = role === 'COMMUNITY_ADMIN' ? CommunityAdminSidebar : Sidebar;

  return (
    <div className="dashboard-layout">
      <SidebarComponent />
      <div className="dashboard-main">
        <Topbar />

        {showModal &&
        <div className="modal-overlay">
            <div className="modal-content">
              <h2 style={{ marginTop: 0, color: 'var(--text-primary)' }}>{t("communityAdmin.newCommunityAnnouncement")}</h2>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                <div>
                  <label className="form-label">{t("communityAdmin.title")}</label>
                  <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Pump Maintenance on Friday"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input" />
                
                </div>

                <div>
                  <label className="form-label">{t("communityAdmin.category")}</label>
                  <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input">
                  
                    <option value="GENERAL">{t("communityAdmin.generalNotice")}</option>
                    <option value="MAINTENANCE">{t("communityAdmin.maintenanceAlert")}</option>
                    <option value="CONSERVATION">{t("communityAdmin.waterConservationCampaign")}</option>
                    <option value="URGENT">{t("communityAdmin.urgentSupplyDisruption")}</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">{t("communityAdmin.messageDetails")}</label>
                  <textarea
                  required
                  rows={4}
                  placeholder="Provide clear details for residents..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input"
                  style={{ resize: 'vertical' }} />
                
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>{t("communityAdmin.cancel")}</button>
                  <button type="submit" className="btn btn-primary">{t("communityAdmin.publishNotice")}</button>
                </div>
              </form>
            </div>
          </div>
        }

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>{t("communityAdmin.communityAnnouncementsBulletins")}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>{t("communityAdmin.broadcastimportantnoticeswatersupply")}

              </p>
            </div>
            {role === 'COMMUNITY_ADMIN' &&
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Plus size={16} />{t("communityAdmin.broadcastNotice")}
            </button>
            }
          </div>

          {msg && <div className="alert alert-info" style={{ marginBottom: 'var(--space-5)' }}>{msg}</div>}

          <MagicCardGrid>
            <MagicCard style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ margin: '0 0 var(--space-6) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{t("communityAdmin.activeBulletins")}
                {announcements.length})
              </h3>

              {loading ?
              <div className="loading-screen" style={{ height: '200px' }}>{t("communityAdmin.loadingnotices")}</div> :
              announcements.length === 0 ?
              <div style={{ textAlign: 'center', padding: 'var(--space-10) 0', color: 'var(--text-tertiary)' }}>
                  <Megaphone size={48} style={{ marginBottom: 'var(--space-3)' }} />
                  <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>{t("communityAdmin.noannouncementspostedyet")}</p>
                </div> :

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {announcements.map((a) =>
                <div
                  key={a.id}
                  style={{
                    padding: 'var(--space-5)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-card-hover)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)'
                  }}>
                  
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span className={`badge ${a.category === 'URGENT' ? 'badge-danger' : a.category === 'MAINTENANCE' ? 'badge-warning' : 'badge-info'}`}>
                            {a.category === 'GENERAL' ? t('communityAdmin.GENERAL', 'General Notice') :
                             a.category === 'MAINTENANCE' ? t('communityAdmin.MAINTENANCE', 'Maintenance Alert') :
                             a.category === 'CONSERVATION' ? t('communityAdmin.CONSERVATION', 'Water Conservation') :
                             a.category === 'URGENT' ? t('communityAdmin.URGENT', 'Urgent Disruption') :
                             t(`communityAdmin.${a.category}`, a.category)}
                          </span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> {a.createdAt ? new Date(a.createdAt).toLocaleString() : t('communityAdmin.recent', 'Recent')}
                          </span>
                        </div>
                        {role === 'COMMUNITY_ADMIN' &&
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="btn btn-ghost"
                      style={{ color: 'var(--color-danger-500)', padding: '4px 8px' }}
                      title="Delete Notice">
                      
                            <Trash2 size={16} />
                          </button>
                    }
                      </div>

                      <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                        {a.title}
                      </h4>

                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                        {a.message}
                      </p>
                    </div>
                )}
                </div>
              }
            </MagicCard>
          </MagicCardGrid>
        </main>
      </div>
    </div>);

}

export default AnnouncementsPage;