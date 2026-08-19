import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, X } from 'lucide-react';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function CommunityAdminDetails() {const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('flat_asc');

  const filteredResidents = residents.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (r.name || '').toLowerCase();
    const email = (r.email || '').toLowerCase();
    const flat = (r.householdNumber || '').toLowerCase();
    return name.includes(q) || email.includes(q) || flat.includes(q);
  });

  const sortedResidents = [...filteredResidents].sort((a, b) => {
    if (sortOption === 'flat_asc') return (a.householdNumber || '').localeCompare(b.householdNumber || '');
    if (sortOption === 'flat_desc') return (b.householdNumber || '').localeCompare(a.householdNumber || '');
    if (sortOption === 'name_asc') return (a.name || '').localeCompare(b.name || '');
    if (sortOption === 'name_desc') return (b.name || '').localeCompare(a.name || '');
    return 0;
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [adminRes, residentRes] = await Promise.all([
      fetch(`http://localhost:8081/api/users/community-admin/${id}`),
      fetch(`http://localhost:8081/api/users/community-admin/${id}/residents`)]
      );

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
        method: 'DELETE'
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
        method: 'DELETE'
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
        method: 'POST'
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

  if (loading) return <div>{t("mainAdmin.loading")}</div>;
  if (!admin) return <div>{t("mainAdmin.adminnotfound")}</div>;

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content" style={{ position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => navigate('/main-admin-panel')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '500' }}>
              
              <ArrowLeft size={18} />{t("mainAdmin.backtoDashboard")}
            </button>
            <button
              onClick={handleDeleteAdmin}
              style={{ padding: '8px 16px', backgroundColor: 'var(--color-danger-50)', color: 'var(--color-danger-700)', border: '1px solid var(--color-danger-400)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t("mainAdmin.removeCommunityAdmin")}


            </button>
          </div>

          <MagicCardGrid>
            <MagicCard style={{ padding: '30px', marginBottom: '30px' }}>
              <h1 style={{ margin: '0 0 20px 0', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User color="var(--color-primary-600)" />{t("mainAdmin.adminProfile")}{admin.name}
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', rowGap: '20px' }}>
              <div>
                <span style={labelStyle}>{t("mainAdmin.emailAddress")}</span>
                <div style={valueStyle}><Mail size={16} /> {admin.email}</div>
              </div>
              <div>
                <span style={labelStyle}>{t("mainAdmin.phoneNumber")}</span>
                <div style={valueStyle}><Phone size={16} /> {admin.phoneNumber || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>{t("mainAdmin.status")}</span>
                <div style={{ ...valueStyle, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} /> 
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        backgroundColor: admin.verificationStatus === 'APPROVED' ? 'var(--color-success-50)' : admin.verificationStatus === 'REJECTED' ? 'var(--color-danger-50)' : admin.verificationStatus === 'RE_REQUEST' ? 'var(--color-warning-50)' : 'var(--color-surface-50)',
                        color: admin.verificationStatus === 'APPROVED' ? 'var(--color-success-700)' : admin.verificationStatus === 'REJECTED' ? 'var(--color-danger-700)' : admin.verificationStatus === 'RE_REQUEST' ? 'var(--color-warning-700)' : 'var(--text-secondary)'
                      }}>
                      {admin.verificationStatus}
                    </span>
                  </div>
                  {admin.verificationStatus !== 'APPROVED' &&
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button onClick={() => handleVerificationAction('approve')} style={{ padding: '6px 12px', backgroundColor: 'var(--color-success-500)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>{t("mainAdmin.approve")}</button>
                      <button onClick={() => handleVerificationAction('decline')} style={{ padding: '6px 12px', backgroundColor: 'var(--color-danger-500)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>{t("mainAdmin.reject")}</button>
                      <button onClick={() => handleVerificationAction('rerequest')} style={{ padding: '6px 12px', backgroundColor: 'var(--color-warning-500)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>{t("mainAdmin.rerequestDocs")}</button>
                    </div>
                  }
                </div>
              </div>
              <div>
                <span style={labelStyle}>{t("mainAdmin.aadharCard")}</span>
                <div style={valueStyle}>{admin.aadharCard || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>{t("mainAdmin.pANCard")}</span>
                <div style={valueStyle}>{admin.panCard || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>{t("mainAdmin.address")}</span>
                <div style={valueStyle}>{admin.address || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>{t("mainAdmin.gender")}</span>
                <div style={valueStyle}>{admin.gender || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>{t("mainAdmin.dateofBirth")}</span>
                <div style={valueStyle}>{admin.dateOfBirth || 'N/A'}</div>
              </div>
            </div>
            </MagicCard>

            <MagicCard style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px' }}>{t("mainAdmin.managedResidents")} ({residents.length})</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="flat_asc">Household (A-Z)</option>
                    <option value="flat_desc">Household (Z-A)</option>
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search residents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', width: '200px' }}
                  />
                </div>
              </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary-50)' }}>
                  <th style={thStyle}>{t("mainAdmin.household")}</th>
                  <th style={thStyle}>{t("mainAdmin.name")}</th>
                  <th style={thStyle}>{t("mainAdmin.email")}</th>
                  <th style={thStyle}>{t("mainAdmin.action")}</th>
                </tr>
              </thead>
              <tbody>
                {sortedResidents.map((r) =>
                  <tr key={r.id} onClick={() => setSelectedResident(r)} style={{ borderBottom: '1px solid var(--border-default)', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={tdStyle}>{r.householdNumber || 'Unassigned'}</td>
                    <td style={tdStyle}>{r.name}</td>
                    <td style={tdStyle}>{r.email}</td>
                    <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedResident(r)}
                        style={{ padding: '6px 12px', backgroundColor: 'var(--color-primary-500)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{t("mainAdmin.viewDetails")}


                      </button>
                    </td>
                  </tr>
                  )}
              </tbody>
            </table>
            </MagicCard>
          </MagicCardGrid>

          {/* Modal */}
          {selectedResident &&
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{t("mainAdmin.residentDetails")}</h2>
                  <button onClick={() => setSelectedResident(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={24} color="var(--text-secondary)" />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <span style={labelStyle}>{t("mainAdmin.name")}</span>
                    <div style={modalValueStyle}>{selectedResident.name}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>{t("mainAdmin.email")}</span>
                    <div style={modalValueStyle}>{selectedResident.email}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>{t("mainAdmin.householdFlat")}</span>
                    <div style={modalValueStyle}>{selectedResident.householdNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>{t("mainAdmin.phoneNumber")}</span>
                    <div style={modalValueStyle}>{selectedResident.phoneNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>{t("mainAdmin.gender")}</span>
                    <div style={modalValueStyle}>{selectedResident.gender || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>{t("mainAdmin.dateofBirth")}</span>
                    <div style={modalValueStyle}>{selectedResident.dateOfBirth || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={labelStyle}>{t("mainAdmin.governmentID")}</span>
                    <div style={modalValueStyle}>{selectedResident.governmentId || 'N/A'}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                  onClick={() => handleDeleteResident(selectedResident.id)}
                  style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-danger-50)', color: 'var(--color-danger-700)', border: '1px solid var(--color-danger-400)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t("mainAdmin.removeResident")}


                </button>
                  <button
                  onClick={() => setSelectedResident(null)}
                  style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-surface-200)', color: 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t("mainAdmin.close")}


                </button>
                </div>
              </div>
            </div>
          }

        </main>
      </div>
    </div>);

}

const labelStyle = { display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' };
const valueStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', color: 'var(--text-primary)', fontWeight: '500' };
const modalValueStyle = { fontSize: '16px', color: 'var(--text-primary)', fontWeight: '500' };
const thStyle = { padding: '15px', color: 'var(--text-secondary)', fontSize: '14px' };
const tdStyle = { padding: '15px', color: 'var(--text-primary)' };

export default CommunityAdminDetails;
