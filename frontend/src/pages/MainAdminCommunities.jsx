import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { Building2 } from 'lucide-react';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function MainAdminCommunities() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartments = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8081/api/config/apartments/all');
        if (res.ok) setApartments(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          
          <div className="page-header">
            <div>
              <h1>Registered Communities & Apartments</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Overview of all communities and their assigned admins
              </p>
            </div>
          </div>

          <MagicCardGrid>
            <MagicCard style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'transparent', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Apartment Name</th>
                  <th style={thStyle}>Address</th>
                  <th style={thStyle}>Community Admin</th>
                  <th style={thStyle}>Billing Rate (₹/L)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                ) : apartments.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No communities registered yet.</td></tr>
                ) : (
                  apartments.map(apt => (
                    <tr 
                      key={apt.id} 
                      onClick={() => apt.communityAdmin ? navigate(`/admin/community-admin/${apt.communityAdmin.id}`) : null}
                      style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s', cursor: apt.communityAdmin ? 'pointer' : 'default' }} 
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} 
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={tdStyle}>#{apt.id}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>{apt.name}</td>
                      <td style={tdStyle}>{apt.address}</td>
                      <td style={tdStyle}>{apt.communityAdmin ? apt.communityAdmin.name : 'Unassigned'}</td>
                      <td style={tdStyle}>₹{apt.baseRate ? apt.baseRate.toFixed(2) : '5.00'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </MagicCard>
          </MagicCardGrid>

        </main>
      </div>
    </div>
  );
}

const thStyle = { padding: '16px', color: '#4b5563', fontSize: '14px', fontWeight: '600' };
const tdStyle = { padding: '16px', color: '#111827', fontSize: '15px' };

export default MainAdminCommunities;
