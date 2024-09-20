import { JsonDB } from '../utils/jsondb.js';

type Locales = {
  en_US: 'en_US';
  ja_JP: 'ja_JP';
};

export async function getLocale(username: string): Promise<keyof Locales> {
  const db = new JsonDB(`locale/${username}.json`);
  if (!db.exists()) await db.create();
  const locale = await db.get();
  if (!locale) return 'en_US';
  return locale;
}
