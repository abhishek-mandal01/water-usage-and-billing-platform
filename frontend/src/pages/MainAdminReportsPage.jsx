import MainAdminSidebar from '../components/MainAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Download, FileText, BarChart3, ShieldCheck } from 'lucide-react';

function MainAdminReportsPage() {
  const handleExportBillingSummary = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Community Name,Billing Cycle,Total Consumption (L),Total Amount Billed (INR),Paid Status\n" +
      "Greenwood Heights,June 2026,52000,260000,PAID\n" +
      "Sunrise Enclave,June 2026,68000,306000,PAID\n" +
      "Oasis Gardens,June 2026,34000,204000,UNPAID\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "billing_summary_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportWaterAudit = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Household No,Community,Meter Serial,Consumption (L),Leak Flag,Alert Sent\n" +
      "Apt 101,Greenwood Heights,WM-101,12500,No,No\n" +
      "Apt 205,Sunrise Enclave,WM-205,24000,Yes,Yes\n" +
      "Apt 302,Oasis Gardens,WM-302,9800,No,No\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "water_usage_audit.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-layout">
      <MainAdminSidebar />
      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <div className="page-header">
            <div>
              <h1>System Reports & Audit Generator</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
                Generate and download comprehensive system audits, monthly financial summaries, and anomaly logs.
              </p>
            </div>
          </div>

          <MagicCardGrid>
            <div className="grid-3">
              <MagicCard style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText color="var(--color-primary-600)" size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>Monthly Billing Report</h3>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>CSV Data Export</span>
                  </div>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                  Itemized summary of billed amounts, payment realization rates, and shared area cost distribution.
                </p>
                <button className="btn btn-primary" onClick={handleExportBillingSummary}>
                  <Download size={16} /> Export CSV
                </button>
              </MagicCard>

              <MagicCard style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 color="var(--color-accent-600)" size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>Water Audit Log</h3>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Anomaly & Consumption Audit</span>
                  </div>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                  Detailed log of meter readings, standard deviation leak flags, and threshold warning alerts.
                </p>
                <button className="btn btn-outline" onClick={handleExportWaterAudit}>
                  <Download size={16} /> Export Audit
                </button>
              </MagicCard>

              <MagicCard style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-success-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck color="var(--color-success-600)" size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>Community Audit</h3>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Verification & Compliance</span>
                  </div>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                  Audit report of registered community admins, PAN/Aadhar verification status, and active flat counts.
                </p>
                <button className="btn btn-success" onClick={handleExportBillingSummary}>
                  <Download size={16} /> Export Compliance
                </button>
              </MagicCard>
            </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default MainAdminReportsPage;
