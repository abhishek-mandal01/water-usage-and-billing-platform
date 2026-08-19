import { Link } from 'react-router-dom';
import { PanelRightOpen } from 'lucide-react';
import logoImg from '../assets/water_usage_and_billing_logo.png';

function BrandLogo({ 
  style = {}, 
  isCollapsed = false, 
  onToggleCollapse, 
  logoSize = 85, 
  textSize = '25px', 
  subTextSize = '12px' 
}) {
  if (isCollapsed && onToggleCollapse) {
    return (
      <div 
        className="brand-logo-collapsed-container"
        onClick={(e) => {
          e.stopPropagation();
          onToggleCollapse();
        }}
        title="Expand sidebar"
        style={style}
      >
        <div className="brand-logo-morph-wrapper">
          <img
            src={logoImg}
            alt="Expand sidebar"
            className="brand-logo-img-morph"
          />
          <PanelRightOpen size={20} className="brand-logo-icon-morph" color="var(--text-secondary)" />
        </div>
      </div>
    );
  }

  return (
    <Link
      to="/"
      aria-label="Smart Water — go to landing page"
      style={{
        padding: 'var(--space-4) var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '8px',
        color: 'inherit',
        textDecoration: 'none',
        ...style
      }}
    >
      <img
        src={logoImg}
        alt=""
        aria-hidden="true"
        style={{
          width: `${logoSize}px`,
          height: `${logoSize}px`,
          objectFit: 'contain',
          flexShrink: 0
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-family)',
          fontSize: textSize,
          fontWeight: 800,
          letterSpacing: '-0.7px',
          whiteSpace: 'nowrap'
        }}>
          Smart <span style={{ color: 'var(--color-primary-500)' }}>Water</span>
        </div>
        <div style={{
          marginTop: '6px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-family)',
          fontSize: subTextSize,
          fontWeight: 700,
          letterSpacing: '1.7px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>
          Smarter Bills
        </div>
      </div>
    </Link>
  );
}

export default BrandLogo;

