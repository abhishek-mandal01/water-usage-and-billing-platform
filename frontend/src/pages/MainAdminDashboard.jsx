import { useState, useEffect } from 'react';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

const mockUsageData = [
  { community: 'Greenwood', usage: 1200 },
  { community: 'Sunrise', usage: 2100 },
  { community: 'Oasis', usage: 800 },
  { community: 'Pine', usage: 1500 },
];

const mockPurchaseData = [
  { month: 'Jan', revenue: 15000 },
  { month: 'Feb', revenue: 20000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 25000 },
  { month: 'May', revenue: 22000 },
  { month: 'Jun', revenue: 28000 },
];

function MainAdminDashboard() {
  const [pendingVerifications, setPendingVerifications] = useState([]);

  const fetchPendingVerifications = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/verification/pending');
      const data = await res.json();
      setPendingVerifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchPendingVerifications(), 0);
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/verification/approve/${id}`, { method: 'POST' });
      alert('Community Admin Approved!');
      fetchPendingVerifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/verification/decline/${id}`, { method: 'POST' });
      alert('Community Admin Verification Denied!');
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
            <h1>Main Admin Dashboard</h1>
          </div>
          
          <MagicCardGrid>
            {/* Top 4 Metrics Grid */}
            <div className="grid-4">
              <MagicCard className="stat-card">
                <h3>Total Households</h3>
                <div className="stat-value">120</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-value">350</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>Total Water Used (kL)</h3>
                <div className="stat-value">450.5</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>Current Cycle</h3>
                <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>June 2026</div>
              </MagicCard>
            </div>

            {/* Pending Verifications Section */}
            <MagicCard style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <h2 style={{ marginTop: 0, fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>Pending Community Admin Verifications</h2>
              {pendingVerifications.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No pending verifications at this time.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Aadhar</th>
                        <th>PAN</th>
                        <th>Phone</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingVerifications.map(v => (
                        <tr key={v.id}>
                          <td>{v.id}</td>
                          <td>{v.aadharCard}</td>
                          <td>{v.panCard}</td>
                          <td>{v.phoneNumber}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                              <button onClick={() => handleApprove(v.id)} className="btn btn-success">Approve</button>
                              <button onClick={() => handleDecline(v.id)} className="btn btn-danger">Deny</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </MagicCard>
            
            {/* Charts section */}
            <div className="grid-2">
              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>Platform Usage (Liters by Community)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockUsageData} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="community" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} cursor={{ fill: 'var(--bg-card-hover)' }} />
                    <Bar dataKey="usage" name="Usage (L)" fill="var(--chart-secondary)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </MagicCard>
              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>Revenue / Water Purchases</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPurchaseData} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="var(--chart-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--chart-primary)', strokeWidth: 2, stroke: 'var(--bg-card)' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </MagicCard>
            </div>

            {/* Bottom section */}
            <div className="grid-3">
              <MagicCard className="chart-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-primary-500)' }}></span> Recent Activities
                </h3>
                <ul style={{ paddingLeft: 'var(--space-5)', margin: 0, color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: 'var(--text-sm)' }}>
                  <li><strong>User #204</strong> registered in Greenwood.</li>
                  <li>Bills generated for <strong>Sunrise</strong> community.</li>
                  <li>New Admin Request from <strong>Oasis</strong>.</li>
                </ul>
              </MagicCard>
              
              <MagicCard className="chart-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-warning-500)' }}></span> Pending Action
                </h3>
                <div className="alert alert-warning">
                  <strong>15 Households</strong> across 3 communities have unpaid bills exceeding 30 days. Action recommended.
                </div>
              </MagicCard>
              
              <MagicCard className="chart-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-danger-500)' }}></span> Leak Alerts (System)
                </h3>
                <div className="alert alert-danger">
                  <strong>Critical Alert!</strong> Abnormal water flow detected in the main pipeline of <strong>Block B (Greenwood)</strong>.
                </div>
              </MagicCard>
            </div>
            
          </MagicCardGrid>
          
        </main>
      </div>
    </div>
  );
}

export default MainAdminDashboard;
