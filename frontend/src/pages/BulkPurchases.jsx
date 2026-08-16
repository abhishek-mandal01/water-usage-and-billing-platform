import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';

function BulkPurchases() {const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [sortOption, setSortOption] = useState('newest');
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

  const filteredPurchases = purchases.filter(p => {
    const date = p.purchaseDate;
    if (searchStartDate && date < searchStartDate) return false;
    if (searchEndDate && date > searchEndDate) return false;
    return true;
  });

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    if (sortOption === 'newest') return new Date(b.purchaseDate) - new Date(a.purchaseDate);
    if (sortOption === 'oldest') return new Date(a.purchaseDate) - new Date(b.purchaseDate);
    if (sortOption === 'vol_high') return b.volumeLiters - a.volumeLiters;
    if (sortOption === 'vol_low') return a.volumeLiters - b.volumeLiters;
    if (sortOption === 'cost_high') return b.totalCost - a.totalCost;
    if (sortOption === 'cost_low') return a.totalCost - b.totalCost;
    return 0;
  });

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
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="vol_high">Volume: High to Low</option>
                    <option value="vol_low">Volume: Low to High</option>
                    <option value="cost_high">Cost: High to Low</option>
                    <option value="cost_low">Cost: Low to High</option>
                  </select>
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
              sortedPurchases.length === 0 ?
              <p style={{ color: 'var(--text-secondary)' }}>No purchases match your criteria.</p> :

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary-50)',  borderBottom: '1px solid var(--border-default)' }}>
                      <th style={{ padding: '12px' }}>{t("communityAdmin.date")}</th>
                      <th style={{ padding: '12px' }}>{t("communityAdmin.vendor")}</th>
                      <th style={{ padding: '15px', borderBottom: '1px solid var(--border-default)', textAlign: 'left', color: 'var(--text-secondary)' }}>{t("communityAdmin.volumeL")}</th>
                      <th style={{ padding: '15px', borderBottom: '1px solid var(--border-default)', textAlign: 'left', color: 'var(--text-secondary)' }}>{t("communityAdmin.basePriceL")}</th>
                      <th style={{ padding: '15px', borderBottom: '1px solid var(--border-default)', textAlign: 'left', color: 'var(--text-secondary)' }}>{t("communityAdmin.totalCost")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPurchases.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                        <td style={{ padding: '15px', color: 'var(--text-primary)' }}>{p.purchaseDate}</td>
                        <td style={{ padding: '15px', color: 'var(--text-primary)' }}>
                          <div style={{ fontWeight: 'bold' }}>{p.vendorName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Receipt: {p.receiptNumber || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '15px', color: 'var(--text-primary)' }}>{p.volumeLiters != null ? p.volumeLiters.toLocaleString() : '0'} L</td>
                        <td style={{ padding: '15px', color: 'var(--text-primary)' }}>₹{p.basePrice != null ? p.basePrice.toFixed(2) : '0.00'}</td>
                        <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--color-primary-600)' }}>₹{p.totalCost != null ? p.totalCost.toFixed(2) : '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
              </div>
            </MagicCard>
            </div>

            {}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '25px' }}>
              {/* Procurement Volume by Vendor Horizontal Bar Chart */}
              <MagicCard style={{ padding: '25px', minHeight: '340px' }}>
                <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #5bbcaa, #34c77b)' }}></span>
                  Procurement Volume by Vendor (kL)
                </h3>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart
                      layout="vertical"
                      data={[
                        { vendor: 'Municipal Water', volume: 450, color: '#5bbcaa' },
                        { vendor: 'Tanker Co-Op', volume: 220, color: '#6c8eef' },
                        { vendor: 'River Supply', volume: 180, color: '#f5ae45' },
                        { vendor: 'Borewell Grid', volume: 120, color: '#34c77b' },
                        { vendor: 'Private Tankers', volume: 90, color: '#a78bfa' },
                      ]}
                      margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                    >
                      <defs>
                        {['#5bbcaa', '#6c8eef', '#f5ae45', '#34c77b', '#a78bfa'].map((color, i) => (
                          <linearGradient key={i} id={`bulkVendHGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.65} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-default)" />
                      <XAxis type="number" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}kL`} />
                      <YAxis type="category" dataKey="vendor" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} width={100} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${v} kL (${v * 1000} L)`, 'Volume']} />
                      <Bar dataKey="volume" name="Volume (kL)" radius={[0, 6, 6, 0]} barSize={22} animationDuration={1200} animationEasing="ease-out">
                        {['#5bbcaa', '#6c8eef', '#f5ae45', '#34c77b', '#a78bfa'].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#bulkVendHGrad${index})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {/* Monthly Procurement Expense Trend Area Chart */}
              <MagicCard style={{ padding: '25px', minHeight: '340px' }}>
                <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #f5ae45, #e86356)' }}></span>
                  Procurement Cost Trend (₹)
                </h3>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      data={[
                        { month: 'Apr', cost: 48000 },
                        { month: 'May', cost: 62000 },
                        { month: 'Jun', cost: 75000 },
                        { month: 'Jul', cost: 68000 },
                        { month: 'Aug', cost: 82000 },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="bulkCostGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f5ae45" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#f5ae45" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                      <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`₹${Number(v).toLocaleString()}`, 'Total Cost']} />
                      <Area type="monotone" dataKey="cost" name="Cost (₹)" stroke="#f5ae45" strokeWidth={3} fill="url(#bulkCostGrad)" dot={{ r: 5, fill: '#f5ae45', stroke: 'var(--bg-card)', strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
                    </AreaChart>
                  </ResponsiveContainer>
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