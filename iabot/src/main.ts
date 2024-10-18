import { Client } from './utils/client.js';
export const client = new Client();

/* main */
(async () => {
  console.log('⊡ Initializing...');
  await client.init().catch(e => {
    const now = new Date();
    const fn = `errors/silent/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.log`;
    client.log(e, 'error', fn);
    console.log(e, '\ntrying prevent crash');
  });
})();
