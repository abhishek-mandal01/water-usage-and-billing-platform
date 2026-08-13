import { useState, useEffect } from 'react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function MainAdminTariffsPage() {
  const { t } = useTranslation();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await fetch('http://localhost:8081/api/config/apartments/all');
        if (res.ok) setApartments(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>{t("mainAdmin.systemTariffConfigurationAudit")}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                {t("mainAdmin.systemwidetariffauditbaselinetier")}
              </p>
            </div>
          </div>

          <MagicCardGrid>
            <MagicCard style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                {t("mainAdmin.communityTariffOverview")}
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t("mainAdmin.communityName")}</th>
                      <th>{t("mainAdmin.baseRateL")}</th>
                      <th>{t("mainAdmin.tierLimitL")}</th>
                      <th>{t("mainAdmin.excessRateL")}</th>
                      <th>{t("mainAdmin.alertThresholdL")}</th>
                      <th>{t("mainAdmin.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                    ) : apartments.length === 0 ? (
                      <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No communities registered yet.</td></tr>
                    ) : (
                      apartments.map((apt) => (
                        <tr key={apt.id}>
                          <td style={{ fontWeight: 'var(--font-semibold)' }}>{apt.name}</td>
                          <td>₹{apt.baseRate ? apt.baseRate.toFixed(2) : '5.00'}</td>
                          <td>{apt.tierLimit ? apt.tierLimit.toLocaleString() : '10,000'} L</td>
                          <td>₹{apt.excessRate ? apt.excessRate.toFixed(2) : '8.00'}</td>
                          <td>{apt.usageAlertThreshold ? apt.usageAlertThreshold.toLocaleString() : '20,000'} L</td>
                          <td><span className="badge badge-success">{t("mainAdmin.active")}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </MagicCard>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default MainAdminTariffsPage;