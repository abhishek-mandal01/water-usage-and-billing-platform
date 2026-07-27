import { Link } from 'react-router-dom';
import logoImg from '../assets/water_usage_and_billing_logo.png';

function BrandLogo({ style = {} }) {
  return (
    <Link
      to="/"
      aria-label="Smart Water — go to landing page"
      style={{
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
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
          width: '85px',
          height: '85px',
          objectFit: 'contain',
          flexShrink: 0
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{
          color: 'var(--text-primary)',
          fontFamily: '"Trebuchet MS", "Arial Rounded MT Bold", sans-serif',
          fontSize: '25px',
          fontWeight: 800,
          letterSpacing: '-0.7px',
          whiteSpace: 'nowrap'
        }}>
          Smart <span style={{ color: 'var(--color-primary-500)' }}>Water</span>
        </div>
        <div style={{
          marginTop: '7px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-family)',
          fontSize: '12px',
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
