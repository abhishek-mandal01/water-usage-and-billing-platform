import { useState, useEffect } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function BulkPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
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
        setTimeout(() => setFormData(prev => ({ ...prev, totalCost: (vol * price).toFixed(2) })), 0);
      }
    } else {
      setTimeout(() => setFormData(prev => ({ ...prev, totalCost: '' })), 0);
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
        
        <main style={{ padding: '40px', marginTop: '60px' }}>
          <h1 style={{ marginBottom: '20px' }}>Bulk Water Purchases</h1>
          {msg && <p style={{ color: 'green', marginBottom: '10px' }}>{msg}</p>}

          <MagicCardGrid>
            <MagicCard style={{ flex: '1 1 350px', padding: '25px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Log New Purchase</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Vendor Name</label>
                  <input type="text" placeholder="e.g. Municipal Supply, Tanker Co." value={formData.vendorName} onChange={e => setFormData({...formData, vendorName: e.target.value})} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Date of Purchase / Delivery</label>
                  <input type="date" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} style={inputStyle} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: 'bold' }}>Volume (Liters) <span style={{color: 'red'}}>*</span></label>
                    <input type="number" required min="1" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} value={formData.volumeLiters} onChange={(e) => setFormData({...formData, volumeLiters: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: 'bold' }}>Base Price (₹/L) <span style={{color: 'red'}}>*</span></label>
                    <input type="number" required min="0.01" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: 'bold' }}>Total Cost (₹) <span style={{color: 'red'}}>*</span></label>
                    <input type="number" required min="0" step="0.01" readOnly style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' }} value={formData.totalCost} placeholder="Auto-calculated" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: 'bold' }}>Receipt / Invoice Number</label>
                    <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} value={formData.receiptNumber} onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})} />
                  </div>
                </div>
                <button type="submit" style={btnStyle}>Log Purchase</button>
              </form>
            </MagicCard>

            <MagicCard style={{ flex: '2 1 500px', padding: '25px' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Purchase History</h3>
              {loading ? (
                <p>Loading...</p>
              ) : purchases.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No bulk purchases recorded yet.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px' }}>Vendor</th>
                      <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>Volume (L)</th>
                      <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>Base Price (₹/L)</th>
                      <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>Total Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px' }}>{p.purchaseDate}</td>
                        <td style={{ padding: '12px' }}>{p.vendorName}</td>
                        <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', color: '#111827' }}>{p.volumeLiters.toLocaleString()} L</td>
                        <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', color: '#111827' }}>₹{p.basePrice ? p.basePrice.toFixed(2) : '-'}</td>
                        <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb', color: '#111827', fontWeight: 'bold' }}>₹{p.totalCost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </MagicCard>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '5px' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' };

export default BulkPurchases;
