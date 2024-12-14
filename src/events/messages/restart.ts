/* modules */
import { messageCommand } from '../../types/index.js';
import { restart } from '../../utils/restart.js';
import { checkPerms } from '../../utils/utilities.js';

/* main */
export const Command: messageCommand = {
  async run(message) {
    const {
      author: { username, id },
    } = message;
    if (!(await checkPerms(username, id, 'admin')))
      return message.reply("**Hey!** Sorry, but you don't have required permission.");
    message.reply('再起動しています...');
    await message.delete().catch(console.log);
    restart();
  },
};
