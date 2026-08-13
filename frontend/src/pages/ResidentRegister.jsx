import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowRight, UserCheck, Building2 } from 'lucide-react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import AuthSidePanel from '../components/AuthSidePanel';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import { WaterBackground } from '../components/WaterBackground';

const ResidentRegister = () => {
  const { t } = useTranslation();
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
    <div className="auth-container">
      <WaterBackground darkMode={theme === 'dark'} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar Strip */}
      <nav style={{ 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 var(--space-6)',
        margin: 'var(--space-6) 5%',
        backgroundColor: theme === 'dark' ? 'var(--bg-card)' : 'var(--color-primary-50)', 
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-card)',
        zIndex: 100,
        minHeight: '76px'
      }}>
        <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center', display: 'flex', alignItems: 'center' }}>
          <BrandLogo style={{ borderBottom: 'none', padding: 0, margin: 0 }} />
        </div>
        
        {/* Center Links (hidden on mobile) */}
        <div className="landing-nav-links" style={{ display: 'flex', gap: 'var(--space-8)', position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
           <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
           <a href="/#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
           <Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
           <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </nav>

      <div className="auth-main">
        <AuthSidePanel variant="resident" />
        {/* Right Form Side */}
        <div className="auth-right" style={{ marginTop: 'var(--space-1)' }}>
          <div className="auth-form-wrapper" style={{ maxWidth: '560px', marginTop: 'var(--space-2)' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
            <UserPlus size={32} color="var(--bg-card)" />
          </div>
          <h2 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Resident Invite</h2>
          <p style={{ margin: 0, fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>Complete your profile to join your community</p>
          
          {error && (
            <div className="alert alert-danger" style={{ marginTop: 'var(--space-6)' }}>
              {error}
            </div>
          )}

          {inviterDetails && !error && (
            <div style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', marginTop: 'var(--space-6)', marginBottom: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <div style={{ padding: 'var(--space-2)', backgroundColor: 'var(--color-primary-100)', borderRadius: '50%' }}>
                  <UserCheck size={20} color="var(--color-primary-600)" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>Invited by</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>{inviterDetails.adminName}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', paddingLeft: '40px' }}>{inviterDetails.adminEmail}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', marginTop: 'var(--space-6)' }}>
            
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="form-input" style={{ padding: 'var(--space-4) var(--space-5)' }} />

            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="form-input" style={{ padding: 'var(--space-4) var(--space-5)' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <input type="text" name="householdNumber" placeholder="Flat # (e.g. A-101)" onChange={handleChange} required className="form-input" style={{ padding: 'var(--space-4) var(--space-5)' }} />
              <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="form-input" style={{ padding: 'var(--space-4) var(--space-5)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <select name="gender" onChange={handleChange} required className="form-input" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                <option value="" disabled selected>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <input type="date" name="dateOfBirth" onChange={handleChange} required className="form-input" style={{ padding: 'var(--space-4) var(--space-5)' }} />
            </div>

            <input type="text" name="governmentId" placeholder="Govt ID (e.g. Aadhar)" onChange={handleChange} required className="form-input" style={{ padding: 'var(--space-4) var(--space-5)' }} />

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Create a strong password" 
                onChange={handleChange} 
                required 
                className="form-input"
                style={{ width: '100%', paddingRight: '45px', padding: 'var(--space-4) var(--space-5)' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={20} color="var(--text-tertiary)" /> : <Eye size={20} color="var(--text-tertiary)" />}
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-base)' }} disabled={loading || !!error}>
              {loading ? 'Joining...' : 'Join Community'}
              {!loading && <ArrowRight size={18} style={{ marginLeft: 'var(--space-2)' }} />}
            </button>
          </form>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', lineHeight: '1.5', marginTop: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            By continuing you agree to our <Link to="/privacy-policy" style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}>privacy policy</Link> & <Link to="/terms-of-use" style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}>terms of use</Link>.
          </p>

          <div style={{ backgroundColor: 'var(--bg-body)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>Already have an account?</span>
            <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-semibold)', marginLeft: 'var(--space-2)' }}>
              Log in →
            </Link>
          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ResidentRegister;
