import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowRight, UserCheck,  } from 'lucide-react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import AuthSidePanel from '../components/AuthSidePanel';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import { WaterBackground } from '../components/WaterBackground';

const ResidentRegister = () => {
  
  const { token } = useParams();
  const { theme } = useTheme();
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
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', fontFamily: 'var(--font-family)', overflowX: 'hidden' }}>
      <WaterBackground darkMode={theme === 'dark'} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* ═•═ TOP NAVBAR STRIP (Identical to Landing.jsx) ═•═ */}
        <nav style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0 5%',
          margin: 0,
          width: '100%',
          backgroundColor: theme === 'dark' ? 'rgba(10, 17, 35, 0.92)' : 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 0,
          borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(37, 99, 235, 0.12)',
          boxShadow: theme === 'dark' 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(37, 99, 235, 0.06)',
          zIndex: 10000,
          height: '68px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BrandLogo style={{ borderBottom: 'none', padding: 0, margin: 0 }} logoSize={60} textSize="19px" subTextSize="8.5px" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginLeft: 'auto' }}>
            <div className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <Link to="/" style={{ padding: '8px 14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>Home</Link>
              <a href="/#features" style={{ padding: '8px 14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>Features</a>
              <Link to="/pricing" style={{ padding: '8px 14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>Pricing</Link>
              <Link to="/about" style={{ padding: '8px 14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>About Us</Link>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <ThemeToggle />
              <LanguageSelector />
              <Link 
                to="/login" 
                className="auth-nav-cta"
                style={{ 
                  textDecoration: 'none', 
                  padding: '8px 18px', 
                  borderRadius: 'var(--radius-full)', 
                  border: '1px solid var(--color-primary-300)',
                  background: 'rgba(37, 99, 235, 0.05)', 
                  color: 'var(--color-primary-600)', 
                  fontSize: '13px', 
                  fontWeight: '700',
                  transition: 'all 0.2s ease'
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </nav>

        <div className="auth-main" style={{ padding: '60px 4% 10px 4%', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-10px)' }}>
          <AuthSidePanel variant="resident" />
          {/* Right Form Side */}
          <div className="auth-right" style={{ marginTop: 0 }}>
            <div 
              className="auth-form-wrapper" 
              style={{ 
                maxWidth: '560px', 
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(37, 99, 235, 0.15)',
                boxShadow: theme === 'dark' 
                  ? '0 20px 50px rgba(0, 0, 0, 0.5)' 
                  : '0 20px 50px rgba(37, 99, 235, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)',
                padding: '18px 24px',
                marginTop: 0
              }}
            >
            <div style={{ width: '42px', height: '42px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)' }}>
              <UserPlus size={22} color="#ffffff" />
            </div>
            <h2 style={{ margin: '0 0 2px 0', fontSize: '1.4rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Resident Invite</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Complete your profile to join your community</p>
            
            {error && (
              <div className="alert alert-danger" style={{ marginTop: '8px', padding: '6px 10px', fontSize: '12px' }}>
                {error}
              </div>
            )}

            {inviterDetails && !error && (
              <div style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 12px', marginTop: '8px', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ padding: '4px', backgroundColor: 'var(--color-primary-100)', borderRadius: '50%' }}>
                    <UserCheck size={16} color="var(--color-primary-600)" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Invited by <strong style={{ color: 'var(--text-primary)' }}>{inviterDetails.adminName}</strong> ({inviterDetails.adminEmail})</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="form-input" style={{ padding: '8px 12px', fontSize: '12.5px', borderRadius: '10px' }} />
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="form-input" style={{ padding: '8px 12px', fontSize: '12.5px', borderRadius: '10px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input type="text" name="householdNumber" placeholder="Flat # (e.g. A-101)" onChange={handleChange} required className="form-input" style={{ padding: '8px 12px', fontSize: '12.5px', borderRadius: '10px' }} />
                <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="form-input" style={{ padding: '8px 12px', fontSize: '12.5px', borderRadius: '10px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <select name="gender" onChange={handleChange} required className="form-input" style={{ padding: '8px 12px', fontSize: '12.5px', borderRadius: '10px' }}>
                  <option value="" disabled selected>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <input type="date" name="dateOfBirth" onChange={handleChange} required className="form-input" style={{ padding: '8px 12px', fontSize: '12.5px', borderRadius: '10px' }} />
              </div>

              <input type="text" name="governmentId" placeholder="Govt ID (e.g. Aadhar)" onChange={handleChange} required className="form-input" style={{ padding: '8px 12px', fontSize: '12.5px', borderRadius: '10px' }} />

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Create a strong password" 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                  style={{ width: '100%', paddingRight: '45px', padding: '8px 12px', fontSize: '12.5px', borderRadius: '10px' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} color="var(--text-tertiary)" /> : <Eye size={16} color="var(--text-tertiary)" />}
                </button>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '9px 18px', borderRadius: '10px', fontSize: '13.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={loading || !!error}>
                {loading ? 'Joining...' : 'Join Community'}
                {!loading && <ArrowRight size={16} style={{ marginLeft: '6px' }} />}
              </button>
            </form>

            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: '1.3', marginTop: '6px', marginBottom: '6px' }}>
              By continuing you agree to our <Link to="/privacy-policy" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>privacy policy</Link> & <Link to="/terms-of-use" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>terms of use</Link>.
            </p>

            <div style={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'var(--bg-input)', border: '1px solid var(--border-light)', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>Already have an account?</span>
              <Link to="/login" style={{ fontSize: '11.5px', color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-bold)', marginLeft: '6px' }}>
                Sign in →
              </Link>
            </div>
            </div>
          </div>
        </div>

        {/* Footer (Identical to Landing.jsx) */}
        <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', padding: '12px 5%', backgroundColor: theme === 'dark' ? 'rgba(10, 17, 35, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 'var(--font-medium)' }}>
            <div>© {new Date().getFullYear()} Smart Water Telemetry Platform. All rights reserved.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Built for Sustainable Smart Cities</span> 💧
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ResidentRegister;

