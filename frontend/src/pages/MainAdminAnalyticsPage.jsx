import { useTranslation } from '../components/LanguageSelector/useTranslation';import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

import { useState, useEffect } from 'react';


function MainAdminAnalyticsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    totalPlatformUsage: 0,
    activeCommunities: 0,
    avgHouseholdUsage: 0,
    waterConserved: 0,
    consumptionTrend: [],
    communityBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8081/api/analytics/main-admin')
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

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>{t("mainAdmin.systemAnalyticsUsageIntelligence")}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>{t("mainAdmin.platformwideinsightsacrossallregistered")}

              </p>
            </div>
          </div>

          <MagicCardGrid>
            <div className="grid-4">
              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.totalPlatformUsage")}</h3>
                <div className="stat-value" style={{ color: 'var(--color-primary-600)' }}>{loading ? '...' : `${data.totalPlatformUsage.toLocaleString(undefined, { maximumFractionDigits: 1 })} kL`}</div>
                <div className="stat-sub">{t("mainAdmin.14vslastmonth")}</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.activeCommunities")}</h3>
                <div className="stat-value">{loading ? '...' : data.activeCommunities}</div>
                <div className="stat-sub">{t("mainAdmin.173TotalHouseholds")}</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.avgHouseholdUsage")}</h3>
                <div className="stat-value">{loading ? '...' : `${data.avgHouseholdUsage.toLocaleString(undefined, { maximumFractionDigits: 1 })} L`}</div>
                <div className="stat-sub">{t("mainAdmin.monthlyAverage")}</div>
              </MagicCard>

              <MagicCard className="stat-card">
                <h3>{t("mainAdmin.waterConserved")}</h3>
                <div className="stat-value" style={{ color: 'var(--color-success-500)' }}>{loading ? '...' : `${data.waterConserved.toLocaleString(undefined, { maximumFractionDigits: 1 })} kL`}</div>
                <div className="stat-sub">{t("mainAdmin.viaAlertReduction")}</div>
              </MagicCard>
            </div>

            <div className="grid-2">
              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>{t("mainAdmin.platformWaterConsumptionTrendLiters")}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.consumptionTrend} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                    <defs>
                      <linearGradient id="colorPlatform" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Area type="monotone" dataKey="totalVolume" stroke="#6c8eef" fillOpacity={1} fill="url(#colorPlatform)" />
                  </AreaChart>
                </ResponsiveContainer>
              </MagicCard>

              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>{t("mainAdmin.consumptionComparisonbyCommunityL")}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.communityBreakdown} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 15 }}>
                    <defs>
                      {['#6c8eef','#5bbcaa','#f5ae45','#e86356','#a78bfa'].map((color, i) => (
                        <linearGradient key={i} id={`commBreakHGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={color} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.65} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--chart-grid)" />
                    <XAxis type="number" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}kL`} />
                    <YAxis type="category" dataKey="community" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} width={95} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${Number(v).toLocaleString()} Liters`, 'Total Usage']} />
                    <Bar dataKey="usage" radius={[0, 6, 6, 0]} barSize={22} animationDuration={1000}>
                      {(data.communityBreakdown || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#commBreakHGrad${index % 5})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </MagicCard>
            </div>

            {/* Visual 1: Average Usage by Community Bar Chart */}
            <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
              <MagicCard className="chart-card" style={{ minHeight: '360px' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #f5ae45, #fb923c)' }}></span>
                  Average Household Water Usage (Liters)
                </h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { community: 'Green Valley', usage: 14200, color: '#6c8eef' },
                        { community: 'Blue Ridge', usage: 11800, color: '#5bbcaa' },
                        { community: 'Sunrise Apts', usage: 18500, color: '#f5ae45' },
                        { community: 'Palm Crest', usage: 9400, color: '#34c77b' },
                        { community: 'River View', usage: 12900, color: '#a78bfa' },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <defs>
                        {['#6c8eef','#5bbcaa','#f5ae45','#34c77b','#a78bfa'].map((color, i) => (
                          <linearGradient key={i} id={`commAvgUsageGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.65} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="community" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}kL`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${Number(v).toLocaleString()} Liters`, 'Avg Household Usage']} />
                      <Bar dataKey="usage" name="Avg Usage (L)" radius={[8, 8, 0, 0]} barSize={38} animationDuration={1200} animationEasing="ease-out">
                        {['#6c8eef','#5bbcaa','#f5ae45','#34c77b','#a78bfa'].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#commAvgUsageGrad${index})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {/* Visual 2: Water Conserved Trend Area Chart */}
              <MagicCard className="chart-card" style={{ minHeight: '360px' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #34c77b, #6c8eef)' }}></span>
                  Total Water Conserved Across Platform (kL)
                </h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: 'Mar', conserved: 142 },
                        { month: 'Apr', conserved: 178 },
                        { month: 'May', conserved: 195 },
                        { month: 'Jun', conserved: 220 },
                        { month: 'Jul', conserved: 240 },
                        { month: 'Aug', conserved: data.waterConserved || 258 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="analyticsSavedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34c77b" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#34c77b" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}kL`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${v} kL (${v * 1000} L)`, 'Conserved']} />
                      <Area type="monotone" dataKey="conserved" name="Conserved (kL)" stroke="#34c77b" strokeWidth={3} fill="url(#analyticsSavedGrad)" dot={{ r: 5, fill: '#34c77b', stroke: 'var(--bg-card)', strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>

            {/* Visual 3: Water Usage by Sector Donut Pie Chart */}
            <MagicCard className="chart-card" style={{ minHeight: '340px', marginTop: 'var(--space-6)' }}>
              <h3 style={{ margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #a78bfa, #f472b6)' }}></span>
                Platform Water Distribution by Sector
              </h3>
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Residential Flats', value: 60, color: '#6c8eef' },
                        { name: 'Clubhouse & Amenities', value: 18, color: '#5bbcaa' },
                        { name: 'Gardens & Landscaping', value: 14, color: '#34c77b' },
                        { name: 'Commercial & Maintenance', value: 8, color: '#f5ae45' },
                      ]}
                      cx="50%" cy="45%" innerRadius={60} outerRadius={95}
                      paddingAngle={5} dataKey="value"
                      animationDuration={1200} animationEasing="ease-out"
                    >
                      {['#6c8eef', '#5bbcaa', '#34c77b', '#f5ae45'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} stroke="var(--bg-card)" strokeWidth={3} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${v}%`, 'Sector Share']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>
          </MagicCardGrid>
        </main>
      </div>
    </div>);

}

export default MainAdminAnalyticsPage;