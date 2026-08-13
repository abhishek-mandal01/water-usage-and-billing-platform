import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../LanguageSelector/useTranslation';
import { Droplets, ArrowRight, CheckCircle } from 'lucide-react';

const HeroContent = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        .hero-content-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
          color: var(--hero-accent, #5F8CFF);
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          box-shadow: var(--shadow-xs);
          border: 1px solid rgba(95, 140, 255, 0.1);
          margin-bottom: var(--space-6);
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          color: #1A1A1A;
          line-height: 1.06;
          letter-spacing: -0.03em;
          margin: 0 0 24px 0;
        }

        .hero-gradient-word {
          background: linear-gradient(135deg, #5F8CFF 0%, #7AA6FF 50%, #5F8CFF 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: hero-gradient-shift 5s ease infinite;
        }

        .hero-subtitle {
          font-size: var(--text-lg);
          color: #4A5568;
          line-height: 1.8;
          margin-bottom: var(--space-8);
          max-width: 92%;
          font-weight: var(--font-medium);
        }

        .hero-cta-container {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
          margin-bottom: var(--space-10);
        }

        .hero-trust-indicators {
          display: flex;
          gap: var(--space-4);
          align-items: center;
          flex-wrap: wrap;
        }

        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-sm);
          color: #718096;
          font-weight: var(--font-medium);
        }

        @keyframes hero-gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }

        [data-theme='dark'] .hero-title {
          color: var(--text-primary);
        }
        
        [data-theme='dark'] .hero-subtitle {
          color: #A0AEC0;
        }
        
        [data-theme='dark'] .hero-badge {
          background: rgba(30, 41, 59, 0.7);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-gradient-word {
            animation: none !important;
          }
        }

        @media (max-width: 1024px) {
          .hero-title {
            font-size: 3rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.4rem;
          }
          .hero-content-container {
            align-items: center;
            text-align: center;
          }
          .hero-subtitle {
            max-width: 100%;
          }
          .hero-cta-container {
            justify-content: center;
          }
          .hero-trust-indicators {
            justify-content: center;
          }
        }
      `}</style>

      <div className="hero-content-container">
        <div className="hero-badge">
          <Droplets size={16} /> Platform v2.0
        </div>

        <h1 className="hero-title">
          {t('landing.title1')}
          <br />
          <span className="hero-gradient-word">{t('landing.title2')}</span>
        </h1>

        <p className="hero-subtitle">
          {t('landing.subtitle')}
        </p>

        <div className="hero-cta-container">
          <Link to="/login" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {t('landing.logIn')} <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn btn-outline btn-lg">
            {t('landing.registerCommunity')}
          </Link>
        </div>

        <div className="hero-trust-indicators">
          {['No credit card required', 'Free trial', 'Setup in 5 min'].map((text, i) => (
            <div key={i} className="hero-trust-item">
              <CheckCircle size={14} style={{ color: 'var(--color-success-500)' }} />
              {text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroContent;
