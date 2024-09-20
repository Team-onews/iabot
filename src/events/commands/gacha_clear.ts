import { Command } from '../../types/index.js';
import { checkPerms } from '../../utils/utilities.js';

/* main */
export const command: Command = {
  data: {
    name: 'gacha_clear',
    name_localizations: {
      ja: 'インベントリを消去',
      'en-US': 'clear-inventory',
    },
    description: '指定したユーザーのインベントリを全消去します。',
    description_localizations: {
      'en-US': 'Clear the inventory of the specified user.',
    },
    type: 1,
    integration_types: [0],
    options: [
      {
        name: 'user',
        name_localizations: {
          ja: 'ユーザー',
        },
        description: '消去したいユーザーを選択してください',
        description_localizations: {
          'en-US': 'Select the user to clear the inventory.',
        },
        type: 6,
        required: true,
      },
      {
        name: 'type',
        name_localizations: {
          ja: 'タイプ',
        },
        description: '消去したいインベントリのタイプを選択してください',
        description_localizations: {
          'en-US': 'Select the type of inventory to clear.',
        },
        type: 3,
        required: false,
        choices: [
          {
            name: 'キャラクター',
            name_localizations: {
              'en-US': 'Character',
            },
            value: 'character',
          },
          {
            name: 'アイテム',
            name_localizations: {
              'en-US': 'Item',
            },
            value: 'item',
          },
          {
            name: '全て',
            name_localizations: {
              'en-US': 'All',
            },
            value: 'all',
          },
        ],
      },
    ],
  },
  run: async interaction => {
    const { options } = interaction;
    if (!(await checkPerms(interaction.user.username, interaction.user.id, 'admin'))) return;
    const type = options.getString('type') || 'all';
    const user = options.getUser('user');
    if (!user || user.bot || user.system) {
      interaction.reply({
        content: '[ERR_NO_SPECIFIED_USER] 有効なユーザーを選択してください',
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      embeds: [
        {
          title: 'インベントリの消去を開始します。この操作は取り消せません。',
          description: [
            '本当に実行しますか?',
            `-# 操作の詳細: ユーザー: ${user.username} タイプ: ${type}`,
          ].join('\n'),
          footer: { text: JSON.stringify({ user: user.username, type }) },
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: '続行する',
              style: 4,
              custom_id: 'delete_yes',
            },
            {
              type: 2,
              label: 'キャンセル',
              style: 1,
              custom_id: 'delete_no',
            },
          ],
        },
      ],
    });
  },
};
