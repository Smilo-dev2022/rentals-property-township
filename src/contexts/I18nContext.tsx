import React, { createContext, useContext, useMemo, useState } from 'react';

type Locale = 'en' | 'zu' | 'xh';

type Dictionary = Record<string, Record<Locale, string>>;

const dictionary: Dictionary = {
  appTitle: { en: 'Cassie Rentals', zu: 'Cassie Rentals', xh: 'Cassie Rentals' },
  browseListings: { en: 'Browse Listings', zu: 'Bheka Izindlu', xh: 'Jonga Izindlu' },
  filters: { en: 'Filters', zu: 'Izihlungi', xh: 'Izihluzi' },
  saved: { en: 'Saved', zu: 'Okulondoloziwe', xh: 'Ezisindwayo' },
  signIn: { en: 'Sign In', zu: 'Ngena', xh: 'Ngena' },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof dictionary) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: keyof typeof dictionary) => dictionary[key]?.[locale] ?? key;

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

