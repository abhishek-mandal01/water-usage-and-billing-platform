import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { 
  Download, 
  FileText, 
  Calendar, 
  Droplet, 
  CreditCard, 
  ArrowDown, 
  ArrowUp, 
  Trophy, 
  Award, 
  Quote, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  TrendingUp 
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

function ResidentReportsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState('2026-08');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user')) || { id: 1 };

  const [reportData, setReportData] = useState({
    monthlyUsage: 14500,
    moneySpent: 850,
    previousMonthUsage: 16000,
    previousMonthSpent: 920,
    dailyUsageTrend: [
      { day: 'Week 1', usage: 3500 },
      { day: 'Week 2', usage: 3200 },
      { day: 'Week 3', usage: 4100 },
      { day: 'Week 4', usage: 3700 }
    ],
    rank: 3,
    totalHouseholds: 24,
    communityName: 'Green Valley Apartments',
    householdNumber: 'A-302',
    rankQuote: '🌟 Exemplary Efficiency! Ranked #3 out of 24 households. Your conscientious water habits greatly benefit our entire community!',
    rankBadge: 'Top 15% Water Saver',
    tierCategory: 'LOW_USAGE'
  });

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`http://localhost:8081/api/reports/resident/${user.id}?dateRange=${dateRange}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch resident report');
      })
      .then(data => {
        if (data) {
          setReportData(prev => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(err => {
        console.warn('Backend report fetch failed, using localized report state:', err);
      })
      .finally(() => setLoading(false));
  }, [user?.id, dateRange]);

  const usageDiff = reportData.monthlyUsage - reportData.previousMonthUsage;
  const usageDiffPercent = Math.abs(usageDiff / (reportData.previousMonthUsage || 1) * 100).toFixed(1);

  const costDiff = reportData.moneySpent - reportData.previousMonthSpent;
  const costDiffPercent = Math.abs(costDiff / (reportData.previousMonthSpent || 1) * 100).toFixed(1);

  // Determine rank tier styling
  const rankPercentile = Math.round((reportData.rank / (reportData.totalHouseholds || 1)) * 100);

  const getRankTheme = () => {
    if (reportData.rank === 1) {
      return {
        bgGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(16, 185, 129, 0.12))',
        borderColor: 'rgba(234, 179, 8, 0.4)',
        badgeBg: '#fef3c7',
        badgeColor: '#92400e',
        icon: <Trophy size={32} color="#d97706" />,
        quoteBg: 'rgba(254, 243, 199, 0.7)',
        quoteBorder: '#fde047',
        quoteTextColor: '#78350f'
      };
    } else if (reportData.tierCategory === 'LOW_USAGE' || rankPercentile <= 35) {
      return {
        bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        badgeBg: 'var(--color-success-50, #ecfdf5)',
        badgeColor: 'var(--color-success-700, #047857)',
        icon: <Award size={32} color="#059669" />,
        quoteBg: 'rgba(209, 250, 229, 0.7)',
        quoteBorder: '#6ee7b7',
        quoteTextColor: '#065f46'
      };
    } else if (reportData.tierCategory === 'AVERAGE_USAGE' || rankPercentile <= 65) {
      return {
        bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(14, 165, 233, 0.08))',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        badgeBg: '#dbeafe',
        badgeColor: '#1e40af',
        icon: <Droplet size={32} color="#2563eb" />,
        quoteBg: 'rgba(219, 234, 254, 0.7)',
        quoteBorder: '#93c5fd',
        quoteTextColor: '#1e3a8a'
      };
    } else {
      return {
        bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.08))',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        badgeBg: '#fef3c7',
        badgeColor: '#9a3412',
        icon: <TrendingUp size={32} color="#d97706" />,
        quoteBg: 'rgba(254, 243, 199, 0.7)',
        quoteBorder: '#fcd34d',
        quoteTextColor: '#7c2d12'
      };
    }
  };

  const theme = getRankTheme();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Community Name,${reportData.communityName || 'N/A'}\n`;
    csvContent += `Household Number,${reportData.householdNumber || 'N/A'}\n`;
    csvContent += `Community Usage Rank,#${reportData.rank} out of ${reportData.totalHouseholds} households\n`;
    csvContent += `Rank Category,${reportData.rankBadge || 'N/A'}\n`;
    csvContent += `Rank Quote,"${reportData.rankQuote || ''}"\n\n`;

    csvContent += `Metric,Value\n`;
    csvContent += `Total Usage (L),${reportData.monthlyUsage}\n`;
    csvContent += `Previous Month Usage (L),${reportData.previousMonthUsage}\n`;
    csvContent += `Total Cost (INR),${reportData.moneySpent}\n`;
    csvContent += `Previous Month Cost (INR),${reportData.previousMonthSpent}\n\n`;
    
    csvContent += "Weekly Usage Breakdown\n";
    csvContent += "Week,Usage (L)\n";
    reportData.dailyUsageTrend.forEach(w => {
      csvContent += `${w.day},${w.usage}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `resident_report_${dateRange}.csv`);
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
        filename: `resident_report_${dateRange}.pdf`,
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
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <h1>My Usage Reports</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Detailed analytics of your household's water consumption, community rank, and costs.
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
                <h2 style={{ marginTop: '20px', color: '#111827', fontSize: '20px' }}>Resident Usage & Community Rank Report: {dateRange}</h2>
              </div>
            )}

            <MagicCardGrid>
              {/* Community Rank & Motivational Quote Hero Card */}
              <MagicCard style={{ 
                background: theme.bgGradient, 
                border: `1px solid ${theme.borderColor}`,
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-lg, 16px)',
                marginBottom: 'var(--space-6)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{
                      padding: '14px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {theme.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          fontSize: 'var(--text-xs, 12px)', 
                          fontWeight: 'bold', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em', 
                          color: 'var(--text-secondary)' 
                        }}>
                          Community Water Usage Rank
                        </span>
                        <span style={{ 
                          backgroundColor: theme.badgeBg, 
                          color: theme.badgeColor, 
                          padding: '2px 10px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: 'bold' 
                        }}>
                          {reportData.rankBadge}
                        </span>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0' }}>
                        Rank #{reportData.rank} <span style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-secondary)' }}>out of {reportData.totalHouseholds} Residents</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <Building2 size={15} /> {reportData.communityName} | Flat {reportData.householdNumber}
                      </div>
                    </div>
                  </div>

                  {/* Rank Percentile Visual Indicator */}
                  <div style={{ minWidth: '200px', maxWidth: '300px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <span>Lowest Usage (#1)</span>
                      <span>Highest (# {reportData.totalHouseholds})</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.max(10, 100 - rankPercentile)}%`, 
                        background: 'linear-gradient(90deg, #10b981, #3b82f6)', 
                        borderRadius: '4px',
                        transition: 'width 0.5s ease-in-out'
                      }} />
                    </div>
                    <div style={{ fontSize: '11px', textAlign: 'right', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                      Top {rankPercentile}% in Community Saver Standing
                    </div>
                  </div>
                </div>

                {/* Rank Quote Banner Box */}
                <div style={{
                  marginTop: 'var(--space-5)',
                  padding: 'var(--space-4) var(--space-5)',
                  backgroundColor: theme.quoteBg,
                  borderLeft: `4px solid ${theme.quoteBorder}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <Quote size={24} style={{ color: theme.quoteTextColor, flexShrink: 0, marginTop: '2px', opacity: 0.9 }} />
                  <div style={{ fontSize: '15px', fontStyle: 'italic', fontWeight: '500', color: theme.quoteTextColor, lineHeight: '1.5' }}>
                    "{reportData.rankQuote}"
                  </div>
                </div>
              </MagicCard>

              {/* Top Metrics */}
              <div className="grid-2">
                <MagicCard className="stat-card" style={{ background: 'linear-gradient(145deg, var(--color-primary-50), var(--bg-card))' }}>
                  <h3>Total Monthly Usage</h3>
                  <div className="stat-value" style={{ color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '36px' }}>
                    <Droplet size={36} /> {reportData.monthlyUsage.toLocaleString()} L
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    {usageDiff <= 0 ? (
                      <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-success-600)', fontWeight: 'bold', backgroundColor: 'var(--color-success-50)', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                        <ArrowDown size={16} /> {usageDiffPercent}%
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-danger-600)', fontWeight: 'bold', backgroundColor: 'var(--color-danger-50)', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                        <ArrowUp size={16} /> {usageDiffPercent}%
                      </span>
                    )}
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>vs Last Month ({reportData.previousMonthUsage.toLocaleString()} L)</span>
                  </div>
                </MagicCard>
                
                <MagicCard className="stat-card" style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.08), var(--bg-card))' }}>
                  <h3>Total Cost Incurred</h3>
                  <div className="stat-value" style={{ color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '36px' }}>
                    <CreditCard size={36} /> ₹{reportData.moneySpent.toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    {costDiff <= 0 ? (
                      <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-success-600)', fontWeight: 'bold', backgroundColor: 'var(--color-success-50)', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                        <ArrowDown size={16} /> {costDiffPercent}%
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-danger-600)', fontWeight: 'bold', backgroundColor: 'var(--color-danger-50)', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                        <ArrowUp size={16} /> {costDiffPercent}%
                      </span>
                    )}
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>vs Last Month (₹{reportData.previousMonthSpent.toLocaleString()})</span>
                  </div>
                </MagicCard>
              </div>

              {/* Chart */}
              <MagicCard style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-xl)' }}>Weekly Consumption Breakdown</h3>
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.dailyUsageTrend} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                      <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={12} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                      <Bar dataKey="usage" name="Water Used (Liters)" fill="var(--color-primary-500)" radius={[6, 6, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {/* Visual 1: 3-Month Usage Progression Area Chart */}
              <MagicCard style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #5bbcaa, #34c77b)' }}></span>
                  3-Month Usage Trend (Liters)
                </h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: 'Jun', usage: 18200 },
                        { month: 'Jul', usage: reportData.previousMonthUsage || 16000 },
                        { month: 'Aug', usage: reportData.monthlyUsage || 14500 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="resRepAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5bbcaa" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#5bbcaa" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                      <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}kL`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${Number(v).toLocaleString()} Liters`, 'Water Used']} />
                      <Area type="monotone" dataKey="usage" name="Water Usage (L)" stroke="#5bbcaa" strokeWidth={3} fill="url(#resRepAreaGrad)" dot={{ r: 6, fill: '#5bbcaa', stroke: 'var(--bg-card)', strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {/* Visual 2 & 3: Donut breakdown & Side-by-Side Comparison */}
              <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
                <MagicCard style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c8eef, #a78bfa)' }}></span>
                    Usage Category Breakdown
                  </h3>
                  <div style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Bathing & Hygiene', value: Math.round(reportData.monthlyUsage * 0.35) || 5075 },
                            { name: 'Cooking & Drinking', value: Math.round(reportData.monthlyUsage * 0.20) || 2900 },
                            { name: 'Cleaning & Laundry', value: Math.round(reportData.monthlyUsage * 0.28) || 4060 },
                            { name: 'Garden / Misc', value: Math.round(reportData.monthlyUsage * 0.17) || 2465 },
                          ]}
                          cx="50%" cy="45%" innerRadius={65} outerRadius={100}
                          paddingAngle={4} dataKey="value"
                          animationDuration={1200} animationEasing="ease-out"
                        >
                          {['#6c8eef','#34c77b','#f5ae45','#f472b6'].map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} stroke="var(--bg-card)" strokeWidth={3} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name) => [`${v.toLocaleString()} L`, name]} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </MagicCard>

                {/* Visual 3: Side-by-Side Bar Chart - You vs Community */}
                <MagicCard style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #fb923c, #e86356)' }}></span>
                    Your Usage vs Community Avg (Weekly)
                  </h3>
                  <div style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { week: 'Week 1', you: 3500, community: 4100 },
                          { week: 'Week 2', you: 3200, community: 4050 },
                          { week: 'Week 3', you: 4100, community: 4200 },
                          { week: 'Week 4', you: 3700, community: 4080 },
                        ]}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="youBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6c8eef" />
                            <stop offset="100%" stopColor="#a78bfa" />
                          </linearGradient>
                          <linearGradient id="commAvgBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb923c" />
                            <stop offset="100%" stopColor="#f5ae45" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                        <XAxis dataKey="week" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}L`} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name) => [`${Number(v).toLocaleString()} L`, name]} />
                        <Legend verticalAlign="bottom" height={28} />
                        <Bar dataKey="you" name="Your Usage (L)" fill="url(#youBarGrad)" radius={[6, 6, 0, 0]} barSize={22} animationDuration={1200} animationEasing="ease-out" />
                        <Bar dataKey="community" name="Community Avg (L)" fill="url(#commAvgBarGrad)" radius={[6, 6, 0, 0]} barSize={22} animationDuration={1400} animationEasing="ease-out" />
                      </BarChart>
                    </ResponsiveContainer>
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

export default ResidentReportsPage;
