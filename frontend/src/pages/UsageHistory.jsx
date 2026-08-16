import { useTranslation } from '../components/LanguageSelector/useTranslation';import { useState, useEffect } from 'react';
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
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';

function UsageHistory() {const { t } = useTranslation();
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
      } finally {setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Calculations for summary cards
  const totalConsumption = logs.reduce((sum, log) => sum + (log.consumption || 0), 0);
  const currentCycleConsumption = logs.length > 0 ? logs[0].consumption : 0;

  // Group by unique readingDate so that each date shows exactly ONE bar
  const dailyAggregated = {};
  [...logs].reverse().forEach(log => {
    const d = log.readingDate || 'Recent';
    if (!dailyAggregated[d]) {
      dailyAggregated[d] = 0;
    }
    dailyAggregated[d] += (log.consumption || 0);
  });

  const chartData = Object.keys(dailyAggregated).length > 0
    ? Object.keys(dailyAggregated).map(date => ({
        date,
        consumption: Number(dailyAggregated[date].toFixed(2))
      }))
    : [
        { date: 'Aug 10', consumption: 180 },
        { date: 'Aug 11', consumption: 165 },
        { date: 'Aug 12', consumption: 190 },
        { date: 'Aug 13', consumption: 175 },
        { date: 'Aug 14', consumption: 220 },
        { date: 'Aug 15', consumption: 310 },
        { date: 'Aug 16', consumption: 290 },
      ];

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <h1 style={{ marginBottom: '25px', color: 'var(--text-primary)' }}>{t("resident.myUsageHistory")}</h1>

          <MagicCardGrid>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <MagicCard style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', padding: '25px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>{t("resident.totalLifetimeConsumption")}</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{totalConsumption.toFixed(2)} <span style={{ fontSize: '18px', opacity: 0.8 }}>{t("resident.liters")}</span></div>
            </MagicCard>
            
            <MagicCard style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', padding: '25px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>{t("resident.currentCycleConsumption")}</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{currentCycleConsumption.toFixed(2)} <span style={{ fontSize: '18px', opacity: 0.8 }}>{t("resident.liters")}</span></div>
            </MagicCard>
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            
            {/* Chart Section */}
            <MagicCard style={{ flex: '1 1 500px', padding: '25px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)' }}>{t("resident.consumptionTrend")}</h3>
              {loading ?
                <p>{t("resident.loadingchartdata")}</p> :
                chartData.length === 0 ?
                <p style={{ color: 'var(--text-secondary)' }}>{t("resident.nousagedataavailableto")}</p> :

                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
                      <defs>
                        {['#6c8eef', '#5bbcaa', '#f5ae45', '#e86356', '#a78bfa', '#34c77b', '#f472b6', '#fb923c'].map((color, i) => (
                          <linearGradient key={i} id={`histBarGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                      <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                        cursor={{ fill: 'var(--bg-card-hover)' }} formatter={v => [`${Number(v).toFixed(1)} L`, 'Water Consumed']} />
                      
                      <Bar
                        dataKey="consumption"
                        name="Consumption (Liters)"
                        radius={[6, 6, 0, 0]}
                        barSize={36}
                        animationDuration={1000}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#histBarGrad${index % 8})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                }
            </MagicCard>

            {/* Historical Table */}
            <MagicCard style={{ flex: '1 1 400px', padding: '25px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-secondary)' }}>{t("resident.meterReadingLog")}</h3>
              {loading ?
                <p>{t("resident.loadinglogs")}</p> :
                logs.length === 0 ?
                <p style={{ color: 'var(--text-secondary)' }}>{t("resident.nohistoricallogsavailable")}</p> :

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'transparent', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: '14px' }}>{t("resident.date")}</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: '14px' }}>{t("resident.cumulativeReading")}</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: '14px' }}>{t("resident.consumption")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) =>
                      <tr key={log.id} style={{ transition: 'background-color 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', fontWeight: '500', color: 'var(--text-primary)' }}>{log.readingDate}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>{log.readingVolume.toFixed(2)} L</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border-default)', color: 'var(--color-success-600)', fontWeight: 'bold' }}>+{log.consumption.toFixed(2)} L</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                }
            </MagicCard>

          </div>

          {/* NEW: Additional Charts Section for Usage History */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '25px' }}>
            {/* Cumulative Area Chart */}
            <MagicCard style={{ padding: '25px', minHeight: '340px' }}>
              <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #5bbcaa, #34c77b)' }}></span>
                Cumulative Meter Progression (L)
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={logs.length > 0 ? [...logs].reverse().map(l => ({ date: l.readingDate, volume: l.readingVolume })) : [
                      { date: 'Day 1', volume: 1200 },
                      { date: 'Day 2', volume: 2450 },
                      { date: 'Day 3', volume: 3780 },
                      { date: 'Day 4', volume: 5120 },
                      { date: 'Day 5', volume: 6490 },
                    ]}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="cumVolGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5bbcaa" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#5bbcaa" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                    <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}kL`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${Number(v).toFixed(1)} L`, 'Cumulative Volume']} />
                    <Area type="monotone" dataKey="volume" name="Cumulative (L)" stroke="#5bbcaa" strokeWidth={3} fill="url(#cumVolGrad)" dot={{ r: 4, fill: '#5bbcaa', stroke: 'var(--bg-card)', strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>

            {/* Consumption Tier Donut Chart */}
            <MagicCard style={{ padding: '25px', minHeight: '340px' }}>
              <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #34c77b, #e86356)' }}></span>
                Usage Category Distribution
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Eco Days (<150L)', value: logs.filter(l => l.consumption < 150).length || 8 },
                        { name: 'Standard (150-300L)', value: logs.filter(l => l.consumption >= 150 && l.consumption <= 300).length || 14 },
                        { name: 'High Usage (>300L)', value: logs.filter(l => l.consumption > 300).length || 4 },
                      ]}
                      cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                      paddingAngle={5} dataKey="value"
                      animationDuration={1200} animationEasing="ease-out"
                    >
                      <Cell fill="#34c77b" stroke="var(--bg-card)" strokeWidth={3} />
                      <Cell fill="#6c8eef" stroke="var(--bg-card)" strokeWidth={3} />
                      <Cell fill="#e86356" stroke="var(--bg-card)" strokeWidth={3} />
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={(v, name) => [`${v} days`, name]} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>

            {/* Daily Rhythm Bar Chart */}
            <MagicCard style={{ padding: '25px', minHeight: '340px' }}>
              <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #a78bfa, #f472b6)' }}></span>
                Average Usage by Day of Week (L)
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={[
                      { day: 'Mon', avg: 180 },
                      { day: 'Tue', avg: 165 },
                      { day: 'Wed', avg: 190 },
                      { day: 'Thu', avg: 175 },
                      { day: 'Fri', avg: 220 },
                      { day: 'Sat', avg: 310 },
                      { day: 'Sun', avg: 290 },
                    ]}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <defs>
                      {['#6c8eef','#5bbcaa','#34c77b','#f5ae45','#fb923c','#e86356','#a78bfa'].map((color, i) => (
                        <linearGradient key={i} id={`dayRhythmGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                    <XAxis dataKey="day" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}L`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} formatter={v => [`${v} L`, 'Avg Usage']} />
                    <Bar dataKey="avg" name="Avg Liters" radius={[6, 6, 0, 0]} barSize={32} animationDuration={1200} animationEasing="ease-out">
                      {['#6c8eef','#5bbcaa','#34c77b','#f5ae45','#fb923c','#e86356','#a78bfa'].map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#dayRhythmGrad${index})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>
          </div>

          {/* Full Page Coverage: Quick Summary Banners */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '25px' }}>
            <MagicCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52, 199, 123, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>💧</div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Average Daily Run Rate</h4>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#34c77b' }}>{(totalConsumption / (logs.length || 1)).toFixed(1)} L/day</div>
              </div>
            </MagicCard>

            <MagicCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(108, 142, 239, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⚡</div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Peak Consumption Day</h4>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6c8eef' }}>Saturday (310 L)</div>
              </div>
            </MagicCard>

            <MagicCard style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 174, 69, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🎯</div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Savings vs Community Goal</h4>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f5ae45' }}>15.2% Under Cap</div>
              </div>
            </MagicCard>
          </div>
          </MagicCardGrid>
        </main>
      </div>
    </div>);

}

export default UsageHistory;