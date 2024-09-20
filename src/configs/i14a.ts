/* modules */
import { rootPath } from '../utils/subpaths.js';
import 'dotenv/config';

/* init */
const dev = process.env.developer?.split(',') ?? [];
const admin = [...dev, ...(process.env.administrator?.split(',') ?? [])];
const mod = [...admin, ...(process.env.moderator?.split(',') ?? [])];
const trusted = [...mod, ...(process.env.trusted?.split(',') ?? [])];
const ignored = process.env.ignore?.split(',') ?? [];
const bannedWords = process.env.banned_word?.split(',') ?? [];

export const i14a = {
  version: '1.0.0-public',
  prefix: 'i.',
  users: {
    ignored,
    trusted,
    mod,
    admin,
    dev,
  },
  antiSpam: {
    slashCommands: ['eval', 'gacha', 'exec'],
    buttons: ['gacha', 'gacha_character', 'inventory_back', 'inventory_yes'],
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
    token: process.env.TOKEN,
    bannedWord: bannedWords || [''],
    clientId: process.env.client_id,
  },
  write: () => {
    console.warn('Not implemented yet.');
  },
};
