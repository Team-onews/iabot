import { messageCommand } from '../../types/index.js';
import { checkPerms } from '../../utils/utilities.js';

export const Command: messageCommand = {
  name: 'eval',
  run: async (message, args) => {
    if (!(await checkPerms(message.author.username, message.author.id, 'dev'))) return;
    const code = args.join(' ');
    try {
      // eslint-disable-next-line no-eval
      const evaled = eval(code);
      message.reply(`\`\`\`js\n${evaled}\n\`\`\``);
    } catch (err) {
      message.reply(`\`\`\`js\n${err}\n\`\`\``);
    }
  },
};
