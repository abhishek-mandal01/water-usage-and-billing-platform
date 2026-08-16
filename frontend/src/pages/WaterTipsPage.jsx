import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { MagicCardGrid, MagicCard } from '../components/MagicBento';
import { Droplet, Lightbulb, Info } from 'lucide-react';
import { useTranslation } from '../components/LanguageSelector/useTranslation';

function WaterTipsPage() {
  const [data, setData] = useState({ waterFact: '', waterTipsFeed: [] });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { id: 1 };
    
    fetch(`http://localhost:8081/api/dashboard/${user.id}`)
      .then(r => r.json())
      .then(dData => {
        if (dData) setData(dData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const tips = (data.waterTipsFeed && data.waterTipsFeed.length > 0) ? data.waterTipsFeed : [
    t('dashboard.tip1', "Check faucets and pipes for leaks. A small drip can waste 20 gallons of water per day."),
    t('dashboard.tip2', "Turn off the tap while brushing your teeth to save up to 8 gallons of water."),
    t('dashboard.tip3', "Use your dishwasher only when it's fully loaded to maximize water efficiency."),
    t('dashboard.tip4', "Install water-saving showerheads to reduce water consumption by up to 30%."),
    t('dashboard.tip5', "Collect rainwater for your garden plants.")
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />
        
        <main className="dashboard-content">
          <div className="page-header">
            <h1>Water Saving Tips</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--text-sm)' }}>
              Learn how to conserve water and lower your bills
            </p>
          </div>
          
          {loading ? (
            <div>Loading...</div>
          ) : (
            <MagicCardGrid>
              <MagicCard style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))' }}>
                
                {data.waterFact && (
                  <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5)', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--color-accent-500)', boxShadow: 'var(--shadow-sm)' }}>
                    <h4 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-accent-600)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Info size={16} /> Did You Know?
                    </h4>
                    <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                      {data.waterFact.replace(/Did you know\?\s*/i, '')}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <Droplet color="var(--color-primary-600)" size={24} />
                  <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                    {t('dashboard.waterSavingTips', 'Water Saving Tips')}
                  </h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {tips.map((tip, idx) => (
                    <div key={idx} style={{ 
                      padding: 'var(--space-4)', 
                      backgroundColor: 'var(--bg-card)', 
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '4px solid var(--color-primary-500)',
                      display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                      boxShadow: 'var(--shadow-xs)'
                    }}>
                      <Lightbulb size={20} color="var(--color-primary-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </MagicCard>
            </MagicCardGrid>
          )}
        </main>
      </div>
    </div>
  );
}

export default WaterTipsPage;
