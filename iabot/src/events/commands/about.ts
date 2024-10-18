import { i14a } from '../../configs/i14a.js';
import { Command } from '../../types/index.js';

export const command: Command = {
  data: {
    name: 'about',
    name_localizations: {
      ja: '詳細',
    },
    description: 'Botの詳細を表示します。',
    description_localizations: {
      de: 'Bot-Details anzeigen',
      fr: 'Affiche les détails du bot',
      ko: '커스텀가 보여주기',
      'en-US': 'About the bot.',
      'zh-CN': '显示Bot详细信息。',
      'zh-TW': '顯示Bot詳細信息。',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async (interaction, client) => {
    if (!client.user) return;
    interaction.reply({
      embeds: [
        {
          author: {
            name: 'About',
            icon_url: client.user.displayAvatarURL(),
          },
          title: 'About bot',
          fields: [
            {
              name: 'Version',
              value: i14a.version,
            },
            {
              name: 'Developers',
              value: i14a.users.dev.join(', '),
            },
            {
              name: '開発者よりお知らせ',
              value: [
                '</gacha:1275010888126169142> で遊んでみてね！',
                'オプションで非表示のリプライにした状態でガチャを回すこともできます！',
              ].join('\n'),
            },
          ],
        },
      ],
    });
  },
};
