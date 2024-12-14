import { i14a } from '../../configs/i14a.js';
import { Command } from '../../types/index.js';

export const command: Command = {
  data: {
    name: 'osu_userinfo',
    name_localizations: {
      ja: 'osuからユーザーを取得',
      'en-US': 'get-osu-userinfo',
    },
    description: 'osu!のユーザー情報を取得します。',
    description_localizations: {
      'en-US': 'Get osu! user information.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'user',
        description: 'osu!のユーザー名またはIDを入力してください。',
        description_localizations: {
          'en-US': 'Enter the osu! user name or ID.',
        },
        type: 3,
        max_length: 15,
        required: true,
      },
      {
        name: 'mode',
        name_localizations: {
          ja: 'モード',
        },
        description: '統計を取得するモードを選択できます。デフォルト:osu!',
        description_localizations: {
          'en-US': 'Select the mode to get statistics. (default:osu!)',
        },
        type: 4,
        required: false,
        choices: [
          { name: 'osu!', value: 0 },
          { name: 'osu!taiko', value: 1 },
          { name: 'osu!catch', value: 2 },
          { name: 'osu!mania', value: 3 },
        ],
      },
      {
        name: 'ephemeral',
        name_localizations: {
          ja: '非公開',
        },
        description: '応答を非公開にすることができます。',
        description_localizations: {
          'en-US': 'Make the response private.',
        },
        type: 5,
        required: false,
      },
    ],
  },
  run: async (interaction, client) => {
    if (!client.user) return;

    const user = interaction.options.getString('user', true);
    const mode = interaction.options.getInteger('mode') ?? 0;
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

    if (!interaction.user) return;
    await interaction.reply({
      embeds: [
        {
          author: {
            name: interaction.user.username,
            icon_url: interaction.user.displayAvatarURL(),
          },
          color: 0x2f3136,
          description: 'osu!からの応答を待っています...',
        },
      ],
      ephemeral,
    });
    try {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
      };
      const get_user = await fetch(
        `https://osu.ppy.sh/api/get_user?k=${i14a.env.osu_api_key}&u=${user}&m=${mode}&limit=1`,
        { method: 'GET', headers }
      );

      const json = (await get_user.json())[0];
      const avatar = `https://a.ppy.sh/${json.user_id}`;
      const joinDate = Math.floor(new Date(json.join_date.replace(' ', 'T')).getTime() / 1000);
      const embed = {
        author: {
          name: 'osu!ユーザー情報',
          url: `https://osu.ppy.sh/users/${user}`,
          icon_url: avatar,
        },
        color: 0x2f3136,
        title: `${json.username} (${json.user_id})`,
        description: [
          `モード: ${mode === 0 ? 'osu!' : mode === 1 ? 'osu!taiko' : mode === 2 ? 'osu!catch' : 'osu!mania'}`,
          `レベル: ${Math.floor(json.level)}`,
          `合計PP: ${Math.floor(json.pp_raw)}`,
          `総プレイ数: ${json.playcount}`,
        ].join('\n'),
        fields: [
          {
            name: '参加日',
            value: `<t:${joinDate}:F>(<t:${joinDate}:R>)`,
          },
          {
            name: '累計スコア',
            value: json.total_score,
          },
        ],
      };
      await interaction.editReply({ embeds: [embed] });
      return;
    } catch (e) {
      await interaction.editReply({
        embeds: [
          {
            color: 0xff0000,
            description: 'どうやらエラーが発生したみたい',
          },
        ],
      });
      client.error(e);
      return;
    }
  },
};
