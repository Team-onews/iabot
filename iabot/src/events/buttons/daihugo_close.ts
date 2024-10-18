import { ButtonInteraction } from '../../types/index.js';

export const Button: ButtonInteraction = {
  run: async function (interaction) {
    await interaction.message.edit({
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: '詳細を表示',
              custom_id: 'daihugo_rule',
              style: 2,
            },
            {
              type: 2,
              label: '募集中にする',
              custom_id: 'daihugo_recruit',
              style: 1,
            },
          ],
        },
      ],
      embeds: [
        {
          title: '大富豪のルーム名とURL',
          fields: [
            {
              name: 'URL',
              value: 'https://playingcards.jp/game/daifugo',
            },
            {
              name: 'ルーム名',
              value: '936361CD7B6B',
            },
          ],
        },
      ],
    });
    await interaction.update({});
  },
};
