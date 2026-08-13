import { useState, useEffect, useCallback } from 'react';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function HouseholdsDirectory() {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [residentTickets, setResidentTickets] = useState([]);
  const [residentUsage, setResidentUsage] = useState([]);
  const [assignMeterForm, setAssignMeterForm] = useState('');
  const [isAssigningMeter, setIsAssigningMeter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const adminId = JSON.parse(localStorage.getItem('user'))?.id;

  const fetchHouseholds = useCallback(async () => {
    if (!adminId) return;
    try {
      const hhRes = await fetch(`http://localhost:8081/api/config/households?adminId=${adminId}`);
      if (hhRes.ok) setHouseholds(await hhRes.json());
    } catch (e) {
      console.error(e);
    }
  }, [adminId]);

  useEffect(() => {
    setTimeout(() => fetchHouseholds(), 0);
  }, [fetchHouseholds]);

  const handleHouseholdClick = async (hh) => {
    setSelectedHousehold(hh);
    setResidentTickets([]);
    setResidentUsage([]);
    if (hh.resident) {
      try {
        const [ticketsRes, usageRes] = await Promise.all([
          fetch(`http://localhost:8081/api/tickets/my/${hh.resident.id}`),
          fetch(`http://localhost:8081/api/usage/my/${hh.resident.id}`)
        ]);
        
        if (ticketsRes.ok) setResidentTickets(await ticketsRes.json());
        if (usageRes.ok) setResidentUsage(await usageRes.json());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveResident = async (residentId, householdNumber) => {
    if (!window.confirm(`Are you sure you want to completely remove the resident from household ${householdNumber}? This will delete their bills and support tickets.`)) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:8081/api/users/resident/${residentId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Resident removed successfully.');
        setSelectedHousehold(null);
        fetchHouseholds();
      } else {
        alert('Failed to remove resident.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const handleDeleteHousehold = async (householdId, householdNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete household ${householdNumber}?`)) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:8081/api/config/households/${householdId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Household deleted successfully.');
        setSelectedHousehold(null);
        fetchHouseholds();
      } else {
        alert('Failed to delete household.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const handleAssignMeter = async (e) => {
    e.preventDefault();
    if (!assignMeterForm) return;
    try {
      const res = await fetch(`http://localhost:8081/api/config/meters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ householdId: selectedHousehold.id, serialNumber: assignMeterForm, installationDate: new Date().toISOString().split('T')[0] })
      });
      if (res.ok) {
        alert('Meter assigned successfully!');
        setAssignMeterForm('');
        setIsAssigningMeter(false);
        fetchHouseholds();
        // Optimistically update selectedHousehold
        setSelectedHousehold({ ...selectedHousehold, waterMeter: await res.json() });
      } else {
        alert('Failed to assign meter. Serial number might be taken.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const filteredHouseholds = households.filter(hh => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = hh.resident?.name?.toLowerCase() || '';
    const email = hh.resident?.email?.toLowerCase() || '';
    const flatNo = hh.householdNumber?.toLowerCase() || '';
    const meterNo = hh.waterMeter?.serialNumber?.toLowerCase() || '';
    return name.includes(q) || email.includes(q) || flatNo.includes(q) || meterNo.includes(q);
  });

  return (
    <div className="dashboard-layout">
      <CommunityAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h1 style={{ margin: 0 }}>Households Directory</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', backgroundColor: 'var(--color-surface-100)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>Total: {households.length}</p>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search Name, Email, Flat No, or Meter No..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '10px 15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', width: '350px', fontSize: 'var(--text-sm)', outline: 'none' }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <MagicCardGrid>
            <MagicCard style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'transparent', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ padding: '15px' }}>Household Number</th>
                  <th style={{ padding: '15px' }}>Resident Name</th>
                  <th style={{ padding: '15px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHouseholds.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {searchQuery ? "No households match your search." : "No households found. Generate an invite link for residents to register."}
                    </td>
                  </tr>
                ) : (
                  filteredHouseholds.map(hh => (
                    <tr 
                      key={hh.id} 
                      onClick={() => handleHouseholdClick(hh)}
                      style={{ borderBottom: '1px solid var(--border-default)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{hh.householdNumber}</td>
                      <td style={{ padding: '15px' }}>
                        {hh.resident ? hh.resident.name : <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Unassigned</span>}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {hh.resident ? 
                          <span style={{ padding: '4px 8px', backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-700)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)' }}>Active</span> : 
                          <span style={{ padding: '4px 8px', backgroundColor: 'var(--color-warning-50)', color: 'var(--color-warning-700)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)' }}>Pending</span>
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </MagicCard>
          </MagicCardGrid>

          {/* Household Detail Modal */}
          {selectedHousehold && (
            <div 
              onClick={() => { setSelectedHousehold(null); setIsAssigningMeter(false); }}
              style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
              justifyContent: 'center', alignItems: 'center'
            }}>
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <h2 style={{ marginTop: 0, borderBottom: '1px solid var(--border-default)', paddingBottom: '10px' }}>Household {selectedHousehold.householdNumber}</h2>
                
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Resident Details</h4>
                  {selectedHousehold.resident ? (
                    <div style={{ backgroundColor: 'transparent', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                      <p style={{ margin: '0 0 5px 0' }}><strong>Name:</strong> {selectedHousehold.resident.name}</p>
                      <p style={{ margin: '0 0 5px 0' }}><strong>Email:</strong> {selectedHousehold.resident.email}</p>
                      <p style={{ margin: '0 0 5px 0' }}><strong>Phone:</strong> {selectedHousehold.resident.phoneNumber}</p>
                      <p style={{ margin: '0 0 5px 0' }}><strong>Gender:</strong> {selectedHousehold.resident.gender || 'N/A'}</p>
                      <p style={{ margin: '0 0 5px 0' }}><strong>Date of Birth:</strong> {selectedHousehold.resident.dateOfBirth || 'N/A'}</p>
                      <p style={{ margin: '0 0 10px 0' }}><strong>Government ID:</strong> {selectedHousehold.resident.governmentId || 'N/A'}</p>
                      <button 
                        onClick={() => handleRemoveResident(selectedHousehold.resident.id, selectedHousehold.householdNumber)}
                        style={{ padding: '6px 12px', backgroundColor: 'var(--color-danger-50)', color: 'var(--color-danger-700)', border: '1px solid var(--color-danger-400)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Remove Resident
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '15px' }}>No resident registered yet.</p>
                      <button 
                        onClick={() => handleDeleteHousehold(selectedHousehold.id, selectedHousehold.householdNumber)}
                        style={{ padding: '6px 12px', backgroundColor: 'var(--color-danger-50)', color: 'var(--color-danger-700)', border: '1px solid var(--color-danger-400)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Delete Household
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Water Meter Details</h4>
                  <div style={{ backgroundColor: 'transparent', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    {selectedHousehold.waterMeter ? (
                      <div>
                        <p style={{ margin: '0 0 5px 0' }}><strong>Meter Number:</strong> {selectedHousehold.waterMeter.serialNumber}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Installed on: {selectedHousehold.waterMeter.installationDate}</p>
                      </div>
                    ) : (
                      <div>
                        <p style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No meter assigned.</p>
                        {!isAssigningMeter ? (
                          <button 
                            onClick={() => setIsAssigningMeter(true)}
                            style={{ padding: '6px 12px', backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-600)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                            Assign Meter
                          </button>
                        ) : (
                          <form onSubmit={handleAssignMeter} style={{ display: 'flex', gap: '10px' }}>
                            <input 
                              type="text" 
                              placeholder="Enter Serial Number" 
                              value={assignMeterForm}
                              onChange={(e) => setAssignMeterForm(e.target.value)}
                              required
                              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none', flexGrow: 1 }}
                            />
                            <button type="submit" style={{ padding: '8px 12px', backgroundColor: 'var(--color-success-500)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                            <button type="button" onClick={() => setIsAssigningMeter(false)} style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Water Usage History</h4>
                  <div style={{ backgroundColor: 'transparent', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-default)', maxHeight: '150px', overflowY: 'auto' }}>
                    {residentUsage.length === 0 ? (
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No usage logs available.</p>
                    ) : (
                      <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                            <th style={{ paddingBottom: '5px' }}>Date</th>
                            <th style={{ paddingBottom: '5px' }}>Volume (L)</th>
                            <th style={{ paddingBottom: '5px' }}>Consumption</th>
                          </tr>
                        </thead>
                        <tbody>
                          {residentUsage.slice(0, 5).map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ paddingTop: '5px' }}>{log.readingDate}</td>
                              <td style={{ paddingTop: '5px' }}>{log.readingVolume.toFixed(1)}</td>
                              <td style={{ paddingTop: '5px', color: '#059669', fontWeight: 'bold' }}>+{log.consumption.toFixed(1)} L</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Financial Overview</h4>
                  <div style={{ backgroundColor: 'transparent', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    <p style={{ margin: 0, color: '#059669', fontWeight: 'bold' }}>No pending bills (₹0.00 Due)</p>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Support Concerns Raised</h4>
                  <div style={{ backgroundColor: 'transparent', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-default)', maxHeight: '150px', overflowY: 'auto' }}>
                    {residentTickets.length === 0 ? (
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No tickets raised by this resident.</p>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {residentTickets.map(ticket => (
                          <li key={ticket.id} style={{ marginBottom: '5px' }}>
                            <strong>{ticket.title}</strong> - <span style={{ fontSize: '12px', color: ticket.status === 'RESOLVED' ? '#059669' : '#d97706' }}>[{ticket.status}]</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedHousehold(null)} 
                  style={{ marginTop: '25px', padding: '10px 20px', width: '100%', backgroundColor: 'var(--color-primary-900)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Close
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default HouseholdsDirectory;
