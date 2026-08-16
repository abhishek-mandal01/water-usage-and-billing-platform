import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
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

  const data = dashboardData || {};



  const tips = (data.waterTipsFeed && data.waterTipsFeed.length > 0) ? data.waterTipsFeed : [
    t('dashboard.tip1', "Check faucets and pipes for leaks. A small drip can waste 20 gallons of water per day."),
    t('dashboard.tip2', "Turn off the tap while brushing your teeth to save up to 8 gallons of water."),
    t('dashboard.tip3', "Use your dishwasher only when it's fully loaded to maximize water efficiency."),
  ];

  const monthlyConsumptionData = (data.monthlyConsumption && data.monthlyConsumption.length > 0)
    ? data.monthlyConsumption.map(item => ({
        label: item.label || item.month || item.name || 'Month',
        value: item.value ?? item.consumption ?? item.usage ?? 12000
      }))
    : [
        { label: 'Apr', value: 12400 },
        { label: 'May', value: 14200 },
        { label: 'Jun', value: 13800 },
        { label: 'Jul', value: 15600 },
        { label: 'Aug', value: 14100 },
      ];

  const weeklyUsageData = (data.weeklyUsage && data.weeklyUsage.length > 0)
    ? data.weeklyUsage.map(item => ({
        label: item.label || item.day || item.name || 'Day',
        value: item.value ?? item.consumption ?? item.usage ?? 350
      }))
    : [
        { label: 'Mon', value: 420 },
        { label: 'Tue', value: 380 },
        { label: 'Wed', value: 450 },
        { label: 'Thu', value: 410 },
        { label: 'Fri', value: 490 },
        { label: 'Sat', value: 580 },
        { label: 'Sun', value: 530 },
      ];


  const displayBill = data.currentBillAmount || 450.50;
  const displayCycle = data.billingCycle || 'August';
  const displayAlerts = data.alerts || 0;

  const displayPeerData = (peerData && peerData.userConsumption != null) ? peerData : {
    percentileRank: "Top 20% Water Saver",
    userConsumption: 145,
    apartmentAverage: 180,
    similarSizeAverage: 160,
    conservationTip: "You're doing great! Keep taking shorter showers to save even more."
  };

  const lastMonthUsage = monthlyConsumptionData.length > 0 
    ? monthlyConsumptionData[monthlyConsumptionData.length - 1].value 
    : (data.todaysUsage || 0);

  const peerComparisonData = peerData ? [
    { name: t('dashboard.yourHome', 'Your home'), usage: peerData.userConsumption ?? 0 },
    { name: t('dashboard.apartmentAverage', 'Apartment average'), usage: peerData.apartmentAverage ?? 0 },
    { name: t('dashboard.similarFlatSize', 'Similar flat size'), usage: peerData.similarSizeAverage ?? 0 }
  ] : [];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <div className="page-header">
            <h1>Welcome, {JSON.parse(localStorage.getItem('user') || '{}')?.name?.split(' ')[0] || 'Resident'} 👋</h1>
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
                <div className="stat-value">₹{displayBill.toFixed(2)}</div>
                <div className="stat-sub">{t('dashboard.cycle')} {displayCycle}</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>{t('dashboard.activeAlerts')}</h3>
                <div className="stat-value" style={{ color: displayAlerts > 0 ? 'var(--color-danger-500)' : 'var(--color-success-500)' }}>{displayAlerts}</div>
                <div className="stat-sub">{t('dashboard.leakActive')}</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>{t('dashboard.peerBenchmark')}</h3>
                <div className="stat-value" style={{ color: 'var(--color-success-500)', fontSize: 'var(--text-xl)' }}>
                  {displayPeerData.percentileRank}
                </div>
                <div className="stat-sub">{t('dashboard.communityRank')}</div>
              </MagicCard>
            </div>
            
            {/* Peer Benchmarking Card */}
            {displayPeerData && (
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
                      {displayPeerData.userConsumption} L
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{t('dashboard.apartmentAverage')}</span>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)' }}>
                      {displayPeerData.apartmentAverage} L
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{t('dashboard.similarFlatSize')}</span>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)' }}>
                      {displayPeerData.similarSizeAverage} L
                    </div>
                  </div>
                </div>

                <div style={{ height: '240px', marginBottom: 'var(--space-4)' }}>
                  <h4 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                    {t('dashboard.usageComparison', 'Usage Comparison (Liters)')}
                  </h4>
                  <ResponsiveContainer width="100%" height={196}>
                    <BarChart data={peerComparisonData} layout="vertical" margin={{ top: 0, right: 24, left: 12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--chart-grid)" />
                      <XAxis type="number" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" width={120} stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} L`, 'Average usage']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} cursor={{ fill: 'var(--bg-card-hover)' }} />
                      <Legend verticalAlign="bottom" height={24} />
                      <Bar dataKey="usage" name="Average usage (L)" radius={[0, 6, 6, 0]} barSize={24} animationDuration={900}>
                        {peerComparisonData.map((entry, index) => (
                          <Cell key={entry.name} fill={['#6c8eef', '#5bbcaa', '#f5ae45'][index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="alert alert-info" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Lightbulb size={20} color="var(--color-primary-600)" />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{displayPeerData.conservationTip}</span>
                </div>
              </MagicCard>
            )}

            {/* Charts Section */}
            <div className="grid-2">
              <MagicCard className="chart-card">
                <h3>{t('dashboard.monthlyConsumption')}</h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyConsumptionData} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}kL`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${Number(v).toLocaleString()} Liters`, 'Consumption']} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={34} animationDuration={1200} animationEasing="ease-out">
                        {monthlyConsumptionData.map((entry, index) => {
                          const maxVal = Math.max(...monthlyConsumptionData.map(d => d.value)) || 1;
                          let color = '#22c55e'; // green (low)
                          if (entry.value > maxVal * 0.75) color = '#ef4444'; // red (high)
                          else if (entry.value > maxVal * 0.4) color = '#f97316'; // orange (mid)
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
              
              <MagicCard className="chart-card">
                <h3>{t('dashboard.weeklyUsage')}</h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyUsageData} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}L`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${v} Liters`, 'Usage']} />
                      <Line type="monotone" dataKey="value" stroke="#34c77b" strokeWidth={3} dot={{ r: 5, fill: '#34c77b', stroke: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 7 }} animationDuration={1200} animationEasing="ease-out" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>


            <MagicCard style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <Droplet color="var(--color-primary-600)" size={24} />
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  {t('dashboard.waterSavingTips')}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {tips && tips.map((tip, idx) => (
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

            {/* Visual 1: Easy Donut - Water Breakdown by Activity */}
            <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c8eef, #34c77b)' }}></span>
                  Where Your Water Goes (By Activity)
                </h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Bathing & Shower', value: 35, color: '#6c8eef' },
                          { name: 'Washing & Laundry', value: 25, color: '#5bbcaa' },
                          { name: 'Kitchen & Cooking', value: 20, color: '#34c77b' },
                          { name: 'Garden & Cleaning', value: 20, color: '#f5ae45' },
                        ]}
                        cx="50%" cy="45%" innerRadius={60} outerRadius={95}
                        paddingAngle={5} dataKey="value"
                        animationDuration={1200} animationEasing="ease-out"
                      >
                        {['#6c8eef', '#5bbcaa', '#34c77b', '#f5ae45'].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} stroke="var(--bg-card)" strokeWidth={3} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v) => [`${v}% of daily water`, 'Share']} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {/* Visual 2: Easy Bar Chart - Daily Water Consumption */}
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #f5ae45, #e86356)' }}></span>
                  Daily Usage This Week (Liters)
                </h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { day: 'Mon', usage: 140, color: '#6c8eef' },
                        { day: 'Tue', usage: 125, color: '#5bbcaa' },
                        { day: 'Wed', usage: 160, color: '#34c77b' },
                        { day: 'Thu', usage: 130, color: '#f5ae45' },
                        { day: 'Fri', usage: 155, color: '#fb923c' },
                        { day: 'Sat', usage: 195, color: '#e86356' },
                        { day: 'Sun', usage: 180, color: '#a78bfa' },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <defs>
                        {['#6c8eef','#5bbcaa','#34c77b','#f5ae45','#fb923c','#e86356','#a78bfa'].map((color, i) => (
                          <linearGradient key={i} id={`dayBarGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}L`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v) => [`${v} Liters`, 'Water Used']} />
                      <Bar dataKey="usage" name="Liters" radius={[8, 8, 0, 0]} barSize={32} animationDuration={1200} animationEasing="ease-out">
                        {['#6c8eef','#5bbcaa','#34c77b','#f5ae45','#fb923c','#e86356','#a78bfa'].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#dayBarGrad${index})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>

            {/* Visual 3: Easy Line Chart - Monthly Water Bill Amount (₹) */}
            <MagicCard style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
              <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #34c77b, #5bbcaa)' }}></span>
                Monthly Water Bill (₹) History
              </h3>
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { month: 'Mar', bill: 450 },
                      { month: 'Apr', bill: 520 },
                      { month: 'May', bill: 480 },
                      { month: 'Jun', bill: 610 },
                      { month: 'Jul', bill: 540 },
                      { month: 'Aug', bill: 490 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="userBillAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34c77b" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#34c77b" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v) => [`₹${v}`, 'Bill Amount']} />
                    <Area type="monotone" dataKey="bill" name="Monthly Bill (₹)" stroke="#34c77b" strokeWidth={3} fill="url(#userBillAreaGrad)" dot={{ r: 5, fill: '#34c77b', stroke: 'var(--bg-card)', strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>

            {/* FULL-PAGE COVERAGE: 3-column Insights, Peak Hours & Smart Goals */}
            <div className="grid-3" style={{ marginTop: 'var(--space-6)' }}>
              {/* Card 1: Eco Score & Efficiency Badge */}
              <MagicCard style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>Water Saver Tier</h3>
                    <span style={{ backgroundColor: 'rgba(52, 199, 123, 0.15)', color: '#34c77b', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Top 15%</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#34c77b', marginBottom: 'var(--space-2)' }}>
                    88<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/100</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    Great job! Your household is consuming 18% less water than your community average this week.
                  </p>
                </div>
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  <span>Streak: <strong>14 Days Eco-Conscious</strong></span>
                  <span>Goal: <strong>120L/day</strong></span>
                </div>
              </MagicCard>

              {/* Card 2: Peak Consumption Hours Guide */}
              <MagicCard style={{ padding: 'var(--space-5)' }}>
                <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                  Community Usage Hours
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', backgroundColor: 'rgba(232, 99, 86, 0.1)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: '#e86356', fontWeight: 'bold' }}>🔴 Peak Hours</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>7:00 AM – 9:30 AM</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', backgroundColor: 'rgba(245, 174, 69, 0.1)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: '#f5ae45', fontWeight: 'bold' }}>🟡 Moderate Hours</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>6:30 PM – 9:00 PM</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', backgroundColor: 'rgba(52, 199, 123, 0.1)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: '#34c77b', fontWeight: 'bold' }}>🟢 Best Off-Peak</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>1:00 PM – 4:00 PM</span>
                  </div>
                </div>
              </MagicCard>

              {/* Card 3: Quick Action & Conservation Checklist */}
              <MagicCard style={{ padding: 'var(--space-5)' }}>
                <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                  Home Checklist
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xs)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <span style={{ color: '#34c77b' }}>✓</span> Faucet aerators checked (Normal)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <span style={{ color: '#34c77b' }}>✓</span> Zero household leak alerts active
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <span style={{ color: '#6c8eef' }}>ℹ</span> Next cycle meter read on <strong>Aug 31</strong>
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

export default UserDashboard;
