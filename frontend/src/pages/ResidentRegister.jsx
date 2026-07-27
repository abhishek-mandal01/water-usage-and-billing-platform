import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowRight, UserCheck, Building2 } from 'lucide-react';
import logoImg from '../assets/water_usage_and_billing_logo.png';

const ResidentRegister = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({ token: token, name: '', email: '', householdNumber: '', phoneNumber: '', password: '', gender: '', dateOfBirth: '', governmentId: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviterDetails, setInviterDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:8081/api/invite/details/${token}`)
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            setError(text || 'Invalid invite link.');
          } else {
            const data = await res.json();
            setInviterDetails(data);
          }
        })
        .catch(() => setError('Failed to fetch invite details. Ensure backend is running.'));
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/invite-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Resident registration successful! Please login to access your dashboard.');
        navigate('/login');
      } else {
        const text = await response.text();
        setError(text || 'Registration failed. The invite link might be invalid or already used.');
      }
    } catch {
      setError('Server error. Ensure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      {/* Left Marketing Side */}
      <div style={leftSideStyle}>
        <div style={brandStyle}>
          <Building2 size={32} color="#2563eb" />
          <span style={{ fontSize: '24px', fontWeight: '800', color: '#111827', letterSpacing: '-1px' }}>SmartWater</span>
        </div>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '20px', transform: 'translateX(-30px)' }}>
          <img 
            src={logoImg} 
            alt="Smart Water Logo" 
            style={{ width: '130px', height: '130px', objectFit: 'contain' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <div style={{
              color: '#12365a',
              fontFamily: '"Trebuchet MS", "Arial Rounded MT Bold", sans-serif',
              fontSize: '48px',
              fontWeight: 800,
              letterSpacing: '-1px',
              whiteSpace: 'nowrap'
            }}>
              Smart <span style={{ color: '#159bd3' }}>Water</span>
            </div>
            <div style={{
              marginTop: '10px',
              color: '#58758c',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>
              Smarter Bills
            </div>
          </div>
        </div>

        <div style={marketingBottomStyle}>
          <h1 style={marketingTitleStyle}>
            Join your community to easily track water usage and payments
          </h1>
          <div style={featuresStyle}>
            <span>✨ Detailed Usage Insights</span>
            <span>✨ Seamless Online Payments</span>
            <span>✨ Real-time Alerts</span>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div style={rightSideStyle}>
        <div style={formWrapperStyle}>
          <div style={logoIconStyle}>
            <UserPlus size={32} color="#ffffff" />
          </div>
          <h2 style={titleStyle}>Resident Invite</h2>
          <p style={subtitleStyle}>Complete your profile to join your community</p>
          
          {error && (
            <div style={errorBannerStyle}>
              {error}
            </div>
          )}

          {inviterDetails && !error && (
            <div style={inviterBannerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ padding: '8px', backgroundColor: '#dbeafe', borderRadius: '50%' }}>
                  <UserCheck size={20} color="#2563eb" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>Invited by</p>
                  <p style={{ margin: 0, fontSize: '16px', color: '#111827', fontWeight: 700 }}>{inviterDetails.adminName}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', paddingLeft: '40px' }}>{inviterDetails.adminEmail}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
            
            <div>
              <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={inputStyle} />
            </div>

            <div>
              <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <input type="text" name="householdNumber" placeholder="Household / Flat # (e.g. A-101)" onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <select name="gender" onChange={handleChange} required style={{...inputStyle, color: formData.gender ? '#111827' : '#9ca3af'}}>
                  <option value="" disabled selected>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <input type="date" name="dateOfBirth" onChange={handleChange} required style={{...inputStyle, color: formData.dateOfBirth ? '#111827' : '#9ca3af'}} />
              </div>
            </div>

            <div>
              <input type="text" name="governmentId" placeholder="Government ID (e.g. Aadhar Number)" onChange={handleChange} required style={inputStyle} />
            </div>

            <div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Create a strong password" 
                  onChange={handleChange} 
                  required 
                  style={{ ...inputStyle, width: '100%', paddingRight: '45px' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeButtonStyle}
                >
                  {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </button>
              </div>
            </div>

            <button type="submit" style={btnStyle} disabled={loading || !!error}>
              {loading ? 'Joining...' : 'Join Community'}
              {!loading && <ArrowRight size={18} style={{ marginLeft: '8px' }} />}
            </button>
          </form>

          <p style={disclaimerStyle}>
            By continuing you agree to our <Link to="/privacy-policy" style={linkStyle}>privacy policy</Link> & <Link to="/terms-of-use" style={linkStyle}>terms of use</Link>.
          </p>

          <div style={partnerBannerStyle}>
            <span style={{ fontSize: '15px', color: '#374151', fontWeight: '500' }}>Already have an account?</span>
            <Link to="/login" style={{ fontSize: '15px', color: '#2563eb', textDecoration: 'none', fontWeight: '600', marginLeft: '6px' }}>
              Log in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  minHeight: '100vh',
  fontFamily: 'Inter, system-ui, sans-serif',
  backgroundColor: '#ffffff'
};

const leftSideStyle = {
  flex: '1.2',
  display: 'none', // Hide on mobile
  '@media (minWidth: 768px)': {
    display: 'flex'
  },
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '50px 60px',
  backgroundColor: '#ffffff'
};

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const marketingBottomStyle = {
  paddingBottom: '40px',
  maxWidth: '600px'
};

const marketingTitleStyle = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#065f46',
  marginBottom: '24px',
  lineHeight: '1.3',
  letterSpacing: '-0.5px'
};

const featuresStyle = {
  display: 'flex',
  gap: '24px',
  color: '#065f46',
  fontWeight: '600',
  fontSize: '14px',
  flexWrap: 'wrap'
};

const rightSideStyle = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '30px 40px',
  backgroundColor: '#ffffff',
  boxShadow: '-10px 0 30px rgba(0,0,0,0.03)',
  borderLeft: '1px solid #f3f4f6',
  position: 'relative'
};

const formWrapperStyle = {
  width: '100%',
  maxWidth: '460px',
  display: 'flex',
  flexDirection: 'column'
};

const logoIconStyle = {
  width: '56px',
  height: '56px',
  backgroundColor: '#2563eb',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px'
};

const titleStyle = {
  margin: '0 0 6px 0',
  fontSize: '28px',
  fontWeight: '700',
  color: '#111827',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  margin: 0,
  fontSize: '16px',
  color: '#4b5563'
};

const errorBannerStyle = {
  backgroundColor: '#fee2e2',
  color: '#991b1b',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  marginTop: '16px',
  borderLeft: '4px solid #ef4444'
};

const inviterBannerStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '16px',
  marginTop: '20px',
  marginBottom: '8px'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '15px',
  backgroundColor: '#f9fafb',
  color: '#111827',
  outline: 'none',
  boxSizing: 'border-box'
};

const eyeButtonStyle = {
  position: 'absolute',
  right: '12px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const btnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '14px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#eff6ff',
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

const disclaimerStyle = {
  fontSize: '13px',
  color: '#6b7280',
  lineHeight: '1.5',
  marginTop: '20px',
  marginBottom: '20px'
};

const linkStyle = {
  color: '#2563eb',
  textDecoration: 'none'
};

const partnerBannerStyle = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center'
};

export default ResidentRegister;
