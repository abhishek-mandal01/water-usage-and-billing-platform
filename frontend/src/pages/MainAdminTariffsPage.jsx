import { useState, useEffect } from 'react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function MainAdminTariffsPage() {
  const { t } = useTranslation();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');

  const filteredApartments = apartments.filter(apt => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (apt.name || '').toLowerCase().includes(q);
  });

  const sortedApartments = [...filteredApartments].sort((a, b) => {
    if (sortOption === 'name_asc') return (a.name || '').localeCompare(b.name || '');
    if (sortOption === 'name_desc') return (b.name || '').localeCompare(a.name || '');
    if (sortOption === 'base_high') return (b.baseRate || 5) - (a.baseRate || 5);
    if (sortOption === 'base_low') return (a.baseRate || 5) - (b.baseRate || 5);
    return 0;
  });

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  {t("mainAdmin.communityTariffOverview")}
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="base_high">Base Rate (High to Low)</option>
                    <option value="base_low">Base Rate (Low to High)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', width: '200px' }}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary-50)' }}>
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
                    ) : sortedApartments.length === 0 ? (
                      <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No communities registered yet.</td></tr>
                    ) : (
                      sortedApartments.map((apt) => (
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
