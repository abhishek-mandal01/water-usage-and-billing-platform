import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import { WaterBackground } from '../components/WaterBackground';

const PrivacyPolicy = () => {
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
             <Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
             <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </nav>

        {/* Content Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--space-4) 5%', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6) var(--space-12)', boxShadow: 'var(--shadow-xl)', borderTop: '4px solid var(--color-primary-500)' }}>

        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-6)' }}>
          {t('policy.title')}
        </h1>
        <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.6, marginBottom: 'var(--space-5)', color: 'var(--text-tertiary)' }}>
          {t('policy.lastUpdated')} {new Date().toLocaleDateString()}
        </p>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>{t('policy.h1')}</h2>
          <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {t('policy.p1')}
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>{t('policy.h2')}</h2>
          <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {t('policy.p2')}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>{t('policy.h3')}</h2>
          <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {t('policy.p3')}
          </p>
        </section>

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
};
export default PrivacyPolicy;
