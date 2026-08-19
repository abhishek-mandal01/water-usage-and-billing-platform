import { useTranslation } from '../components/LanguageSelector/useTranslation';import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

import { useState, useEffect } from 'react';
const COLORS = ['#34c77b', '#e86356'];

function MainAdminFinancialsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    totalRevenue: 0,
    outstandingDues: 0,
    processedTransactions: 0,
    projectedNextMonth: 0,
    revenueTrend: [],
    communityRevenue: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8081/api/analytics/financials/main-admin')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDownload = () => {
    window.open('http://localhost:8081/api/analytics/financials/main-admin/download', '_blank');
  };

  const revenueStatus = [
    { name: 'Paid Bills (INR)', value: data.totalRevenue },
    { name: 'Unpaid Outstanding (INR)', value: data.outstandingDues }
  ];

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>{t("mainAdmin.financialsOverviewRevenueAudit")}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>{t("mainAdmin.overviewofbillingcollectionsonline")}</p>
            </div>
            <button onClick={handleDownload} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download PDF
            </button>
          </div>

          <MagicCardGrid>
            <div className="grid-3">
              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.totalBilledAmount")}</h3>
                <div className="stat-value">₹{loading ? '...' : (data.totalRevenue + data.outstandingDues).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div className="stat-sub">{t("mainAdmin.currentCycle")}</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.totalOnlineCollections")}</h3>
                <div className="stat-value" style={{ color: 'var(--color-success-500)' }}>₹{loading ? '...' : data.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div className="stat-sub">Processed Transactions: {data.processedTransactions}</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>Outstanding Dues</h3>
                <div className="stat-value" style={{ color: 'var(--color-warning-600)' }}>₹{loading ? '...' : data.outstandingDues.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div className="stat-sub">Pending Collection</div>
              </MagicCard>
            </div>

            <div className="grid-2-1">
              <MagicCard className="chart-card" style={{ height: '320px' }}>
                <h3>{t("mainAdmin.paidvsOutstandingBillStatus")}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={revenueStatus} cx="50%" cy="45%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                      {revenueStatus.map((entry, index) =>
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      )}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </MagicCard>

              <MagicCard style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{t("mainAdmin.razorpayGatewayStatus")}</h3>
                  <div className="alert alert-info" style={{ marginBottom: 'var(--space-4)' }}>
                    <strong>{t("mainAdmin.gatewayActiveLiveTestMode")}</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xs)' }}>{t("mainAdmin.webhooksSignatureverificationfunctional")}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                      <span>{t("mainAdmin.successRate")}</span>
                      <strong style={{ color: 'var(--color-success-500)' }}>{t("mainAdmin.994")}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                      <span>{t("mainAdmin.avgSettlementTime")}</span>
                      <strong>{t("mainAdmin.t1Days")}</strong>
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)', padding: '10px', fontSize: '14px' }}>
                  Manage Gateway Settings
                </button>
              </MagicCard>
            </div>

            <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
              <MagicCard className="chart-card" style={{ minHeight: '360px' }}>
                <h3>{t('mainAdmin.monthlyCollectionTrend', 'Monthly Collections & Outstanding Dues (₹)')}</h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenueTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="financialCollections" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34c77b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#34c77b" stopOpacity={0.04} />
                        </linearGradient>
                        <linearGradient id="financialPending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f5ae45" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#f5ae45" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`} />
                      <Tooltip formatter={(value, name) => [`₹${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, name]} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                      <Legend verticalAlign="bottom" height={28} />
                      <Area type="monotone" dataKey="collected" name="Collected" stroke="#34c77b" strokeWidth={3} fill="url(#financialCollections)" animationDuration={900} />
                      <Area type="monotone" dataKey="pending" name="Outstanding" stroke="#f5ae45" strokeWidth={3} fill="url(#financialPending)" animationDuration={900} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              <MagicCard className="chart-card" style={{ minHeight: '360px' }}>
                <h3>{t('mainAdmin.revenueByCommunity', 'Collected Revenue by Community (₹)')}</h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data.communityRevenue} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                      <defs>
                        {['#6c8eef','#5bbcaa','#f5ae45','#e86356','#a78bfa'].map((color, i) => (
                          <linearGradient key={i} id={`commRevHGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.65} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--chart-grid)" />
                      <XAxis type="number" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k`} />
                      <YAxis type="category" dataKey="community" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} width={95} tickFormatter={(v) => v ? v.split(' ')[0] : ''} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'Collected Revenue']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} cursor={{ fill: 'var(--bg-card-hover)' }} />
                      <Bar dataKey="revenue" name="Collected revenue" radius={[0, 6, 6, 0]} barSize={22} animationDuration={900}>
                        {(data.communityRevenue || []).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#commRevHGrad${index % 5})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>

            {}
            <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
              <MagicCard className="chart-card" style={{ minHeight: '360px' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c8eef, #e86356)' }}></span>
                  Revenue Flow: Billed → Collected → Outstanding
                </h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { stage: 'Total Billed', amount: data.totalRevenue + data.outstandingDues, color: '#6c8eef' },
                        { stage: 'Collected (₹)', amount: data.totalRevenue, color: '#34c77b' },
                        { stage: 'Outstanding (₹)', amount: data.outstandingDues, color: '#e86356' },
                        { stage: 'Net Transactions', amount: data.processedTransactions * 420, color: '#f5ae45' },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                    >
                      <defs>
                        {['#6c8eef','#34c77b','#e86356','#f5ae45'].map((color, i) => (
                          <linearGradient key={i} id={`flowGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="stage" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`₹${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Amount']} />
                      <Bar dataKey="amount" name="Amount (₹)" radius={[8,8,0,0]} barSize={52} animationDuration={1200} animationEasing="ease-out">
                        {['#6c8eef','#34c77b','#e86356','#f5ae45'].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#flowGrad${index})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {}
              <MagicCard className="chart-card" style={{ minHeight: '360px' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #5bbcaa, #a78bfa)' }}></span>
                  Monthly Collection Rate % by Community
                </h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Apr', greenValley: 82, blueRidge: 74, sunriseApts: 91, palmCrest: 68 },
                        { month: 'May', greenValley: 85, blueRidge: 79, sunriseApts: 88, palmCrest: 72 },
                        { month: 'Jun', greenValley: 78, blueRidge: 82, sunriseApts: 93, palmCrest: 75 },
                        { month: 'Jul', greenValley: 90, blueRidge: 85, sunriseApts: 87, palmCrest: 80 },
                        { month: 'Aug', greenValley: 94, blueRidge: 88, sunriseApts: 96, palmCrest: 83 },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} tickFormatter={v => `${v}%`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${v}%`, '']} />
                      <Legend verticalAlign="bottom" height={36} />
                      <Line type="monotone" dataKey="greenValley" name="Green Valley" stroke="#34c77b" strokeWidth={3} dot={{ r: 5, fill: '#34c77b', stroke: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 7 }} animationDuration={1200} animationEasing="ease-out" />
                      <Line type="monotone" dataKey="blueRidge" name="Blue Ridge" stroke="#6c8eef" strokeWidth={3} dot={{ r: 5, fill: '#6c8eef', stroke: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 7 }} animationDuration={1300} animationEasing="ease-out" />
                      <Line type="monotone" dataKey="sunriseApts" name="Sunrise Apts" stroke="#f5ae45" strokeWidth={3} dot={{ r: 5, fill: '#f5ae45', stroke: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 7 }} animationDuration={1400} animationEasing="ease-out" />
                      <Line type="monotone" dataKey="palmCrest" name="Palm Crest" stroke="#a78bfa" strokeWidth={3} dot={{ r: 5, fill: '#a78bfa', stroke: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 7 }} animationDuration={1500} animationEasing="ease-out" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>

            {/* Visual 3: Easy Donut - Collected vs Outstanding Dues */}
            <MagicCard className="chart-card" style={{ minHeight: '340px', marginTop: 'var(--space-6)' }}>
              <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #34c77b, #e86356)' }}></span>
                Platform Dues Settlement (Collected vs Outstanding)
              </h3>
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Collected Revenue', value: data.totalRevenue || 420000, color: '#34c77b' },
                        { name: 'Outstanding Dues', value: data.outstandingDues || 65000, color: '#e86356' },
                      ]}
                      cx="50%" cy="45%" innerRadius={60} outerRadius={95}
                      paddingAngle={5} dataKey="value"
                      animationDuration={1200} animationEasing="ease-out"
                    >
                      <Cell fill="#34c77b" stroke="var(--bg-card)" strokeWidth={3} />
                      <Cell fill="#e86356" stroke="var(--bg-card)" strokeWidth={3} />
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`₹${Number(v).toLocaleString()}`, '']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default MainAdminFinancialsPage;

