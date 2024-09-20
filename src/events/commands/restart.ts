/* modules */
import { Command } from '../../types/index.js';
import { restart } from '../../utils/restart.js';
import { checkPerms } from '../../utils/utilities.js';

/* main */
export const command: Command = {
  data: {
    name: 'restart',
    name_localizations: {
      ja: '再起動',
    },
    description: 'Botを再起動します。',
    description_localizations: {
      'en-US': 'Restarts the bot.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async interaction => {
    const {
      user: { id, username },
    } = interaction;
    await interaction.deferReply({ ephemeral: true });
    if (await checkPerms(username, id, 'admin')) {
      await interaction.editReply('再起動しています...');
      restart();
    } else {
      interaction.editReply("**Hey!** Sorry, but you don't have required permission.");
    }
  },
};
