import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { WaterBackground } from '../components/WaterBackground';
import { CheckCircle, Zap } from 'lucide-react';

function Pricing() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', fontFamily: 'var(--font-family)', overflowX: 'hidden' }}>
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
             <Link to="/pricing" style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}>Pricing</Link>
             <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </nav>

        {/* Content Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4) 5% var(--space-12) 5%', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)', letterSpacing: '-0.03em' }}>
              Simple, transparent <span style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'var(--gradient-primary)' }}>pricing</span>
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Designed for Community Admins to efficiently manage apartment water billing without hidden costs.
            </p>
          </div>
          
          {/* Pricing Card */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-3xl)', padding: 'var(--space-10)', boxShadow: 'var(--shadow-xl)', maxWidth: '450px', width: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-16px', right: '32px', background: 'var(--gradient-primary)', color: 'var(--text-inverse)', padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 'var(--font-bold)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={14} /> Most Popular
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Community Plan</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Everything you need for full apartment automation.</p>
            </div>
            
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 'var(--font-extrabold)', color: 'var(--color-primary-600)', letterSpacing: '-0.05em' }}>₹49</span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-medium)' }}> / household / month</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
              {['Automated smart meter reading', 'Multi-tier tariff generation', 'Razorpay payment collection', 'Leak detection AI alerts', 'Unlimited admin accounts'].map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle size={20} style={{ color: 'var(--color-success-500)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-base)' }}>{feature}</span>
                </div>
              ))}
            </div>

            <Link to="/register" style={{ display: 'block', width: '100%', padding: '16px', background: 'var(--gradient-primary)', color: 'var(--text-inverse)', textAlign: 'center', borderRadius: 'var(--radius-xl)', fontWeight: 'var(--font-bold)', textDecoration: 'none', boxShadow: 'var(--shadow-btn)', fontSize: 'var(--text-lg)' }}>
              Start 30-Day Free Trial
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer style={{ position: 'relative', textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)', fontSize: 'var(--text-base)', marginTop: 'auto', zIndex: 10, fontWeight: 'var(--font-medium)' }}>
        {t('landing.footer')}
      </footer>
      
      {/* Responsive styles matching landing page */}
      <style>{`
        @media (max-width: 768px) {
          .landing-nav-links { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Pricing;
