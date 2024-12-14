import { type } from 'os';
import { checkPerms } from '../../utils/utilities.js';
import { exec } from 'child_process';
import { Command } from '../../types/index.js';

export const command: Command = {
  data: {
    name: 'exec',
    description: '指定されたコマンドをホストのターミナルで実行します。',
    description_localizations: {
      'en-US': 'Execute the specified command on the host terminal.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'command',
        description: 'command',
        type: 3,
        required: true,
      },
    ],
  },
  run: async interaction => {
    if (!(await checkPerms(interaction.user.username, interaction.user.id, 'dev'))) return;
    await interaction.reply('<a:loading:1271076741749936179> 実行中...');
    const command = interaction.options.getString('command', true);
    console.log(`(iabot) ${process.cwd()}> ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        interaction.editReply(`\`\`\`bash\n${error}\n\`\`\``);
        return;
      }
      if (stderr) {
        interaction.editReply(`\`\`\`bash\n${stderr}\n\`\`\``);
        return;
      }
      console.log(stdout + '\n');
      if (stdout.length > 1950) {
        interaction.editReply(
          `\`\`\`${type() === 'Windows_NT' ? 'bat' : 'bash'}\n${stdout.slice(0, 1950)}\n\`\`\`\n${stdout.length}bytes`
        );
        return;
      }
      interaction.editReply(`\`\`\`${type() === 'Windows_NT' ? 'bat' : 'bash'}\n${stdout}\n\`\`\``);
    });
  },
};
