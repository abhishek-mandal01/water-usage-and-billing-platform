import { useState, useEffect } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { CheckCircle, Clock, AlertCircle, Share2, Send } from 'lucide-react';

function CommunityAdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [forwardReason, setForwardReason] = useState('');
  const [showForwardBox, setShowForwardBox] = useState(false);
  const [msg, setMsg] = useState('');

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
        fetchTickets();
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
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
        const updated = await res.json();
        setMsg(`Ticket #${selectedTicket.id} successfully forwarded to Main Admin.`);
        setSelectedTicket(updated);
        setShowForwardBox(false);
        setForwardReason('');
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
        return <span className="badge badge-warning"><Clock size={12} /> Open</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-info"><AlertCircle size={12} /> In Progress</span>;
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="badge badge-success"><CheckCircle size={12} /> Resolved</span>;
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
          <div className="page-header">
            <div>
              <h1>Resident Concerns & Support</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Manage resident support tickets. Resolve community concerns or forward app/technical faults to Main Admin.
              </p>
            </div>
          </div>

          {msg && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{msg}</div>}

          <MagicCardGrid>
            <div className="grid-2-1">
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  Assigned Tickets ({tickets.length})
                </h3>

                {loading ? (
                  <div className="loading-screen" style={{ height: '200px' }}>Loading...</div>
                ) : tickets.length === 0 ? (
                  <p style={{ color: 'var(--text-tertiary)' }}>No tickets currently raised for your community.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Resident</th>
                          <th>Subject</th>
                          <th>Status</th>
                          <th>Escalation</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((t) => (
                          <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedTicket(t); setShowForwardBox(false); }}>
                            <td style={{ fontWeight: 'var(--font-semibold)' }}>#{t.id}</td>
                            <td>{t.raisedByName}</td>
                            <td style={{ fontWeight: 'var(--font-medium)' }}>{t.title}</td>
                            <td>{getStatusBadge(t.status)}</td>
                            <td>
                              {t.forwardedToMainAdmin ? (
                                <span className="badge badge-warning" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <Share2 size={10} /> Forwarded
                                </span>
                              ) : (
                                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Local</span>
                              )}
                            </td>
                            <td>
                              <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </MagicCard>

              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  Ticket Details & Actions
                </h3>

                {selectedTicket ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge badge-info">Ticket #{selectedTicket.id}</span>
                        {selectedTicket.forwardedToMainAdmin && (
                          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Share2 size={12} /> Forwarded to Main Admin Tech Support
                          </span>
                        )}
                      </div>
                      <h4 style={{ margin: '8px 0 0 0', color: 'var(--text-primary)' }}>{selectedTicket.title}</h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
                        Raised by: {selectedTicket.raisedByName} on {new Date(selectedTicket.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                      {selectedTicket.description}
                    </div>

                    {selectedTicket.forwardedToMainAdmin && selectedTicket.forwardedReason && (
                      <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', border: '1px solid #fde68a', color: '#92400e', fontSize: '13px' }}>
                        <strong>Forwarding Note for Tech Support:</strong> {selectedTicket.forwardedReason}
                      </div>
                    )}

                    <div>
                      <label className="form-label">Update Resolution Status</label>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                        <button className="btn btn-outline" onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS')}>
                          Mark In Progress
                        </button>
                        <button className="btn btn-success" onClick={() => handleUpdateStatus(selectedTicket.id, 'RESOLVED')}>
                          Mark Resolved
                        </button>
                        <button className="btn btn-danger" onClick={() => handleUpdateStatus(selectedTicket.id, 'CLOSED')}>
                          Close Ticket
                        </button>
                      </div>

                      {/* Technical Fault Forwarding Section */}
                      {!selectedTicket.forwardedToMainAdmin && (
                        <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-light)' }}>
                          {!showForwardBox ? (
                            <button
                              className="btn btn-warning"
                              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                              onClick={() => setShowForwardBox(true)}
                            >
                              <Share2 size={16} /> Forward Tech/App Concern to Main Admin
                            </button>
                          ) : (
                            <form onSubmit={handleForwardToMainAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label className="form-label" style={{ color: '#d97706', margin: 0 }}>
                                Reason for Forwarding to Main Admin
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. System app bug, meter syncing failure, or platform error"
                                value={forwardReason}
                                onChange={(e) => setForwardReason(e.target.value)}
                                className="form-input"
                                required
                              />
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowForwardBox(false)}>
                                  Cancel
                                </button>
                                <button type="submit" className="btn btn-warning">
                                  <Send size={14} /> Confirm Forward
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                    Select a ticket from the left panel to inspect details, update status, or forward app/technical concerns to Main Admin.
                  </p>
                )}
              </MagicCard>
            </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default CommunityAdminSupportPage;
