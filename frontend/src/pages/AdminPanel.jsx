import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

const mockConsumptionData = [
  { month: 'Jan', consumption: 4000 },
  { month: 'Feb', consumption: 3500 },
  { month: 'Mar', consumption: 5000 },
  { month: 'Apr', consumption: 4500 },
  { month: 'May', consumption: 6000 },
  { month: 'Jun', consumption: 5800 },
];

const mockStatusData = [
  { name: 'Paid', value: 85 },
  { name: 'Unpaid', value: 15 },
];
const COLORS = ['#10b981', '#ef4444'];

function AdminPanel() {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [adminStats, setAdminStats] = useState({ totalHouseholds: 0, totalResidents: 0, totalUsage: 0.0, currentCycle: 'N/A' });
  
  // Verification form state
  const [vForm, setVForm] = useState({ aadharCard: '', panCard: '', phoneNumber: '', address: '' });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { id: 1 };

    fetch(`http://localhost:8081/api/verification/status/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        const status = data.verificationStatus ? data.verificationStatus.trim().toUpperCase() : 'UNSUBMITTED';
        setVerificationStatus(status);
        
        if (status === 'APPROVED') {
          fetch(`http://localhost:8081/api/dashboard/admin/${user.id}`)
            .then(res => res.json())
            .then(statsData => setAdminStats(statsData))
            .catch(err => console.error(err));
        }
        
        setLoading(false);
      })
      .catch(() => {
        setVerificationStatus('UNSUBMITTED');
        setLoading(false);
      });
  }, []);

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { id: 1 };

    const payload = { ...vForm, userId: user.id };

    try {
      const response = await fetch('http://localhost:8081/api/verification/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setVerificationStatus('PENDING');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInviteGen = async () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { id: 1 };
    
    const payload = { communityAdminId: user.id };
    
    try {
      const response = await fetch('http://localhost:8081/api/invite/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const link = await response.text();
      setInviteLink(link);
      setShowInviteModal(true);
      setEmailStatus('');
      setTargetEmail('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendEmail = async () => {
    if (!targetEmail) return;
    setEmailStatus('Sending...');
    try {
      const response = await fetch('http://localhost:8081/api/invite/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, inviteLink })
      });
      if (response.ok) {
        setEmailStatus('Email sent successfully!');
        setTargetEmail('');
      } else {
        const error = await response.text();
        setEmailStatus(`Failed: ${error}`);
      }
    } catch (err) {
      console.error(err);
      setEmailStatus('Error sending email.');
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading</div>;
  }

  return (
    <div className="dashboard-layout" style={{ position: 'relative' }}>
      
      {/* Permanent Overlay for Verification */}
      {verificationStatus !== 'APPROVED' && (
        <div className="modal-overlay" style={{ zIndex: 9998 }}>
          <div className="modal-content">
            <h2 style={{ marginTop: 0, textAlign: 'center', color: 'var(--text-primary)' }}>Account Verification</h2>
            
            {verificationStatus === 'PENDING' ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-5)' }}>
                <h3 style={{ color: 'var(--color-warning-600)', marginBottom: 'var(--space-4)' }}>Status: Yet to be approved</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Your verification has been sent and is pending approval by the main admin.</p>
                <p style={{ color: 'var(--text-tertiary)' }}>Please check back later.</p>
                <button onClick={() => { localStorage.removeItem('user'); window.location.href='/login'; }} className="btn btn-outline" style={{ marginTop: 'var(--space-5)' }}>Logout</button>
              </div>
            ) : (
              <form onSubmit={handleVerificationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {verificationStatus === 'RE_REQUEST' ? (
                  <div className="alert alert-danger">
                    <p style={{ margin: 0, fontWeight: 'var(--font-bold)' }}>Action Required</p>
                    <p style={{ margin: 'var(--space-1) 0 0 0' }}>The Main Admin has requested that you re-upload your verification documents. Please ensure all details are clear and accurate.</p>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textAlign: 'center' }}>Please submit your community details for verification.</p>
                )}
                
                <input type="text" placeholder="Aadhar Card No." value={vForm.aadharCard} onChange={e => setVForm({...vForm, aadharCard: e.target.value})} required className="form-input" />
                <input type="text" placeholder="PAN Card No." value={vForm.panCard} onChange={e => setVForm({...vForm, panCard: e.target.value})} required className="form-input" />
                <input type="text" placeholder="Phone Number" value={vForm.phoneNumber} onChange={e => setVForm({...vForm, phoneNumber: e.target.value})} required className="form-input" />
                <textarea placeholder="Community Address" value={vForm.address} onChange={e => setVForm({...vForm, address: e.target.value})} required className="form-input" style={{ height: '80px', resize: 'vertical' }} />
                
                <button type="submit" className="btn btn-primary btn-lg">Submit for Approval</button>
              </form>
            )}
          </div>
        </div>
      )}

      <CommunityAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        {/* Copyable Invite Modal */}
        {showInviteModal && (
          <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <div className="modal-content" style={{ textAlign: 'center' }}>
              <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Invite Link Generated</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Share this link with the resident to allow them to register.</p>
              
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
                <input type="text" value={inviteLink} readOnly className="form-input" style={{ flexGrow: 1 }} />
                <button onClick={() => { navigator.clipboard.writeText(inviteLink); alert('Copied to clipboard!'); }} className="btn btn-primary">Copy</button>
              </div>

              <div style={{ marginTop: 'var(--space-5)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)' }}>
                <p style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>Or send directly via Email:</p>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input type="email" placeholder="resident@example.com" value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} className="form-input" style={{ flexGrow: 1 }} />
                  <button onClick={handleSendEmail} disabled={!targetEmail || emailStatus === 'Sending...'} className="btn btn-success">Send</button>
                </div>
                {emailStatus && <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', color: emailStatus.includes('success') ? 'var(--color-success-500)' : 'var(--color-danger-500)' }}>{emailStatus}</p>}
              </div>
              
              <button onClick={() => { setShowInviteModal(false); setInviteLink(''); setEmailStatus(''); }} className="btn btn-outline" style={{ marginTop: 'var(--space-5)' }}>Close</button>
            </div>
          </div>
        )}

        <main className="dashboard-content">
          <div className="page-header">
            <h1>Community Admin Dashboard</h1>
            <button onClick={handleInviteGen} className="btn btn-success">+ Generate Resident Invite</button>
          </div>
          
          <MagicCardGrid>
            {/* Top Metrics Grid */}
            <div className="grid-3">
              <Link to="/community/households" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MagicCard className="stat-card" style={{ cursor: 'pointer' }}>
                  <h3>Total Households</h3>
                  <div className="stat-value">{adminStats.totalHouseholds}</div>
                </MagicCard>
              </Link>
              <MagicCard className="stat-card">
                <h3>Total Usage (Liters)</h3>
                <div className="stat-value">{adminStats.totalUsage}</div>
              </MagicCard>
              <MagicCard className="stat-card">
                <h3>Current Cycle</h3>
                <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>{adminStats.currentCycle}</div>
              </MagicCard>
            </div>
          
            {/* Charts section */}
            <div className="grid-2-1">
              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>Community Consumption Trend (Liters)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockConsumptionData} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                    <defs>
                      <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Area type="monotone" dataKey="consumption" stroke="#2563eb" fillOpacity={1} fill="url(#colorCons)" />
                  </AreaChart>
                </ResponsiveContainer>
              </MagicCard>
              
              <MagicCard className="chart-card" style={{ height: '350px' }}>
                <h3>Bill Payment Status</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={mockStatusData} cx="50%" cy="45%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {mockStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </MagicCard>
            </div>

            {/* Bottom section Modules */}
            <div className="grid-2">
              <MagicCard className="chart-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-warning-500)' }}></span> Pending Bills
                </h3>
                <div className="alert alert-warning" style={{ marginBottom: 'var(--space-3)' }}>
                  <strong>Apt 101, Block A</strong> - ₹450.00 Due
                </div>
                <div className="alert alert-warning" style={{ marginBottom: 'var(--space-3)' }}>
                  <strong>Apt 205, Block B</strong> - ₹320.00 Due
                </div>
                <div className="alert alert-warning">
                  <strong>Apt 302, Block A</strong> - ₹500.00 Due
                </div>
              </MagicCard>
              
              <MagicCard className="chart-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-danger-500)' }}></span> Recent Alerts
                </h3>
                <div style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--color-danger-500)', backgroundColor: 'transparent', borderRadius: '0 var(--radius-md) var(--radius-md) 0', marginBottom: 'var(--space-3)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>System Maintenance</strong>
                  <p style={{ margin: 'var(--space-1) 0 0 0', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Scheduled for Pump 2 on Friday, 10:00 AM.</p>
                </div>
                <div style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--color-primary-500)', backgroundColor: 'transparent', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>New Registration</strong>
                  <p style={{ margin: 'var(--space-1) 0 0 0', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>A new resident registered for Apt 401.</p>
                </div>
              </MagicCard>
            </div>
          </MagicCardGrid>
          
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
