import { useState, useEffect, useCallback, useRef } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { FileText, X, Download, Droplet, Calendar, User, MapPin } from 'lucide-react';

function BillingManagement() {
  const [cycles, setCycles] = useState([]);
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [selectedBill, setSelectedBill] = useState(null);
  const billRef = useRef(null);

  const adminId = JSON.parse(localStorage.getItem('user'))?.id;

  const fetchCycles = useCallback(async () => {
    if (!adminId) return;
    try {
      const res = await fetch(`http://localhost:8081/api/billing-cycles/community/${adminId}`);
      if (res.ok) setCycles(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, [adminId]);

  const fetchBills = useCallback(async () => {
    if (!adminId) return;
    try {
      const res = await fetch(`http://localhost:8081/api/billing/community/${adminId}`);
      if (res.ok) setBills(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, [adminId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCycles();
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    if (!adminId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/billing-cycles/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, startDate, endDate })
      });
      if (res.ok) {
        alert('Billing Cycle Created successfully!');
        setStartDate('');
        setEndDate('');
        fetchCycles();
      } else {
        alert('Failed to create cycle');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to server');
    }
    setLoading(false);
  };

  const handleFinalizeCycle = async (cycleId) => {
    if (!adminId) return;
    if (!window.confirm("Are you sure? This will distribute bulk costs and generate finalized bills for this cycle.")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/billing-cycles/finalize/${cycleId}`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Cycle Finalized! Bills generated.');
        fetchCycles();
        fetchBills();
      } else {
        const text = await res.text();
        alert('Failed to finalize cycle: ' + text);
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to server');
    }
    setLoading(false);
  };

  const handleDownloadPdf = () => {
    if (!selectedBill) return;
    window.open(`http://localhost:8081/api/billing/pdf/${selectedBill.id}`, '_blank');
  };

  const filteredBills = bills.filter(bill => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = bill.user?.name?.toLowerCase() || '';
    const flat = bill.user?.householdNumber?.toLowerCase() || '';
    const billId = String(bill.id);
    return name.includes(q) || flat.includes(q) || billId.includes(q);
  });

  return (
    <div className="dashboard-layout">
      <CommunityAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <h1 style={{ marginBottom: '20px' }}>Billing Cycles & Distribution</h1>

          <MagicCardGrid>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'stretch' }}>
            {/* Create Cycle Form */}
            <MagicCard style={{ flex: '1 1 300px', padding: 'var(--space-8)' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Open New Billing Cycle</h3>
              <form onSubmit={handleCreateCycle} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', width: '100%', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', width: '100%', boxSizing: 'border-box' }} required />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: 'var(--color-success-500)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold' }}>
                  Create Cycle
                </button>
              </form>
            </MagicCard>

            {/* Cycles List */}
            <MagicCard style={{ flex: '2 1 500px', padding: 'var(--space-8)', overflowX: 'auto' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Active & Past Cycles</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Start Date</th>
                    <th style={{ padding: '12px' }}>End Date</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cycles.map(cycle => (
                    <tr key={cycle.id} style={{ borderBottom: '1px solid var(--color-surface-50)' }}>
                      <td style={{ padding: '12px' }}>#{cycle.id}</td>
                      <td style={{ padding: '12px' }}>{cycle.startDate}</td>
                      <td style={{ padding: '12px' }}>{cycle.endDate}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', backgroundColor: cycle.status === 'FINALIZED' ? 'var(--color-success-50)' : 'var(--color-warning-50)', color: cycle.status === 'FINALIZED' ? 'var(--color-success-700)' : 'var(--color-warning-700)' }}>
                          {cycle.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button 
                          onClick={() => handleFinalizeCycle(cycle.id)} 
                          disabled={loading || cycle.status !== 'OPEN'} 
                          style={{ 
                            padding: '6px 12px', 
                            backgroundColor: cycle.status === 'OPEN' ? 'var(--color-primary-500)' : 'var(--color-surface-200)', 
                            color: cycle.status === 'OPEN' ? 'white' : 'var(--text-tertiary)', 
                            border: 'none', 
                            borderRadius: 'var(--radius-sm)', 
                            cursor: cycle.status === 'OPEN' ? 'pointer' : 'not-allowed', 
                            fontSize: 'var(--text-xs)', 
                            fontWeight: 'var(--font-bold)' 
                          }}>
                          {cycle.status === 'OPEN' ? 'Finalize & Distribute' : 'Finalized'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </MagicCard>
            </div>
          </MagicCardGrid>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Generated Invoices</h2>
            <input 
              type="text" 
              placeholder="Search by Name, Flat No, or Invoice ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '10px 15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', width: '300px', fontSize: 'var(--text-sm)', outline: 'none' }}
            />
          </div>
          <MagicCard style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'transparent', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ padding: '15px' }}>Bill ID</th>
                  <th style={{ padding: '15px' }}>Resident Name</th>
                  <th style={{ padding: '15px' }}>Billing Cycle</th>
                  <th style={{ padding: '15px' }}>Total Amount (₹)</th>
                  <th style={{ padding: '15px' }}>Status</th>
                  <th style={{ padding: '15px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {searchQuery ? "No invoices match your search." : "No bills found. Finalize a cycle to generate bills."}
                    </td>
                  </tr>
                ) : (
                  filteredBills.map(bill => (
                    <tr key={bill.id} style={{ borderBottom: '1px solid var(--border-default)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>#{bill.id}</td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{bill.user ? bill.user.name : 'Unknown Resident'}</div>
                        {bill.user?.householdNumber && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Flat: {bill.user.householdNumber}</div>}
                      </td>
                      <td style={{ padding: '15px' }}>{bill.billingCycle}</td>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>₹{(bill.amount || 0).toFixed(2)}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          backgroundColor: bill.status === 'PAID' ? 'var(--color-success-50)' : 'var(--color-danger-50)', 
                          color: bill.status === 'PAID' ? 'var(--color-success-700)' : 'var(--color-danger-700)', 
                          borderRadius: 'var(--radius-full)', 
                          fontSize: 'var(--text-xs)', 
                          fontWeight: 'var(--font-bold)' 
                        }}>
                          {bill.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <button 
                          onClick={() => setSelectedBill(bill)}
                          style={viewBtnStyle}
                        >
                          <FileText size={16} /> View E-Bill
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </MagicCard>

          {/* E-Bill Modal */}
          {selectedBill && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
              <div style={{ backgroundColor: '#f3f4f6', width: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                
                {/* Modal Header Controls */}
                <div style={{ padding: '20px 30px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>E-Bill Preview</h2>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={handleDownloadPdf} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      <Download size={18} /> Download PDF
                    </button>
                    <button onClick={() => setSelectedBill(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Bill Content for PDF Generation */}
                <div style={{ padding: '30px', overflowY: 'auto', backgroundColor: '#f9fafb' }}>
                  <div ref={billRef} style={{ backgroundColor: 'white', padding: '50px', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#1f2937', fontFamily: 'sans-serif' }}>
                    
                    {/* Bill Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb', paddingBottom: '30px', marginBottom: '30px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#eff6ff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#3b82f6' }}>
                          <Droplet size={32} />
                        </div>
                        <div>
                          <h1 style={{ margin: 0, fontSize: '28px', color: '#1e3a8a', letterSpacing: '-0.5px' }}>SmartWater Utility</h1>
                          <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Official E-Bill Statement</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <h2 style={{ margin: 0, fontSize: '20px', color: '#374151' }}>Invoice #{selectedBill.id.toString().padStart(6, '0')}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>
                          <Calendar size={16} /> Date of Issue: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Resident Info & Bill Summary Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                      
                      <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Billed To</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <User size={18} color="#6b7280" /> <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{selectedBill.user?.name || 'Resident'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563', marginBottom: '10px' }}>
                          <MapPin size={18} color="#6b7280" /> <span style={{ fontSize: '14px' }}>{selectedBill.user?.address || 'Registered Address'}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#4b5563', marginLeft: '28px' }}>
                          Email: {selectedBill.user?.email || 'N/A'}
                        </div>
                      </div>

                      <div style={{ backgroundColor: selectedBill.status === 'PAID' ? '#ecfdf5' : '#fef2f2', padding: '20px', borderRadius: '8px', border: `1px solid ${selectedBill.status === 'PAID' ? '#d1fae5' : '#fee2e2'}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: selectedBill.status === 'PAID' ? '#059669' : '#dc2626', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount {selectedBill.status === 'PAID' ? 'Paid' : 'Due'}</h3>
                        <div style={{ fontSize: '42px', fontWeight: 'bold', color: selectedBill.status === 'PAID' ? '#047857' : '#b91c1c' }}>
                          ₹{(selectedBill.amount || 0).toFixed(2)}
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '14px', color: selectedBill.status === 'PAID' ? '#059669' : '#dc2626' }}>
                          Billing Cycle: <strong>{selectedBill.billingCycle}</strong>
                        </div>
                      </div>

                    </div>

                    {/* Breakdown Table */}
                    <div style={{ marginBottom: '40px' }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#374151' }}>Charges Breakdown</h3>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f3f4f6' }}>
                            <th style={{ padding: '12px 15px', textAlign: 'left', color: '#4b5563', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>Description</th>
                            <th style={{ padding: '12px 15px', textAlign: 'right', color: '#4b5563', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBill.totalConsumptionLiters != null ? (
                            <>
                              <tr>
                                <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px' }}>
                                  Base Water Usage (up to {selectedBill.tierLimit}L)<br/>
                                  <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
                                    ₹{selectedBill.baseRate} x {Math.min(selectedBill.totalConsumptionLiters, selectedBill.tierLimit)}L
                                  </span>
                                </td>
                                <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                                  = ₹{(selectedBill.baseAmount || 0).toFixed(2)}
                                </td>
                              </tr>
                              {selectedBill.excessAmount > 0 && (
                                <tr>
                                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px' }}>
                                    Excess Water Usage (Above {selectedBill.tierLimit}L)<br/>
                                    <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
                                      ₹{selectedBill.excessRate} x {(selectedBill.totalConsumptionLiters - selectedBill.tierLimit).toFixed(1)}L
                                    </span>
                                  </td>
                                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                                    = ₹{(selectedBill.excessAmount || 0).toFixed(2)}
                                  </td>
                                </tr>
                              )}
                            </>
                          ) : (
                            <tr>
                              <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px' }}>Water Usage Charge</td>
                              <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                                ₹{(selectedBill.personalUsageCharge || selectedBill.amount || 0).toFixed(2)}
                              </td>
                            </tr>
                          )}
                          {selectedBill.sharedFacilityCharge > 0 && (
                            <tr>
                              <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px' }}>Shared Facilities & Bulk Purchases</td>
                              <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px', textAlign: 'right', fontWeight: 'bold' }}>₹{(selectedBill.sharedFacilityCharge || 0).toFixed(2)}</td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td style={{ padding: '20px 15px', textAlign: 'right', fontSize: '18px', color: '#4b5563' }}>Total Charges:</td>
                            <td style={{ padding: '20px 15px', textAlign: 'right', fontSize: '22px', fontWeight: 'bold', color: '#111827' }}>₹{(selectedBill.amount || 0).toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Footer / Contact */}
                    <div style={{ textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '30px', color: '#9ca3af', fontSize: '13px' }}>
                      <p style={{ margin: '0 0 5px 0' }}>Thank you for using SmartWater Utility Services.</p>
                      <p style={{ margin: 0 }}>If you have any questions regarding this invoice, please contact your Community Admin or raise a support ticket.</p>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

const viewBtnStyle = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', transition: 'background-color 0.2s' };

export default BillingManagement;
