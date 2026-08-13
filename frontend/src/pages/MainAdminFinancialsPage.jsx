import { useTranslation } from '../components/LanguageSelector/useTranslation';import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{t("mainAdmin.razorpayGatewayStatus")}</h3>
                <div className="alert alert-info" style={{ marginBottom: 'var(--space-3)' }}>
                  <strong>{t("mainAdmin.gatewayActiveLiveTestMode")}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xs)' }}>{t("mainAdmin.webhooksSignatureverificationfunctional")}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t("mainAdmin.successRate")}</span>
                    <strong style={{ color: 'var(--color-success-500)' }}>{t("mainAdmin.994")}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t("mainAdmin.avgSettlementTime")}</span>
                    <strong>{t("mainAdmin.t1Days")}</strong>
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