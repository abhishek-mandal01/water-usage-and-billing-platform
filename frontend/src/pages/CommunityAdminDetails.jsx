import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, X } from 'lucide-react';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function CommunityAdminDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [adminRes, residentRes] = await Promise.all([
        fetch(`http://localhost:8081/api/users/community-admin/${id}`),
        fetch(`http://localhost:8081/api/users/community-admin/${id}/residents`)
      ]);

      if (adminRes.ok) setAdmin(await adminRes.json());
      if (residentRes.ok) setResidents(await residentRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteResident = async (residentId) => {
    if (!window.confirm("Are you sure you want to remove this resident? All their data will be lost.")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/users/resident/${residentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Resident removed successfully.');
        setSelectedResident(null);
        fetchData();
      } else {
        alert('Failed to remove resident.');
      }
    } catch (err) {
      console.error(err);
      alert('Error removing resident.');
    }
  };

  const handleDeleteAdmin = async () => {
    if (!window.confirm("Are you sure you want to completely remove this Community Admin? This will permanently delete the admin, their assigned apartment, ALL associated households, and ALL their residents. This action cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/users/community-admin/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Community Admin removed successfully.');
        navigate('/admin/communities');
      } else {
        alert('Failed to remove community admin.');
      }
    } catch (err) {
      console.error(err);
      alert('Error removing community admin.');
    }
  };

  const handleVerificationAction = async (action) => {
    try {
      const res = await fetch(`http://localhost:8081/api/verification/${action}/${id}`, {
        method: 'POST',
      });
      if (res.ok) {
        alert(`Verification status updated successfully.`);
        fetchData();
      } else {
        alert('Failed to update verification status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!admin) return <div>Admin not found</div>;

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main style={{ padding: '30px', marginTop: '60px', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button 
              onClick={() => navigate('/main-admin-panel')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontWeight: '500' }}
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <button 
              onClick={handleDeleteAdmin}
              style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Remove Community Admin
            </button>
          </div>

          <MagicCardGrid>
            <MagicCard style={{ padding: '30px', marginBottom: '30px' }}>
              <h1 style={{ margin: '0 0 20px 0', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User color="#2563eb" /> Admin Profile: {admin.name}
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', rowGap: '20px' }}>
              <div>
                <span style={labelStyle}>Email Address</span>
                <div style={valueStyle}><Mail size={16} /> {admin.email}</div>
              </div>
              <div>
                <span style={labelStyle}>Phone Number</span>
                <div style={valueStyle}><Phone size={16} /> {admin.phoneNumber || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Status</span>
                <div style={{...valueStyle, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} /> 
                    <span style={{
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      fontWeight: 'bold',
                      backgroundColor: admin.verificationStatus === 'APPROVED' ? '#d1fae5' : admin.verificationStatus === 'REJECTED' ? '#fee2e2' : admin.verificationStatus === 'RE_REQUEST' ? '#fef3c7' : '#f3f4f6',
                      color: admin.verificationStatus === 'APPROVED' ? '#065f46' : admin.verificationStatus === 'REJECTED' ? '#991b1b' : admin.verificationStatus === 'RE_REQUEST' ? '#92400e' : '#374151'
                    }}>
                      {admin.verificationStatus}
                    </span>
                  </div>
                  {admin.verificationStatus !== 'APPROVED' && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button onClick={() => handleVerificationAction('approve')} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleVerificationAction('decline')} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                      <button onClick={() => handleVerificationAction('rerequest')} style={{ padding: '6px 12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Re-request Docs</button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <span style={labelStyle}>Aadhar Card</span>
                <div style={valueStyle}>{admin.aadharCard || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>PAN Card</span>
                <div style={valueStyle}>{admin.panCard || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Address</span>
                <div style={valueStyle}>{admin.address || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Gender</span>
                <div style={valueStyle}>{admin.gender || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Date of Birth</span>
                <div style={valueStyle}>{admin.dateOfBirth || 'N/A'}</div>
              </div>
            </div>
            </MagicCard>

            <MagicCard style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Managed Residents ({residents.length})</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'transparent' }}>
                  <th style={thStyle}>Household #</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {residents.map(r => (
                  <tr key={r.id} onClick={() => setSelectedResident(r)} style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={tdStyle}>{r.householdNumber || 'Unassigned'}</td>
                    <td style={tdStyle}>{r.name}</td>
                    <td style={tdStyle}>{r.email}</td>
                    <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setSelectedResident(r)}
                        style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </MagicCard>
          </MagicCardGrid>

          {/* Modal */}
          {selectedResident && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>Resident Details</h2>
                  <button onClick={() => setSelectedResident(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={24} color="#6b7280" />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <span style={labelStyle}>Name</span>
                    <div style={modalValueStyle}>{selectedResident.name}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>Email</span>
                    <div style={modalValueStyle}>{selectedResident.email}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>Household / Flat #</span>
                    <div style={modalValueStyle}>{selectedResident.householdNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>Phone Number</span>
                    <div style={modalValueStyle}>{selectedResident.phoneNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>Gender</span>
                    <div style={modalValueStyle}>{selectedResident.gender || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>Date of Birth</span>
                    <div style={modalValueStyle}>{selectedResident.dateOfBirth || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>Government ID</span>
                    <div style={modalValueStyle}>{selectedResident.governmentId || 'N/A'}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button 
                    onClick={() => handleDeleteResident(selectedResident.id)}
                    style={{ flex: 1, padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Remove Resident
                  </button>
                  <button 
                    onClick={() => setSelectedResident(null)}
                    style={{ flex: 1, padding: '10px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' };
const valueStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', color: '#111827', fontWeight: '500' };
const modalValueStyle = { fontSize: '16px', color: '#111827', fontWeight: '500' };
const thStyle = { padding: '15px', color: '#4b5563', fontSize: '14px' };
const tdStyle = { padding: '15px', color: '#111827' };

export default CommunityAdminDetails;
