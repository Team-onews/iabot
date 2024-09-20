/* modules */
import { checkPerms } from '../../utils/utilities.js';
import { restart } from '../../utils/restart.js';
import { rebuild } from '../../utils/rebuild.js';
import { Command } from '../../types/index.js';

/* main */
export const command: Command = {
  data: {
    name: 'rebuild',
    name_localizations: {
      ja: 'リビルド',
    },
    description: 'Botを再ビルドします。',
    description_localizations: {
      'en-US': 'Rebuilds the bot.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async interaction => {
    const {
      user: { username, id },
    } = interaction;
    await interaction.deferReply({ ephemeral: true });
    if (!(await checkPerms(username, id, 'dev'))) {
      await interaction.editReply("**Hey!** Sorry, but you don't have required permission.");
      return;
    }
    try {
      rebuild();
    } catch (e) {
      console.error(e);
      await interaction.editReply(
        `[ERR_REBUILD] リビルド中にエラーが発生しました。詳しくはコンソールを確認してください。`
      );
      return;
    }
    interaction.editReply(`Rebuild successfully! Restarting...`);
    restart();
  },
};
