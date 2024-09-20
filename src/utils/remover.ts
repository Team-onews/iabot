/* modules */
import { client } from '../main.js';

/* main */
export async function removeAll() {
  console.info(`⊡ Deleting all in all guilds...`);
  const guilds = client.guilds.cache.values();
  for (const guild of guilds) {
    const commands = await guild.commands.fetch();
    if (commands) {
      await Promise.all(
        commands.map(async cmd => {
          console.log(` ⊳ ${guild.name}/${cmd.name}`);
          await cmd.delete();
        })
      );
    }
  }
}
