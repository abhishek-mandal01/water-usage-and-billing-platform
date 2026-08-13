import {
  BellRing,
  CheckCircle2,
  ClipboardList,
  Droplets,
  Gauge,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const variants = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Keep water billing, usage, and service updates in one place',
    description:
      'Sign in to review consumption patterns, settle bills quickly, and stay ahead of community alerts.',
    highlights: [
      { icon: Gauge, title: 'Usage insights', text: 'Spot spikes early and understand how water is being consumed.' },
      { icon: BellRing, title: 'Smart alerts', text: 'Get reminders for bills, notices, and service updates.' },
      { icon: ShieldCheck, title: 'Secure access', text: 'Protect resident and admin data with a trusted login flow.' },
    ],
    stats: [
      { value: '24/7', label: 'Account access' },
      { value: '1 view', label: 'for billing + usage' },
    ],
    callout: 'Designed for quick decisions, fewer missed payments, and clearer service communication.',
  },
  admin: {
    eyebrow: 'Community admin setup',
    title: 'Launch a professional operations hub for your community',
    description:
      'Create a clean admin account to manage households, tariffs, notices, and support requests from one dashboard.',
    highlights: [
      { icon: Users, title: 'Household management', text: 'Onboard residents and keep community records organized.' },
      { icon: ClipboardList, title: 'Tariff control', text: 'Set billing rules and service charges with confidence.' },
      { icon: BellRing, title: 'Announcements', text: 'Share maintenance updates and important notices instantly.' },
    ],
    stats: [
      { value: 'All-in-one', label: 'admin workspace' },
      { value: 'Fast setup', label: 'for new communities' },
    ],
    callout: 'Everything is structured to help community admins look organized from day one.',
  },
  resident: {
    eyebrow: 'Resident onboarding',
    title: 'Complete your invite and get instant access to your utility account',
    description:
      'Join your community securely, finish your profile, and start tracking your household water services in minutes.',
    highlights: [
      { icon: Sparkles, title: 'Simple invite flow', text: 'Finish registration with the details your admin already shared.' },
      { icon: Droplets, title: 'Service overview', text: 'See bills, usage, and account activity from a single account.' },
      { icon: CheckCircle2, title: 'Verified profile', text: 'Keep your account information accurate and ready for support.' },
    ],
    stats: [
      { value: '5 min', label: 'typical signup' },
      { value: 'Secure', label: 'resident profile' },
    ],
    callout: 'A guided setup keeps the resident experience clear, fast, and professional.',
  },
};

function AuthSidePanel({ variant = 'login' }) {
  const content = variants[variant] ?? variants.login;
  const isResident = variant === 'resident';

  return (
    <div
      className="auth-left"
      style={isResident ? { justifyContent: 'flex-start', paddingTop: 'var(--space-16)' } : undefined}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
          marginTop: isResident ? '0' : '0',
        }}
      >
        <div>
          <p
            className="auth-panel-eyebrow"
            style={{
              margin: 0,
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {content.eyebrow}
          </p>
          <h1 className="auth-marketing-title" style={{ marginTop: 'var(--space-3)', maxWidth: '18ch' }}>
            {content.title}
          </h1>
          <p style={{ margin: 'var(--space-4) 0 0', fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '34rem' }}>
            {content.description}
          </p>
        </div>

        <div
          className="auth-panel-grid auth-panel-highlights"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {content.highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                className="auth-panel-card auth-panel-highlight-card"
                key={item.title}
                style={{
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  minHeight: '160px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    boxShadow: 'var(--shadow-btn)',
                  }}
                >
                  <Icon size={20} color="white" />
                </div>
                <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>
                  {item.title}
                </h3>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-4)' }}>
          {content.stats.map((stat) => (
            <div
              className="auth-panel-card auth-panel-stat-card"
              key={stat.label}
              style={{
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {stat.value}
              </div>
              <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div
          className="auth-panel-card auth-panel-callout"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            padding: 'var(--space-5)',
            borderRadius: 'var(--radius-2xl)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Droplets size={22} color="white" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
              Built for clear utility workflows
            </p>
            <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {content.callout}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthSidePanel;