import { client } from '../main.js';

export async function restart() {
  client.log('Restarting...');
  console.log('⊡ Restarting...\n\n');
  await client.stop(0);
}
