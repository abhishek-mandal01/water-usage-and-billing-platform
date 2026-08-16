import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { Building2, Search, ArrowRight } from 'lucide-react';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function MainAdminCommunities() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');
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

  const filteredApartments = apartments.filter(apt => {
    const term = searchTerm.toLowerCase();
    const matchesId = apt.id.toString().includes(term);
    const matchesName = apt.name?.toLowerCase().includes(term);
    const matchesAdmin = apt.communityAdmin?.name?.toLowerCase().includes(term);
    return matchesId || matchesName || matchesAdmin;
  }).sort((a, b) => {
    if (sortOption === 'newest') return b.id - a.id;
    if (sortOption === 'oldest') return a.id - b.id;
    if (sortOption === 'name_asc') return (a.name || '').localeCompare(b.name || '');
    if (sortOption === 'name_desc') return (b.name || '').localeCompare(a.name || '');
    return 0;
  });

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Registered Communities & Apartments</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Overview of all communities and their assigned admins
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div style={{ position: 'relative', width: '300px' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search by ID, Apartment or Admin..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px 10px 10px 38px', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color var(--transition-fast)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary-500)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            </div>
          </div>

          <MagicCardGrid>
            <MagicCard style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary-50)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Apartment Name</th>
                  <th style={thStyle}>Address</th>
                  <th style={thStyle}>Community Admin</th>
                  <th style={thStyle}>Billing Rate (₹/L)</th>
                  <th style={{...thStyle, textAlign: 'right'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                ) : filteredApartments.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No communities found.</td></tr>
                ) : (
                  filteredApartments.map(apt => (
                    <tr 
                      key={apt.id} 
                      onClick={() => apt.communityAdmin ? navigate(`/admin/community-admin/${apt.communityAdmin.id}`) : null}
                      style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s', cursor: apt.communityAdmin ? 'pointer' : 'default' }} 
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'} 
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={tdStyle}>#{apt.id}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>{apt.name}</td>
                      <td style={tdStyle}>{apt.address}</td>
                      <td style={tdStyle}>{apt.communityAdmin ? apt.communityAdmin.name : 'Unassigned'}</td>
                      <td style={tdStyle}>₹{apt.baseRate ? apt.baseRate.toFixed(2) : '5.00'}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        {apt.communityAdmin && (
                          <button 
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            onClick={(e) => {
                              e.stopPropagation(); // prevent double navigation if row is clicked
                              navigate(`/admin/community-admin/${apt.communityAdmin.id}`);
                            }}
                          >
                            View <ArrowRight size={14} />
                          </button>
                        )}
                      </td>
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
