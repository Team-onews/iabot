import { Client } from './utils/client.js';
export const client = new Client();

(async () => {
  console.log('⊡ Initializing...');
  await client.init().catch(e => {
    const now = new Date();
    const file = `errors/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}.log`;
    client.log(e, 'error', file);
    console.error(e);
  });
})();
