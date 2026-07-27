import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function MainAdminTariffsPage() {
  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>System Tariff Configuration & Audit</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                System-wide tariff audit, baseline tier rate policies, and community tariff configurations.
              </p>
            </div>
          </div>

          <MagicCardGrid>
            <MagicCard style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                Community Tariff Overview
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Community Name</th>
                      <th>Base Rate (₹/L)</th>
                      <th>Tier Limit (L)</th>
                      <th>Excess Rate (₹/L)</th>
                      <th>Alert Threshold (L)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 'var(--font-semibold)' }}>Greenwood Heights</td>
                      <td>₹5.0</td>
                      <td>10,000 L</td>
                      <td>₹8.0</td>
                      <td>20,000 L</td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'var(--font-semibold)' }}>Sunrise Enclave</td>
                      <td>₹4.5</td>
                      <td>12,000 L</td>
                      <td>₹7.5</td>
                      <td>25,000 L</td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'var(--font-semibold)' }}>Oasis Gardens</td>
                      <td>₹6.0</td>
                      <td>8,000 L</td>
                      <td>₹10.0</td>
                      <td>15,000 L</td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
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
