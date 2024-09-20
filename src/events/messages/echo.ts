import { i14a } from '../../configs/i14a.js';
import { messageCommand } from '../../types/index.js';
import { checkPerms } from '../../utils/utilities.js';

export const Command: messageCommand = {
  async run(message) {
    const {
      author: { username, id },
    } = message;
    if (!(await checkPerms(username, id, 'mod'))) {
      message.reply("**Hey!** Sorry, but you don't have required permission.");
      return;
    }
    await message.reply(message.content.slice(i14a.prefix.length + 5));
    message.delete().catch(console.log);
  },
};
