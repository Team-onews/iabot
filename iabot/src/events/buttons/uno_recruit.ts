import { ButtonInteraction } from '../../types/index.js';
import { checkPerms } from '../../utils/utilities.js';

export const Button: ButtonInteraction = {
  run: async function (interaction) {
    const {
      user: { id, username },
    } = interaction;
    if (!checkPerms(username, id, 'trust')) {
      interaction.reply("**Hey!** Sorry, but you don't have required permission.");
      return;
    }
    const embeds = interaction.message.embeds;
    embeds[0].fields.push({
      name: '現在ゲームを募集中です',
      value: 'このゲームの最大募集人数は3人です',
    });
    await interaction.message.edit({
      embeds,
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
              label: '募集を終了する',
              custom_id: 'uno_close',
              style: 4,
            },
          ],
        },
      ],
    });
    await interaction.update({});
  },
};
