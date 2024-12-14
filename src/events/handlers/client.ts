/* types */
import { Client } from '../../utils/client.js';

/* modules */
import { i14a } from '../../configs/i14a.js';
import { setRPC } from '../../utils/utilities.js';
import startWebUIServer from '../../utils/webui.js';

/* main */
export async function ready(client: Client) {
  startWebUIServer();
  setRPC(client);
  setInterval(() => setRPC(client), 40000);

  console.info((await generateMessage(client, i14a.webui.port)).join('\n') + '\n');
}

async function generateMessage(client: Client, port?: number) {
  const r = [
    `⊡ Client(${i14a.version}) is now ready!`,
    ` ⊳ Logged in as ${client.user.tag} (${client.user.id})!`,
    ` ⊳ At ${new Date().toLocaleString()}`,
  ];
  if (port) r.push(` ⊳ WebUI Port: ${port}`);

  const { slashCommands, textCommands, buttons } = client;
  const { guilds, users } = await getUserInstallCount(client);
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

  return r;
}

async function getUserInstallCount(client: Client): Promise<{ users: number; guilds: number }> {
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
