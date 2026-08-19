import { Link } from 'react-router-dom';
import { useTranslation } from '../../LanguageSelector/useTranslation';
import BrandLogo from '../../BrandLogo';
import ThemeToggle from '../../ThemeToggle';
import LanguageSelector from '../../LanguageSelector';

const HeroNav = () => {
  const { t } = useTranslation();

  return (
    <nav style={{
      position: 'relative',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--space-3) 5%'
    }}>
      <BrandLogo style={{ borderBottom: 'none', padding: 0, marginLeft: '-15px', marginTop: '-10px' }} />
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
        <LanguageSelector />
        <ThemeToggle />
        <Link to="/login" className="btn btn-ghost">
          {t('landing.logIn')}
        </Link>
        <Link to="/register" className="btn btn-primary">
          {t('landing.register')}
        </Link>
      </div>
    </nav>
  );
};

export default HeroNav;

