import { client } from '../main.js';
import { execSync } from 'child_process';

export async function rebuild() {
  client.log('Rebuilding... ');
  console.log('⊡ Rebuilding...\n');

  try {
    await execSync('build.bat', { stdio: 'inherit' });
  } catch (e) {
    client.error(e);
    throw new Error('Failed to rebuild.');
  }
}
