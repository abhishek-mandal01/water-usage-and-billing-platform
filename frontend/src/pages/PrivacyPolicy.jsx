import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '60px 40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: '#111827' }}>
      <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', textDecoration: 'none', fontWeight: 600, marginBottom: '40px' }}>
        <ArrowLeft size={20} /> Back
      </Link>
      <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px' }}>Privacy Policy</h1>
      <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '20px', color: '#4b5563' }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>1. Information We Collect</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#4b5563' }}>
          We collect personal information such as your name, email address, phone number, and water usage data to provide our billing and tracking services efficiently.
        </p>
      </section>
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>2. How We Use Your Information</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#4b5563' }}>
          Your data is used to calculate water bills accurately, provide usage analytics, and maintain your account security. We do not sell your personal data to third parties.
        </p>
      </section>
      <section>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>3. Data Security</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#4b5563' }}>
          We implement industry-standard security measures to protect your personal and billing information from unauthorized access or disclosure.
        </p>
      </section>
    </div>
  );
};
export default PrivacyPolicy;
