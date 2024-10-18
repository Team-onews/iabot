import { Command } from '../../types/index.js';

/* main */
export const command: Command = {
  data: {
    name: 'support',
    name_localizations: {
      ja: 'サポートサーバー',
    },
    description: 'Botのサポートサーバーへの招待リンクを表示します。',
    description_localizations: {
      'en-US': 'Display the support server invite link.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async interaction => {
    await interaction.reply({
      content: 'Support server: discord.gg/PTTGPsYwjX',
      ephemeral: true,
    });
  },
};
