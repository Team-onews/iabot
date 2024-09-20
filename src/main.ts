import { Client } from './utils/client.js';
export const client = new Client();

/* main */
(async () => {
  await client.init();
})();
