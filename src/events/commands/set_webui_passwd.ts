import { Command } from '../../types/index.js';
import { JsonDB } from '../../utils/jsondb.js';

export const command: Command = {
  data: {
    name: 'set_webui_passwd',
    description: 'あなたのWebUIのパスワードを設定します。',
    description_localizations: {
      'en-US': 'Set your WebUI password.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'passwd',
        description: 'パスワード',
        description_localizations: {
          'en-US': 'Password',
        },
        min_length: 4,
        max_length: 24,
        type: 3,
        required: true,
        autocomplete: false,
      },
      {
        name: 'expire',
        description: '有効期限 (Bot管理者のみ設定可能、分指定)',
        description_localizations: {
          'en-US': 'Expiration date (Only available to bot administrators, type in minutes)',
        },
        type: 4,
        required: false,
      },
    ],
  },
  run: async interaction => {
    const db = new JsonDB(`webui/passwd/${interaction.user.username}`);
    if (!db.exists()) db.create();

    await interaction.reply({ content: 'パスワードを設定しています...', ephemeral: true });
    await db.set({
      username: interaction.user.username,
      id: interaction.user.id,
      passwd: interaction.options.getString('passwd', true),
      expire: Date.now() + 24 * 60 * 60 * 1000,
    });
    await interaction.editReply(
      'パスワードを設定しました。\nパスワードは24時間もしくはBotが再起動するまで有効です。'
    );
  },
};
