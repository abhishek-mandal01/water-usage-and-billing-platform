import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Droplet,
  DropletFill,
  ShieldLockFill,
  PeopleFill,
  GraphUpArrow,
  BellFill,
  Building,
  ArrowRight,
  CheckCircleFill,
  PersonFill,
  KeyFill,
} from "react-bootstrap-icons";

const roleRedirects = {
  RESIDENT: "/resident/dashboard",
  COMMUNITY_ADMIN: "/community/dashboard",
  ADMIN: "/admin/dashboard",
};

const features = [
  {
    icon: DropletFill,
    title: "Real-Time Usage Tracking",
    desc: "Meter readings are logged and instantly turned into consumption trends over time.",
  },
  {
    icon: ShieldLockFill,
    title: "Secure, Role-Based Access",
    desc: "JWT-backed authentication keeps every account scoped to exactly what it should see.",
  },
  {
    icon: Building,
    title: "Community Management",
    desc: "Each community manages its own residents and usage data — no cross-community visibility.",
  },
  {
    icon: GraphUpArrow,
    title: "Visual Insights",
    desc: "Weekly and monthly consumption charts make it easy to spot spikes before they become a problem.",
  },
  {
    icon: PeopleFill,
    title: "Multi-Tier Oversight",
    desc: "Platform-wide visibility across every registered community and its residents.",
  },
  {
    icon: BellFill,
    title: "Usage Alerts",
    desc: "Threshold-based notifications keep everyone informed when consumption trends upward.",
  },
];

function EmbeddedSignInForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("approved", String(response.data.approved));
      navigate(roleRedirects[response.data.role] || "/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wm-embed-login">
      <div className="wm-embed-login-icon">
        <Droplet size={22} />
      </div>
      <h5 className="wm-embed-login-title">Sign In</h5>
      <p className="wm-embed-login-subtitle">
        Enter your credentials to continue
      </p>

      <form onSubmit={handleLogin}>
        <div className="wm-embed-field">
          <label>Username</label>
          <div className="wm-embed-input-group">
            <PersonFill size={14} />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="wm-embed-field">
          <label>Password</label>
          <div className="wm-embed-input-group">
            <KeyFill size={14} />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && <p className="wm-embed-error">{error}</p>}

        <button className="wm-embed-submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="wm-embed-footer">
        New here?{" "}
        <button className="wm-link-btn" onClick={() => navigate("/register")}>
          Register
        </button>
      </p>
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="wm-land">
      {/* Navbar */}
      <header className="wm-land-nav">
        <div className="wm-land-nav-inner">
          <div className="wm-land-brand">
            <div className="wm-land-brand-mark">
              <Droplet size={17} />
            </div>
            <span>Water Billing</span>
          </div>
          <nav className="wm-land-nav-links">
            <button onClick={() => scrollTo("features")}>Features</button>
            <button onClick={() => scrollTo("roles")}>Get Started</button>
          </nav>
          <button
            className="wm-land-btn-primary wm-land-nav-cta"
            onClick={() => scrollTo("roles")}
          >
            Get Started
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="wm-hero">
        <div className="wm-hero-blob wm-hero-blob-1" />
        <div className="wm-hero-blob wm-hero-blob-2" />
        <div className="wm-hero-blob wm-hero-blob-3" />

        <div className="wm-hero-content">
          <span className="wm-hero-eyebrow">
            Water Usage Monitoring &amp; Billing
          </span>
          <h1 className="wm-hero-title">
            Track water usage.
            <br />
            Manage communities.
            <br />
            <span className="wm-hero-title-accent">All in one place.</span>
          </h1>
          <p className="wm-hero-subtitle">
            A role-based platform for apartment communities — residents log
            usage, community admins manage their residents, and super admins
            oversee it all.
          </p>
          <div className="wm-hero-actions">
            <button
              className="wm-land-btn-primary"
              onClick={() => scrollTo("roles")}
            >
              Get Started
              <ArrowRight size={15} />
            </button>
            <button
              className="wm-land-btn-ghost"
              onClick={() => scrollTo("features")}
            >
              See Features
            </button>
          </div>
        </div>

        <svg
          className="wm-hero-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,64 L1440,120 L0,120 Z"
            fill="#F6F8FB"
          />
        </svg>
      </section>

      {/* Features */}
      <section className="wm-section" id="features">
        <div className="wm-section-head">
          <span className="wm-section-eyebrow">Features</span>
          <h2 className="wm-section-title">
            Built for every level of the community
          </h2>
        </div>

        <div className="wm-features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div className="wm-feature-card" key={i}>
                <div className="wm-feature-icon">
                  <Icon size={19} />
                </div>
                <h6>{f.title}</h6>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role selection - single unified block */}
      <section className="wm-section wm-section-alt" id="roles">
        <div className="wm-section-head">
          <span className="wm-section-eyebrow">Get Started</span>
          <h2 className="wm-section-title">
            Choose how you'll use the platform
          </h2>
        </div>

        <EmbeddedSignInForm />
      </section>

      {/* Trust strip */}
      <section className="wm-trust">
        <div className="wm-trust-item">
          <CheckCircleFill size={15} /> JWT-secured authentication
        </div>
        <div className="wm-trust-item">
          <CheckCircleFill size={15} /> Role-scoped data access
        </div>
        <div className="wm-trust-item">
          <CheckCircleFill size={15} /> Real usage-based insights
        </div>
      </section>

      {/* Footer */}
      <footer className="wm-footer">
        <div className="wm-land-brand">
          <div className="wm-land-brand-mark">
            <Droplet size={15} />
          </div>
          <span>Water Billing</span>
        </div>
        <p>Water Usage Monitoring &amp; Billing Administration Platform</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .wm-land {
          font-family: 'Inter', sans-serif;
          color: #0F172A;
          background: #F6F8FB;
          overflow-x: hidden;
        }

        /* Navbar */
        .wm-land-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(11,28,44,0.85);
          backdrop-filter: blur(10px);
        }
        .wm-land-nav-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .wm-land-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 15.5px;
          color: #fff;
        }
        .wm-land-brand-mark {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: #14B8A6;
          color: #06231f;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wm-land-nav-links {
          display: flex;
          gap: 6px;
        }
        .wm-land-nav-links button {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.75);
          font-size: 13.5px;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
        }
        .wm-land-nav-links button:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .wm-land-nav-cta { padding: 9px 16px !important; font-size: 13.5px !important; }

        @media (max-width: 767px) {
          .wm-land-nav-links { display: none; }
        }

        /* Buttons */
        .wm-land-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #14B8A6;
          color: #06231f;
          border: none;
          padding: 13px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14.5px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .wm-land-btn-primary:hover { background: #0EA99A; transform: translateY(-1px); }

        .wm-land-btn-ghost {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
          padding: 13px 24px;
          border-radius: 10px;
          font-weight: 500;
          font-size: 14.5px;
          cursor: pointer;
        }
        .wm-land-btn-ghost:hover { background: rgba(255,255,255,0.14); }

        /* Hero */
        .wm-hero {
          position: relative;
          background: #0B1C2C;
          padding: 90px 24px 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .wm-hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.35;
        }
        .wm-hero-blob-1 { width: 420px; height: 420px; background: #14B8A6; top: -120px; left: -100px; }
        .wm-hero-blob-2 { width: 380px; height: 380px; background: #6366F1; top: -60px; right: -120px; }
        .wm-hero-blob-3 { width: 300px; height: 300px; background: #0EA5E9; bottom: -60px; left: 40%; opacity: 0.25; }

        .wm-hero-content {
          position: relative;
          z-index: 2;
          max-width: 720px;
          text-align: center;
          padding-bottom: 90px;
        }
        .wm-hero-eyebrow {
          display: inline-block;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.4px;
          color: #5EEAD4;
          background: rgba(20,184,166,0.14);
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 22px;
        }
        .wm-hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 44px;
          line-height: 1.15;
          color: #fff;
          letter-spacing: -1px;
          margin-bottom: 18px;
        }
        .wm-hero-title-accent {
          background: linear-gradient(90deg, #5EEAD4, #7DD3FC);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .wm-hero-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.68);
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .wm-hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .wm-hero-wave {
          width: 100%;
          height: 90px;
          display: block;
        }

        @media (max-width: 640px) {
          .wm-hero-title { font-size: 32px; }
        }

        /* Sections */
        .wm-section { padding: 70px 24px; max-width: 1160px; margin: 0 auto; }
        .wm-section-alt { background: #fff; max-width: none; padding-left: 0; padding-right: 0; }
        .wm-section-alt > * { max-width: 1160px; margin-left: auto; margin-right: auto; padding-left: 24px; padding-right: 24px; }
        .wm-section-alt .wm-roles-grid { padding-left: 24px; padding-right: 24px; }

        .wm-embed-login {
          max-width: 380px;
          margin: 0 auto;
          background: #F6F8FB;
          border: 1px solid #E7EBF1;
          border-radius: 20px;
          padding: 34px 30px;
          text-align: center;
        }
        .wm-embed-login-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #E3FBF6;
          color: #0D9488;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .wm-embed-login-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: #0F172A;
          margin-bottom: 4px;
        }
        .wm-embed-login-subtitle {
          font-size: 13.5px;
          color: #64748B;
          margin-bottom: 22px;
        }
        .wm-embed-field {
          text-align: left;
          margin-bottom: 14px;
        }
        .wm-embed-field label {
          font-size: 12px;
          color: #64748B;
          display: block;
          margin-bottom: 6px;
        }
        .wm-embed-input-group {
          display: flex;
          align-items: center;
          gap: 9px;
          background: #fff;
          border: 1px solid #E7EBF1;
          border-radius: 10px;
          padding: 0 12px;
          height: 44px;
          transition: border-color 0.15s ease;
        }
        .wm-embed-input-group:focus-within { border-color: #14B8A6; }
        .wm-embed-input-group svg { color: #a3adba; flex-shrink: 0; }
        .wm-embed-input-group input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 14px;
          height: 100%;
          background: transparent;
        }
        .wm-embed-error {
          color: #EF4444;
          font-size: 12.5px;
          text-align: left;
          margin: -4px 0 12px;
        }
        .wm-embed-submit {
          width: 100%;
          background: #14B8A6;
          color: #06231f;
          border: none;
          height: 44px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .wm-embed-submit:hover { background: #0EA99A; }
        .wm-embed-submit:disabled { opacity: 0.7; cursor: default; }
        .wm-embed-footer {
          font-size: 13px;
          color: #64748B;
          margin: 18px 0 0;
        }
        .wm-link-btn {
          background: transparent;
          border: none;
          color: #0D9488;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
        }
        .wm-link-btn:hover { text-decoration: underline; }

        .wm-section-head { text-align: center; max-width: 560px; margin: 0 auto 44px; }
        .wm-section-eyebrow {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #0D9488;
          margin-bottom: 10px;
        }
        .wm-section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 28px;
          color: #0F172A;
          letter-spacing: -0.5px;
        }

        .wm-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .wm-feature-card {
          background: #fff;
          border: 1px solid #E7EBF1;
          border-radius: 16px;
          padding: 22px;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .wm-feature-card:hover { transform: translateY(-2px); border-color: #14B8A6; }
        .wm-feature-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #E3FBF6;
          color: #0D9488;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .wm-feature-card h6 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 6px;
          color: #0F172A;
        }
        .wm-feature-card p {
          font-size: 13px;
          color: #64748B;
          line-height: 1.55;
          margin: 0;
        }

        @media (max-width: 900px) {
          .wm-features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .wm-features-grid { grid-template-columns: 1fr; }
        }

        .wm-role-block {
          max-width: 480px;
          margin: 0 auto;
          background: #F6F8FB;
          border: 1px solid #E7EBF1;
          border-radius: 20px;
          padding: 10px;
        }
        .wm-role-tabs {
          display: flex;
          gap: 4px;
          background: #fff;
          border-radius: 14px;
          padding: 5px;
          margin-bottom: 4px;
        }
        .wm-role-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background: transparent;
          border: none;
          padding: 10px 8px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .wm-role-tab-active {
          background: var(--role-accent-soft);
          color: var(--role-accent);
        }
        @media (max-width: 480px) {
          .wm-role-tab span { display: none; }
        }

        .wm-role-content {
          padding: 28px 20px 24px;
          text-align: center;
        }
        .wm-role-icon {
          width: 54px;
          height: 54px;
          border-radius: 15px;
          background: var(--role-accent-soft);
          color: var(--role-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .wm-role-content h5 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #0F172A;
          margin-bottom: 8px;
        }
        .wm-role-content p {
          font-size: 13.5px;
          color: #64748B;
          line-height: 1.6;
          margin-bottom: 22px;
          min-height: 42px;
        }
        .wm-role-note {
          font-size: 11.5px;
          color: #94A3B8;
          margin: 14px 0 0;
        }
        .wm-role-actions {
          display: flex;
          gap: 10px;
        }
        .wm-role-btn-primary {
          flex: 1;
          background: var(--role-accent);
          color: #fff;
          border: none;
          padding: 12px 0;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }
        .wm-role-btn-primary:hover { opacity: 0.9; }
        .wm-role-btn-outline {
          flex: 1;
          background: #fff;
          color: var(--role-accent);
          border: 1.5px solid var(--role-accent);
          padding: 12px 0;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .wm-trust {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          padding: 20px 24px 60px;
          max-width: 1160px;
          margin: 0 auto;
        }
        .wm-trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #0D9488;
        }

        .wm-footer {
          background: #0B1C2C;
          padding: 40px 24px;
          text-align: center;
        }
        .wm-footer .wm-land-brand { justify-content: center; margin-bottom: 8px; }
        .wm-footer p {
          font-size: 12.5px;
          color: rgba(255,255,255,0.45);
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
