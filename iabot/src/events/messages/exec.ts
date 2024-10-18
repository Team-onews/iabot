import { type } from 'os';
import { messageCommand } from '../../types/index.js';
import { checkPerms } from '../../utils/utilities.js';
import { exec } from 'child_process';

export const Command: messageCommand = {
  name: 'exec',
  run: async (message, args) => {
    if (!(await checkPerms(message.author.username, message.author.id, 'dev'))) return;
    const reply = await message.reply('<a:loading:1271076741749936179> 実行中...');
    const command = args.slice(1).join(' ');
    console.log(`(iabot) ${process.cwd()}> ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reply.edit(`\`\`\`bash\n${error}\n\`\`\``);
        return;
      }
      if (stderr) {
        reply.edit(`\`\`\`bash\n${stderr}\n\`\`\``);
        return;
      }
      console.log(stdout + '\n');
      if (stdout.length > 1950) {
        reply.edit(
          `\`\`\`${type() === 'Windows_NT' ? 'bat' : 'bash'}\n${stdout.slice(0, 1950)}\n\`\`\`\n${stdout.length}bytes`
        );
        return;
      }
      reply.edit(`\`\`\`${type() === 'Windows_NT' ? 'bat' : 'bash'}\n${stdout}\n\`\`\``);
    });
  },
};
