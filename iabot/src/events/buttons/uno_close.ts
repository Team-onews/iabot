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
              custom_id: 'uno_rule',
              style: 2,
            },
            {
              type: 2,
              label: '募集中にする',
              custom_id: 'uno_recruit',
              style: 1,
            },
          ],
        },
      ],
      embeds: [
        {
          title: 'UNOのURL',
          fields: [
            {
              name: 'URL',
              value: 'https://turbowarp.org/560830444/fullscreen',
            },
          ],
        },
      ],
    });
    await interaction.update({});
  },
};
