import { useState, useEffect } from 'react';
import UserSidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function UsageHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const residentId = JSON.parse(localStorage.getItem('user'))?.id;
      if (!residentId) return;
      try {
        const res = await fetch(`http://localhost:8081/api/usage/my/${residentId}`);
        if (res.ok) {
          setLogs(await res.json());
        }
      } catch {
        // Suppressed console.error per audit
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Calculations for summary cards
  const totalConsumption = logs.reduce((sum, log) => sum + (log.consumption || 0), 0);
  const currentCycleConsumption = logs.length > 0 ? logs[0].consumption : 0;

  // Prepare data for the chart (reversing so oldest is on the left, newest on right)
  const chartData = [...logs].reverse().map(log => ({
    date: log.readingDate,
    consumption: log.consumption
  }));

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main style={{ padding: '40px', marginTop: '60px' }}>
          <h1 style={{ marginBottom: '25px', color: '#111827' }}>My Usage & History</h1>

          <MagicCardGrid>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <MagicCard style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', padding: '25px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>Total Lifetime Consumption</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{totalConsumption.toFixed(2)} <span style={{ fontSize: '18px', opacity: 0.8 }}>Liters</span></div>
            </MagicCard>
            
            <MagicCard style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '25px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>Current Cycle Consumption</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{currentCycleConsumption.toFixed(2)} <span style={{ fontSize: '18px', opacity: 0.8 }}>Liters</span></div>
            </MagicCard>
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            
            {/* Chart Section */}
            <MagicCard style={{ flex: '1 1 500px', padding: '25px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>Consumption Trend</h3>
              {loading ? (
                <p>Loading chart data...</p>
              ) : chartData.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No usage data available to display.</p>
              ) : (
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: '#f3f4f6' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar 
                        dataKey="consumption" 
                        name="Consumption (Liters)" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]} 
                        barSize={40}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </MagicCard>

            {/* Historical Table */}
            <MagicCard style={{ flex: '1 1 400px', padding: '25px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>Meter Reading Log</h3>
              {loading ? (
                <p>Loading logs...</p>
              ) : logs.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No historical logs available.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'transparent', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '1px solid #ddd', color: '#4b5563', fontSize: '14px' }}>Date</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #ddd', color: '#4b5563', fontSize: '14px' }}>Cumulative Reading</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #ddd', color: '#4b5563', fontSize: '14px' }}>Consumption</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(log => (
                        <tr key={log.id} style={{ transition: 'background-color 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: '500', color: '#111827' }}>{log.readingDate}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#6b7280' }}>{log.readingVolume.toFixed(2)} L</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#059669', fontWeight: 'bold' }}>+{log.consumption.toFixed(2)} L</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </MagicCard>

          </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>
  );
}

export default UsageHistory;
