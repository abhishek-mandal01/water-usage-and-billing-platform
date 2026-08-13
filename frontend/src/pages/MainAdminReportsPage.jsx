import { useState, useEffect } from 'react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Download, FileText, Calendar, Building, DollarSign, Activity } from 'lucide-react';

function MainAdminReportsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState('2026-08');

  const [data, setData] = useState({ reports: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8081/api/analytics/reports/main-admin')
      .then(res => res.json())
      .then(json => {
        if (json) {
          setData(json);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Community Name,Usage (L),Cost (INR),Households,Status\n";
    const reportsListForCsv = data?.reports || [];
    reportsListForCsv.forEach(c => {
      csvContent += `${c.community},${c.waterUsage},${c.totalBilled},${c.totalHouseholds},${c.status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `main_admin_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.open('http://localhost:8081/api/analytics/reports/main-admin/download', '_blank');
  };

  const reportsList = data?.reports || [];
  const totalUsage = reportsList.reduce((sum, r) => sum + (r.waterUsage || 0), 0);
  const totalCost = reportsList.reduce((sum, r) => sum + (r.totalBilled || 0), 0);

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <h1>System Reports & Analytics</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Monthly water usage analytics across all community admins.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', backgroundColor: 'var(--bg-card)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                <Calendar size={18} color="var(--text-secondary)" />
                <input 
                  type="month" 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontWeight: 'var(--font-medium)' }}
                />
              </div>
              <button className="btn btn-outline" onClick={handleExportCSV}>
                <FileText size={16} /> CSV
              </button>
              <button className="btn btn-primary" onClick={handleExportPDF}>
                <Download size={16} /> PDF
              </button>
            </div>
          </div>

          <div style={{ padding: '2px', backgroundColor: 'transparent', color: '#000' }}>
            <MagicCardGrid>
              <div className="grid-3">
                <MagicCard className="stat-card">
                  <h3>Total System Usage</h3>
                  <div className="stat-value" style={{ color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={28} /> {loading ? '...' : totalUsage.toLocaleString(undefined, { maximumFractionDigits: 1 })} L
                  </div>
                  <div className="stat-sub">Across all registered communities</div>
                </MagicCard>
                
                <MagicCard className="stat-card">
                  <h3>Total System Revenue</h3>
                  <div className="stat-value" style={{ color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={28} /> ₹{loading ? '...' : totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div className="stat-sub">Expected revenue this month</div>
                </MagicCard>
                
                <MagicCard className="stat-card">
                  <h3>Active Communities</h3>
                  <div className="stat-value" style={{ color: 'var(--color-accent-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={28} /> {loading ? '...' : reportsList.length}
                  </div>
                  <div className="stat-sub">Currently monitored</div>
                </MagicCard>
              </div>

              <MagicCard style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-xl)' }}>Community Breakdown: {dateRange}</h3>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: 'var(--space-3)' }}>Community Name</th>
                        <th style={{ padding: 'var(--space-3)' }}>Households</th>
                        <th style={{ padding: 'var(--space-3)' }}>Monthly Usage (L)</th>
                        <th style={{ padding: 'var(--space-3)' }}>Cost Billed (INR)</th>
                        <th style={{ padding: 'var(--space-3)' }}>Collection %</th>
                        <th style={{ padding: 'var(--space-3)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsList.map((c, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-default)' }}>
                          <td style={{ padding: 'var(--space-3)', fontWeight: 'var(--font-semibold)' }}>{c.community || 'N/A'}</td>
                          <td style={{ padding: 'var(--space-3)' }}>{c.totalHouseholds || 0}</td>
                          <td style={{ padding: 'var(--space-3)' }}>{(c.waterUsage || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                          <td style={{ padding: 'var(--space-3)' }}>₹{(c.totalBilled || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          <td style={{ padding: 'var(--space-3)' }}>{(c.paymentCollection || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}%</td>
                          <td style={{ padding: 'var(--space-3)' }}>
                            <span style={{ color: c.status === 'Excellent' ? 'var(--color-success-600)' : (c.status === 'Good' ? 'var(--color-warning-600)' : 'var(--color-danger-600)'), fontWeight: 'bold' }}>
                              {c.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {reportsList.length === 0 && !loading && (
                        <tr>
                          <td colSpan={6} style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No community reports available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </MagicCard>
            </MagicCardGrid>

          </div>
        </main>
      </div>
    </div>
  );
}

export default MainAdminReportsPage;