import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { CheckCircle, Clock, AlertCircle, Share2, UserCheck, Eye } from 'lucide-react';

function MainAdminSupportPage() {const { t } = useTranslation();
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
        return <span className="badge badge-warning"><Clock size={12} />{t("mainAdmin.open")}</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-info"><AlertCircle size={12} />{t("mainAdmin.inProgress")}</span>;
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="badge badge-success"><CheckCircle size={12} />{t("mainAdmin.resolved")}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getOriginBadge = (ticket) => {
    if (ticket.forwardedToMainAdmin) {
      return (
        <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Share2 size={12} />{t("mainAdmin.forwardedTechFault")}
        </span>);

    }
    return (
      <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <UserCheck size={12} />{t("mainAdmin.communityAdminTicket")}
      </span>);

  };

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>{t("mainAdmin.systemSupportEscalationTickets")}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>{t("mainAdmin.systemwideticketoversightDisplaysconcerns")}

              </p>
            </div>
          </div>

          <MagicCardGrid>
            <div className="grid-2-1">
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{t("mainAdmin.mainAdminEscalations")}
                  {tickets.length})
                </h3>

                {loading ?
                <div className="loading-screen" style={{ height: '200px' }}>{t("mainAdmin.loading")}</div> :
                tickets.length === 0 ?
                <p style={{ color: 'var(--text-tertiary)' }}>{t("mainAdmin.nocommunityconcernsorforwarded")}</p> :

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t("mainAdmin.iD")}</th>
                          <th>{t("mainAdmin.raisedBy")}</th>
                          <th>{t("mainAdmin.subject")}</th>
                          <th>{t("mainAdmin.originScope")}</th>
                          <th>{t("mainAdmin.status")}</th>
                          <th>{t("mainAdmin.action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((ticket) =>
                      <tr key={ticket.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedTicket(ticket)}>
                            <td style={{ fontWeight: 'var(--font-semibold)' }}>#{ticket.id}</td>
                            <td>
                              <div>{ticket.raisedByName}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{ticket.raisedByRole}</div>
                            </td>
                            <td style={{ fontWeight: 'var(--font-medium)' }}>{ticket.title}</td>
                            <td>{getOriginBadge(ticket)}</td>
                            <td>{getStatusBadge(ticket.status)}</td>
                            <td>
                              <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}>
                                <Eye size={14} />{t("mainAdmin.inspect")}
                          </button>
                            </td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
                }
              </MagicCard>

              {/* Detail Inspection Card */}
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{t("mainAdmin.ticketResolutionDetails")}

                </h3>

                {selectedTicket ?
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge badge-info">{t("mainAdmin.ticket")}{selectedTicket.id}</span>
                        {getOriginBadge(selectedTicket)}
                      </div>
                      <h4 style={{ margin: '8px 0 0 0', color: 'var(--text-primary)' }}>{selectedTicket.title}</h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>{t("mainAdmin.raisedby")}
                      {selectedTicket.raisedByName} ({selectedTicket.raisedByRole}{t("mainAdmin.on")}{new Date(selectedTicket.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                      <strong>{t("mainAdmin.description")}</strong><br />
                      {selectedTicket.description}
                    </div>

                    {selectedTicket.forwardedToMainAdmin && selectedTicket.forwardedReason &&
                  <div style={{ padding: '12px', backgroundColor: 'var(--color-warning-50)', borderRadius: '6px', border: '1px solid var(--color-warning-400)', color: 'var(--color-warning-700)', fontSize: '13px' }}>
                        <strong>{t("mainAdmin.forwardingNoteReason")}</strong> {selectedTicket.forwardedReason}
                      </div>
                  }

                    <div>
                      <label className="form-label">{t("mainAdmin.updateTicketStatus")}</label>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        <button className="btn btn-outline" onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS')}>{t("mainAdmin.inProgress")}

                      </button>
                        <button className="btn btn-success" onClick={() => handleUpdateStatus(selectedTicket.id, 'RESOLVED')}>{t("mainAdmin.markResolved")}

                      </button>
                        <button className="btn btn-danger" onClick={() => handleUpdateStatus(selectedTicket.id, 'CLOSED')}>{t("mainAdmin.closeTicket")}

                      </button>
                      </div>
                    </div>
                  </div> :

                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{t("mainAdmin.selectanescalationticketfrom")}

                </p>
                }
              </MagicCard>
            </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>);

}

export default MainAdminSupportPage;