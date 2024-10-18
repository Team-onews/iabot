import { Command } from '../../types/index.js';

export const command: Command = {
  data: {
    name: 'test_error',
    description: 'Intentionally creating an error',
    type: 1,
    integration_types: [0],
    options: [
      {
        name: 'message',
        description: 'message',
        type: 5,
      },
    ],
  },
  run: async interaction => {
    const message = interaction.options.getBoolean('message');
    if (message) {
      await interaction.reply({ content: 'test', ephemeral: true });
      throw new Error('test error');
    } else throw new Error('test error');
  },
};
