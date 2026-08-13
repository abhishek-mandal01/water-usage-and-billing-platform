import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Award, Lightbulb, Droplet } from 'lucide-react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';

import SkeletonLoader from '../components/SkeletonLoader';

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [peerData, setPeerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <Topbar />
          <main className="dashboard-content">
            <SkeletonLoader type="dashboard" />
          </main>
        </div>
      </div>
    );
  }

  const data = dashboardData || {
    todaysUsage: 0, currentBillAmount: 0, billingCycle: 'N/A', 
    monthlyConsumption: [], weeklyUsage: [], recentAlerts: [], apartmentAverageComparison: 0, waterTipsFeed: []
  };

  const tips = (data.waterTipsFeed && data.waterTipsFeed.length > 0) ? data.waterTipsFeed : [
    t('dashboard.tip1', "Check faucets and pipes for leaks. A small drip can waste 20 gallons of water per day."),
    t('dashboard.tip2', "Turn off the tap while brushing your teeth to save up to 8 gallons of water."),
    t('dashboard.tip3', "Use your dishwasher only when it's fully loaded to maximize water efficiency."),
    t('dashboard.tip4', "Install water-saving showerheads to reduce water consumption by up to 30%."),
    t('dashboard.tip5', "Collect rainwater for your garden plants.")
  ];

  const lastMonthUsage = data.monthlyConsumption?.length > 0 
    ? data.monthlyConsumption[data.monthlyConsumption.length - 1].value 
    : (data.todaysUsage || 0);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <div className="page-header">
            <h1>{t('dashboard.myDashboard', 'My Dashboard')}</h1>
          </div>
          
          <MagicCardGrid>
            {/* Top Metrics */}
            <div className="grid-4">
              <MagicCard className="stat-card">
                <h3>{t('dashboard.lastMonthUsage', "Last Month's Usage")}</h3>
                <div className="stat-value" style={{ color: 'var(--color-primary-600)' }}>{lastMonthUsage} L</div>
                <div className="stat-sub" style={{ color: 'var(--color-success-500)' }}>{t('dashboard.latestReading', "Based on billing cycle")}</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>{t('dashboard.currentBill')}</h3>
                <div className="stat-value">₹{(data.currentBillAmount || 0).toFixed(2)}</div>
                <div className="stat-sub">{t('dashboard.cycle')} {data.billingCycle}</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>{t('dashboard.activeAlerts')}</h3>
                <div className="stat-value" style={{ color: data.alerts > 0 ? 'var(--color-danger-500)' : 'var(--color-success-500)' }}>{data.alerts || 0}</div>
                <div className="stat-sub">{t('dashboard.leakActive')}</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>{t('dashboard.peerBenchmark')}</h3>
                <div className="stat-value" style={{ color: 'var(--color-success-500)', fontSize: 'var(--text-xl)' }}>
                  {peerData ? peerData.percentileRank : "Top 25% Water Saver"}
                </div>
                <div className="stat-sub">{t('dashboard.communityRank')}</div>
              </MagicCard>
            </div>
            
            {/* Peer Benchmarking Card */}
            {peerData && (
              <MagicCard style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <Award color="var(--color-accent-600)" size={24} />
                  <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                    {t('dashboard.peerBenchmarking')}
                  </h3>
                </div>

                <div className="grid-3" style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{t('dashboard.yourAverage')}</span>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>
                      {peerData.userConsumption} L
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{t('dashboard.apartmentAverage')}</span>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)' }}>
                      {peerData.apartmentAverage} L
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{t('dashboard.similarFlatSize')}</span>
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
                <h3>{t('dashboard.monthlyConsumption')}</h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthlyConsumption} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={12} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                      <Bar dataKey="value" fill="#6c8eef" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
              
              <MagicCard className="chart-card">
                <h3>{t('dashboard.weeklyUsage')}</h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.weeklyUsage} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={12} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                      <Line type="monotone" dataKey="value" stroke="#5bbcaa" strokeWidth={3} dot={{ r: 4, fill: '#5bbcaa' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>

            {/* Water Saving Tips Feed */}
            <MagicCard style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))' }}>
              
              {data.waterFact && (
                <div style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-4)', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--color-accent-500)', boxShadow: 'var(--shadow-sm)' }}>
                  <h4 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-accent-600)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Did You Know?</h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.5' }}>
                    {data.waterFact.replace(/Did you know\?\s*/i, '')}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <Droplet color="var(--color-primary-600)" size={24} />
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  {t('dashboard.waterSavingTips')}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {tips.map((tip, idx) => (
                  <div key={idx} style={{ 
                    padding: 'var(--space-3)', 
                    backgroundColor: 'var(--bg-card)', 
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--color-primary-500)',
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)'
                  }}>
                    <Lightbulb size={18} color="var(--color-primary-500)" />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </MagicCard>
            
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
