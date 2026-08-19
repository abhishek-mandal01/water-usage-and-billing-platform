import { useState, useEffect } from 'react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Download, FileText, Calendar, Building, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend, AreaChart, Area } from 'recharts';

function MainAdminReportsPage() {
  useTranslation();
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
                  <tr style={{ backgroundColor: 'var(--color-primary-50)',  borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
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

              {}
              <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
                {/* BarChart: Top Communities by Water Usage */}
                <MagicCard style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c8eef, #a78bfa)' }}></span>
                    Community Water Usage Ranking (L)
                  </h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          ...reportsList
                            .slice(0, 6)
                            .map((c, i) => ({ community: c.community || `Comm ${i+1}`, usage: c.waterUsage || 0 }))
                            .sort((a, b) => b.usage - a.usage),
                          ...(reportsList.length === 0 ? [
                            { community: 'Green Valley', usage: 145200 },
                            { community: 'Blue Ridge', usage: 118500 },
                            { community: 'Sunrise Apts', usage: 185000 },
                            { community: 'Palm Crest', usage: 94200 },
                            { community: 'River View', usage: 129100 },
                          ] : [])
                        ]}
                        margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
                        layout="vertical"
                      >
                        <defs>
                          {['#6c8eef','#5bbcaa','#f5ae45','#e86356','#34c77b','#a78bfa'].map((color, i) => (
                            <linearGradient key={i} id={`usageGradR${i}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={color} stopOpacity={1} />
                              <stop offset="100%" stopColor={color} stopOpacity={0.65} />
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--chart-grid)" />
                        <XAxis type="number" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}kL`} />
                        <YAxis type="category" dataKey="community" width={100} stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => v ? v.split(' ')[0] : ''} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${Number(v).toLocaleString()} L`, 'Water Usage']} />
                        <Bar dataKey="usage" name="Water Usage (L)" radius={[0,8,8,0]} barSize={28} animationDuration={1200} animationEasing="ease-out">
                          {(reportsList.length > 0 ? reportsList.slice(0,6) : [1,2,3,4,5]).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#usageGradR${index % 6})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </MagicCard>

                {/* PieChart: Collection % Distribution by tier */}
                <MagicCard style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #34c77b, #5bbcaa)' }}></span>
                    Collection Rate Tier Distribution
                  </h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: 'Excellent (≥90%)',
                              value: reportsList.filter(r => (r.paymentCollection || 0) >= 90).length || 2
                            },
                            {
                              name: 'Good (75–89%)',
                              value: reportsList.filter(r => (r.paymentCollection || 0) >= 75 && (r.paymentCollection || 0) < 90).length || 3
                            },
                            {
                              name: 'Fair (60–74%)',
                              value: reportsList.filter(r => (r.paymentCollection || 0) >= 60 && (r.paymentCollection || 0) < 75).length || 1
                            },
                            {
                              name: 'Poor (<60%)',
                              value: reportsList.filter(r => (r.paymentCollection || 0) < 60).length || 1
                            },
                          ]}
                          cx="50%" cy="42%" innerRadius={65} outerRadius={100}
                          paddingAngle={5} dataKey="value"
                          animationDuration={1200} animationEasing="ease-out"
                        >
                          <Cell fill="#34c77b" stroke="var(--bg-card)" strokeWidth={3} />
                          <Cell fill="#6c8eef" stroke="var(--bg-card)" strokeWidth={3} />
                          <Cell fill="#f5ae45" stroke="var(--bg-card)" strokeWidth={3} />
                          <Cell fill="#e86356" stroke="var(--bg-card)" strokeWidth={3} />
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name) => [`${v} community(s)`, name]} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </MagicCard>
              </div>

              {}
              <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
                {/* Visual 3: Side-by-Side Billed Revenue vs Procurement Cost */}
                <MagicCard style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #34c77b, #f5ae45)' }}></span>
                    Revenue vs Procurement Cost by Community (₹)
                  </h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { community: 'Green Valley', revenue: 145000, cost: 92000 },
                          { community: 'Blue Ridge', revenue: 118000, cost: 74000 },
                          { community: 'Sunrise Apts', revenue: 185000, cost: 120000 },
                          { community: 'Palm Crest', revenue: 94000, cost: 58000 },
                          { community: 'River View', revenue: 129000, cost: 81000 },
                        ]}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="repRevBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34c77b" />
                            <stop offset="100%" stopColor="#5bbcaa" />
                          </linearGradient>
                          <linearGradient id="repCostBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f5ae45" />
                            <stop offset="100%" stopColor="#e86356" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                        <XAxis dataKey="community" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name) => [`₹${Number(v).toLocaleString()}`, name]} />
                        <Legend verticalAlign="bottom" height={28} />
                        <Bar dataKey="revenue" name="Billed Revenue (₹)" fill="url(#repRevBarGrad)" radius={[6, 6, 0, 0]} barSize={22} animationDuration={1200} animationEasing="ease-out" />
                        <Bar dataKey="cost" name="Bulk Procurement Cost (₹)" fill="url(#repCostBarGrad)" radius={[6, 6, 0, 0]} barSize={22} animationDuration={1400} animationEasing="ease-out" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </MagicCard>

                {/* Visual 4: Inflow vs Consumed Volume Trend Area */}
                <MagicCard style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c8eef, #34c77b)' }}></span>
                    Platform Water Inflow vs Resident Consumption (kL)
                  </h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { month: 'May', inflow: 1200, consumed: 1080 },
                          { month: 'Jun', inflow: 1350, consumed: 1220 },
                          { month: 'Jul', inflow: 1280, consumed: 1160 },
                          { month: 'Aug', inflow: 1420, consumed: 1310 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="repInflowGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6c8eef" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#6c8eef" stopOpacity={0.03} />
                          </linearGradient>
                          <linearGradient id="repConsumedGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34c77b" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#34c77b" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                        <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}kL`} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name) => [`${v} kL (${v * 1000} L)`, name]} />
                        <Legend verticalAlign="bottom" height={28} />
                        <Area type="monotone" dataKey="inflow" name="Bulk Inflow (kL)" stroke="#6c8eef" strokeWidth={3} fill="url(#repInflowGrad)" dot={{ r: 5, fill: '#6c8eef', stroke: 'var(--bg-card)', strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
                        <Area type="monotone" dataKey="consumed" name="Resident Consumed (kL)" stroke="#34c77b" strokeWidth={3} fill="url(#repConsumedGrad)" dot={{ r: 5, fill: '#34c77b', stroke: 'var(--bg-card)', strokeWidth: 2 }} animationDuration={1400} animationEasing="ease-out" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </MagicCard>
              </div>

            </MagicCardGrid>

          </div>
        </main>
      </div>
    </div>
  );
}

export default MainAdminReportsPage;