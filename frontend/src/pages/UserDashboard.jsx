import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Award, Lightbulb } from 'lucide-react';

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [peerData, setPeerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { id: 1 };
    
    Promise.all([
      fetch(`http://localhost:8081/api/dashboard/${user.id}`).then(r => r.json()).catch(() => null),
      fetch(`http://localhost:8081/api/dashboard/peer-benchmarking/${user.id}`).then(r => r.json()).catch(() => null)
    ]).then(([dData, pData]) => {
      if (dData) setDashboardData(dData);
      if (pData) setPeerData(pData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading Dashboard</div>;
  }

  const data = dashboardData || {
    todaysUsage: 0, currentBillAmount: 0, billingCycle: 'N/A', 
    monthlyConsumption: [], weeklyUsage: [], recentAlerts: [], apartmentAverageComparison: 0
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <div className="page-header">
            <h1>My Dashboard</h1>
          </div>
          
          <MagicCardGrid>
            {/* Top Metrics */}
            <div className="grid-4">
              <MagicCard className="stat-card">
                <h3>Today's Usage</h3>
                <div className="stat-value" style={{ color: 'var(--color-primary-600)' }}>{data.todaysUsage || 0} L</div>
                <div className="stat-sub" style={{ color: 'var(--color-success-500)' }}>Recorded today</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>Current Bill</h3>
                <div className="stat-value">₹{(data.currentBillAmount || 0).toFixed(2)}</div>
                <div className="stat-sub">Cycle: {data.billingCycle}</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>Active Alerts</h3>
                <div className="stat-value" style={{ color: data.alerts > 0 ? 'var(--color-danger-500)' : 'var(--color-success-500)' }}>{data.alerts || 0}</div>
                <div className="stat-sub">Leak Detection Active</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>Peer Benchmark Rank</h3>
                <div className="stat-value" style={{ color: 'var(--color-success-500)', fontSize: 'var(--text-xl)' }}>
                  {peerData ? peerData.percentileRank : "Top 25% Water Saver"}
                </div>
                <div className="stat-sub">Community Peer Rank</div>
              </MagicCard>
            </div>
            
            {/* Peer Benchmarking Card */}
            {peerData && (
              <MagicCard style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <Award color="var(--color-accent-600)" size={24} />
                  <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                    Peer Consumption Benchmarking
                  </h3>
                </div>

                <div className="grid-3" style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Your Average</span>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>
                      {peerData.userConsumption} L
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Apartment Average</span>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)' }}>
                      {peerData.apartmentAverage} L
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Similar Flat Size</span>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)' }}>
                      {peerData.similarSizeAverage} L
                    </div>
                  </div>
                </div>

                <div className="alert alert-info" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Lightbulb size={20} color="var(--color-primary-600)" />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{peerData.conservationTip}</span>
                </div>
              </MagicCard>
            )}

            {/* Charts Section */}
            <div className="grid-2">
              <MagicCard className="chart-card">
                <h3>Monthly Consumption (kL)</h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthlyConsumption} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={12} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                      <Bar dataKey="value" fill="var(--chart-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
              
              <MagicCard className="chart-card">
                <h3>Weekly Usage (Liters)</h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.weeklyUsage} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={12} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                      <Line type="monotone" dataKey="value" stroke="var(--chart-secondary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--chart-secondary)' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>
            
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
