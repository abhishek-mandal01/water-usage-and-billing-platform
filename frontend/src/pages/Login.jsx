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
  const [formData, setFormData] = useState(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    return { email: rememberedEmail || '', password: '', remember: !!rememberedEmail };
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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

        if (formData.remember) {
          localStorage.setItem('rememberedEmail', formData.email.trim());
        } else {
          localStorage.removeItem('rememberedEmail');
        }

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
                to="/register" 
                className="auth-nav-cta"
                style={{ 
                  textDecoration: 'none', 
                  padding: '8px 18px', 
                  borderRadius: 'var(--radius-full)', 
                  background: 'var(--gradient-primary)', 
                  color: '#ffffff', 
                  fontSize: '13px', 
                  fontWeight: '700',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                Register Society
              </Link>
            </div>
          </div>
        </nav>

        {/* Right Form Side */}
        <div className="auth-main" style={{ padding: '60px 4% 10px 4%', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-10px)' }}>
          <AuthSidePanel variant="login" />
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
                padding: '22px 26px',
                marginTop: 0
              }}
            >
              <div style={{ width: '44px', height: '44px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)' }}>
                <Droplets size={24} color="#ffffff" />
              </div>
              <h2 style={{ margin: '0 0 2px 0', fontSize: '1.6rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{t('auth.login')}</h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{t('login.subtitle')}</p>
              


              {error && (
                <div className="alert alert-danger" style={{ marginTop: '10px', padding: '8px 12px', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                <div>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    placeholder="name@example.com" 
                    onChange={handleChange} 
                    required 
                    className="form-input"
                    style={{ padding: '10px 14px', fontSize: '13.5px', borderRadius: '12px' }}
                    autoComplete="email"
                  />
                </div>
                
                <div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      value={formData.password}
                      placeholder={t('auth.password')} 
                      onChange={handleChange} 
                      required 
                      className="form-input"
                      style={{ width: '100%', paddingRight: '45px', padding: '10px 14px', fontSize: '13.5px', borderRadius: '12px' }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} color="var(--text-tertiary)" /> : <Eye size={18} color="var(--text-tertiary)" />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'var(--font-medium)' }}>
                      <input 
                        type="checkbox" 
                        name="remember" 
                        checked={formData.remember} 
                        onChange={handleChange}
                        style={{ accentColor: 'var(--color-primary-600)', width: '14px', height: '14px', margin: 0, cursor: 'pointer' }}
                      />
                      {t('login.rememberMe', 'Remember me')}
                    </label>
                    <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-semibold)' }}>{t('login.forgot')}</Link>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '11px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '700' }}>
                  {loading ? t('login.signingIn') : t('auth.login')}
                </button>
              </form>

              <p style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', lineHeight: '1.4', marginTop: '10px', marginBottom: '10px' }}>
                {t('login.agreeText1')}<Link to="/privacy-policy" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>{t('login.privacyPolicy')}</Link>{t('login.agreeText2')}<Link to="/terms-of-use" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>{t('login.termsOfUse')}</Link>{t('login.agreeText3')}
              </p>

              <div style={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'var(--bg-input)', border: '1px solid var(--border-light)', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>{t('login.noAccount')}</span>
                <Link to="/register" style={{ fontSize: '12px', color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 'var(--font-bold)', marginLeft: '6px' }}>
                  {t('login.registerComm')} →
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

export default Login;

