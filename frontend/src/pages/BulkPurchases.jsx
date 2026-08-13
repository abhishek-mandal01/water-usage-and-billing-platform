import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function BulkPurchases() {const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [formData, setFormData] = useState({
    vendorName: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    volumeLiters: '',
    basePrice: '',
    totalCost: '',
    receiptNumber: ''
  });

  const adminId = JSON.parse(localStorage.getItem('user'))?.id;

  const fetchPurchases = async () => {
    if (!adminId) return;
    try {
      const res = await fetch(`http://localhost:8081/api/bulk-purchases/community/${adminId}`);
      if (res.ok) {
        setPurchases(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formData.volumeLiters && formData.basePrice) {
      const vol = parseFloat(formData.volumeLiters);
      const price = parseFloat(formData.basePrice);
      if (!isNaN(vol) && !isNaN(price)) {
        setTimeout(() => setFormData((prev) => ({ ...prev, totalCost: (vol * price).toFixed(2) })), 0);
      }
    } else {
      setTimeout(() => setFormData((prev) => ({ ...prev, totalCost: '' })), 0);
    }
  }, [formData.volumeLiters, formData.basePrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8081/api/bulk-purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, adminId })
      });
      if (res.ok) {
        setMsg('Purchase logged successfully!');
        setFormData({
          vendorName: '',
          purchaseDate: new Date().toISOString().split('T')[0],
          volumeLiters: '',
          basePrice: '',
          totalCost: '',
          receiptNumber: ''
        });
        fetchPurchases();
      }
    } catch (err) {
      console.error(err);
      alert('Error recording purchase.');
    }
  };

  return (
    <div className="dashboard-layout">
      <CommunityAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <h1 style={{ marginBottom: '20px' }}>{t("communityAdmin.bulkWaterPurchases")}</h1>
          {msg && <p style={{ color: 'var(--color-success-500)', marginBottom: '10px' }}>{msg}</p>}

          <MagicCardGrid>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'stretch' }}>
            <MagicCard style={{ flex: '1 1 350px', padding: '25px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>{t("communityAdmin.logNewPurchase")}</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>{t("communityAdmin.vendorName")}</label>
                  <input type="text" placeholder="e.g. Municipal Supply, Tanker Co." value={formData.vendorName} onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>{t("communityAdmin.dateofPurchaseDelivery")}</label>
                  <input type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} style={inputStyle} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>{t("communityAdmin.volumeLiters")}<span style={{ color: 'var(--color-danger-500)' }}>*</span></label>
                    <input type="number" required min="1" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }} value={formData.volumeLiters} onChange={(e) => setFormData({ ...formData, volumeLiters: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>{t("communityAdmin.basePriceL")}<span style={{ color: 'var(--color-danger-500)' }}>*</span></label>
                    <input type="number" required min="0.01" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }} value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>{t("communityAdmin.totalCost")}<span style={{ color: 'var(--color-danger-500)' }}>*</span></label>
                    <input type="number" required min="0" step="0.01" readOnly style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', backgroundColor: 'var(--color-surface-50)', color: 'var(--text-secondary)', cursor: 'not-allowed' }} value={formData.totalCost} placeholder="Auto-calculated" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>{t("communityAdmin.receiptInvoiceNumber")}</label>
                    <input type="text" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }} value={formData.receiptNumber} onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })} />
                  </div>
                </div>
                <button type="submit" style={btnStyle}>{t("communityAdmin.logPurchase")}</button>
              </form>
            </MagicCard>

            <MagicCard style={{ flex: '2 1 500px', padding: '25px', maxHeight: '500px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>{t("communityAdmin.purchaseHistory")}</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="date" value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)} style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none' }} />
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>to</span>
                  <input type="date" value={searchEndDate} onChange={(e) => setSearchEndDate(e.target.value)} style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none' }} />
                  {(searchStartDate || searchEndDate) && (
                    <button 
                      onClick={() => { setSearchStartDate(''); setSearchEndDate(''); }}
                      title="Clear Dates"
                      style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', backgroundColor: 'var(--color-surface-100)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <div style={{ overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
              {loading ?
              <p>{t("communityAdmin.loading")}</p> :
              purchases.filter(p => {
                const date = p.purchaseDate;
                if (searchStartDate && date < searchStartDate) return false;
                if (searchEndDate && date > searchEndDate) return false;
                return true;
              }).length === 0 ?
              <p style={{ color: 'var(--text-secondary)' }}>No purchases match your criteria.</p> :

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                      <th style={{ padding: '12px' }}>{t("communityAdmin.date")}</th>
                      <th style={{ padding: '12px' }}>{t("communityAdmin.vendor")}</th>
                      <th style={{ padding: '15px', borderBottom: '1px solid var(--border-default)', textAlign: 'left', color: 'var(--text-secondary)' }}>{t("communityAdmin.volumeL")}</th>
                      <th style={{ padding: '15px', borderBottom: '1px solid var(--border-default)', textAlign: 'left', color: 'var(--text-secondary)' }}>{t("communityAdmin.basePriceL")}</th>
                      <th style={{ padding: '15px', borderBottom: '1px solid var(--border-default)', textAlign: 'left', color: 'var(--text-secondary)' }}>{t("communityAdmin.totalCost")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.filter(p => {
                      const date = p.purchaseDate;
                      if (searchStartDate && date < searchStartDate) return false;
                      if (searchEndDate && date > searchEndDate) return false;
                      return true;
                    }).map((p) =>
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-surface-50)' }}>
                        <td style={{ padding: '12px' }}>{p.purchaseDate}</td>
                        <td style={{ padding: '12px' }}>{p.vendorName}</td>
                        <td style={{ padding: '15px', borderBottom: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>{p.volumeLiters.toLocaleString()} L</td>
                        <td style={{ padding: '15px', borderBottom: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>₹{p.basePrice ? p.basePrice.toFixed(2) : '-'}</td>
                        <td style={{ padding: '15px', borderBottom: '1px solid var(--border-default)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>₹{p.totalCost.toFixed(2)}</td>
                      </tr>
                  )}
                  </tbody>
                </table>
              }
              </div>
            </MagicCard>
            </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>);

}

const labelStyle = { display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--text-secondary)', marginBottom: '5px' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: 'var(--color-primary-500)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'var(--font-bold)', fontSize: '15px' };

export default BulkPurchases;