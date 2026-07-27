import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

const revenueStatus = [
  { name: 'Paid Bills (INR)', value: 185000 },
  { name: 'Unpaid Outstanding (INR)', value: 32000 },
];
const COLORS = ['#10b981', '#ef4444'];

function MainAdminFinancialsPage() {
  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>Financials Overview & Revenue Audit</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Overview of billing collections, online Razorpay transactions, outstanding balances, and tanker procurement costs.
              </p>
            </div>
          </div>

          <MagicCardGrid>
            <div className="grid-3">
              <MagicCard className="stat-card">
                <h3>Total Billed Amount</h3>
                <div className="stat-value">₹2,17,000</div>
                <div className="stat-sub">Current Cycle</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>Total Online Collections</h3>
                <div className="stat-value" style={{ color: 'var(--color-success-500)' }}>₹1,85,000</div>
                <div className="stat-sub">85.2% Realized</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>Bulk Procurement Cost</h3>
                <div className="stat-value" style={{ color: 'var(--color-warning-600)' }}>₹48,500</div>
                <div className="stat-sub">Tanker & Municipal</div>
              </MagicCard>
            </div>

            <div className="grid-2-1">
              <MagicCard className="chart-card" style={{ height: '320px' }}>
                <h3>Paid vs Outstanding Bill Status</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={revenueStatus} cx="50%" cy="45%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                      {revenueStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </MagicCard>

              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  Razorpay Gateway Status
                </h3>
                <div className="alert alert-info" style={{ marginBottom: 'var(--space-3)' }}>
                  <strong>Gateway: Active (Live/Test Mode)</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xs)' }}>Webhooks & Signature verification functional.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Success Rate:</span>
                    <strong style={{ color: 'var(--color-success-500)' }}>99.4%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Avg Settlement Time:</span>
                    <strong>T+1 Days</strong>
                  </div>
                </div>
              </MagicCard>
            </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default MainAdminFinancialsPage;
