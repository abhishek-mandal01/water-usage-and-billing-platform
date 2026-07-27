import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Droplets } from 'lucide-react';
import logoImg from '../assets/water_usage_and_billing_logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
      {/* Left Marketing Side */}
      <div className="auth-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Droplets size={32} color="var(--color-primary-600)" />
          <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', letterSpacing: '-1px' }}>SmartWater</span>
        </div>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-10) 0', gap: 'var(--space-5)', transform: 'translateX(-30px)' }}>
          <img 
            src={logoImg} 
            alt="Smart Water Logo" 
            style={{ width: '130px', height: '130px', objectFit: 'contain' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <div style={{ color: 'var(--text-primary)', fontFamily: '"Trebuchet MS", "Arial Rounded MT Bold", sans-serif', fontSize: '48px', fontWeight: 800, letterSpacing: '-1px', whiteSpace: 'nowrap' }}>
              Smart <span style={{ color: 'var(--color-primary-500)' }}>Water</span>
            </div>
            <div style={{ marginTop: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Smarter Bills
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: 'var(--space-10)', maxWidth: '600px' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent-700)', marginBottom: 'var(--space-6)', lineHeight: '1.3', letterSpacing: '-0.5px' }}>
            Join thousands of communities that trust SmartWater to manage their resources
          </h1>
          <div style={{ display: 'flex', gap: 'var(--space-6)', color: 'var(--color-accent-700)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', flexWrap: 'wrap' }}>
            <span>✨ Transparent Billing</span>
            <span>✨ Easy Integration</span>
            <span>✨ Powerful Dashboard</span>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div style={{ width: '56px', height: '56px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
            <Droplets size={32} color="#ffffff" />
          </div>
          <h2 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Welcome to SmartWater</h2>
          <p style={{ margin: 0, fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>Sign in with your email address</p>
          
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
                  placeholder="Enter your password" 
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
                <Link to="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 'var(--font-medium)' }}>Forgot password?</Link>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', lineHeight: '1.6', marginTop: 'var(--space-7)', marginBottom: 'var(--space-7)' }}>
            By continuing you agree to our <Link to="/privacy-policy" style={{ color: 'var(--text-link)', textDecoration: 'none' }}>privacy policy</Link> & <Link to="/terms-of-use" style={{ color: 'var(--text-link)', textDecoration: 'none' }}>terms of use</Link>.
          </p>

          <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>Don't have an account?</span>
            <Link to="/register" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-link)', textDecoration: 'none', fontWeight: 'var(--font-semibold)', marginLeft: 'var(--space-2)' }}>
              Register Community →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .auth-container {
          display: flex;
          min-height: 100vh;
          font-family: var(--font-family);
          background-color: var(--bg-card);
        }
        .auth-left {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 50px 60px;
          background-color: var(--bg-card);
        }
        .auth-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 40px;
          background-color: var(--bg-card);
          box-shadow: -10px 0 30px rgba(0,0,0,0.03);
          border-left: 1px solid var(--border-light);
          position: relative;
        }
        .auth-form-wrapper {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 1024px) {
          .auth-left { display: none; }
          .auth-right {
            flex: 1;
            border-left: none;
            box-shadow: none;
          }
        }
        @media (max-width: 768px) {
          .auth-right { padding: var(--space-6) var(--space-5); }
        }
      `}</style>
    </div>
  );
};

export default Login;
