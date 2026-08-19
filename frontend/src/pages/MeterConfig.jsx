import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';
import CommunityAdminSidebar from '../components/CommunityAdminSidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function MeterConfig() {
  const { t } = useTranslation();
  const [households, setHouseholds] = useState([]);
  const [readingForm, setReadingForm] = useState({ householdNumber: '', readingVolume: '', readingDate: new Date().toISOString().split('T')[0] });
  const [readingLoading, setReadingLoading] = useState(false);
  
  const [csvFile, setCsvFile] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  
  const [message, setMessage] = useState('');

  const adminId = JSON.parse(localStorage.getItem('user'))?.id;

  const fetchData = useCallback(async () => {
    if (!adminId) return;
    try {
      const hhRes = await fetch(`http://localhost:8081/api/config/households?adminId=${adminId}`);
      if (hhRes.ok) setHouseholds(await hhRes.json());
    } catch (err) {
      console.error(err);
    }
  }, [adminId]);

  useEffect(() => {
    setTimeout(() => fetchData(), 0);
  }, [fetchData]);

  const handleAddReading = async (e) => {
    e.preventDefault();
    setReadingLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(readingForm)
      });
      if (res.ok) {
        setMessage('Meter reading submitted! A bill has been automatically generated for the resident.');
        setReadingForm({ ...readingForm, readingVolume: '' });
      } else {
        setMessage('Failed to submit reading. Check if household number is correct.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error occurred.');
    }
    setReadingLoading(false);
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;
    setCsvLoading(true);
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const res = await fetch(`http://localhost:8081/api/usage/upload?adminId=${adminId}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.text();
      if (res.ok) {
        setMessage('Success: ' + data);
        setCsvFile(null);
        document.getElementById('csvInput').value = '';
      } else {
        setMessage('Error: ' + data);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error occurred during upload.');
    }
    setCsvLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <CommunityAdminSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <div className="page-header" style={{ marginBottom: '20px' }}>
            <h1 style={{ margin: 0 }}>Meter Readings & Billing Setup</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
              Configure base rates, input monthly meter readings, or perform bulk uploads.
            </p>
          </div>

          {message && <div style={{ padding: '15px', backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-700)', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--color-success-400)' }}>{message}</div>}

          <MagicCardGrid>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'stretch' }}>
              
              {/* Manual Reading Entry */}
              <MagicCard style={{ flex: '2 1 400px', padding: '25px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Submit New Meter Reading</h3>
              <form onSubmit={handleAddReading} style={{ ...formStyle, gap: '25px' }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '15px' }}>Select Household</label>
                  <input 
                    list="households-list"
                    value={readingForm.householdNumber} 
                    onChange={e => setReadingForm({...readingForm, householdNumber: e.target.value})} 
                    placeholder="Type to search by name or household..."
                    style={{ ...inputStyle, padding: '14px', width: '100%', marginTop: '5px', marginBottom: '10px' }} 
                    required
                  />
                  <datalist id="households-list">
                    {households.map(h => (
                      <option key={h.id} value={h.householdNumber}>
                        {h.householdNumber} - {h.resident ? h.resident.name : 'No Resident'}
                      </option>
                    ))}
                  </datalist>
                
                {readingForm.householdNumber && (
                  <div style={{ padding: '10px', backgroundColor: 'var(--color-surface-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <strong>{t("communityAdmin.assignedMeter")}</strong> {households.find(h => h.householdNumber === readingForm.householdNumber)?.waterMeter?.serialNumber || <span style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>{t("communityAdmin.nometerassigned")}</span>}
                  </div>
                )}
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ ...labelStyle, fontSize: '15px' }}>New Cumulative Reading (Liters)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 15430.5" 
                      value={readingForm.readingVolume} 
                      onChange={e => setReadingForm({...readingForm, readingVolume: e.target.value})} 
                      style={{ ...inputStyle, padding: '14px', width: '100%', marginTop: '5px' }} 
                      required 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ ...labelStyle, fontSize: '15px' }}>Reading Date</label>
                    <input 
                      type="date" 
                      value={readingForm.readingDate} 
                      onChange={e => setReadingForm({...readingForm, readingDate: e.target.value})} 
                      style={{ ...inputStyle, padding: '14px', width: '100%', marginTop: '5px' }} 
                      required 
                    />
                  </div>
                </div>

                  <button type="submit" disabled={readingLoading} style={{ ...btnStyle, marginTop: 'auto' }}>Submit & Generate Bill</button>
                </form>
              </MagicCard>

              {/* Bulk CSV Upload */}
              <MagicCard style={{ flex: '1 1 300px', padding: '25px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Bulk CSV Upload</h3>
              <p style={{ fontSize: '15.5px', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '25px' }}>
                Upload a CSV file containing <code style={{backgroundColor: 'transparent', padding:'2px 4px', borderRadius:'4px'}}>HouseholdNumber</code>, <code style={{backgroundColor: 'transparent', padding:'2px 4px', borderRadius:'4px'}}>ReadingVolume</code>, and <code style={{backgroundColor: 'transparent', padding:'2px 4px', borderRadius:'4px'}}>Date</code> to automatically log usage and generate bills.
              </p>
                <form onSubmit={handleCsvUpload} style={formStyle}>
                  <input 
                    id="csvInput"
                    type="file" 
                    accept=".csv"
                    className="custom-file-input"
                    onChange={e => setCsvFile(e.target.files[0])}
                    style={{ ...inputStyle, padding: '8px' }}
                    required
                  />
                <button type="submit" disabled={csvLoading || !csvFile} style={{ ...btnStyle, backgroundColor: 'var(--color-primary-600)', marginTop: 'auto' }}>
                  {csvLoading ? 'Uploading...' : 'Upload CSV'}
                  </button>
                </form>
              </MagicCard>

            </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}


const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1 };
const labelStyle = { fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '5px' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-default)', fontSize: '15px', outline: 'none' };
const btnStyle = { padding: '12px', backgroundColor: 'var(--color-primary-500)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: 'background-color 0.2s' };

export default MeterConfig;

