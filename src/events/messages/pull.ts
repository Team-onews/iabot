import { messageCommand } from '../../types/index.js';
import { checkPerms } from '../../utils/utilities.js';
import { exec } from 'child_process';

export const Command: messageCommand = {
  name: 'pull',
  run: async message => {
    if (!(await checkPerms(message.author.username, message.author.id, 'dev'))) return;
    const reply = await message.reply('updating...');
    console.log(`(iabot) Updating...`);
    exec('git pull', (error, stdout, stderr) => {
      if (error || stderr) {
        reply.edit('error');
        return;
      }
      console.log(stdout + '\n');
      reply.edit('success');
    });
  },
};
