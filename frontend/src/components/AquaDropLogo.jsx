import logoImg from '../assets/water_usage_and_billing_logo.png';

/**
 * AquaDropLogo — Render water_usage_and_billing_logo.png image asset
 */
export default function AquaDropLogo({ size = 48, className = '' }) {
  return (
    <img
      src={logoImg}
      alt="Smart Water Logo"
      width={size}
      height={size}
      className={className}
      style={{
        flexShrink: 0,
        display: 'block',
        objectFit: 'contain',
        width: `${size}px`,
        height: `${size}px`
      }}
    />
  );
}

