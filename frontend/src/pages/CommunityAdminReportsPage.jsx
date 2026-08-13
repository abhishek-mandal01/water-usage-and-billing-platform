import { useState, useRef } from 'react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Download, FileText, Calendar, Home, DollarSign, Package, TrendingUp, TrendingDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CommunityAdminReportsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState('2026-08');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef(null);

  const reportData = {
    totalHouseholds: 45,
    bulkPurchaseCost: 150000,
    totalEarnings: 210000,
    profit: 60000,
    loss: 0,
    householdComparison: [
      { id: '101', usage: 12500, previous: 11000 },
      { id: '102', usage: 9800, previous: 10500 },
      { id: '103', usage: 15400, previous: 14000 },
      { id: '104', usage: 11200, previous: 11500 },
      { id: '105', usage: 18000, previous: 17200 }
    ],
    bulkPurchases: [
      { date: '2026-08-01', vendor: 'City Water Board', volume: 500000, cost: 75000 },
      { date: '2026-08-15', vendor: 'Private Tankers (x10)', volume: 100000, cost: 75000 }
    ]
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Financial Summary\n";
    csvContent += `Total Earnings,${reportData.totalEarnings}\n`;
    csvContent += `Bulk Purchase Cost,${reportData.bulkPurchaseCost}\n`;
    csvContent += `Total Profit,${reportData.profit}\n`;
    csvContent += `Total Loss,${reportData.loss}\n\n`;
    
    csvContent += "Household Usage Comparison\n";
    csvContent += "Household ID,Current Usage (L),Previous Month (L)\n";
    reportData.householdComparison.forEach(h => {
      csvContent += `${h.id},${h.usage},${h.previous}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `community_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      const element = reportRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `community_report_${dateRange}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, windowWidth: 1200 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save().then(() => {
        setIsGeneratingPdf(false);
      });
    }, 100);
  };

  return (
    <div className="dashboard-layout">
      <CommunityAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <h1>Reports & Analytics</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Monthly household usage, bulk purchases, and financial breakdown.
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

          <div ref={reportRef} style={{ padding: isGeneratingPdf ? '20px' : '2px', backgroundColor: isGeneratingPdf ? '#ffffff' : 'transparent', color: '#000' }}>
            
            {isGeneratingPdf && (
              <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #e5e7eb' }}>
                <h1 style={{ margin: 0, color: '#2563eb', fontSize: '24px' }}>Smart Water Platform</h1>
                <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                  www.smartwater.com | support@smartwater.com | +1 800 555 1234
                </p>
                <h2 style={{ marginTop: '20px', color: '#111827', fontSize: '20px' }}>Community Admin Report: {dateRange}</h2>
              </div>
            )}

            <MagicCardGrid>
              {/* Financial Metrics */}
              <div className="grid-4">
                <MagicCard className="stat-card">
                  <h3>Total Earnings</h3>
                  <div className="stat-value" style={{ color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={28} /> ₹{reportData.totalEarnings.toLocaleString()}
                  </div>
                  <div className="stat-sub">From resident billing</div>
                </MagicCard>
                
                <MagicCard className="stat-card">
                  <h3>Bulk Purchases</h3>
                  <div className="stat-value" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={28} /> ₹{reportData.bulkPurchaseCost.toLocaleString()}
                  </div>
                  <div className="stat-sub">Total water procurement</div>
                </MagicCard>
                
                <MagicCard className="stat-card">
                  <h3>Net Profit</h3>
                  <div className="stat-value" style={{ color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={28} /> ₹{reportData.profit.toLocaleString()}
                  </div>
                  <div className="stat-sub">Surplus this month</div>
                </MagicCard>
                
                <MagicCard className="stat-card">
                  <h3>Net Loss</h3>
                  <div className="stat-value" style={{ color: 'var(--color-danger-500)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingDown size={28} /> ₹{reportData.loss.toLocaleString()}
                  </div>
                  <div className="stat-sub">Deficit this month</div>
                </MagicCard>
              </div>

              {/* Charts & Tables */}
              <div className="grid-2">
                <MagicCard style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-xl)' }}>Household Usage Comparison</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.householdComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                        <XAxis dataKey="id" stroke="var(--text-tertiary)" fontSize={12} />
                        <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                        <Bar dataKey="usage" name="Current (L)" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="previous" name="Previous (L)" fill="var(--color-accent-400)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </MagicCard>

                <MagicCard style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-xl)' }}>Bulk Purchase Details</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: 'var(--space-3)' }}>Date</th>
                          <th style={{ padding: 'var(--space-3)' }}>Vendor</th>
                          <th style={{ padding: 'var(--space-3)' }}>Volume (L)</th>
                          <th style={{ padding: 'var(--space-3)' }}>Cost (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.bulkPurchases.map((b, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-default)' }}>
                            <td style={{ padding: 'var(--space-3)' }}>{b.date}</td>
                            <td style={{ padding: 'var(--space-3)' }}>{b.vendor}</td>
                            <td style={{ padding: 'var(--space-3)' }}>{b.volume.toLocaleString()}</td>
                            <td style={{ padding: 'var(--space-3)', fontWeight: 'bold' }}>₹{b.cost.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </MagicCard>
              </div>

            </MagicCardGrid>

            {isGeneratingPdf && (
              <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #e5e7eb', color: '#9ca3af', fontSize: '12px' }}>
                <p style={{ margin: 0 }}>Generated on {new Date().toLocaleDateString()} | Smart Water Billing & Usage Platform</p>
                <p style={{ margin: '4px 0 0 0' }}>This is an automatically generated document.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CommunityAdminReportsPage;
