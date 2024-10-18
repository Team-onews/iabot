import { JsonDB } from '../utils/jsondb.js';

type Locales = {
  en_US: 'English';
  ja: 'Japanese';
};

export async function getLocale(username: string): Promise<keyof Locales> {
  const db = new JsonDB(`locale/${username}.json`);
  if (!db.exists()) await db.create('object');
  const { locale } = await db.get();
  if (!locale) {
    db.set({ locale: 'ja' });
    return 'en_US';
  }
  return locale;
}
