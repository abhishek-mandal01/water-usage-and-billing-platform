import { useState } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { AlertTriangle, Droplet, Clock, Wrench, CheckCircle } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend, AreaChart, Area } from 'recharts';
import { useTranslation } from '../components/LanguageSelector/useTranslation';

function WaterLeakagePage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const plumbers = [
    { name: 'Abdul Rahman', phone: '+91 634 567 8900', rating: '4.8/5' },
    { name: 'Raj Kumar', phone: '+91 98765 43210', rating: '4.9/5' },
    { name: 'Aarush Pradhan', phone: '+91 87654 32109', rating: '4.5/5' },
    { name: 'Amit Singh', phone: '+91 99887 76655', rating: '4.7/5' }
  ];

  // Hard-coded dummy data for the module
  const leakData = [
    { id: 'LK-1001', location: 'Block A, Floor 3 Corridor', type: 'Pipe Burst', severity: 'High', status: 'Pending', reported: '2026-08-09' },
    { id: 'LK-1002', location: 'Apartment B-402 (Main Valve)', type: 'Slow Leak', severity: 'Low', status: 'In Progress', reported: '2026-08-08' },
    { id: 'LK-1003', location: 'Basement Parking', type: 'Seepage', severity: 'Medium', status: 'Pending', reported: '2026-08-08' },
    { id: 'LK-1004', location: 'Block C Rooftop Tank', type: 'Overflow', severity: 'High', status: 'Resolved', reported: '2026-08-07' },
    { id: 'LK-1005', location: 'Apartment A-105 (Bathroom)', type: 'Fixture Leak', severity: 'Low', status: 'Resolved', reported: '2026-08-05' },
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'var(--color-danger-500)';
      case 'Medium': return 'var(--color-warning-500)';
      case 'Low': return 'var(--color-success-500)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': 
        return <span style={{ backgroundColor: 'var(--color-danger-50)', color: 'var(--color-danger-600)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{status}</span>;
      case 'In Progress':
        return <span style={{ backgroundColor: 'var(--color-warning-50)', color: 'var(--color-warning-600)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{status}</span>;
      case 'Resolved':
        return <span style={{ backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-600)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const filteredLeaks = leakData.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (l.location || '').toLowerCase().includes(q) || (l.id || '').toLowerCase().includes(q) || (l.type || '').toLowerCase().includes(q);
  });

  const sortedLeaks = [...filteredLeaks].sort((a, b) => {
    if (sortOption === 'newest') return new Date(b.reported) - new Date(a.reported);
    if (sortOption === 'oldest') return new Date(a.reported) - new Date(b.reported);
    if (sortOption === 'severity') {
      const sevMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return (sevMap[b.severity] || 0) - (sevMap[a.severity] || 0);
    }
    if (sortOption === 'status') {
      const statMap = { 'Pending': 3, 'In Progress': 2, 'Resolved': 1 };
      return (statMap[b.status] || 0) - (statMap[a.status] || 0);
    }
    return 0;
  });

  return (
    <div className="dashboard-layout">
      <CommunityAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <div className="page-header">
            <h1>{t('nav.waterLeakage', 'Water Leakage & Wastage')}</h1>
          </div>
          
          <MagicCardGrid>
            {/* Top Metrics */}
            <div className="grid-4">
              <MagicCard className="stat-card">
                <h3>Active Leaks</h3>
                <div className="stat-value" style={{ color: 'var(--color-danger-500)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={28} /> 3
                </div>
                <div className="stat-sub">Requires attention</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>Estimated Wastage</h3>
                <div className="stat-value" style={{ color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplet size={28} /> 1,450 L
                </div>
                <div className="stat-sub">In the last 7 days</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>Repairs in Progress</h3>
                <div className="stat-value" style={{ color: 'var(--color-warning-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={28} /> 1
                </div>
                <div className="stat-sub">Plumbing team dispatched</div>
              </MagicCard>
              
              <MagicCard className="stat-card">
                <h3>Avg. Resolution Time</h3>
                <div className="stat-value" style={{ color: 'var(--color-success-500)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={28} /> 2.4 Days
                </div>
                <div className="stat-sub">Historical average</div>
              </MagicCard>
            </div>
            
            {/* Leakage Table */}
            <MagicCard style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Recent Leak Reports</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="severity">Highest Severity</option>
                    <option value="status">Unresolved First</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search by ID, Location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', width: '200px' }}
                  />
                </div>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary-50)',  borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: 'var(--space-3)' }}>ID</th>
                      <th style={{ padding: 'var(--space-3)' }}>Location</th>
                      <th style={{ padding: 'var(--space-3)' }}>Type</th>
                      <th style={{ padding: 'var(--space-3)' }}>Severity</th>
                      <th style={{ padding: 'var(--space-3)' }}>Reported On</th>
                      <th style={{ padding: 'var(--space-3)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeaks.map((leak) => (
                      <tr 
                        key={leak.id} 
                        style={{ borderBottom: '1px solid var(--border-default)', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: 'var(--space-3)', fontWeight: 'var(--font-semibold)' }}>{leak.id}</td>
                        <td style={{ padding: 'var(--space-3)' }}>{leak.location}</td>
                        <td style={{ padding: 'var(--space-3)' }}>{leak.type}</td>
                        <td style={{ padding: 'var(--space-3)', color: getSeverityColor(leak.severity), fontWeight: 'bold' }}>{leak.severity}</td>
                        <td style={{ padding: 'var(--space-3)' }}>{leak.reported}</td>
                        <td style={{ padding: 'var(--space-3)' }}>{getStatusBadge(leak.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </MagicCard>

            {}
            <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
              {/* BarChart: Leak Severity Distribution */}
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #e86356, #f5ae45)' }}></span>
                  Leak Severity Distribution
                </h3>
                <div style={{ height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { severity: 'High', count: leakData.filter(l => l.severity === 'High').length, fill: '#e86356' },
                        { severity: 'Medium', count: leakData.filter(l => l.severity === 'Medium').length, fill: '#f5ae45' },
                        { severity: 'Low', count: leakData.filter(l => l.severity === 'Low').length, fill: '#34c77b' },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e86356" /><stop offset="100%" stopColor="#f472b6" /></linearGradient>
                        <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5ae45" /><stop offset="100%" stopColor="#fb923c" /></linearGradient>
                        <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34c77b" /><stop offset="100%" stopColor="#5bbcaa" /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="severity" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} label={{ value: 'No. of Leaks', angle: -90, position: 'insideLeft', fill: 'var(--text-tertiary)', fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name, props) => [`${v} leak${v !== 1 ? 's' : ''}`, `${props.payload.severity} Severity`]} />
                      <Bar dataKey="count" name="Leaks" radius={[10,10,0,0]} barSize={60} animationDuration={1200} animationEasing="ease-out">
                        <Cell fill="url(#highGrad)" />
                        <Cell fill="url(#medGrad)" />
                        <Cell fill="url(#lowGrad)" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {/* PieChart Donut: Leak Status Overview */}
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c8eef, #a78bfa)' }}></span>
                  Leak Status Overview
                </h3>
                <div style={{ height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Pending', value: leakData.filter(l => l.status === 'Pending').length },
                          { name: 'In Progress', value: leakData.filter(l => l.status === 'In Progress').length },
                          { name: 'Resolved', value: leakData.filter(l => l.status === 'Resolved').length },
                        ]}
                        cx="50%" cy="42%" innerRadius={60} outerRadius={95}
                        paddingAngle={5} dataKey="value"
                        animationDuration={1200} animationEasing="ease-out"
                      >
                        <Cell fill="#e86356" stroke="var(--bg-card)" strokeWidth={3} />
                        <Cell fill="#f5ae45" stroke="var(--bg-card)" strokeWidth={3} />
                        <Cell fill="#34c77b" stroke="var(--bg-card)" strokeWidth={3} />
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name) => [`${v} report${v !== 1 ? 's' : ''}`, name]} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>

            {}
            <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
              {/* AreaChart: Daily Water Wastage */}
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #f472b6, #e86356)' }}></span>
                  Estimated Daily Water Wastage (L)
                </h3>
                <div style={{ height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { day: 'Aug 05', wastage: 120 },
                        { day: 'Aug 06', wastage: 95 },
                        { day: 'Aug 07', wastage: 210 },
                        { day: 'Aug 08', wastage: 340 },
                        { day: 'Aug 09', wastage: 420 },
                        { day: 'Aug 10', wastage: 380 },
                        { day: 'Today', wastage: 280 },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="wastageGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e86356" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#f472b6" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}L`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${v} L`, 'Estimated Wastage']} />
                      <Area type="monotone" dataKey="wastage" name="Daily Wastage (L)" stroke="#e86356" strokeWidth={3} fill="url(#wastageGrad)" dot={{ r: 5, fill: '#e86356', stroke: 'var(--bg-card)', strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {/* BarChart: Leak Type Breakdown */}
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #5bbcaa, #6c8eef)' }}></span>
                  Reports by Leak Type
                </h3>
                <div style={{ height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { type: 'Pipe Burst', count: leakData.filter(l => l.type === 'Pipe Burst').length + 1, color: '#e86356' },
                        { type: 'Slow Leak', count: leakData.filter(l => l.type === 'Slow Leak').length + 2, color: '#f5ae45' },
                        { type: 'Seepage', count: leakData.filter(l => l.type === 'Seepage').length + 1, color: '#5bbcaa' },
                        { type: 'Overflow', count: leakData.filter(l => l.type === 'Overflow').length + 2, color: '#6c8eef' },
                        { type: 'Fixture Leak', count: leakData.filter(l => l.type === 'Fixture Leak').length + 1, color: '#a78bfa' },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <defs>
                        {['#e86356', '#f5ae45', '#5bbcaa', '#6c8eef', '#a78bfa'].map((color, i) => (
                          <linearGradient key={i} id={`leakBarGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.65} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis dataKey="type" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${v} reports`, 'Count']} />
                      <Bar dataKey="count" name="Reports" radius={[6, 6, 0, 0]} barSize={34} animationDuration={1200} animationEasing="ease-out">
                        {['#e86356', '#f5ae45', '#5bbcaa', '#6c8eef', '#a78bfa'].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#leakBarGrad${index})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>

            {/* Recommendations */}
            <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
              <MagicCard style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05))' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--color-danger-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} /> High Priority Action
                </h3>
                <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  The <strong>Block A, Floor 3 Corridor</strong> pipe burst is causing significant water wastage and potential structural damage. Please dispatch the maintenance team immediately.
                </p>
                <button className="btn btn-outline" onClick={() => setIsModalOpen(true)} style={{ marginTop: 'var(--space-4)' }}>Contact Plumber</button>
              </MagicCard>

              <MagicCard style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} /> System Status
                </h3>
                <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  All smart meters are currently online and reporting normally. No anomalous usage spikes detected in the last 24 hours aside from the reported leak locations.
                </p>
              </MagicCard>
            </div>
            
          </MagicCardGrid>
        </main>
      </div>

      {/* Plumber Modal */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: 'var(--shadow-xl)' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid var(--border-default)', paddingBottom: '10px', color: 'var(--text-primary)' }}>Emergency Plumbers</h2>
            
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {plumbers.map((p, i) => (
                <div key={i} style={{ padding: '15px', border: '1px solid var(--border-default)', borderRadius: '8px', backgroundColor: 'var(--bg-card-hover)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '4px' }}>{p.name}</div>
                  <div style={{ color: 'var(--color-primary-600)', fontSize: '14px', marginBottom: '4px', fontWeight: 'bold' }}>{p.phone}</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Rating: {p.rating}</div>
                </div>
              ))}
            </div>
            
            <button 
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
              style={{ width: '100%', marginTop: '20px' }}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default WaterLeakagePage;
