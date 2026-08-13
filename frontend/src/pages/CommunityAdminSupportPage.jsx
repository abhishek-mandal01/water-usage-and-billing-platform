import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { CheckCircle, Clock, AlertCircle, Share2, Send } from 'lucide-react';

function CommunityAdminSupportPage() {const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [forwardReason, setForwardReason] = useState('');
  const [showForwardBox, setShowForwardBox] = useState(false);
  const [msg, setMsg] = useState('');
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [raiseForm, setRaiseForm] = useState({ title: '', description: '' });

  const adminId = JSON.parse(localStorage.getItem('user'))?.id || 1;

  const fetchTickets = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/tickets/assigned/${adminId}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8081/api/tickets/${ticketId}/status?status=${newStatus}`, {
        method: 'PUT'
      });
      if (res.ok) {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
        if (selectedTicket && selectedTicket.id === ticketId) {
          if (newStatus === 'CLOSED') {
            setSelectedTicket(null);
          } else {
            setSelectedTicket({ ...selectedTicket, status: newStatus });
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleForwardToMainAdmin = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      const params = new URLSearchParams({ reason: forwardReason });
      const res = await fetch(`http://localhost:8081/api/tickets/${selectedTicket.id}/forward?${params.toString()}`, {
        method: 'PUT'
      });

      if (res.ok) {
        setMsg(`Ticket #${selectedTicket.id} successfully forwarded to Main Admin.`);
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, forwardedToMainAdmin: true, forwardedReason: forwardReason } : t));
        setSelectedTicket(null);
        setShowForwardBox(false);
        setForwardReason('');
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8081/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: raiseForm.title,
          description: raiseForm.description,
          raisedById: adminId
        })
      });
      if (res.ok) {
        setMsg('Your concern was successfully raised to the Main Admin.');
        setShowRaiseModal(false);
        setRaiseForm({ title: '', description: '' });
        fetchTickets();
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge badge-warning"><Clock size={12} />{t("communityAdmin.open")}</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-info"><AlertCircle size={12} />{t("communityAdmin.inProgress")}</span>;
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="badge badge-success"><CheckCircle size={12} />{t("communityAdmin.resolved")}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <CommunityAdminSidebar />
      <div className="dashboard-main">
        <Topbar />


        <main className="dashboard-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>{t("communityAdmin.residentConcernsSupport")}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>{t("communityAdmin.manageresidentsupportticketsResolve")}
              </p>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              onClick={() => setShowRaiseModal(true)}
            >
              <Send size={16} /> Raise Concern to Main Admin
            </button>
          </div>

          {msg && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{msg}</div>}

          <MagicCardGrid>
            <div className="grid-2-1">
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{t("communityAdmin.assignedTickets")} ({tickets.length})
                </h3>

                {loading ?
                <div className="loading-screen" style={{ height: '200px' }}>{t("communityAdmin.loading")}</div> :
                tickets.length === 0 ?
                <p style={{ color: 'var(--text-tertiary)' }}>{t("communityAdmin.noticketscurrentlyraisedfor")}</p> :

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t("communityAdmin.iD")}</th>
                          <th>{t("communityAdmin.resident")}</th>
                          <th>{t("communityAdmin.subject")}</th>
                          <th>{t("communityAdmin.status")}</th>
                          <th>{t("communityAdmin.escalation")}</th>
                          <th>{t("communityAdmin.action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.filter(ticket => ticket.status !== 'CLOSED' && !ticket.forwardedToMainAdmin).map((ticket) =>
                      <tr key={ticket.id} style={{ cursor: 'pointer' }} onClick={() => {setSelectedTicket(ticket);setShowForwardBox(false);}}>
                            <td style={{ fontWeight: 'var(--font-semibold)' }}>#{ticket.id}</td>
                            <td>{ticket.raisedByName}</td>
                            <td style={{ fontWeight: 'var(--font-medium)' }}>{ticket.title}</td>
                            <td>{getStatusBadge(ticket.status)}</td>
                            <td>
                              {ticket.forwardedToMainAdmin ?
                          <span className="badge badge-warning" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <Share2 size={10} />{t("communityAdmin.forwarded")}
                          </span> :

                          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{t("communityAdmin.local")}</span>
                          }
                            </td>
                            <td>
                              <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}>{t("communityAdmin.viewDetails")}

                          </button>
                            </td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
                }
              </MagicCard>

              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{t("communityAdmin.ticketDetailsActions")}

                </h3>

                {selectedTicket ?
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge badge-info">{t("communityAdmin.ticket")}{selectedTicket.id}</span>
                        {selectedTicket.forwardedToMainAdmin &&
                      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Share2 size={12} />{t("communityAdmin.forwardedtoMainAdminTech")}
                      </span>
                      }
                      </div>
                      <h4 style={{ margin: '8px 0 0 0', color: 'var(--text-primary)' }}>{selectedTicket.title}</h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>{t("communityAdmin.raisedby")}
                      {selectedTicket.raisedByName}{t("communityAdmin.on")}{new Date(selectedTicket.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                      {selectedTicket.description}
                    </div>

                    {selectedTicket.forwardedToMainAdmin && selectedTicket.forwardedReason &&
                  <div style={{ padding: '12px', backgroundColor: 'var(--color-warning-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-warning-400)', color: 'var(--color-warning-700)', fontSize: 'var(--text-sm)' }}>
                        <strong>{t("communityAdmin.forwardingNoteforTechSupport")}</strong> {selectedTicket.forwardedReason}
                      </div>
                  }

                    <div>
                      <label className="form-label">{t("communityAdmin.updateResolutionStatus")}</label>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                        <button className="btn btn-outline" onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS')}>{t("communityAdmin.markInProgress")}

                      </button>
                        <button className="btn btn-success" onClick={() => handleUpdateStatus(selectedTicket.id, 'RESOLVED')}>{t("communityAdmin.markResolved")}

                      </button>
                        <button className="btn btn-danger" onClick={() => handleUpdateStatus(selectedTicket.id, 'CLOSED')}>{t("communityAdmin.closeTicket")}

                      </button>
                      </div>

                      {/* Technical Fault Forwarding Section */}
                      {!selectedTicket.forwardedToMainAdmin &&
                    <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-light)' }}>
                          {!showForwardBox ?
                      <button
                        className="btn btn-warning"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        onClick={() => setShowForwardBox(true)}>
                        
                              <Share2 size={16} />{t("communityAdmin.forwardTechAppConcerntoMain")}
                      </button> :

                      <form onSubmit={handleForwardToMainAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label className="form-label" style={{ color: 'var(--color-warning-600)', margin: 0 }}>{t("communityAdmin.reasonforForwardingtoMain")}

                        </label>
                              <input
                          type="text"
                          placeholder="e.g. System app bug, meter syncing failure, or platform error"
                          value={forwardReason}
                          onChange={(e) => setForwardReason(e.target.value)}
                          className="form-input"
                          required />
                        
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowForwardBox(false)}>{t("communityAdmin.cancel")}

                          </button>
                                <button type="submit" className="btn btn-warning">
                                  <Send size={14} />{t("communityAdmin.confirmForward")}
                          </button>
                              </div>
                            </form>
                      }
                        </div>
                    }
                    </div>
                  </div> :

                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{t("communityAdmin.selectaticketfromthe")}

                </p>
                }
              </MagicCard>
            </div>
          </MagicCardGrid>

          {/* Raise Ticket Modal */}
          {showRaiseModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
            }}>
              <div style={{ backgroundColor: 'white', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ marginTop: 0, marginBottom: 'var(--space-4)', fontSize: 'var(--text-xl)' }}>Raise Concern to Main Admin</h2>
                <form onSubmit={handleRaiseTicket} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <label className="form-label">Subject</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. System Bug, Request for feature"
                      value={raiseForm.title}
                      onChange={(e) => setRaiseForm({ ...raiseForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-input" 
                      required 
                      rows="5"
                      placeholder="Describe your concern in detail..."
                      value={raiseForm.description}
                      onChange={(e) => setRaiseForm({ ...raiseForm, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setShowRaiseModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit Ticket</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>);

}

export default CommunityAdminSupportPage;