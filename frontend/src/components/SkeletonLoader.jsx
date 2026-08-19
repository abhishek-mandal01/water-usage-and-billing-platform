const SkeletonBlock = ({ width = '100%', height = '20px', borderRadius = '8px', className = '', style = {} }) => (
  <div
    className={`skeleton-shimmer ${className}`}
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: 'var(--border-default, #e5e7eb)',
      backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
      backgroundSize: '200% 100%',
      animation: 'skeletonPulse 1.5s ease-in-out infinite',
      ...style
    }}
  />
);

const SkeletonLoader = ({ type = 'dashboard', rows = 5 }) => {
  if (type === 'table') {
    return (
      <div style={{ width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <SkeletonBlock height="40px" borderRadius="6px" />
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonBlock key={i} height="32px" borderRadius="4px" style={{ opacity: 1 - i * 0.12 }} />
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div style={{ width: '100%', height: '300px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <SkeletonBlock width="40%" height="24px" />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', marginTop: '20px' }}>
          {[60, 85, 45, 95, 70, 80, 50].map((h, idx) => (
            <SkeletonBlock key={idx} width="100%" height={`${h}%`} borderRadius="6px 6px 0 0" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', width: '100%' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-default, #e5e7eb)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SkeletonBlock width="50%" height="18px" />
            <SkeletonBlock width="80%" height="36px" />
            <SkeletonBlock width="35%" height="14px" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-default, #e5e7eb)' }}>
            <SkeletonBlock width="40px" height="40px" borderRadius="50%" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SkeletonBlock width="60%" height="16px" />
              <SkeletonBlock width="40%" height="12px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default Dashboard Page Skeleton
  return (
    <div style={{ padding: '24px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SkeletonBlock width="250px" height="36px" />
      <SkeletonLoader type="card" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="chart" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
