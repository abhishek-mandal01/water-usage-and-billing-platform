import { useTranslation as useI18nTranslation } from 'react-i18next';
import enTranslations from '../../locales/en.json';

const resolveKey = (obj, path) => {
  if (!path || typeof path !== 'string') return null;
  return path.split('.').reduce((acc, part) => (acc && typeof acc === 'object' ? acc[part] : null), obj);
};

export const useTranslation = () => {
  const { t: i18nT, i18n } = useI18nTranslation();

  const t = (key, defaultOrOptions) => {
    if (!key) return '';

    const fallbackString = typeof defaultOrOptions === 'string' ? defaultOrOptions : '';
    const optionsObj = typeof defaultOrOptions === 'object' ? defaultOrOptions : undefined;

    // Call i18next
    const translated = i18nT(key, optionsObj || (fallbackString ? { defaultValue: fallbackString } : undefined));

    // If i18next returned the raw key because it wasn't found in current language resources
    if (translated === key) {
      // Check enTranslations as secondary fallback
      const enValue = resolveKey(enTranslations, key);
      if (enValue) return enValue;
      
      // If a default fallback string was provided, use it
      if (fallbackString) return fallbackString;
      
      // If key is something like "communityAdmin.GENERAL", format nicely as "General" or fallback to last segment
      if (key.includes('.')) {
        const lastPart = key.split('.').pop();
        if (lastPart === 'GENERAL') return 'General Notice';
        if (lastPart === 'MAINTENANCE') return 'Maintenance Alert';
        if (lastPart === 'CONSERVATION') return 'Water Conservation Campaign';
        if (lastPart === 'URGENT') return 'Urgent Supply Disruption';
        if (lastPart === 'tooltip') return 'Hi! I am SmartBot. Need help? 💧';
      }
    }

    return translated;
  };

  return { t, i18n };
};

export default useTranslation;
