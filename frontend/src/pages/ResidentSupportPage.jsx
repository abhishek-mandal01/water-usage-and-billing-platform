import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { MessageSquare, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';

function ResidentSupportPage() {const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [statusMsg, setStatusMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const user = JSON.parse(localStorage.getItem('user')) || { id: 1 };

  const fetchTickets = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/tickets/my/${user.id}`);
      if (res.ok) {
        setTickets(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchTickets(), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTickets = tickets.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (t.title || '').toLowerCase().includes(q) || t.id.toString().includes(q);
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortOption === 'newest') return b.id - a.id;
    if (sortOption === 'oldest') return a.id - b.id;
    if (sortOption === 'status_open') {
      if (a.status === 'OPEN' && b.status !== 'OPEN') return -1;
      if (a.status !== 'OPEN' && b.status === 'OPEN') return 1;
      return b.id - a.id;
    }
    return 0;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('Submitting ticket...');
    try {
      const res = await fetch('http://localhost:8081/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          raisedById: user.id
        })
      });
      if (res.ok) {
        setStatusMsg('Ticket submitted successfully!');
        setFormData({ title: '', description: '' });
        setShowModal(false);
        fetchTickets();
      } else {
        setStatusMsg('Failed to submit ticket.');
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Error submitting ticket.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{t("resident.open")}</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} />{t("resident.inProgress")}</span>;
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} />{t("resident.resolved")}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />

        {showModal &&
        <div className="modal-overlay">
            <div className="modal-content">
              <h2 style={{ marginTop: 0, color: 'var(--text-primary)' }}>{t("resident.raiseSupportConcern")}</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                <div>
                  <label className="form-label">{t("resident.subjectTitle")}</label>
                  <input
                  type="text"
                  required
                  placeholder="e.g. Discrepancy in billing amount or suspected leak"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input" />
                
                </div>
                <div>
                  <label className="form-label">{t("resident.detailedDescription")}</label>
                  <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue or concern in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  style={{ resize: 'vertical' }} />
                
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>{t("resident.cancel")}</button>
                  <button type="submit" className="btn btn-primary">{t("resident.submitTicket")}</button>
                </div>
              </form>
            </div>
          </div>
        }

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>{t("resident.supportResidentConcerns")}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>{t("resident.raisebillinginquiriesreportleaks")}

              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} />{t("resident.newSupportTicket")}
            </button>
          </div>

          {statusMsg && <div className="alert alert-info" style={{ marginBottom: 'var(--space-5)' }}>{statusMsg}</div>}

          <MagicCardGrid>
            <MagicCard style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{t("resident.mySupportTickets")} ({tickets.length})</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="status_open">Open First</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', width: '200px' }}
                  />
                </div>
              </div>

              {loading ?
              <div className="loading-screen" style={{ height: '200px' }}>{t("resident.loadingtickets")}</div> :
              tickets.length === 0 ?
              <div style={{ textAlign: 'center', padding: 'var(--space-10) 0', color: 'var(--text-tertiary)' }}>
                  <MessageSquare size={48} style={{ marginBottom: 'var(--space-3)' }} />
                  <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>{t("resident.nosupportticketsraisedyet")}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>{t("resident.ifyouhavebillinginquiries")}</p>
                </div> :

              <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary-50)' }}>
                        <th>{t("resident.ticketID")}</th>
                        <th>{t("resident.subject")}</th>
                        <th>{t("resident.level")}</th>
                        <th>{t("resident.status")}</th>
                        <th>{t("resident.submittedOn")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTickets.map((t) =>
                    <tr key={t.id}>
                          <td style={{ fontWeight: 'var(--font-semibold)' }}>#{t.id}</td>
                          <td>
                            <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>{t.title}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{t.description}</div>
                          </td>
                          <td><span className="badge badge-info">{t.level}</span></td>
                          <td>{getStatusBadge(t.status)}</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                            {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent'}
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              }
            </MagicCard>
          </MagicCardGrid>
        </main>
      </div>
    </div>);

}

export default ResidentSupportPage;