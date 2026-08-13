import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import { Eye, EyeOff, Droplets } from 'lucide-react';
import AuthSidePanel from '../components/AuthSidePanel';
import LanguageSelector from '../components/LanguageSelector';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import { WaterBackground } from '../components/WaterBackground';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password
      };

      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const userData = await response.json();
        
        localStorage.setItem('user', JSON.stringify(userData));

        if (userData.role === 'MAIN_ADMIN') {
          navigate('/main-admin-panel');
        } else if (userData.role === 'COMMUNITY_ADMIN' || userData.role === 'ADMIN') {
          navigate('/admin-panel');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
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

      {/* Right Form Side */}
      <div className="auth-main">
        <AuthSidePanel variant="login" />
        <div className="auth-right" style={{ marginTop: 'var(--space-1)' }}>
          <div className="auth-form-wrapper" style={{ marginTop: 'var(--space-2)' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
            <Droplets size={32} color="var(--bg-card)" />
          </div>
          <h2 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{t('auth.login')}</h2>
          <p style={{ margin: 0, fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>{t('login.subtitle')}</p>
          
          {error && (
            <div className="alert alert-danger" style={{ marginTop: 'var(--space-6)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="name@example.com" 
                onChange={handleChange} 
                required 
                className="form-input"
                style={{ padding: 'var(--space-4) var(--space-5)' }}
                autoComplete="email"
              />
            </div>
            
            <div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder={t('auth.password')} 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                  style={{ width: '100%', paddingRight: '45px', padding: 'var(--space-4) var(--space-5)' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} color="var(--text-tertiary)" /> : <Eye size={20} color="var(--text-tertiary)" />}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
                <Link to="/forgot-password" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>{t('login.forgot')}</Link>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? t('login.signingIn') : t('auth.login')}
            </button>
          </form>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', lineHeight: '1.6', marginTop: 'var(--space-7)', marginBottom: 'var(--space-7)' }}>
            {t('login.agreeText1')}<Link to="/privacy-policy" style={{ color: 'var(--text-link)', textDecoration: 'none' }}>{t('login.privacyPolicy')}</Link>{t('login.agreeText2')}<Link to="/terms-of-use" style={{ color: 'var(--text-link)', textDecoration: 'none' }}>{t('login.termsOfUse')}</Link>{t('login.agreeText3')}
          </p>

          <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>{t('login.noAccount')}</span>
            <Link to="/register" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-link)', textDecoration: 'none', fontWeight: 'var(--font-semibold)', marginLeft: 'var(--space-2)' }}>
              {t('login.registerComm')}
            </Link>
          </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ position: 'relative', textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)', fontSize: 'var(--text-base)', marginTop: 'auto', zIndex: 10, fontWeight: 'var(--font-medium)' }}>
        {t('landing.footer')}
      </footer>
      </div>
    </div>
  );
};

export default Login;
