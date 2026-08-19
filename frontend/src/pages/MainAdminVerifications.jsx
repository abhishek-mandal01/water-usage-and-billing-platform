import { useState, useEffect } from 'react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCard } from '../components/MagicBento';

function MainAdminVerifications() {
  const { t } = useTranslation();
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPendingVerifications = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/verification/pending');
      const data = await res.json();
      setPendingVerifications(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {// eslint-disable-next-line react-hooks/set-state-in-effect

    fetchPendingVerifications();
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/verification/approve/${id}`, { method: 'POST' });
      alert('Community Admin Approved!');
      setSelectedVerification(null);// eslint-disable-next-line react-hooks/set-state-in-effect

      fetchPendingVerifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/verification/decline/${id}`, { method: 'POST' });
      alert('Community Admin Verification Denied!');
      setSelectedVerification(null);// eslint-disable-next-line react-hooks/set-state-in-effect

      fetchPendingVerifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
            <div>
              <h1 style={{ margin: 0 }}>{t("mainAdmin.pendingCommunityAdminVerifications")}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Review and approve community administrator registrations.
              </p>
            </div>
          </div>
          
          <MagicCard style={{ padding: 'var(--space-6)' }}>
            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading verifications...</p>
            ) : pendingVerifications.length === 0 ? (
              <div className="alert alert-success">
                <strong>All Caught Up!</strong>
                <span style={{ display: 'block', marginTop: '4px' }}>There are no pending verifications at this time.</span>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-primary-50)' }}>
                      <th>{t("mainAdmin.userID")}</th>
                      <th>Name</th>
                      <th>{t("mainAdmin.aadhar")}</th>
                      <th>{t("mainAdmin.pAN")}</th>
                      <th>{t("mainAdmin.phone")}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingVerifications.map((v) =>
                      <tr key={v.id} onClick={() => setSelectedVerification(v)} style={{ cursor: 'pointer' }} className="clickable-row">
                        <td>{v.id}</td>
                        <td>{v.name || 'N/A'}</td>
                        <td>{v.aadharCard}</td>
                        <td>{v.panCard}</td>
                        <td>{v.phoneNumber}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleApprove(v.id); }} 
                              className="btn btn-success" 
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                            >
                              Approve
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDecline(v.id); }} 
                              className="btn btn-danger" 
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                            >
                              Deny
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </MagicCard>
        </main>
      </div>

      {/* Verification Modal */}
      {selectedVerification && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', minWidth: '400px', boxShadow: 'var(--shadow-xl)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>Review Verification</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', color: 'var(--text-secondary)' }}>
              <div><strong>User ID:</strong> {selectedVerification.id}</div>
              <div><strong>Name:</strong> {selectedVerification.name || 'N/A'}</div>
              <div><strong>Aadhar Card:</strong> {selectedVerification.aadharCard}</div>
              <div><strong>PAN Card:</strong> {selectedVerification.panCard}</div>
              <div><strong>Phone Number:</strong> {selectedVerification.phoneNumber}</div>
              <div><strong>Address:</strong> {selectedVerification.address || 'N/A'}</div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedVerification(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={() => handleDecline(selectedVerification.id)} className="btn btn-danger">Deny</button>
              <button onClick={() => handleApprove(selectedVerification.id)} className="btn btn-success">Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainAdminVerifications;
