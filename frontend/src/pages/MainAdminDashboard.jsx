import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

// Hardcoded placeholders removed in favor of real API data
function MainAdminDashboard() {const { t } = useTranslation();
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalHouseholds: 0,
    totalUsers: 0,
    totalWaterUsedkL: 0,
    totalRevenue: 0,
    currentCycle: 'N/A',
    consumptionTrend: [],
    revenueTrend: [],
    globalAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);

  const fetchPendingVerifications = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/verification/pending');
      const data = await res.json();
      setPendingVerifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/dashboard/main-admin');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVerifications();
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/verification/approve/${id}`, { method: 'POST' });
      alert('Community Admin Approved!');
      setSelectedVerification(null);
      fetchPendingVerifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/verification/decline/${id}`, { method: 'POST' });
      alert('Community Admin Verification Denied!');
      setSelectedVerification(null);
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
          <div className="page-header">
            <h1>{t("mainAdmin.mainAdminDashboard")}</h1>
          </div>
          
          <MagicCardGrid>
            {/* Top 4 Metrics Grid */}
            <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.totalHouseholds")}</h3>
                <div className="stat-value">{loading ? '...' : dashboardData.totalHouseholds}</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.totalUsers")}</h3>
                <div className="stat-value">{loading ? '...' : dashboardData.totalUsers}</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.totalWaterUsedkL")}</h3>
                <div className="stat-value">{loading ? '...' : dashboardData.totalWaterUsedkL.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>Total Revenue</h3>
                <div className="stat-value">₹{loading ? '...' : dashboardData.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.currentCycle")}</h3>
                <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>{loading ? '...' : dashboardData.currentCycle}</div>
              </MagicCard>
            </div>

            {/* Pending Verifications Section */}
            <MagicCard style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <h2 style={{ marginTop: 0, fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>{t("mainAdmin.pendingCommunityAdminVerifications")}</h2>
              {pendingVerifications.length === 0 ?
              <p style={{ color: 'var(--text-secondary)' }}>{t("mainAdmin.nopendingverificationsatthis")}</p> :

              <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
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
              }
            </MagicCard>
            
            {/* Charts section */}
            <div className="grid-2">
              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>{t("mainAdmin.platformUsageLitersbyCommunity", "System Usage Trend (Liters)")}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.consumptionTrend} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} cursor={{ fill: 'var(--bg-card-hover)' }} />
                    <Bar dataKey="value" name="Usage (L)" fill="#5bbcaa" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </MagicCard>
              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>{t("mainAdmin.revenueWaterPurchases", "Revenue Trend (₹)")}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.revenueTrend} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Line type="monotone" dataKey="value" name="Revenue (₹)" stroke="#6c8eef" strokeWidth={3} dot={{ r: 4, fill: '#6c8eef', strokeWidth: 2, stroke: 'var(--bg-card)' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </MagicCard>
            </div>

            {/* Bottom section */}
            <div className="grid-3">
              <MagicCard className="chart-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-primary-500)' }}></span>{t("mainAdmin.recentActivities")}
                </h3>
                <ul style={{ paddingLeft: 'var(--space-5)', margin: 0, color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: 'var(--text-sm)' }}>
                  {dashboardData.globalAlerts?.filter(a => a.category !== 'Leak').slice(0, 2).map((alert, i) => (
                    <li key={i}><strong>{alert.title}: </strong> {alert.message} <span style={{ fontSize: '0.8em', color: 'var(--text-tertiary)' }}>({alert.communityName})</span></li>
                  ))}
                  {(!dashboardData.globalAlerts || dashboardData.globalAlerts.filter(a => a.category !== 'Leak').length === 0) && (
                    <li>No recent activities.</li>
                  )}
                </ul>
              </MagicCard>
              
              <MagicCard className="chart-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-warning-500)' }}></span>{t("mainAdmin.pendingAction")}
                </h3>
                {pendingVerifications.length > 0 ? (
                  <div className="alert alert-warning" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <strong>{pendingVerifications.length} Pending Verifications</strong>
                    <span>You have {pendingVerifications.length} community admin registration(s) requiring your approval.</span>
                  </div>
                ) : (
                  <div className="alert alert-success">
                    <strong>All Caught Up!</strong>
                    <span style={{ display: 'block' }}>No pending actions required at this time.</span>
                  </div>
                )}
              </MagicCard>
              
              <MagicCard className="chart-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-danger-500)' }}></span>{t("mainAdmin.leakAlertsSystem")}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {dashboardData.globalAlerts?.filter(a => a.category === 'Leak').slice(0, 2).map((alert, i) => (
                    <div key={i} className="alert alert-danger">
                      <strong>{alert.title} </strong> {alert.message} <br/> <em>Location: {alert.communityName}</em>
                    </div>
                  ))}
                  {(!dashboardData.globalAlerts || dashboardData.globalAlerts.filter(a => a.category === 'Leak').length === 0) && (
                    <div className="alert alert-success">
                      <strong>All Clear!</strong>
                      <span style={{ display: 'block' }}>No active leak alerts detected globally.</span>
                    </div>
                  )}
                </div>
              </MagicCard>
            </div>
            
          </MagicCardGrid>
          
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
    </div>);

}

export default MainAdminDashboard;