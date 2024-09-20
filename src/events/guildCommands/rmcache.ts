import { Command } from '../../types/index.js';
import { removeAll } from '../../utils/remover.js';
import { restart } from '../../utils/restart.js';

export const command: Command = {
  data: {
    name: 'rmcache',
    description: 'Botのスラッシュコマンドのキャッシュを削除します。',
    description_localizations: {
      de: 'Bot-Slash-Befehle-Cache löschen',
      fr: 'Cache des commandes de bot supprimé',
      ko: '커스텀을 삭제하기',
      'en-US': 'Removes the bot slash command cache.',
      'zh-CN': '清除Bot Slash命令缓存。',
      'zh-TW': '清除Bot Slash命令快取。',
    },
    type: 1,
    integration_types: [0],
  },
  run: async interaction => {
    await interaction.reply({ content: 'Removing all commands...', ephemeral: true });
    await removeAll();
    interaction.editReply(`All commands are removed! Restarting...`);
    restart();
  },
};
