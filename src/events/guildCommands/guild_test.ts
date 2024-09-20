import { Command } from '../../types/index.js';

export const command: Command = {
  data: {
    name: 'guild_test',
    description: 'test command',
    description_localizations: {
      ja: 'Test Command for ja',
      de: 'Test Command for de',
      fr: 'Test Commande pour fr',
      'en-US': 'Test Command for en-US',
      'zh-CN': 'Test Command for zh-CN',
      'zh-TW': 'Test Command for zh-TW',
    },
    type: 1,
    integration_types: [0],
  },
  run: async interaction => {
    interaction.reply({ content: 'test command', ephemeral: true });
  },
};
