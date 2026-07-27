import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { User, Mail, Phone, Shield, Edit2, Save, X } from 'lucide-react';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function Profile({ role }) {
  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phoneNumber: '', gender: '', dateOfBirth: '', governmentId: '', aadharCard: '', panCard: '', address: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user) {
      fetch(`http://localhost:8081/api/profile/${user.id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load profile');
          return res.json();
        })
        .then(data => {
          setProfile(data);
          setEditForm({ 
            name: data.name, 
            phoneNumber: data.phoneNumber || '',
            gender: data.gender || '',
            dateOfBirth: data.dateOfBirth || '',
            governmentId: data.governmentId || '',
            aadharCard: data.aadharCard || '',
            panCard: data.panCard || '',
            address: data.address || ''
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setTimeout(() => setLoading(false), 0);
        });
    } else {
      setTimeout(() => setLoading(false), 0);
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage('');
    // Reset form to current profile if cancelling edit
    if (isEditing) {
      setEditForm({ 
        name: profile.name, 
        phoneNumber: profile.phoneNumber || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        governmentId: profile.governmentId || '',
        aadharCard: profile.aadharCard || '',
        panCard: profile.panCard || '',
        address: profile.address || ''
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user) {
      try {
        const payload = { 
          ...profile, 
          name: editForm.name, 
          phoneNumber: editForm.phoneNumber,
          gender: editForm.gender,
          dateOfBirth: editForm.dateOfBirth,
          governmentId: editForm.governmentId,
          aadharCard: editForm.aadharCard,
          panCard: editForm.panCard,
          address: editForm.address
        };
        const response = await fetch(`http://localhost:8081/api/profile/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const updatedProfile = await response.json();
          setProfile(updatedProfile);
          setIsEditing(false);
          setMessage('Profile updated successfully!');
        } else {
          const errorMsg = await response.text();
          setMessage(`Error: ${errorMsg}`);
        }
      } catch (err) {
        console.error(err);
        setMessage('Network error occurred while saving.');
      }
    }
    setSaving(false);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>Loading Profile...</div>;
  }

  // A generic placeholder avatar (person icon)
  const avatarUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-3.354 0-10 1.688-10 5v3h20v-3c0-3.312-6.646-5-10-5z'/%3E%3C/svg%3E";

  return (
    <div className="dashboard-layout">
      {role === 'COMMUNITY_ADMIN' ? <CommunityAdminSidebar /> : <Sidebar />}
      
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          
          <MagicCardGrid style={{ width: '100%' }}>
            <MagicCard style={{ padding: '0', overflow: 'hidden' }}>
              
              {/* Header / Banner Area */}
            <div style={{ height: '120px', backgroundColor: '#2563eb', position: 'relative' }}></div>
            
            <div style={{ padding: '0 40px 40px 40px', position: 'relative' }}>
              
              {/* Profile Avatar & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-50px', marginBottom: '30px' }}>
                <img 
                  src={avatarUrl} 
                  alt="Profile Avatar" 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #fff', backgroundColor: '#fff' }} 
                />
                
                <div>
                  {!isEditing ? (
                    <button onClick={handleEditToggle} style={{ ...btnStyle, backgroundColor: 'transparent', color: '#111827', border: '1px solid #d1d5db' }}>
                      <Edit2 size={16} /> Edit Profile
                    </button>
                  ) : (
                    <button onClick={handleEditToggle} style={{ ...btnStyle, backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
                      <X size={16} /> Cancel
                    </button>
                  )}
                </div>
              </div>

              {message && (
                <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5', color: message.includes('Error') ? '#991b1b' : '#065f46', fontWeight: '500' }}>
                  {message}
                </div>
              )}

              {/* Profile Content */}
              {!isEditing ? (
                // View Mode
                <div>
                  <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#111827' }}>{profile.name}</h1>
                  <p style={{ margin: '0 0 30px 0', color: '#6b7280', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Shield size={16} /> {profile.role?.replace('_', ' ')}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    <div style={infoBoxStyle}>
                      <div style={infoIconWrapperStyle}><User size={20} color="#4f46e5" /></div>
                      <div>
                        <p style={infoLabelStyle}>Full Name</p>
                        <p style={infoValueStyle}>{profile.name}</p>
                      </div>
                    </div>
                    
                    <div style={infoBoxStyle}>
                      <div style={infoIconWrapperStyle}><Mail size={20} color="#4f46e5" /></div>
                      <div>
                        <p style={infoLabelStyle}>Email Address</p>
                        <p style={infoValueStyle}>{profile.email}</p>
                      </div>
                    </div>
                    
                    <div style={infoBoxStyle}>
                      <div style={infoIconWrapperStyle}><Phone size={20} color="#4f46e5" /></div>
                      <div>
                        <p style={infoLabelStyle}>Phone Number</p>
                        <p style={infoValueStyle}>{profile.phoneNumber || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div style={infoBoxStyle}>
                      <div style={infoIconWrapperStyle}><User size={20} color="#4f46e5" /></div>
                      <div>
                        <p style={infoLabelStyle}>Gender</p>
                        <p style={infoValueStyle}>{profile.gender || 'Not provided'}</p>
                      </div>
                    </div>

                    <div style={infoBoxStyle}>
                      <div style={infoIconWrapperStyle}><User size={20} color="#4f46e5" /></div>
                      <div>
                        <p style={infoLabelStyle}>Date of Birth</p>
                        <p style={infoValueStyle}>{profile.dateOfBirth || 'Not provided'}</p>
                      </div>
                    </div>

                    {role === 'RESIDENT' && (
                      <div style={infoBoxStyle}>
                        <div style={infoIconWrapperStyle}><Shield size={20} color="#4f46e5" /></div>
                        <div>
                          <p style={infoLabelStyle}>Government ID</p>
                          <p style={infoValueStyle}>{profile.governmentId || 'Not provided'}</p>
                        </div>
                      </div>
                    )}
                    
                    {role === 'COMMUNITY_ADMIN' && (
                      <>
                        <div style={infoBoxStyle}>
                          <div style={infoIconWrapperStyle}><Shield size={20} color="#4f46e5" /></div>
                          <div>
                            <p style={infoLabelStyle}>Aadhar Card</p>
                            <p style={infoValueStyle}>{profile.aadharCard || 'Not provided'}</p>
                          </div>
                        </div>
                        <div style={infoBoxStyle}>
                          <div style={infoIconWrapperStyle}><Shield size={20} color="#4f46e5" /></div>
                          <div>
                            <p style={infoLabelStyle}>PAN Card</p>
                            <p style={infoValueStyle}>{profile.panCard || 'Not provided'}</p>
                          </div>
                        </div>
                        <div style={infoBoxStyle}>
                          <div style={infoIconWrapperStyle}><Shield size={20} color="#4f46e5" /></div>
                          <div>
                            <p style={infoLabelStyle}>Verification Status</p>
                            <p style={infoValueStyle}>{profile.verificationStatus || 'N/A'}</p>
                          </div>
                        </div>
                        <div style={{ ...infoBoxStyle, gridColumn: '1 / -1' }}>
                          <div style={infoIconWrapperStyle}><User size={20} color="#4f46e5" /></div>
                          <div>
                            <p style={infoLabelStyle}>Address</p>
                            <p style={infoValueStyle}>{profile.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleSave}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        required 
                        style={inputStyle} 
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Email Address <span style={{color: '#9ca3af', fontWeight: 'normal'}}>(Read-only)</span></label>
                      <input 
                        type="email" 
                        value={profile.email} 
                        readOnly 
                        style={{ ...inputStyle, backgroundColor: 'transparent', color: '#6b7280' }} 
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input 
                        type="text" 
                        value={editForm.phoneNumber} 
                        onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                        style={inputStyle} 
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Account Role <span style={{color: '#9ca3af', fontWeight: 'normal'}}>(Read-only)</span></label>
                      <input 
                        type="text" 
                        value={profile.role?.replace('_', ' ')} 
                        readOnly 
                        style={{ ...inputStyle, backgroundColor: 'transparent', color: '#6b7280' }} 
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Gender</label>
                      <select 
                        value={editForm.gender} 
                        onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                        style={inputStyle}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Date of Birth</label>
                      <input 
                        type="date" 
                        value={editForm.dateOfBirth} 
                        onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                        style={inputStyle} 
                      />
                    </div>

                    {role === 'RESIDENT' && (
                      <div>
                        <label style={labelStyle}>Government ID</label>
                        <input 
                          type="text" 
                          value={editForm.governmentId} 
                          onChange={(e) => setEditForm({...editForm, governmentId: e.target.value})}
                          style={inputStyle} 
                        />
                      </div>
                    )}
                    
                    {role === 'COMMUNITY_ADMIN' && (
                      <>
                        <div>
                          <label style={labelStyle}>Aadhar Card</label>
                          <input 
                            type="text" 
                            value={editForm.aadharCard} 
                            onChange={(e) => setEditForm({...editForm, aadharCard: e.target.value})}
                            style={inputStyle} 
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>PAN Card</label>
                          <input 
                            type="text" 
                            value={editForm.panCard} 
                            onChange={(e) => setEditForm({...editForm, panCard: e.target.value})}
                            style={inputStyle} 
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Address</label>
                          <textarea 
                            value={editForm.address} 
                            onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      type="submit" 
                      disabled={saving}
                      style={{ ...btnStyle, backgroundColor: '#2563eb', color: 'white', opacity: saving ? 0.7 : 1 }}>
                      {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </MagicCard>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

// Reusable Styles
const btnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' };
const infoBoxStyle = { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'transparent', padding: '20px', borderRadius: '12px', border: '1px solid #f3f4f6' };
const infoIconWrapperStyle = { backgroundColor: '#e0e7ff', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const infoLabelStyle = { margin: '0 0 5px 0', color: '#6b7280', fontSize: '14px', fontWeight: '500' };
const infoValueStyle = { margin: '0', color: '#111827', fontSize: '16px', fontWeight: '600' };
const labelStyle = { display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' };

export default Profile;
