import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from '../components/BrandLogo';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { WaterBackground } from '../components/WaterBackground';
import { 
  Droplets, BarChart3, Shield, Zap,
  Sparkles, Users, Building2, TrendingDown, 
  HelpCircle, ChevronRight, Calculator, Check, ExternalLink
} from 'lucide-react';

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

  // Interactive page states
  const [heroMode, setHeroMode] = useState('eco'); // 'eco', 'leak', 'tariff'
  const [activeTab, setActiveTab] = useState('resident');
  const [householdCount, setHouseholdCount] = useState(120);
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);


  // Real-time Telemetry Stream Simulation for dynamic visual animation
  const [liveFlowRate, setLiveFlowRate] = useState(2.4);
  const [activePulseIndex, setActivePulseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveFlowRate(() => parseFloat((2.1 + Math.random() * 0.6).toFixed(1)));
      setActivePulseIndex((prev) => (prev + 1) % 10);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Scroll Spy: Update active header tab when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'faq', 'about'];
      const scrollPos = window.scrollY + 130;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollPos) {
          // Handle scroll spy if needed
          // activeNav was removed as it's not used in old nav
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);  // Calculations for savings estimator
  const annualWaterSavedLiters = householdCount * 365 * 45;
  const annualMoneySaved = Math.round(annualWaterSavedLiters * 0.08);
  const carbonOffsetKg = Math.round(annualWaterSavedLiters * 0.0004);

  const features = [
    { 
      icon: <Droplets size={26} />, 
      title: 'Smart Sub-Metering', 
      desc: 'Digital flow intake monitoring per flat with continuous usage logging and instant anomaly warnings.',
      badge: 'Real-time Telemetry'
    },
    { 
      icon: <BarChart3 size={26} />, 
      title: 'Automated Tiered Billing', 
      desc: 'Fair slab-rate billing engine, automated monthly invoice generation, and online payment integration.',
      badge: 'Zero Manual Work'
    },
    { 
      icon: <Shield size={26} />, 
      title: 'Multi-Tenant Governance', 
      desc: 'Centralized admin controls for multiple blocks, meter battery monitoring, and flat profile pairing.',
      badge: 'Scalable Architecture'
    },
    { 
      icon: <Zap size={26} />, 
      title: 'Conservation AI Engine', 
      desc: 'Peer benchmarking, instant leak alerts, and behavioral insights that reduce society water bills.',
      badge: 'AI Conservation'
    },
  ];

  const stats = [
    { end: 99.4, decimals: 1, suffix: '%', label: 'Platform Uptime' },
    { end: 50, decimals: 0, suffix: 'K+', label: 'Connected Households' },
    { end: 12, decimals: 0, suffix: 'M L', label: 'Water Saved Annually' },
    { end: 4.9, decimals: 1, suffix: '★', label: 'User Satisfaction' },
  ];

  const portalDemos = {
    resident: {
      title: 'Resident Portal Experience',
      subtitle: 'Empower households with live intake tracking, leak warnings, and itemized online billing.',
      badge: 'Resident View',
      highlights: [
        'Live daily water usage graphs & projected monthly bill',
        'Peer benchmarking (Compare usage vs society flat average)',
        'Instant leak detection alerts & inline ticket reporting',
        'Transparent slab-based itemized bills with online payment',
        'Water conservation challenges & eco rank badges'
      ],
      previewStats: [
        { label: "Today's Intake", value: '142 L', color: 'var(--color-primary-600)' },
        { label: 'Current Bill', value: '₹340.50', color: 'var(--color-success-600)' },
        { label: 'Eco Saver Rank', value: 'Top 15%', color: 'var(--color-warning-600)' }
      ]
    },
    admin: {
      title: 'Community Admin Portal',
      subtitle: 'Complete society-wide water governance, automated batch billing, and tanker procurement.',
      badge: 'Admin View',
      highlights: [
        'Macro dashboard for block-by-block consumption trends',
        'One-click automated batch billing for all society flats',
        'Smart meter pairing, battery health & telemetry logs',
        'Bulk water tanker purchasing & automatic cost splitting',
        'Audit-ready PDF and CSV financial & usage exports'
      ],
      previewStats: [
        { label: 'Total Households', value: '128 Flats', color: 'var(--color-primary-600)' },
        { label: 'Cycle Intake', value: '45.2 kL', color: 'var(--color-info-600)' },
        { label: 'Collection Rate', value: '96.4%', color: 'var(--color-success-600)' }
      ]
    }
  };

  const faqs = [
    { q: 'How does sub-metering save water in apartments?', a: 'By shifting from flat-rate billing to pay-as-you-use sub-metering, residents become aware of their usage patterns, reducing society water waste by 25% to 40% on average.' },
    { q: 'Can Smart Water integrate with existing smart meters?', a: 'Yes! Smart Water seamlessly supports standard digital pulse meters, Ultrasonic AMR/AMI smart meters, and cloud IoT telemetry ingestion.' },
    { q: 'How does automated leak detection work?', a: 'Our engine continuously monitors flow readings during overnight hours (2 AM - 5 AM). Non-zero continuous flow triggers instant alerts for residents and admins.' },
    { q: 'What happens when a society purchases bulk water tankers?', a: 'Admins log tanker orders in the Tankers tab. Smart Water automatically calculates vendor charges and splits the cost across flat bills according to usage or flat rate rules.' }
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
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-xl)', padding: '8px 20px' }}>{t('landing.logIn')}</Link>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-xl)', padding: '8px 24px' }}>{t('landing.register')}</Link>
        </div>
      </nav>

        {/* ═══ HERO SECTION ═══ */}
        <section id="hero" className="landing-hero" style={{ padding: 'var(--space-6) 5% var(--space-8)' }}>
          
          {/* Hero Left Column: Title + Animated SVG Illustration */}
          <div className="landing-hero-left">
            {/* Main Hero Headline */}
            <h1 
              className="landing-hero-title" 
              style={{ 
                fontSize: '3.4rem', 
                fontWeight: '900',
                lineHeight: '1.12',
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-3)',
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
              }}
            >
              Smart Water Management & <br />
              <span style={{ 
                color: 'transparent', 
                backgroundClip: 'text', 
                WebkitBackgroundClip: 'text', 
                backgroundImage: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #3b82f6 100%)'
              }}>
                Billing Platform
              </span>
            </h1>

            {/* Sub Pill Badge below title */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '4px 14px', 
              borderRadius: 'var(--radius-full)', 
              background: theme === 'dark' ? 'rgba(59, 130, 246, 0.18)' : 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', 
              color: 'var(--color-primary-700)', 
              fontSize: '11px', 
              fontWeight: '800', 
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-4)', 
              border: '1px solid rgba(59, 130, 246, 0.25)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <Sparkles size={13} style={{ color: 'var(--color-primary-600)' }} /> Smart Sub-Metering & Telemetry Engine
            </div>

            {/* Enlarged SVG Illustration Container */}
            <div style={{ 
              width: '100%', 
              maxWidth: '600px', 
              margin: '0 auto', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              padding: 'var(--space-2) 0'
            }}>
              <img 
                src="/Girl watering plants animation.svg" 
                alt="Girl watering plants animation" 
                className="hero-svg-illustration"
                style={{ 
                  width: '100%', 
                  maxHeight: '420px', 
                  objectFit: 'contain', 
                  filter: theme === 'dark' ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.5)) opacity(0.92) contrast(1.05)' : 'drop-shadow(0 18px 36px rgba(0,0,0,0.1))',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          {/* Hero Right Column: Dynamic Interactive Telemetry Showcase Card */}
          <div className="landing-hero-right">
            
            {/* Dynamic Ambient Backdrop Glow */}
            <div style={{ 
              position: 'absolute', 
              width: '420px', 
              height: '420px', 
              borderRadius: '50%', 
              background: heroMode === 'leak' ? 'rgba(239, 68, 68, 0.22)' : heroMode === 'tariff' ? 'rgba(254, 215, 170, 0.35)' : 'rgba(59, 130, 246, 0.22)', 
              filter: 'blur(70px)', 
              zIndex: 0,
              transition: 'background 0.5s ease'
            }} />

            <div style={{ position: 'relative', zIndex: 1, width: '460px', maxWidth: '100%' }}>
              
              {/* Main Interactive Glass Container */}
              <div 
                className="telemetry-glass-card"
                style={{ 
                  background: theme === 'dark' ? 'rgba(30, 41, 59, 0.92)' : 'rgba(255, 255, 255, 0.95)', 
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '32px', 
                  padding: 'var(--space-6)', 
                  boxShadow: '0 25px 60px -10px rgba(37, 99, 235, 0.22)', 
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                
                {/* Header Strip with Live Pulse & Mode Switcher */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ 
                        position: 'absolute', 
                        width: '18px', 
                        height: '18px', 
                        borderRadius: '50%', 
                        background: heroMode === 'leak' ? 'rgba(239, 68, 68, 0.4)' : heroMode === 'tariff' ? 'rgba(251, 146, 60, 0.35)' : 'rgba(59, 130, 246, 0.4)', 
                        animation: 'radarPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite' 
                      }}></span>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        background: heroMode === 'leak' ? '#ef4444' : heroMode === 'tariff' ? '#fb923c' : '#3b82f6', 
                        boxShadow: `0 0 10px ${heroMode === 'leak' ? '#ef4444' : heroMode === 'tariff' ? '#fb923c' : '#3b82f6'}`,
                        position: 'relative',
                        zIndex: 1
                      }}></span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                      Live Telemetry Hub
                    </span>
                  </div>
                  
                  {/* Interactive Mode Pills */}
                  <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-input)', padding: '3px', borderRadius: 'var(--radius-lg)' }}>
                    <button 
                      onClick={() => setHeroMode('eco')} 
                      style={{ 
                        border: 'none', 
                        background: heroMode === 'eco' ? 'var(--bg-card)' : 'transparent', 
                        color: heroMode === 'eco' ? 'var(--color-primary-600)' : 'var(--text-tertiary)', 
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-md)', 
                        fontSize: '11px', 
                        fontWeight: 'var(--font-bold)', 
                        cursor: 'pointer', 
                        boxShadow: heroMode === 'eco' ? 'var(--shadow-xs)' : 'none',
                        transition: 'all 0.2s ease'
                      }}>
                      💧 Telemetry
                    </button>
                    <button 
                      onClick={() => setHeroMode('tariff')} 
                      style={{ 
                        border: 'none', 
                        background: heroMode === 'tariff' ? 'var(--bg-card)' : 'transparent', 
                        color: heroMode === 'tariff' ? '#ea580c' : 'var(--text-tertiary)', 
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-md)', 
                        fontSize: '11px', 
                        fontWeight: 'var(--font-bold)', 
                        cursor: 'pointer', 
                        boxShadow: heroMode === 'tariff' ? 'var(--shadow-xs)' : 'none',
                        transition: 'all 0.2s ease'
                      }}>
                      📊 Billing
                    </button>
                    <button 
                      onClick={() => setHeroMode('leak')} 
                      style={{ 
                        border: 'none', 
                        background: heroMode === 'leak' ? 'var(--bg-card)' : 'transparent', 
                        color: heroMode === 'leak' ? '#dc2626' : 'var(--text-tertiary)', 
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-md)', 
                        fontSize: '11px', 
                        fontWeight: 'var(--font-bold)', 
                        cursor: 'pointer', 
                        boxShadow: heroMode === 'leak' ? 'var(--shadow-xs)' : 'none',
                        transition: 'all 0.2s ease'
                      }}>
                      ⚡ Leak Guard
                    </button>
                  </div>
                </div>

                {/* Interactive Feature List (Clicking any row switches active mode) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  
                  {/* Feature 1: Sub-Metering */}
                  <div 
                    className="telemetry-row-hover"
                    onClick={() => setHeroMode('eco')}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      padding: '12px 14px', 
                      borderRadius: 'var(--radius-xl)', 
                      background: heroMode === 'eco' ? (theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(224, 242, 254, 0.8)') : 'var(--bg-input)', 
                      border: heroMode === 'eco' ? '1.5px solid var(--color-primary-400)' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)' }}>
                      <Droplets size={20} style={{ animation: heroMode === 'eco' ? 'gentle-float 3s ease-in-out infinite' : 'none' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>Individual Sub-Metering</div>
                        {heroMode === 'eco' && <span style={{ fontSize: '10px', background: 'var(--color-primary-600)', color: '#fff', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 'var(--font-bold)', boxShadow: '0 0 10px rgba(37, 99, 235, 0.4)' }}>ACTIVE</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Track precise flat intake & stop paying flat-rate waste.</div>
                    </div>
                  </div>

                  {/* Feature 2: Slab Billing */}
                  <div 
                    className="telemetry-row-hover"
                    onClick={() => setHeroMode('tariff')}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      padding: '12px 14px', 
                      borderRadius: 'var(--radius-xl)', 
                      background: heroMode === 'tariff' ? (theme === 'dark' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(255, 247, 237, 0.95)') : 'var(--bg-input)', 
                      border: heroMode === 'tariff' ? '1.5px solid #fed7aa' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', flexShrink: 0, boxShadow: '0 4px 10px rgba(251, 146, 60, 0.2)' }}>
                      <BarChart3 size={20} style={{ animation: heroMode === 'tariff' ? 'gentle-float 3s ease-in-out infinite' : 'none' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>Automated Slab Billing</div>
                        {heroMode === 'tariff' && <span style={{ fontSize: '10px', background: '#ffedd5', color: '#c2410c', border: '1px solid #fed7aa', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 'var(--font-bold)', boxShadow: '0 0 8px rgba(251, 146, 60, 0.25)' }}>ACTIVE</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Tiered slab rate calculation with instant online payments.</div>
                    </div>
                  </div>

                  {/* Feature 3: AI Leak Warning */}
                  <div 
                    className="telemetry-row-hover"
                    onClick={() => setHeroMode('leak')}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      padding: '12px 14px', 
                      borderRadius: 'var(--radius-xl)', 
                      background: heroMode === 'leak' ? (theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(254, 226, 226, 0.8)') : 'var(--bg-input)', 
                      border: heroMode === 'leak' ? '1.5px solid #ef4444' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 4px 10px rgba(239, 68, 68, 0.25)' }}>
                      <Zap size={20} style={{ animation: heroMode === 'leak' ? 'gentle-float 3s ease-in-out infinite' : 'none' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>AI Overnight Leak Alerts</div>
                        {heroMode === 'leak' && <span style={{ fontSize: '10px', background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 'var(--font-bold)', boxShadow: '0 0 10px rgba(220, 38, 38, 0.4)' }}>ACTIVE</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Automatic continuous flow flags before damage occurs.</div>
                    </div>
                  </div>

                </div>

                {/* Expanded Dynamic Readout Box depending on active mode */}
                <div style={{ 
                  background: theme === 'dark' 
                    ? (heroMode === 'leak' ? 'rgba(239, 68, 68, 0.12)' : heroMode === 'tariff' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(59, 130, 246, 0.12)')
                    : (heroMode === 'leak' ? 'rgba(254, 242, 242, 0.85)' : heroMode === 'tariff' ? 'rgba(255, 247, 237, 0.95)' : 'rgba(239, 246, 255, 0.85)'), 
                  borderRadius: 'var(--radius-2xl)', 
                  padding: 'var(--space-4)', 
                  border: `1px solid ${theme === 'dark'
                    ? (heroMode === 'leak' ? 'rgba(239, 68, 68, 0.3)' : heroMode === 'tariff' ? 'rgba(251, 146, 60, 0.25)' : 'rgba(59, 130, 246, 0.3)')
                    : (heroMode === 'leak' ? '#fecaca' : heroMode === 'tariff' ? '#fed7aa' : '#bfdbfe')}`,
                  transition: 'all 0.3s ease'
                }}>
                  
                  {/* Mode Title & Telemetry Sparkline */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 'var(--font-bold)', color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {heroMode === 'leak' ? 'Overnight Monitor (2 AM - 5 AM)' : heroMode === 'tariff' ? 'Slab Tariff Rate Breakdown' : 'Flat Intake Telemetry'}
                      </span>
                      <div style={{ 
                        fontSize: '15px', 
                        fontWeight: 'var(--font-extrabold)', 
                        color: theme === 'dark' 
                          ? (heroMode === 'leak' ? '#f87171' : heroMode === 'tariff' ? '#fdba74' : '#60a5fa') 
                          : (heroMode === 'leak' ? '#dc2626' : heroMode === 'tariff' ? '#ea580c' : '#1d4ed8'), 
                        transition: 'all 0.3s ease' 
                      }}>
                        {heroMode === 'leak' ? '0 Critical Pipe Leaks Flagged' : heroMode === 'tariff' ? 'Tier 1: ₹8.00/kL | Tier 2: ₹14.00/kL' : `Flow Rate: ${liveFlowRate} L/min (Normal)`}
                      </div>
                    </div>
                    
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 'var(--font-bold)', 
                      padding: '4px 10px', 
                      borderRadius: 'var(--radius-md)', 
                      background: theme === 'dark' 
                        ? (heroMode === 'leak' ? 'rgba(239, 68, 68, 0.25)' : heroMode === 'tariff' ? 'rgba(251, 146, 60, 0.2)' : 'rgba(59, 130, 246, 0.25)')
                        : (heroMode === 'leak' ? '#fee2e2' : heroMode === 'tariff' ? '#fff7ed' : '#dbeafe'), 
                      color: theme === 'dark' 
                        ? (heroMode === 'leak' ? '#fca5a5' : heroMode === 'tariff' ? '#fed7aa' : '#93c5fd')
                        : (heroMode === 'leak' ? '#991b1b' : heroMode === 'tariff' ? '#ea580c' : '#1e40af'),
                      border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : (heroMode === 'tariff' ? '1px solid #fed7aa' : 'none')
                    }}>
                      {heroMode === 'leak' ? 'Continuous Flow Sensor' : heroMode === 'tariff' ? 'Auto Invoice Engine' : 'Live Streaming'}
                    </span>
                  </div>

                  {/* Sparkline Visual Bar Chart with Live Pulsing Waves */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '44px', margin: '8px 0' }}>
                    {(heroMode === 'leak' ? [12, 10, 8, 5, 3, 2, 2, 1, 2, 1] : heroMode === 'tariff' ? [25, 35, 50, 40, 65, 75, 80, 90, 85, 95] : [30, 45, 60, 40, 70, 85, 65, 90, 75, 98]).map((val, idx) => {
                      const isPulsing = idx === activePulseIndex;
                      const barHeight = isPulsing ? Math.min(100, val + 16) : val;
                      return (
                        <div 
                          key={idx} 
                          className="telemetry-bar-item"
                          style={{ 
                            flex: 1, 
                            height: `${barHeight}%`, 
                            borderRadius: '4px', 
                            background: heroMode === 'leak' ? (isPulsing ? '#ef4444' : idx > 7 ? '#f87171' : '#fca5a5') : heroMode === 'tariff' ? (isPulsing ? '#fb923c' : idx > 7 ? '#fed7aa' : '#ffedd5') : (isPulsing ? '#2563eb' : idx > 7 ? '#3b82f6' : '#93c5fd'),
                            boxShadow: isPulsing ? `0 0 10px ${heroMode === 'leak' ? '#ef4444' : heroMode === 'tariff' ? '#fb923c' : '#2563eb'}` : 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }} 
                          title={`Reading ${idx + 1}: ${val}`}
                        />
                      );
                    })}
                  </div>

                  {/* Bottom Stats Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'var(--font-semibold)', paddingTop: '6px', borderTop: '1px rgba(0,0,0,0.06) solid' }}>
                    <span>128 Flats Connected</span>
                    <span style={{ color: 'var(--color-success-600)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success-500)' }}></span> 99.4% Meter Uptime
                    </span>
                  </div>

                </div>

              </div>

              {/* SAVE WATER, SAVE EARTH Prominent Badge Below Telemetry Card */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                marginTop: 'var(--space-4)'
              }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '10px 26px',
                  borderRadius: 'var(--radius-full)',
                  background: theme === 'dark' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(209, 250, 229, 0.95)',
                  color: theme === 'dark' ? '#34d399' : '#047857', 
                  fontWeight: '900', 
                  fontSize: '1.15rem', 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase',
                  border: '1.5px solid rgba(16, 185, 129, 0.5)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.22)',
                  backdropFilter: 'blur(12px)',
                  fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
                }}
                className="pulse-badge-hover">
                  <Droplets size={22} className="badge-water-icon" style={{ color: '#0284c7' }} /> <span style={{ fontWeight: 900 }}>SAVE WATER, SAVE EARTH</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══ STATS BAR ═══ */}
        <section style={{ position: 'relative', zIndex: 10, padding: '0 5%', marginBottom: 'var(--space-16)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)', maxWidth: '1050px', margin: '0 auto' }} className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} style={{ 
                textAlign: 'center', 
                background: theme === 'dark' ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(12px)',
                borderRadius: 'var(--radius-2xl)', 
                padding: 'var(--space-6) var(--space-4)', 
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
                border: '1px solid var(--border-light)',
                transition: 'transform 0.3s ease, boxShadow 0.3s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(37, 99, 235, 0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.04)'; }}>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-primary-600)', lineHeight: 1 }}>
                  <CountUp end={s.end} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-semibold)', marginTop: '8px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ INTERACTIVE SAVINGS ESTIMATOR ═══ */}
        <section id="calculator" style={{ position: 'relative', zIndex: 10, padding: '0 5% var(--space-16)' }}>
          <div 
            className="roi-main-card"
            style={{ 
              maxWidth: '1050px', 
              margin: '0 auto', 
              background: 'var(--bg-card)', 
              backdropFilter: 'none',
              borderRadius: 'var(--radius-3xl)', 
              padding: 'var(--space-10)', 
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)', 
              border: '1px solid var(--border-light)' 
            }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <div className="roi-badge-hover" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: '12px', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)', border: '1px solid var(--color-primary-100)' }}>
                <Calculator size={14} /> Interactive ROI Estimator
              </div>
              <h2 className="roi-title-hover" style={{ fontSize: '2.2rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', margin: 0 }}>
                Calculate Your Society&apos;s Annual Savings
              </h2>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Adjust the flat slider to calculate estimated water conserved, bill savings, and carbon reduction.
              </p>
            </div>

            {/* Slider Control */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  Number of Apartment Flats:
                </span>
                <span className="roi-flats-badge" style={{ fontSize: '1.4rem', fontWeight: 'var(--font-extrabold)', color: 'var(--color-primary-600)', background: 'var(--color-primary-50)', padding: '6px 20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-primary-100)' }}>
                  {householdCount} Flats
                </span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="500" 
                step="10" 
                value={householdCount} 
                onChange={(e) => setHouseholdCount(Number(e.target.value))}
                className="custom-range-slider"
                style={{
                  width: '100%',
                  height: '10px',
                  borderRadius: '5px',
                  outline: 'none',
                  accentColor: 'var(--color-primary-600)',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px', fontWeight: 'var(--font-medium)' }}>
                <span>20 Flats (Small Society)</span>
                <span>250 Flats (Medium Society)</span>
                <span>500 Flats (Large Gated Community)</span>
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }} className="calculator-grid">
              <div className="roi-stat-card roi-card-water" style={{ 
                background: theme === 'dark' ? 'rgba(37, 99, 235, 0.12)' : 'var(--color-primary-50)', 
                borderRadius: 'var(--radius-2xl)', 
                padding: 'var(--space-6)', 
                textAlign: 'center', 
                border: theme === 'dark' ? '1px solid rgba(37, 99, 235, 0.25)' : '1px solid var(--color-primary-100)' 
              }}>
                <div className="roi-card-icon" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto var(--space-3) auto', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                  <Droplets size={22} />
                </div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: theme === 'dark' ? '#60a5fa' : 'var(--color-primary-700)' }}>
                  {(annualWaterSavedLiters / 1000000).toFixed(2)}M Liters
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: theme === 'dark' ? '#93c5fd' : 'var(--color-primary-600)', marginTop: '4px' }}>Annual Water Conserved</div>
              </div>

              <div className="roi-stat-card roi-card-savings" style={{ 
                background: theme === 'dark' ? 'rgba(34, 197, 94, 0.12)' : 'var(--color-success-50)', 
                borderRadius: 'var(--radius-2xl)', 
                padding: 'var(--space-6)', 
                textAlign: 'center', 
                border: theme === 'dark' ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid var(--color-success-100)' 
              }}>
                <div className="roi-card-icon" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto var(--space-3) auto', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)' }}>
                  <TrendingDown size={22} />
                </div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: theme === 'dark' ? '#4ade80' : 'var(--color-success-700)' }}>
                  ₹{(annualMoneySaved / 100000).toFixed(2)} Lakhs
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: theme === 'dark' ? '#86efac' : 'var(--color-success-600)', marginTop: '4px' }}>Est. Annual Bill Reduction</div>
              </div>

              <div className="roi-stat-card roi-card-carbon" style={{ 
                background: theme === 'dark' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.1)', 
                borderRadius: 'var(--radius-2xl)', 
                padding: 'var(--space-6)', 
                textAlign: 'center', 
                border: theme === 'dark' ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(245, 158, 11, 0.2)' 
              }}>
                <div className="roi-card-icon" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto var(--space-3) auto', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                  <Sparkles size={22} />
                </div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: theme === 'dark' ? '#fbbf24' : 'var(--color-warning-700)' }}>
                  {carbonOffsetKg.toLocaleString()} kg
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: theme === 'dark' ? '#fcd34d' : 'var(--color-warning-600)', marginTop: '4px' }}>CO2 Footprint Reduced</div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══ INTERACTIVE PORTAL SHOWCASE ═══ */}
        <section id="showcase" style={{ position: 'relative', zIndex: 10, padding: '0 5% var(--space-16)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }}>
              Built For Residents & Society Admins
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
              Switch tabs to preview how Smart Water simplifies water governance for all stakeholders.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <button 
              onClick={() => setActiveTab('resident')}
              className={`showcase-tab-btn ${activeTab === 'resident' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 'var(--font-bold)',
                fontSize: 'var(--text-md)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: activeTab === 'resident' ? 'none' : '1px solid var(--border-default)',
                background: activeTab === 'resident' ? 'var(--gradient-primary)' : 'var(--bg-card)',
                color: activeTab === 'resident' ? '#fff' : 'var(--text-secondary)',
                boxShadow: activeTab === 'resident' ? '0 6px 20px rgba(37, 99, 235, 0.35)' : 'none'
              }}
            >
              <Users size={18} /> Resident Portal
            </button>

            <button 
              onClick={() => setActiveTab('admin')}
              className={`showcase-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 'var(--font-bold)',
                fontSize: 'var(--text-md)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: activeTab === 'admin' ? 'none' : '1px solid var(--border-default)',
                background: activeTab === 'admin' ? 'var(--gradient-primary)' : 'var(--bg-card)',
                color: activeTab === 'admin' ? '#fff' : 'var(--text-secondary)',
                boxShadow: activeTab === 'admin' ? '0 6px 20px rgba(37, 99, 235, 0.35)' : 'none'
              }}
            >
              <Building2 size={18} /> Community Admin Portal
            </button>
          </div>

          {/* Feature Display Card with Dynamic Switch Animation */}
          <div 
            key={activeTab}
            style={{
              maxWidth: '1050px',
              margin: '0 auto',
              background: theme === 'dark' ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-3xl)',
              padding: 'var(--space-8)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
              border: '1px solid var(--border-light)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-8)',
              alignItems: 'center',
              animation: 'accordionFadeDown 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
            }} 
            className="showcase-grid showcase-main-card"
          >
            
            <div>
              <span className="showcase-badge-hover" style={{ 
                fontSize: '12px', 
                padding: '5px 14px', 
                borderRadius: 'var(--radius-full)', 
                background: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'var(--color-primary-50)', 
                color: 'var(--color-primary-600)', 
                fontWeight: 'var(--font-extrabold)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={13} /> {portalDemos[activeTab].badge}
              </span>
              <h3 className="showcase-title-hover" style={{ fontSize: '1.9rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', margin: 'var(--space-3) 0 var(--space-2) 0' }}>
                {portalDemos[activeTab].title}
              </h3>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: '1.6' }}>
                {portalDemos[activeTab].subtitle}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {portalDemos[activeTab].highlights.map((h, i) => (
                  <div key={i} className="showcase-check-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' }}>
                    <div className="check-circle-icon" style={{ width: '24px', height: '24px', borderRadius: '50%', background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'var(--color-success-50)', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(34, 197, 94, 0.2)', transition: 'transform 0.25s ease' }}>
                      <Check size={14} />
                    </div>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link 
                  to="/login" 
                  className="btn btn-primary nav-start-btn" 
                  style={{ gap: '8px', padding: '13px 28px', borderRadius: 'var(--radius-xl)', fontSize: '14px', fontWeight: '700' }}
                >
                  Launch {activeTab === 'resident' ? 'Resident' : 'Admin'} View <ExternalLink size={16} className="arrow-shift" />
                </Link>
              </div>
            </div>

            <div 
              className="showcase-preview-box"
              style={{ 
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.75)' : 'var(--bg-input)', 
                borderRadius: 'var(--radius-2xl)', 
                padding: 'var(--space-6)', 
                border: '1px solid var(--border-light)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={15} style={{ color: 'var(--color-primary-600)' }} /> Live Dashboard Telemetry
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-success-500)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'var(--font-bold)', background: 'rgba(34, 197, 94, 0.12)', padding: '3px 9px', borderRadius: 'var(--radius-full)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span> Live Stream
                </span>
              </div>

              {/* Stat Cards with Hover Lift */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                {portalDemos[activeTab].previewStats.map((ps, i) => (
                  <div 
                    key={i} 
                    className="preview-stat-pill"
                    style={{ 
                      background: 'var(--bg-card)', 
                      padding: 'var(--space-3)', 
                      borderRadius: 'var(--radius-lg)', 
                      boxShadow: 'var(--shadow-sm)',
                      border: '1px solid var(--border-light)',
                      transition: 'all 0.25s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'var(--font-bold)' }}>{ps.label}</div>
                    <div style={{ fontSize: '15px', fontWeight: 'var(--font-extrabold)', color: ps.color, marginTop: '2px' }}>{ps.value}</div>
                  </div>
                ))}
              </div>

              {/* Dynamic Live Pulsing Bar Chart */}
              <div style={{ background: 'var(--bg-card)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Intake Volume Trend (Liters)</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-primary-600)', fontWeight: '700' }}>Updated 1s ago</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
                  {[35, 50, 42, 68, 55, 85, 48, 62].map((baseH, i) => {
                    const isHighlighted = (activePulseIndex % 8) === i;
                    const h = isHighlighted ? Math.min(100, baseH + 18) : baseH;
                    return (
                      <div 
                        key={i} 
                        className="showcase-preview-bar"
                        style={{ 
                          flex: 1, 
                          height: `${h}%`, 
                          borderRadius: '6px', 
                          background: isHighlighted 
                            ? 'var(--gradient-primary)' 
                            : (theme === 'dark' ? 'rgba(59, 130, 246, 0.25)' : 'var(--color-primary-100)'),
                          boxShadow: isHighlighted ? '0 0 14px rgba(37, 99, 235, 0.5)' : 'none',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} 
                      />
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══ FEATURES GRID ═══ */}
        <section id="features" style={{ position: 'relative', zIndex: 10, padding: '0 5% var(--space-16)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>
              Everything You Need For Smart Water Governance
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              A complete web application for apartment water sub-metering, billing automation, and eco-conservation tracking.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)', maxWidth: '1150px', margin: '0 auto' }} className="features-grid">
            {features.map((f, i) => {
              const isSelected = selectedFeature === i;
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedFeature(i)}
                  style={{ 
                    background: isSelected 
                      ? (theme === 'dark' ? 'rgba(37, 99, 235, 0.2)' : 'var(--color-primary-50)') 
                      : (theme === 'dark' ? 'rgba(30, 41, 59, 0.85)' : 'var(--bg-card)'), 
                    borderRadius: 'var(--radius-2xl)', 
                    padding: 'var(--space-6)', 
                    boxShadow: isSelected 
                      ? (theme === 'dark' ? '0 12px 35px rgba(37, 99, 235, 0.35)' : '0 12px 30px rgba(37, 99, 235, 0.15)') 
                      : '0 8px 24px rgba(0,0,0,0.04)', 
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
                    cursor: 'pointer',
                    border: isSelected 
                      ? (theme === 'dark' ? '2px solid #3b82f6' : '2px solid var(--color-primary-400)') 
                      : (theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-light)')
                  }} 
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: 'var(--radius-xl)', 
                      background: isSelected 
                        ? 'var(--gradient-primary)' 
                        : (theme === 'dark' ? 'rgba(59, 130, 246, 0.18)' : 'var(--gradient-primary-subtle)'), 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: isSelected ? '#ffffff' : (theme === 'dark' ? '#60a5fa' : 'var(--color-primary-600)'), 
                      boxShadow: 'var(--shadow-sm)' 
                    }}>
                      {f.icon}
                    </div>
                    <span style={{ 
                      fontSize: '10px', 
                      padding: '3px 10px', 
                      borderRadius: 'var(--radius-full)', 
                      background: isSelected 
                        ? (theme === 'dark' ? 'rgba(59, 130, 246, 0.35)' : 'rgba(37, 99, 235, 0.12)') 
                        : (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-input)'), 
                      color: isSelected 
                        ? (theme === 'dark' ? '#93c5fd' : 'var(--color-primary-600)') 
                        : (theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-tertiary)'), 
                      fontWeight: 'var(--font-bold)' 
                    }}>
                      {f.badge}
                    </span>
                  </div>
                  <h3 style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: 'var(--font-bold)', 
                    color: isSelected 
                      ? (theme === 'dark' ? '#ffffff' : 'var(--color-primary-800)') 
                      : 'var(--text-primary)', 
                    margin: '0 0 var(--space-2) 0' 
                  }}>
                    {f.title}
                  </h3>
                  <p style={{ 
                    fontSize: 'var(--text-sm)', 
                    color: isSelected 
                      ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)') 
                      : (theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)'), 
                    lineHeight: '1.6', 
                    margin: 0, 
                    fontWeight: 'var(--font-medium)' 
                  }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ FAQ SECTION ═══ */}
        <section id="faq" style={{ position: 'relative', zIndex: 10, padding: '0 5% var(--space-16)' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: '12px', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
                <HelpCircle size={14} /> Got Questions?
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', margin: 0 }}>
                Frequently Asked Questions
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {faqs.map((faq, i) => {
                const isOpen = activeFaq === i;
                return (
                  <div 
                    key={i} 
                    style={{ 
                      background: isOpen 
                        ? (theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.98)') 
                        : (theme === 'dark' ? 'rgba(30, 41, 59, 0.75)' : 'var(--bg-card)'), 
                      borderRadius: 'var(--radius-2xl)', 
                      padding: 'var(--space-5) var(--space-6)', 
                      boxShadow: isOpen 
                        ? '0 12px 30px rgba(37, 99, 235, 0.15)' 
                        : '0 4px 14px rgba(0, 0, 0, 0.04)',
                      border: isOpen 
                        ? '1.5px solid var(--color-primary-400)' 
                        : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isOpen ? 'scale(1.01)' : 'scale(1)'
                    }}
                    className="faq-card-hover"
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-md)', color: isOpen ? 'var(--color-primary-600)' : 'var(--text-primary)', transition: 'color 0.2s ease' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: isOpen ? 'var(--color-primary-50)' : 'var(--bg-input)', color: isOpen ? 'var(--color-primary-600)' : 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>
                          Q{i + 1}
                        </span>
                        {faq.q}
                      </span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isOpen ? 'var(--color-primary-50)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s ease' }}>
                        <ChevronRight 
                          size={20} 
                          style={{ 
                            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                            color: isOpen ? 'var(--color-primary-600)' : 'var(--text-tertiary)' 
                          }} 
                        />
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ 
                        marginTop: 'var(--space-4)', 
                        paddingTop: 'var(--space-3)',
                        borderTop: '1px solid var(--border-light)',
                        fontSize: 'var(--text-sm)', 
                        color: 'var(--text-secondary)', 
                        lineHeight: '1.75',
                        animation: 'accordionFadeDown 0.35s ease-out forwards'
                      }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ ABOUT US SECTION ═══ */}
        <section id="about" style={{ position: 'relative', zIndex: 10, padding: '0 5% var(--space-16)' }}>
          <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: '12px', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)', border: '1px solid var(--color-primary-100)' }}>
                <Users size={14} /> Driven By Sustainability & Innovation
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>
                About Smart Water
              </h2>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto' }}>
                Empowering multi-dwelling residential societies with real-time water telemetry, fair sub-metering, automated slab billing, and AI-powered leak protection.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
              {[
                {
                  icon: <Droplets size={26} />,
                  title: 'Sub-Metering Precision',
                  desc: 'Eliminating wasteful flat-rate water charges by giving every flat full visibility into their exact consumption.'
                },
                {
                  icon: <BarChart3 size={26} />,
                  title: 'Automated Billing',
                  desc: 'Streamlining monthly invoice distribution with tiered slab rates, Razorpay payment links, and instant receipts.'
                },
                {
                  icon: <Shield size={26} />,
                  title: 'AI Leak Guard',
                  desc: 'Continuous 24/7 telemetry monitoring to detect overnight micro-leaks before they cause structural damage.'
                },
                {
                  icon: <Building2 size={26} />,
                  title: 'Community Governance',
                  desc: 'Centralized admin controls for society boards to manage tanker purchases, meter battery health, and audits.'
                }
              ].map((pillar, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: theme === 'dark' ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 'var(--radius-2xl)',
                    padding: 'var(--space-6)',
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(37, 99, 235, 0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.04)'; }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-xl)', background: 'var(--gradient-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-600)', marginBottom: 'var(--space-4)' }}>
                    {pillar.icon}
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                    {pillar.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA SECTION ═══ */}
        <section style={{ position: 'relative', zIndex: 10, padding: '0 5% var(--space-16)' }}>
          <div className="cta-card" style={{
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-3xl)',
            padding: 'var(--space-12) var(--space-10)',
            textAlign: 'center',
            boxShadow: '0 20px 45px rgba(37, 99, 235, 0.35)',
            maxWidth: '950px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative glow orbs (dark mode only) */}
            {theme === 'dark' && (
              <>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-50px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
              </>
            )}
            <h2 style={{ fontSize: '2.4rem', fontWeight: 'var(--font-extrabold)', color: '#fff', margin: '0 0 var(--space-3) 0', position: 'relative', textShadow: theme === 'dark' ? '0 0 40px rgba(147,210,255,0.4)' : 'none' }}>
              Ready to Upgrade Your Society&apos;s Water Management?
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.88)', marginBottom: 'var(--space-8)', fontWeight: 'var(--font-medium)', maxWidth: '650px', margin: '0 auto var(--space-8) auto', position: 'relative' }}>
              Join forward-thinking residential communities conserving water, automating billing, and eliminating leaks today.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link 
                to="/register" 
                className="cta-btn-primary btn btn-lg" 
                style={{ 
                  background: '#fff', 
                  color: 'var(--color-primary-700)', 
                  fontWeight: 'var(--font-bold)', 
                  padding: '14px 32px', 
                  borderRadius: 'var(--radius-xl)', 
                  boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {t('landing.registerCommunity')}
              </Link>
              <Link 
                to="/login" 
                className="cta-btn-secondary btn btn-lg" 
                style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  color: '#fff', 
                  border: '1.5px solid rgba(255,255,255,0.45)', 
                  padding: '14px 30px', 
                  borderRadius: 'var(--radius-xl)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {t('landing.logIn')} →
              </Link>
            </div>
          </div>
        </section>

        {/* Executive Multi-Column Footer */}
        <footer style={{ 
          position: 'relative', 
          zIndex: 10, 
          background: theme === 'dark' ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-light)',
          padding: 'var(--space-12) 5% var(--space-6)',
          marginTop: 'var(--space-8)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
            
            {/* Column 1: Brand & Operational Status */}
            <div className="footer-brand-col">
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'left center', marginBottom: 'var(--space-2)' }}>
                <BrandLogo style={{ borderBottom: 'none', padding: 0, margin: 0 }} />
              </div>
              <p className="footer-desc-text" style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: 'var(--space-4)' }}>
                Intelligent water telemetry, automated slab billing, and AI leak detection built for modern residential societies.
              </p>
              <div className="footer-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.25)', color: '#16a34a', fontSize: '12px', fontWeight: 'var(--font-bold)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span> Live Telemetry Active
              </div>
            </div>

            {/* Column 2: Platform Features */}
            <div className="footer-features-col">
              <h4 style={{ fontSize: '12px', fontWeight: 'var(--font-extrabold)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Platform Features</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <a href="#features" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Sub-Metering Intake</a>
                <a href="#features" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Automated Slab Billing</a>
                <a href="#features" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Overnight Leak Alerts</a>
                <a href="#features" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Bulk Tanker Management</a>
                <a href="#calculator" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Society ROI Calculator</a>
              </div>
            </div>

            {/* Column 3: Portals & Access */}
            <div className="footer-portals-col">
              <h4 style={{ fontSize: '12px', fontWeight: 'var(--font-extrabold)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>System Portals</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <Link to="/login" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Resident Self-Service</Link>
                <Link to="/login" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Community Admin Portal</Link>
                <Link to="/register" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Register New Society</Link>
                <a href="#showcase" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Interactive Feature Demo</a>
                <a href="#faq" className="footer-link-hover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Knowledge Base & FAQ</a>
              </div>
            </div>

            {/* Column 4: Contact & Location */}
            <div className="footer-hq-col">
              <h4 style={{ fontSize: '12px', fontWeight: 'var(--font-extrabold)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>HQ & Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>Smart Water Telemetry Hub</div>
                <div className="footer-hq-extra">Bengaluru, Karnataka, India</div>
                <div style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-bold)' }}>support@smartwater.io</div>
                <div className="footer-hq-extra" style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  24/7 Meter Monitoring Support
                </div>
              </div>
            </div>

          </div>

          {/* Sub-Footer Copyright Bar */}
          <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <div>© {new Date().getFullYear()} Smart Water Telemetry Platform. All rights reserved.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Built for Sustainable Smart Cities</span> 💧
            </div>
          </div>
        </footer>

        {/* Responsive Overrides & Styles */}
        <style>{`
          .landing-hero {
            position: relative;
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
            flex-wrap: wrap;
            z-index: 10;
          }
          .landing-hero-left {
            flex: 1 1 50%;
            max-width: 580px;
          }
          .landing-hero-title {
            font-size: 3.1rem;
            font-weight: 800;
            color: var(--text-primary);
            line-height: 1.15;
            margin: 0 0 20px 0;
            letter-spacing: -0.03em;
          }
          .landing-hero-right {
            flex: 1 1 42%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          @keyframes accordionFadeDown {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes radarPing {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.8); opacity: 0; }
            100% { transform: scale(1); opacity: 0; }
          }
          .faq-card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
            border-color: var(--color-primary-300) !important;
          }
          .telemetry-row-hover {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .nav-pill-item {
            transition: all 0.2s ease !important;
          }
          .nav-pill-item:hover {
            color: var(--color-primary-600) !important;
            background: var(--color-primary-50) !important;
            border-radius: var(--radius-full);
          }
          .footer-link-hover {
            transition: all 0.2s ease !important;
          }
          .footer-link-hover:hover {
            color: var(--color-primary-600) !important;
            transform: translateX(4px);
          }
          .saas-nav-link:hover {
            color: var(--color-primary-600) !important;
          }
          .saas-login-link:hover {
            color: var(--color-primary-600) !important;
            background: rgba(37, 99, 235, 0.06);
          }
          .nav-login-btn:hover {
            border-color: var(--color-primary-400) !important;
            color: var(--color-primary-600) !important;
            background: rgba(37, 99, 235, 0.05) !important;
            transform: translateY(-1px);
          }
          .nav-start-btn:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45) !important;
          }
          .nav-start-btn:hover .arrow-shift {
            transform: translateX(4px);
            transition: transform 0.2s ease;
          }
          .telemetry-glass-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .telemetry-glass-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 32px 70px -10px rgba(37, 99, 235, 0.28) !important;
          }
          @media (max-width: 1024px) {
            .landing-hero-title { font-size: 2.8rem !important; }
            .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .showcase-grid { grid-template-columns: 1fr !important; }
            .calculator-grid { grid-template-columns: repeat(3, 1fr) !important; }
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 768px) {
            .landing-nav-links { display: none !important; }
            .landing-hero {
              flex-direction: column;
              text-align: center;
            }
            .landing-hero-left {
              max-width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .landing-hero-title { font-size: 2.2rem; }
            .landing-hero-right > div { width: 100% !important; }
            .features-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 640px) {
            .calculator-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Landing;


