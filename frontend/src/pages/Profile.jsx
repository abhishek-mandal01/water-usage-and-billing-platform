import { useTranslation } from '../components/LanguageSelector/useTranslation';
import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { User, Mail, Phone, Shield, Edit2, Save, X, Camera, Upload, Check } from 'lucide-react';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-3.354 0-10 1.688-10 5v3h20v-3c0-3.312-6.646-5-10-5z'/%3E%3C/svg%3E";

const AVATAR_PRESETS = [
  { id: 'droplet', name: 'Smart Water Droplet 💧', url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300d2ff'/%3E%3Cstop offset='100%25' stop-color='%230072ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3Cpath d='M50 20 C50 20 28 50 28 65 A22 22 0 0 0 72 65 C72 50 50 20 50 20 Z' fill='%23ffffff' opacity='0.9'/%3E%3C/svg%3E" },
  { id: 'shield', name: 'Admin Shield 🛡️ï¸', url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%234f46e5'/%3E%3Cstop offset='100%25' stop-color='%2306b6d4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3Cpath d='M50 22 L72 32 V52 C72 68 50 78 50 78 C50 78 28 68 28 52 V32 Z' fill='%23ffffff' opacity='0.9'/%3E%3C/svg%3E" },
  { id: 'leaf', name: 'Eco Guardian 🌿', url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2310b981'/%3E%3Cstop offset='100%25' stop-color='%23059669'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3Cpath d='M50 20 C30 35 25 65 50 80 C75 65 70 35 50 20 Z' fill='%23ffffff' opacity='0.9'/%3E%3C/svg%3E" },
  { id: 'person_m', name: 'Male Avatar 👤', url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%233b82f6'/%3E%3Cstop offset='100%25' stop-color='%231d4ed8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3Ccircle cx='50' cy='40' r='18' fill='%23ffffff'/%3E%3Cpath d='M25 80 C25 62 35 56 50 56 C65 56 75 62 75 80 Z' fill='%23ffffff'/%3E%3C/svg%3E" },
  { id: 'person_f', name: 'Female Avatar 👤', url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ec4899'/%3E%3Cstop offset='100%25' stop-color='%23be185d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3Ccircle cx='50' cy='40' r='18' fill='%23ffffff'/%3E%3Cpath d='M25 80 C25 62 35 56 50 56 C65 56 75 62 75 80 Z' fill='%23ffffff'/%3E%3C/svg%3E" },
  { id: 'aqua_tech', name: 'Tech Engineer 💻', url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%238b5cf6'/%3E%3Cstop offset='100%25' stop-color='%236d28d9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3Cpath d='M30 35 L70 35 L70 65 L30 65 Z' fill='none' stroke='%23ffffff' stroke-width='6' stroke-linejoin='round'/%3E%3Cpath d='M40 72 L60 72' stroke='%23ffffff' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E" },
  { id: 'sparkle', name: 'Aqua Sparkle ✨', url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2306b6d4'/%3E%3Cstop offset='100%25' stop-color='%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3Cpath d='M50 25 L56 42 L75 50 L56 58 L50 75 L44 58 L25 50 L44 42 Z' fill='%23ffffff'/%3E%3C/svg%3E" }
];

function Profile({ role: propRole }) {
  const { t } = useTranslation();
  
  const userStr = localStorage.getItem('user');
  const sessionUser = userStr ? JSON.parse(userStr) : null;
  const role = propRole || sessionUser?.role || 'RESIDENT';

  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '', role: '', avatarUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    phoneNumber: '', 
    gender: '', 
    dateOfBirth: '', 
    governmentId: '', 
    aadharCard: '', 
    panCard: '', 
    address: '',
    avatarUrl: ''
  });
  const [message, setMessage] = useState('');

  const updateLocalUserAvatar = (newAvatarUrl) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      const updated = { ...u, avatarUrl: newAvatarUrl };
      localStorage.setItem('user', JSON.stringify(updated));
      window.dispatchEvent(new Event('user_profile_updated'));
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user) {
      fetch(`http://localhost:8081/api/profile/${user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load profile');
          return res.json();
        })
        .then((data) => {
          setProfile(data);
          const activeAvatar = data.avatarUrl || user.avatarUrl || '';
          setEditForm({
            name: data.name,
            phoneNumber: data.phoneNumber || '',
            gender: data.gender || '',
            dateOfBirth: data.dateOfBirth || '',
            governmentId: data.governmentId || '',
            aadharCard: data.aadharCard || '',
            panCard: data.panCard || '',
            address: data.address || '',
            avatarUrl: activeAvatar
          });
          if (data.avatarUrl && data.avatarUrl !== user.avatarUrl) {
            updateLocalUserAvatar(data.avatarUrl);
          }
          setLoading(false);
        })
        .catch((err) => {
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
    if (isEditing) {
      setEditForm({
        name: profile.name,
        phoneNumber: profile.phoneNumber || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        governmentId: profile.governmentId || '',
        aadharCard: profile.aadharCard || '',
        panCard: profile.panCard || '',
        address: profile.address || '',
        avatarUrl: profile.avatarUrl || ''
      });
    }
  };

  const handleCustomFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, WebP).');
      return;
    }

    // Convert file to scaled canvas Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/png', 0.85);
        setEditForm(prev => ({ ...prev, avatarUrl: dataUrl }));
        setProfile(prev => ({ ...prev, avatarUrl: dataUrl }));
        updateLocalUserAvatar(dataUrl);
        setShowAvatarModal(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
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
          address: editForm.address,
          avatarUrl: editForm.avatarUrl || profile.avatarUrl || ''
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

          // Sync updated avatar & name to localStorage user and trigger event for Topbar
          const updatedUser = {
            ...user,
            name: updatedProfile.name,
            avatarUrl: updatedProfile.avatarUrl
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('user_profile_updated'));
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
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>{t("resident.loadingProfile", "Loading Profile...")}</div>;
  }

  const currentAvatar = editForm.avatarUrl || profile.avatarUrl || DEFAULT_AVATAR;

  return (
    <div className="dashboard-layout">
      {role === 'MAIN_ADMIN' ? <MainAdminSidebar /> : (role === 'COMMUNITY_ADMIN' || role === 'ADMIN') ? <CommunityAdminSidebar /> : <Sidebar />}
      
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          
          <MagicCardGrid style={{ width: '100%' }}>
            <MagicCard style={{ padding: '0', overflow: 'hidden' }}>
              
              {/* Header / Banner Area */}
              <div style={{ height: '120px', backgroundColor: 'var(--color-primary-600)', position: 'relative' }}></div>
              
              <div style={{ padding: '0 40px 40px 40px', position: 'relative' }}>
                
                {/* Profile Avatar & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-50px', marginBottom: '30px' }}>
                  
                  {/* Interactive Profile Picture Container */}
                  <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={() => setShowAvatarModal(true)} title="Click to Change Profile Picture">
                    <img
                      src={currentAvatar}
                      alt="Profile Avatar"
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%', 
                        border: '4px solid var(--bg-card)', 
                        backgroundColor: 'var(--bg-card)', 
                        objectFit: 'cover',
                        display: 'block',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                      }} 
                    />

                    {/* Camera Change Icon Overlay */}
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        backgroundColor: 'var(--color-primary-600)',
                        color: '#ffffff',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        border: '2px solid #ffffff',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Camera size={18} />
                    </div>
                  </div>
                  
                  <div>
                    {!isEditing ? (
                      <button onClick={handleEditToggle} style={{ ...btnStyle, backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}>
                        <Edit2 size={16} />{t("resident.editProfile", "Edit Profile")}
                      </button>
                    ) : (
                      <button onClick={handleEditToggle} style={{ ...btnStyle, backgroundColor: 'var(--color-danger-50)', color: 'var(--color-danger-700)', border: 'none' }}>
                        <X size={16} />{t("resident.cancel", "Cancel")}
                      </button>
                    )}
                  </div>
                </div>

                {message && (
                  <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', backgroundColor: message.includes('Error') ? 'var(--color-danger-50)' : 'var(--color-success-50)', color: message.includes('Error') ? 'var(--color-danger-700)' : 'var(--color-success-700)', fontWeight: '500' }}>
                    {message}
                  </div>
                )}

                {/* Profile Content */}
                {!isEditing ? (
                  // View Mode
                  <div>
                    <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: 'var(--text-primary)' }}>{profile.name}</h1>
                    <p style={{ margin: '0 0 30px 0', color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Shield size={16} /> {profile.role?.replace('_', ' ')}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                      <div style={infoBoxStyle}>
                        <div style={infoIconWrapperStyle}><User size={20} color="var(--color-primary-600)" /></div>
                        <div>
                          <p style={infoLabelStyle}>{t("resident.fullName", "Full Name")}</p>
                          <p style={infoValueStyle}>{profile.name}</p>
                        </div>
                      </div>
                      
                      <div style={infoBoxStyle}>
                        <div style={infoIconWrapperStyle}><Mail size={20} color="var(--color-primary-600)" /></div>
                        <div>
                          <p style={infoLabelStyle}>{t("resident.emailAddress", "Email Address")}</p>
                          <p style={infoValueStyle}>{profile.email}</p>
                        </div>
                      </div>
                      
                      <div style={infoBoxStyle}>
                        <div style={infoIconWrapperStyle}><Phone size={20} color="var(--color-primary-600)" /></div>
                        <div>
                          <p style={infoLabelStyle}>{t("resident.phoneNumber", "Phone Number")}</p>
                          <p style={infoValueStyle}>{profile.phoneNumber || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div style={infoBoxStyle}>
                        <div style={infoIconWrapperStyle}><User size={20} color="var(--color-primary-600)" /></div>
                        <div>
                          <p style={infoLabelStyle}>{t("resident.gender", "Gender")}</p>
                          <p style={infoValueStyle}>{profile.gender || 'Not provided'}</p>
                        </div>
                      </div>

                      <div style={infoBoxStyle}>
                        <div style={infoIconWrapperStyle}><User size={20} color="var(--color-primary-600)" /></div>
                        <div>
                          <p style={infoLabelStyle}>{t("resident.dateofBirth", "Date of Birth")}</p>
                          <p style={infoValueStyle}>{profile.dateOfBirth || 'Not provided'}</p>
                        </div>
                      </div>

                      {role === 'RESIDENT' && (
                        <div style={infoBoxStyle}>
                          <div style={infoIconWrapperStyle}><Shield size={20} color="var(--color-primary-600)" /></div>
                          <div>
                            <p style={infoLabelStyle}>{t("resident.governmentID", "Government ID")}</p>
                            <p style={infoValueStyle}>{profile.governmentId || 'Not provided'}</p>
                          </div>
                        </div>
                      )}
                      
                      {role === 'COMMUNITY_ADMIN' && (
                        <>
                          <div style={infoBoxStyle}>
                            <div style={infoIconWrapperStyle}><Shield size={20} color="var(--color-primary-600)" /></div>
                            <div>
                              <p style={infoLabelStyle}>{t("resident.aadharCard", "Aadhar Card")}</p>
                              <p style={infoValueStyle}>{profile.aadharCard || 'Not provided'}</p>
                            </div>
                          </div>
                          <div style={infoBoxStyle}>
                            <div style={infoIconWrapperStyle}><Shield size={20} color="var(--color-primary-600)" /></div>
                            <div>
                              <p style={infoLabelStyle}>{t("resident.pANCard", "PAN Card")}</p>
                              <p style={infoValueStyle}>{profile.panCard || 'Not provided'}</p>
                            </div>
                          </div>
                          <div style={infoBoxStyle}>
                            <div style={infoIconWrapperStyle}><Shield size={20} color="var(--color-primary-600)" /></div>
                            <div>
                              <p style={infoLabelStyle}>{t("resident.verificationStatus", "Verification Status")}</p>
                              <p style={infoValueStyle}>{profile.verificationStatus || 'N/A'}</p>
                            </div>
                          </div>
                          <div style={{ ...infoBoxStyle, gridColumn: '1 / -1' }}>
                            <div style={infoIconWrapperStyle}><User size={20} color="var(--color-primary-600)" /></div>
                            <div>
                              <p style={infoLabelStyle}>{t("resident.address", "Address")}</p>
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
                        <label style={labelStyle}>{t("resident.fullName", "Full Name")}</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                          style={inputStyle} 
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>{t("resident.emailAddress", "Email Address")} <span style={{ color: 'var(--text-tertiary)', fontWeight: 'normal' }}>({t("resident.readonly", "Read-only")})</span></label>
                        <input
                          type="email"
                          value={profile.email}
                          readOnly
                          style={{ ...inputStyle, backgroundColor: 'transparent', color: 'var(--text-secondary)' }} 
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>{t("resident.phoneNumber", "Phone Number")}</label>
                        <input
                          type="text"
                          value={editForm.phoneNumber}
                          onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                          style={inputStyle} 
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>{t("resident.accountRole", "Account Role")} <span style={{ color: 'var(--text-tertiary)', fontWeight: 'normal' }}>({t("resident.readonly", "Read-only")})</span></label>
                        <input
                          type="text"
                          value={profile.role?.replace('_', ' ')}
                          readOnly
                          style={{ ...inputStyle, backgroundColor: 'transparent', color: 'var(--text-secondary)' }} 
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>{t("resident.gender", "Gender")}</label>
                        <select
                          value={editForm.gender}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          style={inputStyle}
                        >
                          <option value="">{t("resident.selectGender", "Select Gender")}</option>
                          <option value="Male">{t("resident.male", "Male")}</option>
                          <option value="Female">{t("resident.female", "Female")}</option>
                          <option value="Other">{t("resident.other", "Other")}</option>
                          <option value="Prefer not to say">{t("resident.prefernottosay", "Prefer not to say")}</option>
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>{t("resident.dateofBirth", "Date of Birth")}</label>
                        <input
                          type="date"
                          value={editForm.dateOfBirth}
                          onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                          style={inputStyle} 
                        />
                      </div>

                      {role === 'RESIDENT' && (
                        <div>
                          <label style={labelStyle}>{t("resident.governmentID", "Government ID")}</label>
                          <input
                            type="text"
                            value={editForm.governmentId}
                            onChange={(e) => setEditForm({ ...editForm, governmentId: e.target.value })}
                            style={inputStyle} 
                          />
                        </div>
                      )}
                      
                      {role === 'COMMUNITY_ADMIN' && (
                        <>
                          <div>
                            <label style={labelStyle}>{t("resident.aadharCard", "Aadhar Card")}</label>
                            <input
                              type="text"
                              value={editForm.aadharCard}
                              onChange={(e) => setEditForm({ ...editForm, aadharCard: e.target.value })}
                              style={inputStyle} 
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>{t("resident.pANCard", "PAN Card")}</label>
                            <input
                              type="text"
                              value={editForm.panCard}
                              onChange={(e) => setEditForm({ ...editForm, panCard: e.target.value })}
                              style={inputStyle} 
                            />
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>{t("resident.address", "Address")}</label>
                            <textarea
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setShowAvatarModal(true)}
                        style={{ ...btnStyle, backgroundColor: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                      >
                        <Camera size={16} /> Choose Profile Picture
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        style={{ ...btnStyle, backgroundColor: 'var(--color-primary-600)', color: 'white', opacity: saving ? 0.7 : 1 }}
                      >
                        {saving ? 'Saving...' : <><Save size={16} />{t("resident.saveChanges", "Save Changes")}</>}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </MagicCard>
          </MagicCardGrid>
        </main>
      </div>

      {/* Profile Picture Selection Modal */}
      {showAvatarModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowAvatarModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid var(--border-light)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--color-primary-500)" /> Choose Profile Picture
              </h3>
              <button 
                onClick={() => setShowAvatarModal(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Upload Custom File Section */}
            <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', border: '2px dashed var(--border-default)', backgroundColor: 'var(--bg-input)', textAlign: 'center' }}>
              <Upload size={28} color="var(--color-primary-500)" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Upload Photo from Device</p>
              <label 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--color-primary-600)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Browse File
                <input type="file" accept="image/*" onChange={handleCustomFileUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Presets Gallery */}
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Or Choose an Avatar Preset</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = (editForm.avatarUrl || profile.avatarUrl) === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setEditForm(prev => ({ ...prev, avatarUrl: preset.url }));
                      setProfile(prev => ({ ...prev, avatarUrl: preset.url }));
                      updateLocalUserAvatar(preset.url);
                    }}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      padding: '4px',
                      border: isSelected ? '3px solid var(--color-primary-500)' : '3px solid transparent',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto' }}
                    />
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--color-primary-500)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowAvatarModal(false)}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Done
              </button>
              <button 
                onClick={(e) => {
                  setShowAvatarModal(false);
                  handleSave(e);
                }}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Save Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Styles
const btnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' };
const infoBoxStyle = { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'transparent', padding: '20px', borderRadius: '12px', border: '1px solid var(--bg-card-hover)' };
const infoIconWrapperStyle = { backgroundColor: 'var(--color-primary-100)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const infoLabelStyle = { margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' };
const infoValueStyle = { margin: '0', color: 'var(--text-primary)', fontSize: '16px', fontWeight: '600' };
const labelStyle = { display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' };

export default Profile;
