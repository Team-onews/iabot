import fs from 'fs';
import { checkPerms } from '../../utils/utilities.js';
import { messageCommand } from '../../types/index.js';

export const Command: messageCommand = {
  async run(message, args, client) {
    const { author } = message;
    if (!(await checkPerms(author.username, author.id, 'dev'))) {
      message.reply("**Hey!** Sorry, but you don't have required permission.");
      return;
    }

    const boolean = args[1];

    try {
      if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
      }
      if (boolean === 'true') {
        fs.writeFileSync('./data/kill.bool', 'allowed', 'utf-8');
        await message.reply({ content: 'kill is now allowed.', flags: [4096] });
        return;
      }

      if (boolean === 'false') {
        fs.writeFileSync('./data/kill.bool', 'disallowed', 'utf-8');
        await message.reply({ content: 'kill is now disallowed.', flags: [4096] });
        return;
      }

      const data = fs.readFileSync('./data/kill.bool', 'utf-8');
      await message.reply({
        content: `kill is now ${data}.`,
      });
    } catch (e) {
      await message.reply({
        content: 'Something went wrong. Please try again later.',
      });
      client.error(e);
    }
  },
};
