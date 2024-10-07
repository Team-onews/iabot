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
    `⊡ Client(${version}) is now ready!`,
    ` ⊳ Logged in as ${client.user.tag} (${client.user.id})!`,
  ];

  const { slashCommands, textCommands, buttons } = client;
  const { guilds, users } = await getInstallCount(client);
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
  if (guilds > 0) r.push(` ⊳ ${guilds} server(s)`);
  if (users > 0) r.push(` ⊳ ${users} user(s)`);

  console.info(r.join('\n') + '\n');
}

async function getInstallCount(client: Client): Promise<{ users: number; guilds: number }> {
  const response = await fetch('https://discord.com/api/v10/applications/@me', {
    headers: {
      Authorization: `Bot ${client.i14a.env.token}`,
      'Content-Type': 'application/json',
    },
  });
  const json = await response.json();

  return {
    users: json.approximate_user_install_count,
    guilds: json.approximate_guild_count,
  };
}
