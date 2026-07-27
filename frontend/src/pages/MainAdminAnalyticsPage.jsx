import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

const analyticsTrendData = [
  { month: 'Jan', totalVolume: 125000, activeCommunities: 4 },
  { month: 'Feb', totalVolume: 140000, activeCommunities: 5 },
  { month: 'Mar', totalVolume: 135000, activeCommunities: 6 },
  { month: 'Apr', totalVolume: 160000, activeCommunities: 8 },
  { month: 'May', totalVolume: 185000, activeCommunities: 9 },
  { month: 'Jun', totalVolume: 210000, activeCommunities: 12 },
];

const communityBreakdown = [
  { community: 'Greenwood Heights', usage: 52000, households: 45 },
  { community: 'Sunrise Enclave', usage: 68000, households: 60 },
  { community: 'Oasis Gardens', usage: 34000, households: 30 },
  { community: 'Pinecrest Apartments', usage: 41000, households: 38 },
];

function MainAdminAnalyticsPage() {
  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>System Analytics & Usage Intelligence</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Platform-wide insights across all registered communities, water consumption metrics, and growth trends.
              </p>
            </div>
          </div>

          <MagicCardGrid>
            <div className="grid-4">
              <MagicCard className="stat-card">
                <h3>Total Platform Usage</h3>
                <div className="stat-value" style={{ color: 'var(--color-primary-600)' }}>854 kL</div>
                <div className="stat-sub">+14% vs last month</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>Active Communities</h3>
                <div className="stat-value">12</div>
                <div className="stat-sub">173 Total Households</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>Avg Household Usage</h3>
                <div className="stat-value">4.9 kL</div>
                <div className="stat-sub">Monthly Average</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>Water Conserved</h3>
                <div className="stat-value" style={{ color: 'var(--color-success-500)' }}>112 kL</div>
                <div className="stat-sub">Via Alert Reduction</div>
              </MagicCard>
            </div>

            <div className="grid-2">
              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>Platform Water Consumption Trend (Liters)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                    <defs>
                      <linearGradient id="colorPlatform" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Area type="monotone" dataKey="totalVolume" stroke="var(--color-primary-600)" fillOpacity={1} fill="url(#colorPlatform)" />
                  </AreaChart>
                </ResponsiveContainer>
              </MagicCard>

              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>Consumption Comparison by Community (L)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={communityBreakdown} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="community" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Bar dataKey="usage" fill="var(--color-accent-500)" radius={[4, 4, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </MagicCard>
            </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default MainAdminAnalyticsPage;
