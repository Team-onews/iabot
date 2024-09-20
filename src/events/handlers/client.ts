//todo: display user install count

/* types */
import { Client } from '../../utils/client.js';

/* modules */
import { i14a } from '../../configs/i14a.js';
import { setRPC } from '../../utils/utilities.js';

/* init */
const { version } = i14a;

/* main */
export async function ready(client: Client) {
  setRPC(client);
  setInterval(() => setRPC(client), 40000);

  const r = [
    '⊡ Client is now ready!',
    ` ⊳ Logged in as ${client.user.tag}!`,
    ` ⊳ ID: ${client.user.id}`,
    ` ⊳ Version: ${version}`,
  ];
  const { guilds, slashCommands, textCommands, buttons } = client;

  const cmdTypes = {
    slashCommands,
    textCommands,
    buttons,
  };

  Object.entries(cmdTypes).forEach(([K, V]) => {
    if (V.size > 0) {
      r.push(` ⊳ Loaded ${V.size} ${K}`);
    }
  });

  if (guilds.cache.size > 0) r.push(` ⊳ ${guilds.cache.size} server(s)`);

  console.info(r.join('\n') + '\n');
}
