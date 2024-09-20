/* data */
import { addInventoryItem, createGachaEmbed, pullGacha } from '../../utils/gachaUtil.js';
import { ButtonInteraction, MessageComponents } from '../../types/index.js';
export const Button: ButtonInteraction = {
  run: async function (interaction) {
    const {
      user,
      message: { embeds: e },
    } = interaction;
    const _type = 'item';

    if (e[0].author?.name !== user.username) {
      interaction.reply({
        content:
          '[ERR_NO_PERMISSION] インタラクションに失敗しました。あなたはこのメッセージのインタラクションの作成者ではない可能性があります。',
        ephemeral: true,
      });
      return;
    }
    const item = await pullGacha(_type);
    if (!item) {
      interaction.reply({
        ephemeral: true,
        content: '[ERR_UNKNOWN] Failed to pull gacha.',
      });
      return;
    }
    const embeds = [await createGachaEmbed(item, interaction.user, _type)];
    const components: MessageComponents[] = [
      {
        type: 1,
        components: [
          {
            custom_id: 'gacha',
            type: 2,
            label: 'もう一度回す',
            style: 1,
          },
        ],
      },
    ];
    await addInventoryItem(item.id, user.username);

    interaction.reply({
      components,
      embeds,
      flags: [4096],
    });
  },
};
