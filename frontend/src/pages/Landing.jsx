import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { WaterBackground } from '../components/WaterBackground';
import { Droplets, BarChart3, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const CountUp = ({ end, decimals = 0, suffix = '', prefix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(end * easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{prefix}{count.toFixed(decimals)}{suffix}</span>;
};

function Landing() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const features = [
    { icon: <Droplets size={28} />, title: 'Smart Metering', desc: 'Real-time water consumption tracking with automated meter readings and leak detection alerts.' },
    { icon: <BarChart3 size={28} />, title: 'Automated Billing', desc: 'Tiered pricing, cycle management, and instant invoice generation with Razorpay integration.' },
    { icon: <Shield size={28} />, title: 'Multi-Tenant', desc: 'Manage multiple apartment communities from a single platform with role-based access controls.' },
    { icon: <Zap size={28} />, title: 'Conservation AI', desc: 'Peer benchmarking, usage anomaly detection, and personalized water-saving recommendations.' },
  ];

  const stats = [
    { end: 99.4, decimals: 1, suffix: '%', label: 'Uptime' },
    { end: 50, decimals: 0, suffix: 'K+', label: 'Households' },
    { end: 12, decimals: 0, suffix: 'M L', label: 'Water Saved' },
    { end: 4.9, decimals: 1, suffix: '★', label: 'User Rating' },
  ];

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
           <Link to="/" style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}>Home</Link>
           <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
           <Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
           <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <ThemeToggle />
          <LanguageSelector />
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-xl)', padding: '8px 20px', display: 'none' }}>{t('landing.logIn')}</Link>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-xl)', padding: '8px 24px' }}>{t('landing.register')}</Link>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="landing-hero">
        <div className="landing-hero-left">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-5)', boxShadow: 'var(--shadow-xs)' }}>
            <Droplets size={16} /> Platform v2.0
          </div>

          <h1 className="landing-hero-title">
            {t('landing.title1')} <br />
            <span style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'var(--gradient-primary)' }}>{t('landing.title2')}</span>
          </h1>

          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: 'var(--space-8)', maxWidth: '92%', fontWeight: 'var(--font-medium)' }}>
            {t('landing.subtitle')}
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-10)' }}>
            <Link to="/login" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
              {t('landing.logIn')} <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              {t('landing.registerCommunity')}
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
            {['No credit card required', 'Free trial', 'Setup in 5 min'].map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-medium)' }}>
                <CheckCircle size={14} style={{ color: 'var(--color-success-500)' }} /> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Clay Card Stack */}
        <div className="landing-hero-right">
          <div style={{ position: 'relative', width: '420px', maxWidth: '100%', animation: 'gentle-float 6s ease-in-out infinite' }}>
            {/* Main hero clay card */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-xl)', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-inverse)', boxShadow: 'var(--shadow-btn)' }}>
                  <Droplets size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 'var(--font-extrabold)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>Smart Platform</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-semibold)' }}>Live Dashboard Preview</div>
                </div>
              </div>

              {/* Added a feature alert */}
              <div style={{ background: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-700)' }}>
                <Zap size={14} /> AI Alert: Leak detected in Unit A-402
              </div>
              
              {/* Mini stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', boxShadow: 'var(--shadow-inset)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today&apos;s Usage</div>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-primary-500)' }}>142 L</div>
                </div>
                <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', boxShadow: 'var(--shadow-inset)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Bill</div>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-success-500)' }}>₹280</div>
                </div>
              </div>

              {/* Mini bar chart visual */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px', marginBottom: 'var(--space-3)' }}>
                {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '6px 6px 3px 3px', background: i === 3 ? 'var(--gradient-primary)' : 'var(--color-primary-100)', boxShadow: i === 3 ? 'var(--shadow-xs)' : 'none', transition: 'height 0.3s ease' }} />
                ))}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'var(--font-semibold)' }}>Weekly consumption trend</div>
            </div>

            {/* Floating badge */}
            <div style={{ position: 'absolute', top: '-16px', right: '-16px', background: 'var(--color-success-50)', color: 'var(--color-success-700)', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', boxShadow: 'var(--shadow-md)', zIndex: 3, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> All bills paid
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 5%', marginBottom: 'var(--space-16)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)', maxWidth: '900px', margin: '0 auto' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5) var(--space-4)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-primary-500)', lineHeight: 1 }}>
                <CountUp end={s.end} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-semibold)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" style={{ position: 'relative', zIndex: 10, padding: '0 5% var(--space-16)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>Everything you need to manage water</h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontWeight: 'var(--font-medium)' }}>A complete platform for apartment water management, billing automation, and conservation tracking.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)', maxWidth: '1100px', margin: '0 auto' }} className="features-grid">
          {features.map((f, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-card)', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', cursor: 'default' }} 
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-600)', marginBottom: 'var(--space-4)', boxShadow: 'var(--shadow-sm)' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }}>{f.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, fontWeight: 'var(--font-medium)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 5% var(--space-16)' }}>
        <div style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-12) var(--space-10)', textAlign: 'center', boxShadow: '0 20px 40px rgba(90, 125, 224, 0.4)', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--text-inverse)', margin: '0 0 var(--space-4) 0' }}>Ready to transform your water management?</h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-8)', fontWeight: 'var(--font-medium)' }}>Join thousands of communities already saving water and reducing costs.</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', boxShadow: 'var(--shadow-btn)' }}>{t('landing.registerCommunity')}</Link>
            <Link to="/login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--text-inverse)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: 'none' }}>{t('landing.logIn')} →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)', fontSize: 'var(--text-base)', marginTop: 'auto', zIndex: 10, fontWeight: 'var(--font-medium)' }}>
        {t('landing.footer')}
      </footer>

      {/* Responsive overrides and animations */}
      <style>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .landing-hero {
          position: relative;
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          gap: 60px;
          flex-wrap: wrap;
          z-index: 10;
          margin-bottom: var(--space-16);
        }
        .landing-hero-left {
          flex: 1 1 50%;
          max-width: 600px;
          padding-bottom: 40px;
        }
        .landing-hero-title {
          font-size: 3.8rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.08;
          margin: 0 0 24px 0;
          letter-spacing: -0.03em;
        }
        .landing-hero-right {
          flex: 1 1 40%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 1024px) {
          .landing-hero-title { font-size: 2.8rem; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .landing-nav-links { display: none !important; }
          .landing-hero {
            flex-direction: column;
            text-align: center;
            padding: var(--space-6) 5%;
          }
          .landing-hero-left {
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .landing-hero-title { font-size: 2.2rem; }
          .landing-hero-right > div { width: 320px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      </div>
    </div>
  );
}

export default Landing;
