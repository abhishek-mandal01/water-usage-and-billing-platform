import { Link } from 'react-router-dom';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { WaterBackground } from '../components/WaterBackground';

function AboutUs() {
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BrandLogo style={{ borderBottom: 'none', padding: 0, margin: 0 }} logoSize={85} textSize="23px" subTextSize="10px" />
          </div>
          
          {/* Center Links (hidden on mobile) */}
          <div className="landing-nav-links" style={{ display: 'flex', gap: 'var(--space-8)', position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontFamily: "'Poppins', sans-serif" }}>
             <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
             <a href="/#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
             <Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
             <Link to="/about" style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}>About Us</Link>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </nav>

        {/* Premium Content Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-4) 5% var(--space-12) 5%', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Water Management, <br />
              <span style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'var(--gradient-primary)' }}>Reimagined.</span>
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontWeight: 'var(--font-medium)' }}>
              Water Usage & Billing Platform is a modern, unified solution designed to bring transparency, accountability, and conservation to apartment communities worldwide.
            </p>
          </div>

          {/* Value Props Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', width: '100%', marginBottom: 'var(--space-12)' }}>
            
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-card)', borderTop: '4px solid var(--color-primary-500)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: 'var(--text-sm)' }}>
                Replace manual readings and estimations with precise smart metering. We automate complex multi-tier billing processes to save community admins hours of work.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-card)', borderTop: '4px solid var(--color-success-500)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>Intelligent Insights</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: 'var(--text-sm)' }}>
                Leverage our built-in AI analytics to monitor household consumption trends, detect anomalous usage, and receive proactive leak alerts before disasters happen.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-card)', borderTop: '4px solid var(--color-warning-500)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>Robust & Scalable</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: 'var(--text-sm)' }}>
                Built with a cutting-edge claymorphic design and highly scalable infrastructure, ensuring data privacy and top-tier security for your community's financial reports.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-card)', borderTop: '4px solid var(--color-accent-500)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>Community First</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: 'var(--text-sm)' }}>
                Empowering residents with transparent billing and seamless communication to foster a water-conscious culture within your entire apartment complex.
              </p>
            </div>

          </div>

          {/* Contact Us Card */}
          <div style={{ background: 'var(--gradient-primary-subtle)', borderRadius: 'var(--radius-3xl)', padding: 'var(--space-10)', boxShadow: 'var(--shadow-xl)', width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-800)', marginBottom: 'var(--space-3)' }}>Have a question? Contact Us!</h2>
              <p style={{ color: 'var(--color-primary-700)', marginBottom: 'var(--space-6)', maxWidth: '500px', margin: '0 auto var(--space-6)', fontWeight: 'var(--font-medium)' }}>
                Whether you need a custom enterprise solution, technical support, or just want to say hi, our team is always here to help.
              </p>
              
              <a href="mailto:18mandalabhishek@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--gradient-primary)', color: 'var(--text-inverse)', padding: '12px 32px', borderRadius: 'var(--radius-full)', fontWeight: 'var(--font-bold)', textDecoration: 'none', boxShadow: 'var(--shadow-btn)', fontSize: 'var(--text-base)', transition: 'transform 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Send us an email
              </a>
            </div>
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

export default AboutUs;

