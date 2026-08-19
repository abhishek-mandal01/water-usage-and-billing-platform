import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import AuthSidePanel from '../components/AuthSidePanel';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import { WaterBackground } from '../components/WaterBackground';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'ADMIN', gender: '', dateOfBirth: '', phoneNumber: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        setError('Registration failed. Email might already be in use.');
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
        
        {/* ═•═ TOP NAVBAR STRIP ═•═ */}
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
          {/* Logo */}
          <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center', display: 'flex', alignItems: 'center' }}>
            <BrandLogo style={{ borderBottom: 'none', padding: 0, margin: 0 }} />
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
          <AuthSidePanel variant="admin" />
          {/* Right Form Side */}
          <div className="auth-right" style={{ marginTop: 0 }}>
            <div 
              className="auth-form-wrapper" 
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(37, 99, 235, 0.15)',
                boxShadow: theme === 'dark' 
                  ? '0 20px 50px rgba(0, 0, 0, 0.5)' 
                  : '0 20px 50px rgba(37, 99, 235, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)',
                padding: '20px 24px',
                marginTop: 0
              }}
            >
            <div style={{ width: '44px', height: '44px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)' }}>
              <Building2 size={24} color="#ffffff" />
            </div>
            <h2 style={{ margin: '0 0 2px 0', fontSize: '1.5rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Register Community</h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Create your community admin account</p>
            
            {error && (
              <div className="alert alert-danger" style={{ marginTop: '10px', padding: '8px 12px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="form-input" style={{ padding: '9px 14px', fontSize: '13px', borderRadius: '10px' }} />
              <input type="email" name="email" placeholder="name@example.com" onChange={handleChange} required className="form-input" style={{ padding: '9px 14px', fontSize: '13px', borderRadius: '10px' }} autoComplete="email" />
              
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Create a password" 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                  style={{ width: '100%', paddingRight: '45px', padding: '9px 14px', fontSize: '13px', borderRadius: '10px' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} color="var(--text-tertiary)" /> : <Eye size={18} color="var(--text-tertiary)" />}
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <select name="gender" onChange={handleChange} required className="form-input" style={{ padding: '9px 14px', fontSize: '13px', borderRadius: '10px' }}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input type="date" name="dateOfBirth" onChange={handleChange} required className="form-input" style={{ padding: '9px 14px', fontSize: '13px', borderRadius: '10px' }} />
              </div>
              
              <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="form-input" style={{ padding: '9px 14px', fontSize: '13px', borderRadius: '10px' }} />

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' }}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: '1.3', marginTop: '8px', marginBottom: '8px' }}>
              By registering you agree to our <Link to="/privacy-policy" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>privacy policy</Link> & <Link to="/terms-of-use" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>terms of use</Link>.
            </p>

            <div style={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'var(--bg-input)', border: '1px solid var(--border-light)', padding: '8px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>Already have an account?</span>
              <Link to="/login" style={{ fontSize: '12px', color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-bold)', marginLeft: '6px' }}>
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

export default Register;

