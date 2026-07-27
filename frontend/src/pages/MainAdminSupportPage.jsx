import { useState, useEffect } from 'react';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { CheckCircle, Clock, AlertCircle, Share2, UserCheck, Eye } from 'lucide-react';

function MainAdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/tickets/all');
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

  const getOriginBadge = (t) => {
    if (t.forwardedToMainAdmin) {
      return (
        <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Share2 size={12} /> Forwarded Tech Fault
        </span>
      );
    }
    return (
      <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <UserCheck size={12} /> Community Admin Ticket
      </span>
    );
  };

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>System Support & Escalation Tickets</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                System-wide ticket oversight. Displays concerns raised by Community Admins & resident technical faults forwarded for resolution.
              </p>
            </div>
          </div>

          <MagicCardGrid>
            <div className="grid-2-1">
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  Main Admin Escalations ({tickets.length})
                </h3>

                {loading ? (
                  <div className="loading-screen" style={{ height: '200px' }}>Loading...</div>
                ) : tickets.length === 0 ? (
                  <p style={{ color: 'var(--text-tertiary)' }}>No community concerns or forwarded technical fault tickets found.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Raised By</th>
                          <th>Subject</th>
                          <th>Origin / Scope</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((t) => (
                          <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedTicket(t)}>
                            <td style={{ fontWeight: 'var(--font-semibold)' }}>#{t.id}</td>
                            <td>
                              <div>{t.raisedByName}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{t.raisedByRole}</div>
                            </td>
                            <td style={{ fontWeight: 'var(--font-medium)' }}>{t.title}</td>
                            <td>{getOriginBadge(t)}</td>
                            <td>{getStatusBadge(t.status)}</td>
                            <td>
                              <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}>
                                <Eye size={14} /> Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </MagicCard>

              {/* Detail Inspection Card */}
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  Ticket Resolution Details
                </h3>

                {selectedTicket ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge badge-info">Ticket #{selectedTicket.id}</span>
                        {getOriginBadge(selectedTicket)}
                      </div>
                      <h4 style={{ margin: '8px 0 0 0', color: 'var(--text-primary)' }}>{selectedTicket.title}</h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
                        Raised by: {selectedTicket.raisedByName} ({selectedTicket.raisedByRole}) on {new Date(selectedTicket.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                      <strong>Description:</strong><br />
                      {selectedTicket.description}
                    </div>

                    {selectedTicket.forwardedToMainAdmin && selectedTicket.forwardedReason && (
                      <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', border: '1px solid #fde68a', color: '#92400e', fontSize: '13px' }}>
                        <strong>Forwarding Note / Reason:</strong> {selectedTicket.forwardedReason}
                      </div>
                    )}

                    <div>
                      <label className="form-label">Update Ticket Status</label>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        <button className="btn btn-outline" onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS')}>
                          In Progress
                        </button>
                        <button className="btn btn-success" onClick={() => handleUpdateStatus(selectedTicket.id, 'RESOLVED')}>
                          Mark Resolved
                        </button>
                        <button className="btn btn-danger" onClick={() => handleUpdateStatus(selectedTicket.id, 'CLOSED')}>
                          Close Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                    Select an escalation ticket from the table to view details, notes, and resolve technical concerns.
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

export default MainAdminSupportPage;
