import { useState, useEffect } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Calculator, Save } from 'lucide-react';

function TariffConfigPage() {
  const [apartmentConfig, setApartmentConfig] = useState({
    baseRate: 5.0,
    excessRate: 8.0,
    tierLimit: 10000.0,
    usageAlertThreshold: 20000.0,
    lateFeePerMonth: 50.0,
    gracePeriodDays: 15
  });

  const [simUsage, setSimUsage] = useState(15000);
  const [simMonthsLate, setSimMonthsLate] = useState(0);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const adminId = JSON.parse(localStorage.getItem('user'))?.id || 1;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/config/apartment-config?adminId=${adminId}`);
        if (res.ok) {
          const data = await res.json();
          setApartmentConfig({
            baseRate: data.baseRate ?? 5.0,
            excessRate: data.excessRate ?? 8.0,
            tierLimit: data.tierLimit ?? 10000.0,
            usageAlertThreshold: data.usageAlertThreshold ?? 20000.0,
            lateFeePerMonth: data.lateFeePerMonth ?? 50.0,
            gracePeriodDays: data.gracePeriodDays ?? 15
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [adminId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg('Saving tariff configuration...');
    try {
      const params = new URLSearchParams({
        adminId: adminId.toString(),
        baseRate: apartmentConfig.baseRate.toString(),
        excessRate: apartmentConfig.excessRate.toString(),
        tierLimit: apartmentConfig.tierLimit.toString(),
        usageAlertThreshold: apartmentConfig.usageAlertThreshold.toString(),
        lateFeePerMonth: apartmentConfig.lateFeePerMonth.toString(),
        gracePeriodDays: apartmentConfig.gracePeriodDays.toString()
      });

      const res = await fetch(`http://localhost:8081/api/config/apartment-config?${params.toString()}`, {
        method: 'POST'
      });

      if (res.ok) {
        setMsg('Tariff plan updated successfully!');
      } else {
        setMsg('Failed to update tariff plan.');
      }
    } catch (err) {
      console.error(err);
      setMsg('Error saving configuration.');
    }
  };

  // Real-time calculation preview
  const calcBaseAmount = Math.min(simUsage, apartmentConfig.tierLimit) * apartmentConfig.baseRate;
  const calcExcessAmount = Math.max(0, simUsage - apartmentConfig.tierLimit) * apartmentConfig.excessRate;
  const calcLateFeeAmount = simMonthsLate * apartmentConfig.lateFeePerMonth;
  const calcTotalAmount = calcBaseAmount + calcExcessAmount + calcLateFeeAmount;

  return (
    <div className="dashboard-layout">
      <CommunityAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>Tariff Plan & Rate Configuration</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Configure tiered rate limits, excess consumption multipliers, late payment surcharges, and usage alert thresholds for your apartment community.
              </p>
            </div>
          </div>

          {msg && <div className="alert alert-info" style={{ marginBottom: 'var(--space-5)' }}>{msg}</div>}

          <MagicCardGrid>
            <div className="grid-2">
              {/* Tariff Configuration Form */}
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  Community Tariff Tiers & Fees
                </h3>

                {loading ? (
                  <div className="loading-screen" style={{ height: '200px' }}>Loading...</div>
                ) : (
                  <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                      <label className="form-label">Tier 1 Base Rate (₹ / Litre)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        required
                        value={apartmentConfig.baseRate}
                        onChange={(e) => setApartmentConfig({ ...apartmentConfig, baseRate: parseFloat(e.target.value) || 0 })}
                        className="form-input"
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Applied to consumption up to tier limit.</span>
                    </div>

                    <div>
                      <label className="form-label">Tier 1 Volume Limit (Liters)</label>
                      <input
                        type="number"
                        step="100"
                        min="0"
                        required
                        value={apartmentConfig.tierLimit}
                        onChange={(e) => setApartmentConfig({ ...apartmentConfig, tierLimit: parseFloat(e.target.value) || 0 })}
                        className="form-input"
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Threshold (e.g. 10,000 L) before Tier 2 excess pricing applies.</span>
                    </div>

                    <div>
                      <label className="form-label">Tier 2 Excess Rate (₹ / Litre)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        required
                        value={apartmentConfig.excessRate}
                        onChange={(e) => setApartmentConfig({ ...apartmentConfig, excessRate: parseFloat(e.target.value) || 0 })}
                        className="form-input"
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Higher multiplier applied to consumption beyond Tier 1 limit.</span>
                    </div>

                    <div>
                      <label className="form-label">Late Payment Fee per Month (₹ / Month)</label>
                      <input
                        type="number"
                        step="10"
                        min="0"
                        required
                        value={apartmentConfig.lateFeePerMonth}
                        onChange={(e) => setApartmentConfig({ ...apartmentConfig, lateFeePerMonth: parseFloat(e.target.value) || 0 })}
                        className="form-input"
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Extra surcharge charged for every month the payment is late.</span>
                    </div>

                    <div>
                      <label className="form-label">Payment Grace Period (Days)</label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        required
                        value={apartmentConfig.gracePeriodDays}
                        onChange={(e) => setApartmentConfig({ ...apartmentConfig, gracePeriodDays: parseInt(e.target.value) || 0 })}
                        className="form-input"
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Number of days after cycle end date before late payment surcharge starts accumulating.</span>
                    </div>

                    <div>
                      <label className="form-label">Usage Alert Threshold (Liters)</label>
                      <input
                        type="number"
                        step="500"
                        min="0"
                        required
                        value={apartmentConfig.usageAlertThreshold}
                        onChange={(e) => setApartmentConfig({ ...apartmentConfig, usageAlertThreshold: parseFloat(e.target.value) || 0 })}
                        className="form-input"
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Triggers automatic high usage email alert to household.</span>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-2)' }}>
                      <Save size={16} /> Save Tariff Settings
                    </button>
                  </form>
                )}
              </MagicCard>

              {/* Real-time Calculation Simulator */}
              <MagicCard style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calculator size={20} color="var(--color-primary-500)" /> Tariff Calculation Preview
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-4) 0' }}>
                  Test how your configured rates and late fees will calculate household bills based on hypothetical consumption and overdue delay.
                </p>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="form-label">Simulated Consumption (Liters): {simUsage.toLocaleString()} L</label>
                  <input
                    type="range"
                    min="1000"
                    max="40000"
                    step="500"
                    value={simUsage}
                    onChange={(e) => setSimUsage(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-primary-600)' }}
                  />
                </div>

                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <label className="form-label">Simulated Payment Delay: {simMonthsLate} Month(s) Overdue</label>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="1"
                    value={simMonthsLate}
                    onChange={(e) => setSimMonthsLate(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-danger-500)' }}
                  />
                </div>

                <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tier 1 Base Portion ({Math.min(simUsage, apartmentConfig.tierLimit).toLocaleString()} L @ ₹{apartmentConfig.baseRate}/L):</span>
                    <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>₹{calcBaseAmount.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tier 2 Excess Portion ({Math.max(0, simUsage - apartmentConfig.tierLimit).toLocaleString()} L @ ₹{apartmentConfig.excessRate}/L):</span>
                    <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-danger-500)' }}>₹{calcExcessAmount.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Late Payment Surcharge ({simMonthsLate} Mo. @ ₹{apartmentConfig.lateFeePerMonth}/mo):</span>
                    <span style={{ fontWeight: 'var(--font-semibold)', color: simMonthsLate > 0 ? '#dc2626' : 'var(--text-tertiary)' }}>₹{calcLateFeeAmount.toFixed(2)}</span>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: 'var(--space-2) 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Estimated Total Bill:</span>
                    <span style={{ color: 'var(--color-primary-600)' }}>₹{calcTotalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </MagicCard>
            </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default TariffConfigPage;
