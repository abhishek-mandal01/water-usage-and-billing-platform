import { useState, useEffect, useRef } from 'react';
import UserSidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { FileText, X, Download, Droplet, Calendar, User, MapPin } from 'lucide-react';

function MyBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [selectedBill, setSelectedBill] = useState(null);
  const billRef = useRef(null);

  const residentData = JSON.parse(localStorage.getItem('user'));
  const residentId = residentData?.id;

  useEffect(() => {
    const fetchBills = async () => {
      if (!residentId) return;
      try {
        const res = await fetch(`http://localhost:8081/api/billing/my/${residentId}`);
        if (res.ok) {
          setBills(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchBills();
  }, [residentId]);

  const fetchBillsRef = async () => {
      if (!residentId) return;
      try {
        const res = await fetch(`http://localhost:8081/api/billing/my/${residentId}`);
        if (res.ok) setBills(await res.json());
      } catch {
        // empty
      }
  };

  const handlePay = async (billId) => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const orderRes = await fetch(`http://localhost:8081/api/payments/create-order/${billId}`, {
        method: 'POST'
      });
      
      if (!orderRes.ok) {
        const errorMsg = await orderRes.text();
        setMessage(`Failed to initialize payment: ${errorMsg}`);
        setLoading(false);
        return;
      }
      
      const orderData = await orderRes.json();
      
      // 2. Initialize Razorpay options
      const options = {
        key: "rzp_test_TFdEdEuWTNsH5O",
        amount: orderData.amount, // Amount is in paise
        currency: "INR",
        name: "SmartWater Utility",
        description: "Water Bill Payment",
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify signature on backend
          try {
            const verifyRes = await fetch('http://localhost:8081/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                billId: billId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });
            
            if (verifyRes.ok) {
              setMessage('Payment successful! Your bill is now marked as PAID.');
              fetchBillsRef();
            } else {
              setMessage('Payment verification failed.');
            }
          } catch (err) {
            console.error("Verification Error:", err);
            setMessage('Error verifying payment.');
          }
        },
        prefill: {
          name: residentData?.name || "",
          email: residentData?.email || "",
          contact: residentData?.phoneNumber || ""
        },
        theme: {
          color: "#2563eb"
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        console.error("Payment Failed", response.error);
        setMessage(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();
      
    } catch (err) {
      console.error("Checkout Error:", err);
      setMessage('Error opening checkout.');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleDownloadPdf = () => {
    if (!selectedBill) return;
    window.open(`http://localhost:8081/api/billing/pdf/${selectedBill.id}`, '_blank');
  };

  const totalDue = bills.filter(b => b.status === 'UNPAID').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main style={{ padding: '40px', marginTop: '60px' }}>
          <h1 style={{ marginBottom: '20px' }}>My Bills & Payments</h1>

          {message && <div style={{ padding: '15px', backgroundColor: '#d1fae5', color: '#065f46', marginBottom: '20px', borderRadius: '8px', border: '1px solid #34d399' }}>{message}</div>}

          <MagicCardGrid>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              
              <MagicCard style={{ flex: '1 1 300px', backgroundColor: '#1e3a8a', color: 'white', padding: '25px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', opacity: 0.9 }}>Total Amount Due</h3>
                <div style={{ fontSize: '48px', fontWeight: 'bold' }}>₹{totalDue.toFixed(2)}</div>
                <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8 }}>
                  {bills.filter(b => b.status === 'UNPAID').length} Unpaid Bill(s)
                </p>
              </MagicCard>

              <MagicCard style={{ flex: '2 1 500px', padding: '25px' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Billing History</h3>
                {bills.length === 0 ? (
                  <p style={{ color: '#6b7280' }}>No bills generated yet.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'transparent', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Cycle</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Due Date</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Amount</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Status</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map(b => (
                        <tr key={b.id} style={{ transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: '500' }}>{b.billingCycle}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '13px', color: '#4b5563' }}>{b.dueDate || 'N/A'}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: '600' }}>₹{b.amount.toFixed(2)}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '12px', 
                                fontSize: '12px', 
                                fontWeight: 'bold',
                                backgroundColor: b.status === 'PAID' ? '#d1fae5' : '#fee2e2',
                                color: b.status === 'PAID' ? '#065f46' : '#991b1b'
                              }}>
                                {b.status}
                              </span>
                              {b.status === 'UNPAID' && b.monthsLate > 0 && (
                                <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 'bold' }}>
                                  ⚠️ Overdue ({b.monthsLate} mo.)
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {b.status === 'UNPAID' && (
                                <button 
                                  onClick={() => handlePay(b.id)} 
                                  disabled={loading}
                                  style={payBtnStyle}
                                >
                                  Pay Now
                                </button>
                              )}
                              <button 
                                onClick={() => setSelectedBill(b)}
                                style={viewBtnStyle}
                              >
                                <FileText size={16} /> View E-Bill
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </MagicCard>

            </div>
          </MagicCardGrid>

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
                          <Calendar size={16} /> Due Date: <strong>{selectedBill.dueDate || 'N/A'}</strong>
                        </div>
                        {selectedBill.status === 'PAID' && (
                          <div style={{ marginTop: '10px', fontSize: '12px', color: '#059669', textAlign: 'right' }}>
                            <strong>Payment Mode:</strong> Online (Razorpay)<br/>
                            <strong>Paid Date:</strong> {selectedBill.paidDate || 'Paid'}<br/>
                            <strong>Txn ID:</strong> {selectedBill.razorpayPaymentId || 'Processing...'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resident Info & Bill Summary Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                      
                      <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Billed To</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <User size={18} color="#6b7280" /> <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{residentData?.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563', marginBottom: '10px' }}>
                          <MapPin size={18} color="#6b7280" /> <span style={{ fontSize: '14px' }}>{residentData?.address || 'Registered Address'}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#4b5563', marginLeft: '28px' }}>
                          Email: {residentData?.email}
                        </div>
                      </div>

                      <div style={{ backgroundColor: selectedBill.status === 'PAID' ? '#ecfdf5' : '#fef2f2', padding: '20px', borderRadius: '8px', border: `1px solid ${selectedBill.status === 'PAID' ? '#d1fae5' : '#fee2e2'}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: selectedBill.status === 'PAID' ? '#059669' : '#dc2626', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount {selectedBill.status === 'PAID' ? 'Paid' : 'Due'}</h3>
                        <div style={{ fontSize: '42px', fontWeight: 'bold', color: selectedBill.status === 'PAID' ? '#047857' : '#b91c1c' }}>
                          ₹{selectedBill.amount.toFixed(2)}
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
                          <tr>
                            <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px' }}>
                              Late Payment Surcharge<br/>
                              <span style={{ fontSize: '13px', color: selectedBill.monthsLate > 0 ? '#dc2626' : '#6b7280', fontWeight: '500' }}>
                                {selectedBill.monthsLate > 0 
                                  ? `₹${selectedBill.lateFeePerMonth || 50} / month x ${selectedBill.monthsLate} month(s) overdue`
                                  : 'On schedule / Paid within grace period'}
                              </span>
                            </td>
                            <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', fontSize: '15px', textAlign: 'right', fontWeight: 'bold', color: selectedBill.lateFeeAmount > 0 ? '#dc2626' : '#111827' }}>
                              = ₹{(selectedBill.lateFeeAmount || 0).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="1" style={{ padding: '20px 15px', textAlign: 'right', fontSize: '18px', color: '#4b5563' }}>Total Charges:</td>
                            <td style={{ padding: '20px 15px', textAlign: 'right', fontSize: '22px', fontWeight: 'bold', color: '#111827' }}>₹{selectedBill.amount.toFixed(2)}</td>
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

const payBtnStyle = { padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const viewBtnStyle = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'background-color 0.2s' };

export default MyBills;
