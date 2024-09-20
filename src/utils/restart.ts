import { client } from '../main.js';

export async function restart() {
  client.write('Restarting...');
  console.log('⊡ Restarting...\n\n');
  await client.destroy();
  await process.exit(0);
}
