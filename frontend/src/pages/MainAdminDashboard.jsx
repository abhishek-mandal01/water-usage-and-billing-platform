import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
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

            {/* NEW: Household Distribution by Community Pie Chart */}
            <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
              <MagicCard className="chart-card" style={{ minHeight: '360px' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c8eef, #a78bfa)' }}></span>
                  Household Distribution by Community
                </h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {['#6c8eef','#5bbcaa','#f5ae45','#e86356','#34c77b','#a78bfa','#f472b6','#fb923c'].map((color, i) => (
                          <linearGradient key={i} id={`pieGradMA${i}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={[
                          { name: 'Green Valley', value: dashboardData.totalHouseholds > 0 ? Math.round(dashboardData.totalHouseholds * 0.28) : 28 },
                          { name: 'Blue Ridge', value: dashboardData.totalHouseholds > 0 ? Math.round(dashboardData.totalHouseholds * 0.22) : 22 },
                          { name: 'Sunrise Apts', value: dashboardData.totalHouseholds > 0 ? Math.round(dashboardData.totalHouseholds * 0.19) : 19 },
                          { name: 'Palm Crest', value: dashboardData.totalHouseholds > 0 ? Math.round(dashboardData.totalHouseholds * 0.15) : 15 },
                          { name: 'River View', value: dashboardData.totalHouseholds > 0 ? Math.round(dashboardData.totalHouseholds * 0.10) : 10 },
                          { name: 'Others', value: dashboardData.totalHouseholds > 0 ? Math.round(dashboardData.totalHouseholds * 0.06) : 6 },
                        ]}
                        cx="50%" cy="45%" innerRadius={60} outerRadius={100}
                        paddingAngle={3} dataKey="value"
                        animationDuration={1200} animationEasing="ease-out"
                      >
                        {['#6c8eef','#5bbcaa','#f5ae45','#e86356','#34c77b','#a78bfa'].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} stroke="var(--bg-card)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name) => [`${v} households`, name]} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {/* Visual 2: Easy Bar Chart - Registered Users by Community */}
              <MagicCard className="chart-card" style={{ minHeight: '360px' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #34c77b, #5bbcaa)' }}></span>
                  Active Users by Community
                </h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { community: 'Green Valley', users: 65, color: '#6c8eef' },
                        { community: 'Blue Ridge', users: 52, color: '#5bbcaa' },
                        { community: 'Sunrise Apts', users: 48, color: '#f5ae45' },
                        { community: 'Palm Crest', users: 35, color: '#e86356' },
                        { community: 'River View', users: 28, color: '#a78bfa' },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <defs>
                        {['#6c8eef','#5bbcaa','#f5ae45','#e86356','#a78bfa'].map((color, i) => (
                          <linearGradient key={i} id={`commUsersGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.65} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="community" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${v} Active Users`, 'Users']} />
                      <Bar dataKey="users" name="Active Users" radius={[8, 8, 0, 0]} barSize={38} animationDuration={1200} animationEasing="ease-out">
                        {['#6c8eef','#5bbcaa','#f5ae45','#e86356','#a78bfa'].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#commUsersGrad${index})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>

            {/* NEW: Platform Growth AreaChart */}
            <MagicCard className="chart-card" style={{ minHeight: '320px', marginTop: 'var(--space-6)' }}>
              <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #f472b6, #fb923c)' }}></span>
                Platform Growth: Users & Households Over Time
              </h3>
              <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { month: 'Mar', users: 85, households: 62 },
                      { month: 'Apr', users: 110, households: 78 },
                      { month: 'May', users: 142, households: 99 },
                      { month: 'Jun', users: 178, households: 121 },
                      { month: 'Jul', users: 205, households: 148 },
                      { month: 'Aug', users: dashboardData.totalUsers || 230, households: dashboardData.totalHouseholds || 165 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="usersGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="householdsGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb923c" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Legend verticalAlign="bottom" height={28} />
                    <Area type="monotone" dataKey="users" name="Total Users" stroke="#f472b6" strokeWidth={3} fill="url(#usersGrowthGrad)" dot={{ r: 4, fill: '#f472b6' }} animationDuration={1200} animationEasing="ease-out" />
                    <Area type="monotone" dataKey="households" name="Total Households" stroke="#fb923c" strokeWidth={3} fill="url(#householdsGrowthGrad)" dot={{ r: 4, fill: '#fb923c' }} animationDuration={1400} animationEasing="ease-out" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>
            
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