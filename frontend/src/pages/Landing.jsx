import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import Ferrofluid from '../components/Ferrofluid';
import ThemeToggle from '../components/ThemeToggle';

function Landing() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-body)', fontFamily: 'var(--font-family)', overflowX: 'hidden' }}>
      
      {/* Background Ferrofluid */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Ferrofluid
          colors={["#1d4ed8", "#3b82f6", "#06b6d4"]}
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={2.5}
          shimmer={1.5}
          glow={2}
          flowDirection="down"
          opacity={0.4}
          mouseInteraction
          mouseStrength={1}
          mouseRadius={0.35}
        />
      </div>
      
      {/* Top Navbar */}
      <nav style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-5) 5%', backgroundColor: 'transparent', zIndex: 100 }}>
        <BrandLogo style={{ borderBottom: 'none', padding: 0, marginLeft: '-15px', marginTop: '-10px' }} />
        
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <ThemeToggle />
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: 'var(--text-base)' }}>Log In</Link>
          <Link to="/register" className="btn btn-outline" style={{ fontSize: 'var(--text-base)' }}>Register</Link>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="landing-hero">
        
        {/* Left Column: Typography & CTAs */}
        <div className="landing-hero-left">
          <h1 className="landing-hero-title">
            Water Management, <br />
            <span style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'var(--gradient-primary)' }}>Reimagined.</span>
          </h1>
          <p style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: 'var(--space-10)', maxWidth: '90%' }}>
            Bring transparency to your apartment's water consumption. 
            Automate billing, track usage trends, and encourage conservation all from one modern platform.
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary btn-lg">Log In</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Register Community</Link>
          </div>
        </div>

        {/* Right Column: Abstract Animated Graphic */}
        <div className="landing-hero-right">
          <div style={{ position: 'relative', width: '400px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100%' }}>
            <div className="morphing-blob" style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--gradient-primary)', boxShadow: 'inset 0 0 50px rgba(255,255,255,0.5)', zIndex: 10 }}></div>
            <div style={{ position: 'absolute', bottom: '-20px', width: '70%', height: '30px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%', filter: 'blur(10px)', zIndex: 5 }}></div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ position: 'relative', textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-tertiary)', fontSize: 'var(--text-lg)', marginTop: 'auto', zIndex: 10 }}>
        💧 Smart Water • Smarter Bills © 2026 • Stay cool, Save H₂O.
      </footer>

      {/* Responsive styles */}
      <style>{`
        .landing-hero {
          position: relative;
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          gap: 40px;
          flex-wrap: wrap;
          z-index: 10;
        }
        .landing-hero-left {
          flex: 1 1 50%;
          max-width: 650px;
          padding-bottom: 40px;
        }
        .landing-hero-title {
          font-size: 4.5rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
          margin: 0 0 24px 0;
          letter-spacing: -0.03em;
        }
        .landing-hero-right {
          flex: 1 1 40%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          min-height: 400px;
        }
        @media (max-width: 1024px) {
          .landing-hero-title { font-size: 3rem; }
        }
        @media (max-width: 768px) {
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
          .landing-hero-title { font-size: 2.25rem; }
          .landing-hero-right { min-height: 250px; }
          .landing-hero-right > div { width: 250px !important; height: 250px !important; }
        }
      `}</style>
    </div>
  );
}

export default Landing;
