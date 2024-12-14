/* modules */
import { rootPath } from '../utils/subpaths.js';
import 'dotenv/config';
import _ from 'lodash';

/* init */
const dev = process.env.developer?.split(',') ?? [];
const admin = [...dev, ...(process.env.administrator?.split(',') ?? [])];
const mod = [...admin, ...(process.env.moderator?.split(',') ?? [])];
const trusted = [...mod, ...(process.env.trusted?.split(',') ?? [])];
const ignored = process.env.ignore?.split(',') ?? [];
const bannedWords = process.env.banned_word?.split(',').map(w => _.escapeRegExp(w)) ?? [];

const version = '1.6.1-public';
const isDev = version.includes('dev');

export const i14a = {
  version,
  isDev,
  prefix: isDev ? 'i!' : 'i.',
  users: {
    ignored,
    trusted,
    mod,
    admin,
    dev,
  },
  antiSpam: {
    slashCommands: ['eval', 'gacha', 'exec', 'refresh', 'support', 'rebuild', 'restart', 'ping'],
    buttons: ['gacha', 'gacha_character', 'inventory_back', 'inventory_yes', 'delete'],
  },
  components: {
    delete: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: 'メッセージを削除',
            custom_id: 'delete',
            style: 4,
          },
        ],
      },
    ],
  },
  env: {
    dist: 'dist',
    rootPath,
    dbPath: rootPath.replace(/(\/dist\/configs)|()*$/g, '') + '/db',
    token: isDev ? process.env.DEV_TOKEN : process.env.TOKEN,
    gemini: process.env.gemini ?? '',
    gsi2: process.env.gsi2 ?? '',
    gemini_token: process.env.gemini_token ?? '',
    gemini_system_instruction: process.env.gemini_system_instruction ?? '',
    osu_api_key: process.env.osu_api_key ?? '',
    bannedWord: bannedWords || [''],
    clientId: isDev ? process.env.DEV_client_id : process.env.client_id,
  },
  write: () => {
    console.warn('Not implemented yet.');
  },
  webui: {
    port: (process.env.WEBUI_PORT as number | undefined) ?? 8080,
  },
};
