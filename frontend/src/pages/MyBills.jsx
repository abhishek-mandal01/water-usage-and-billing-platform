import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect, useRef } from 'react';
import UserSidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { FileText, X, Download, Droplet, Calendar, User, MapPin } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend } from 'recharts';

function MyBills() {const { t } = useTranslation();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [selectedBill, setSelectedBill] = useState(null);
  const billRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('unpaid_first');

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
    }};

  const handlePay = async (billId) => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const orderRes = await fetch(`http://localhost:8081/api/payments/create-order/${billId}`, {
        method: 'POST'
      });

      const orderData = await orderRes.json();
      
      // 2. Open Razorpay Checkout
      const options = {
        key: 'rzp_test_TFdEdEuWTNsH5O',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SmartWater Utility',
        description: "Water Bill Payment",
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyRes = await fetch('http://localhost:8081/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              billId: billId
            })
          });

          if (verifyRes.ok) {
            setMessage('Payment successful!');
            fetchBillsRef();
          } else {
            setMessage('Payment verification failed.');
          }
        },
        prefill: {
          name: residentData?.name || 'Resident',
          email: residentData?.email || 'resident@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        setMessage('Payment failed: ' + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error("Payment flow error:", err);
      setMessage('Could not initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  const payBtnStyle = {
    padding: '8px 16px',
    backgroundColor: 'var(--color-primary-600)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px'
  };

  const viewBtnStyle = {
    padding: '8px 16px',
    backgroundColor: 'white',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const handleDownloadPdf = () => {
    window.open(`http://localhost:8081/api/billing/pdf/${selectedBill.id}`, '_blank');
  };

  const totalDue = bills.filter((b) => b.status === 'UNPAID').reduce((sum, b) => sum + b.amount, 0);

  const filteredBills = bills.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (b.billingCycle || '').toLowerCase().includes(q) || (b.status || '').toLowerCase().includes(q);
  });

  const sortedBills = [...filteredBills].sort((a, b) => {
    if (sortOption === 'unpaid_first') {
      if (a.status === 'UNPAID' && b.status !== 'UNPAID') return -1;
      if (a.status !== 'UNPAID' && b.status === 'UNPAID') return 1;
      return b.id - a.id;
    }
    if (sortOption === 'newest') return b.id - a.id;
    if (sortOption === 'oldest') return a.id - b.id;
    if (sortOption === 'amount_high') return b.amount - a.amount;
    if (sortOption === 'amount_low') return a.amount - b.amount;
    return 0;
  });

  const totalPages = Math.ceil(sortedBills.length / itemsPerPage);
  const currentBills = sortedBills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <h1 style={{ marginBottom: '20px' }}>{t("resident.myBillsPayments")}</h1>

          {message && <div style={{ padding: '15px', backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-700)', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--color-success-400)' }}>{message}</div>}

          <MagicCardGrid>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              
              <MagicCard style={{ flex: '1 1 300px', backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '25px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', opacity: 0.9 }}>{t("resident.totalAmountDue")}</h3>
                <div style={{ fontSize: '48px', fontWeight: 'bold' }}>₹{totalDue.toFixed(2)}</div>
                <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8 }}>
                  {bills.filter((b) => b.status === 'UNPAID').length}{t("resident.unpaidBills")}
                </p>
              </MagicCard>

              <MagicCard style={{ flex: '2 1 500px', padding: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0 }}>{t("resident.billingHistory")}</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    >
                      <option value="unpaid_first">Unpaid First</option>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="amount_high">Amount: High to Low</option>
                      <option value="amount_low">Amount: Low to High</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Search bills..."
                      value={searchQuery}
                      onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                      style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: 'var(--text-sm)', outline: 'none', width: '200px' }}
                    />
                  </div>
                </div>
                {bills.length === 0 ?
                <p style={{ color: 'var(--text-secondary)' }}>{t("resident.nobillsgeneratedyet")}</p> :
                <>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary-50)', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '1px solid var(--border-default)' }}>{t("resident.cycle")}</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid var(--border-default)' }}>{t("resident.dueDate")}</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid var(--border-default)' }}>{t("resident.amount")}</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid var(--border-default)' }}>{t("resident.status")}</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid var(--border-default)' }}>{t("resident.action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBills.map((b) =>
                    <tr key={b.id} style={{ transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', fontWeight: '500' }}>{b.billingCycle}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', fontSize: '13px', color: 'var(--text-secondary)' }}>{b.dueDate || 'N/A'}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', fontWeight: '600' }}>₹{b.amount.toFixed(2)}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border-default)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                              <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: b.status === 'PAID' ? 'var(--color-success-50)' : 'var(--color-danger-50)',
                            color: b.status === 'PAID' ? 'var(--color-success-700)' : 'var(--color-danger-700)'
                          }}>
                                {b.status}
                              </span>
                              {b.status === 'UNPAID' && b.monthsLate > 0 &&
                          <span style={{ fontSize: '11px', color: 'var(--color-danger-600)', fontWeight: 'bold' }}>{t("resident.overdue")}
                            {b.monthsLate}{t("resident.mo")}
                          </span>
                          }
                            </div>
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border-default)' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {b.status === 'UNPAID' &&
                          <button
                            onClick={() => handlePay(b.id)}
                            disabled={loading}
                            style={payBtnStyle}>{t("resident.payNow")}


                          </button>
                          }
                              <button
                            onClick={() => setSelectedBill(b)}
                            style={viewBtnStyle}>
                            
                                <FileText size={16} />{t("resident.viewEBill")}
                          </button>
                            </div>
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                  
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedBills.length)} of {sortedBills.length}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          style={{ padding: '6px 12px', border: '1px solid var(--border-default)', borderRadius: '6px', background: currentPage === 1 ? 'var(--bg-body)' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                          Previous
                        </button>
                        <button 
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          style={{ padding: '6px 12px', border: '1px solid var(--border-default)', borderRadius: '6px', background: currentPage === totalPages ? 'var(--bg-body)' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
                }
              </MagicCard>

            </div>

            {}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '25px' }}>
              {/* Monthly Bill Amount Bar Chart */}
              <MagicCard style={{ padding: '25px', minHeight: '340px' }}>
                <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c8eef, #34c77b)' }}></span>
                  Billing Amount Trend (₹)
                </h3>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={bills.length > 0 ? [...bills].reverse().map(b => ({
                        cycle: b.billingCycle || 'Cycle',
                        amount: b.amount,
                        status: b.status
                      })) : [
                        { cycle: 'Apr 2026', amount: 840, status: 'PAID' },
                        { cycle: 'May 2026', amount: 920, status: 'PAID' },
                        { cycle: 'Jun 2026', amount: 1050, status: 'PAID' },
                        { cycle: 'Jul 2026', amount: 890, status: 'PAID' },
                        { cycle: 'Aug 2026', amount: 940, status: 'UNPAID' },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="paidBillGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34c77b" />
                          <stop offset="100%" stopColor="#5bbcaa" />
                        </linearGradient>
                        <linearGradient id="unpaidBillGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e86356" />
                          <stop offset="100%" stopColor="#f472b6" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                      <XAxis dataKey="cycle" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`₹${Number(v).toFixed(2)}`, 'Amount']} />
                      <Bar dataKey="amount" name="Bill Amount (₹)" radius={[6, 6, 0, 0]} barSize={38} animationDuration={1200} animationEasing="ease-out">
                        {(bills.length > 0 ? [...bills].reverse() : [1,2,3,4,5]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={(entry.status === 'PAID' || index < 4) ? 'url(#paidBillGrad)' : 'url(#unpaidBillGrad)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>

              {/* Payment Settlement Status Donut */}
              <MagicCard style={{ padding: '25px', minHeight: '340px' }}>
                <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #34c77b, #e86356)' }}></span>
                  Payment Settlement Status
                </h3>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Paid Bills', value: bills.filter(b => b.status === 'PAID').length || 4 },
                          { name: 'Unpaid / Current', value: bills.filter(b => b.status === 'UNPAID' && (!b.monthsLate || b.monthsLate === 0)).length || 1 },
                          { name: 'Overdue', value: bills.filter(b => b.status === 'UNPAID' && b.monthsLate > 0).length || 0 },
                        ].filter(d => d.value > 0)}
                        cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                        paddingAngle={5} dataKey="value"
                        animationDuration={1200} animationEasing="ease-out"
                      >
                        <Cell fill="#34c77b" stroke="var(--bg-card)" strokeWidth={3} />
                        <Cell fill="#f5ae45" stroke="var(--bg-card)" strokeWidth={3} />
                        <Cell fill="#e86356" stroke="var(--bg-card)" strokeWidth={3} />
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name) => [`${v} bill(s)`, name]} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </MagicCard>
            </div>
          </MagicCardGrid>

          {/* E-Bill Modal */}
          {selectedBill &&
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
              <div style={{ backgroundColor: 'var(--bg-card-hover)', width: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                
                {/* Modal Header Controls */}
                <div style={{ padding: '20px 30px', backgroundColor: 'white', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>{t("resident.eBillPreview")}</h2>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={handleDownloadPdf} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--color-primary-600)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      <Download size={18} />{t("resident.downloadPDF")}
                  </button>
                    <button onClick={() => setSelectedBill(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Bill Content for PDF Generation */}
                <div style={{ padding: '30px', overflowY: 'auto', backgroundColor: 'var(--bg-card-hover)' }}>
                  <div ref={billRef} style={{ backgroundColor: 'white', padding: '50px', borderRadius: '8px', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontFamily: 'sans-serif' }}>
                    
                    {/* Bill Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-default)', paddingBottom: '30px', marginBottom: '30px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: 'var(--color-primary-50)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-primary-600)' }}>
                          <Droplet size={32} />
                        </div>
                        <div>
                          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--color-primary-900)', letterSpacing: '-0.5px' }}>{t("resident.smartWaterUtility")}</h1>
                          <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>{t("resident.officialEBillStatement")}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-secondary)' }}>{t("resident.invoice")}{selectedBill.id.toString().padStart(6, '0')}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                          <Calendar size={16} />{t("resident.dueDate")}<strong>{selectedBill.dueDate || 'N/A'}</strong>
                        </div>
                        {selectedBill.status === 'PAID' &&
                      <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-success-600)', textAlign: 'right' }}>
                            <strong>{t("resident.paymentMode")}</strong>{t("resident.onlineRazorpay")}<br />
                            <strong>{t("resident.paidDate")}</strong> {selectedBill.paidDate || 'Paid'}<br />
                            <strong>{t("resident.txnID")}</strong> {selectedBill.razorpayPaymentId || 'Processing...'}
                          </div>
                      }
                      </div>
                    </div>

                    {/* Resident Info & Bill Summary Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                      
                      <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: '20px', borderRadius: '8px', border: '1px solid var(--bg-card-hover)' }}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t("resident.billedTo")}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <User size={18} color="var(--text-secondary)" /> <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{residentData?.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                          <MapPin size={18} color="var(--text-secondary)" /> <span style={{ fontSize: '14px' }}>{residentData?.address || 'Registered Address'}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '28px' }}>{t("resident.email")}
                        {residentData?.email}
                        </div>
                      </div>

                      <div style={{ backgroundColor: selectedBill.status === 'PAID' ? 'var(--color-success-50)' : 'var(--color-danger-50)', padding: '20px', borderRadius: '8px', border: `1px solid ${selectedBill.status === 'PAID' ? 'var(--border-default)' : 'var(--color-danger-50)'}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: selectedBill.status === 'PAID' ? 'var(--color-success-600)' : 'var(--color-danger-600)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t("resident.totalAmount")}{selectedBill.status === 'PAID' ? 'Paid' : 'Due'}</h3>
                        <div style={{ fontSize: '42px', fontWeight: 'bold', color: selectedBill.status === 'PAID' ? 'var(--color-success-700)' : 'var(--color-danger-600)' }}>
                          ₹{selectedBill.amount.toFixed(2)}
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '14px', color: selectedBill.status === 'PAID' ? 'var(--color-success-600)' : 'var(--color-danger-600)' }}>{t("resident.billingCycle")}
                        <strong>{selectedBill.billingCycle}</strong>
                        </div>
                      </div>

                    </div>

                    {/* Breakdown Table */}
                    <div style={{ marginBottom: '40px' }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'var(--text-secondary)' }}>{t("resident.chargesBreakdown")}</h3>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary-50)' }}>
                            <th style={{ padding: '12px 15px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '13px', borderBottom: '1px solid var(--border-default)' }}>{t("resident.description")}</th>
                            <th style={{ padding: '12px 15px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '13px', borderBottom: '1px solid var(--border-default)' }}>{t("resident.total")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBill.totalConsumptionLiters != null ?
                        <>
                              <tr>
                                <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px' }}>{t("resident.baseWaterUsageupto")}
                              {selectedBill.tierLimit}{t("resident.l")}<br />
                                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                    ₹{selectedBill.baseRate} x {Math.min(selectedBill.totalConsumptionLiters, selectedBill.tierLimit)}L
                                  </span>
                                </td>
                                <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px', textAlign: 'right', fontWeight: 'bold' }}>{t("resident.str_cm6dr")}
                              {(selectedBill.baseAmount || 0).toFixed(2)}
                                </td>
                              </tr>
                              {selectedBill.excessAmount > 0 &&
                          <tr>
                                  <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px' }}>{t("resident.excessWaterUsageAbove")}
                              {selectedBill.tierLimit}{t("resident.l")}<br />
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                      ₹{selectedBill.excessRate} x {(selectedBill.totalConsumptionLiters - selectedBill.tierLimit).toFixed(1)}L
                                    </span>
                                  </td>
                                  <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px', textAlign: 'right', fontWeight: 'bold' }}>{t("resident.str_jhd71")}
                              {(selectedBill.excessAmount || 0).toFixed(2)}
                                  </td>
                                </tr>
                          }
                            </> :

                        <tr>
                              <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px' }}>{t("resident.waterUsageCharge")}</td>
                              <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                                ₹{(selectedBill.personalUsageCharge || selectedBill.amount || 0).toFixed(2)}
                              </td>
                            </tr>
                        }
                          {selectedBill.sharedFacilityCharge > 0 &&
                        <tr>
                              <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px' }}>{t("resident.sharedFacilitiesBulkPurchases")}</td>
                              <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px', textAlign: 'right', fontWeight: 'bold' }}>₹{(selectedBill.sharedFacilityCharge || 0).toFixed(2)}</td>
                            </tr>
                        }
                          <tr>
                            <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px' }}>{t("resident.latePaymentSurcharge")}
                            <br />
                              <span style={{ fontSize: '13px', color: selectedBill.monthsLate > 0 ? 'var(--color-danger-600)' : 'var(--text-secondary)', fontWeight: '500' }}>
                                {selectedBill.monthsLate > 0 ?
                              `₹${selectedBill.lateFeePerMonth || 50} / month x ${selectedBill.monthsLate} month(s) overdue` :
                              'On schedule / Paid within grace period'}
                              </span>
                            </td>
                            <td style={{ padding: '15px', borderBottom: '1px solid var(--bg-card-hover)', fontSize: '15px', textAlign: 'right', fontWeight: 'bold', color: selectedBill.lateFeeAmount > 0 ? 'var(--color-danger-600)' : 'var(--text-primary)' }}>{t("resident.str_qv77o")}
                            {(selectedBill.lateFeeAmount || 0).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="1" style={{ padding: '20px 15px', textAlign: 'right', fontSize: '18px', color: 'var(--text-secondary)' }}>{t("resident.totalCharges")}</td>
                            <td style={{ padding: '20px 15px', textAlign: 'right', fontSize: '22px', fontWeight: 'bold', color: 'var(--text-primary)' }}>₹{selectedBill.amount.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Footer / Contact */}
                    <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-default)', paddingTop: '30px', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                      <p style={{ margin: '0 0 5px 0' }}>{t("resident.thankyouforusingSmartWater")}</p>
                      <p style={{ margin: 0 }}>{t("resident.ifyouhaveanyquestions")}</p>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          }

        </main>
      </div>
    </div>);

}

const payBtnStyle = { padding: '8px 16px', backgroundColor: 'var(--color-success-600)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const viewBtnStyle = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', border: '1px solid var(--color-primary-200)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'background-color 0.2s' };

export default MyBills;