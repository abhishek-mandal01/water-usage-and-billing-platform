import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfUse = () => {
  return (
    <div style={{ padding: '60px 40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: '#111827' }}>
      <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', textDecoration: 'none', fontWeight: 600, marginBottom: '40px' }}>
        <ArrowLeft size={20} /> Back
      </Link>
      <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px' }}>Terms of Use</h1>
      <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '20px', color: '#4b5563' }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>1. Acceptance of Terms</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#4b5563' }}>
          By accessing and using the SmartWater platform, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
      </section>
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>2. User Responsibilities</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#4b5563' }}>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and current information.
        </p>
      </section>
      <section>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>3. Service Modifications</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#4b5563' }}>
          We reserve the right to modify or discontinue the service with or without notice to you. We shall not be liable to you or any third party should we exercise our right to modify or discontinue the service.
        </p>
      </section>
    </div>
  );
};
export default TermsOfUse;
