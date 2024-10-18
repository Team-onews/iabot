import { messageCommand } from '../../types/index.js';
import { removeAll } from '../../utils/remover.js';
import { restart } from '../../utils/restart.js';

export const Command: messageCommand = {
  async run(message, args, client) {
    if (args[1] === 'userinstall') {
      await message.reply('Removing all commands...');

      if (!client.user) throw new Error('User not found');
      console.info(`Deleting all user-install commands...`);
      const commands = await client.application?.commands.fetch();
      if (commands) {
        await Promise.all(
          commands.map(async cmd => {
            console.log(` ⊳ User-unstall/${cmd.name}`);
            await cmd.delete();
          })
        );
      }
      console.log('\n');
      return;
    } else if (args[1] === 'guild') {
      const reply = await message.reply('Removing all commands...');
      await removeAll();
      await reply.edit(`All commands are removed! Restarting...`);
      restart();
    } else {
      await message.reply('Wrong argument. Use `userinstall` or `guild`');
    }
  },
};
