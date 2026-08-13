import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Droplets } from 'lucide-react';
import AuthSidePanel from '../components/AuthSidePanel';
import LanguageSelector from '../components/LanguageSelector';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import { WaterBackground } from '../components/WaterBackground';
import { useTranslation } from '../components/LanguageSelector/useTranslation';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:8081/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      
      if (res.ok) {
        setSuccess(true);
      } else {
        const text = await res.text();
        setError(text || 'Failed to send reset link');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <WaterBackground darkMode={theme === 'dark'} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
      
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
        
        <div className="landing-nav-links" style={{ display: 'flex', gap: 'var(--space-8)', position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
           <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
           <Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
           <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </nav>

      <div className="auth-main">
        <AuthSidePanel variant="login" />
        <div className="auth-right" style={{ marginTop: 'var(--space-1)' }}>
          <div className="auth-form-wrapper" style={{ marginTop: 'var(--space-2)' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
            <Mail size={32} color="var(--bg-card)" />
          </div>
          <h2 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Reset Password</h2>
          <p style={{ margin: 0, fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>Enter your email to receive a password reset link.</p>
          
          {error && (
            <div className="alert alert-danger" style={{ marginTop: 'var(--space-6)' }}>
              {error}
            </div>
          )}

          {success ? (
            <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
              <CheckCircle2 size={48} color="var(--color-success-500)" style={{ margin: '0 auto var(--space-4) auto' }} />
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Check Your Email</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <ArrowLeft size={18} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
              <div>
                <input 
                  type="email" 
                  value={email}
                  placeholder="name@example.com" 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="form-input"
                  style={{ padding: 'var(--space-4) var(--space-5)' }}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !email} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>Remembered your password?</span>
            <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-link)', textDecoration: 'none', fontWeight: 'var(--font-semibold)', marginLeft: 'var(--space-2)' }}>
              Log in here
            </Link>
          </div>
          </div>
        </div>
      </div>

      <footer style={{ position: 'relative', textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)', fontSize: 'var(--text-base)', marginTop: 'auto', zIndex: 10, fontWeight: 'var(--font-medium)' }}>
        {t('landing.footer')}
      </footer>
      </div>
    </div>
  );
};

export default ForgotPassword;
