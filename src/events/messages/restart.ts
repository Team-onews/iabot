/* modules */
import { messageCommand } from '../../types/index.js';
import { restart } from '../../utils/restart.js';
import { checkPerms } from '../../utils/utilities.js';

/* main */
export const Command: messageCommand = {
  async run(message, args, client) {
    const {
      author: { username, id },
    } = message;
    if (await checkPerms(username, id, 'admin')) {
      await message.reply('再起動しています...');
      await message.delete().catch(console.log);
      restart();
    } else {
      message.reply("**Hey!** Sorry, but you don't have required permission.");
      await client.write('No permission', 'perm', 'permissionError');
      return;
    }
  },
};
