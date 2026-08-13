import { useTranslation } from '../components/LanguageSelector/useTranslation';import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
                  <BarChart data={data.communityBreakdown} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="community" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Bar dataKey="usage" fill="#5bbcaa" radius={[4, 4, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </MagicCard>
            </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>);

}

export default MainAdminAnalyticsPage;