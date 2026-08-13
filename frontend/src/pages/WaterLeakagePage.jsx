import { useState } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { AlertTriangle, Droplet, Clock, Wrench, CheckCircle } from 'lucide-react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';

function WaterLeakagePage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: 'var(--space-3)' }}>ID</th>
                      <th style={{ padding: 'var(--space-3)' }}>Location</th>
                      <th style={{ padding: 'var(--space-3)' }}>Type</th>
                      <th style={{ padding: 'var(--space-3)' }}>Severity</th>
                      <th style={{ padding: 'var(--space-3)' }}>Reported On</th>
                      <th style={{ padding: 'var(--space-3)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leakData.map((leak) => (
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
