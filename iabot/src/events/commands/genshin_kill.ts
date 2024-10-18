import { execSync } from 'child_process';
import { Command } from '../../types/index.js';
import fs from 'fs';
import { i14a } from '../../configs/i14a.js';

export const command: Command = {
  data: {
    name: 'genshin_kill',
    name_localizations: {
      ja: 'genshin-kill',
    },
    description: '原神をタスクキルします',
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async (interaction, client) => {
    const state = fs.readFileSync('./data/kill.bool', 'utf-8');
    if (state === 'disallowed') {
      interaction.reply({
        content:
          '[ERR_TEMP_DISABLED] This command is Temporarily unavailable. To enable this command, run `' +
          i14a.prefix +
          'kill true`.',
        ephemeral: true,
      });
      return;
    }
    await interaction.reply('このBotを起動しているデバイスで原神を強制停止します。');
    try {
      execSync('taskkill /im genshinimpact.exe /f');
    } catch (e) {
      interaction.editReply({
        content: 'Something went wrong. GenshinImpact.exe not found.',
      });
      client.error(e);
    }
  },
};
