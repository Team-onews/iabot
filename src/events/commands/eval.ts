import { checkPerms } from '../../utils/utilities.js';
import { Command } from '../../types/index.js';

export const command: Command = {
  data: {
    name: 'eval',
    description: '指定されたコードでJavaScriptを実行します。',
    description_localizations: {
      'en-US': 'Execute JavaScript.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'code',
        description: 'code',
        type: 3,
        required: true,
      },
    ],
  },
  run: async interaction => {
    if (!(await checkPerms(interaction.user.username, interaction.user.id, 'dev'))) {
      await interaction.reply(
        "[ERR_NO_PERMISSION] **Hey!** Sorry, but you don't have required permission."
      );
      return;
    }

    try {
      const code = interaction.options.getString('code', true);
      // eslint-disable-next-line no-eval
      const evaled = eval(code);
      interaction.reply(`\`\`\`js\n${evaled}\n\`\`\``);
    } catch (err) {
      interaction.reply(`\`\`\`js\n${err}\n\`\`\``);
    }
  },
};
