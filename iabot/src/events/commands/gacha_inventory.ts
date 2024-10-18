/* data */
import {
  createInventoryEmbed,
  getPageFromInventoryEmbedData,
  getUserInventory,
} from '../../utils/gachaUtil.js';
import { Command, MessageComponents } from '../../types/index.js';

/* main */
export const command: Command = {
  data: {
    name: 'gacha_inventory',
    name_localizations: {
      ja: 'インベントリ',
      'en-US': 'inventory',
    },
    description: 'あなたのインベントリを表示します。',
    description_localizations: {
      'en-US': 'Display your inventory.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'ephemeral',
        name_localizations: {
          ja: '公開するか',
          'en-US': 'no-ephemeral',
        },
        description: 'ephemeral',
        description_localizations: {
          ja: '非表示のリプライから公開のリプライに変更できます。',
          'en-US': 'Change from ephemeral message to public message.',
        },
        type: 5,
        required: false,
      },
    ],
  },
  run: async interaction => {
    const { user, options } = interaction;
    const ephemeral = options.getBoolean('ephemeral') ? false : true;

    const { inventory } = await getUserInventory(user.username, 'item');
    if (inventory.length < 1) {
      await interaction.reply({
        content: "[ERR_NO_ITEMS_IN_INV] You don't have any items in your inventory.",
        ephemeral: true,
      });
      return;
    }

    const embed = await createInventoryEmbed(user, 'item');
    const data = getPageFromInventoryEmbedData(embed);
    if (!data) {
      await interaction.reply({
        content: '[ERR_UNKNOWN] エラーが発生しました。',
        ephemeral: true,
      });
      return;
    }
    let components: MessageComponents[] = [];
    if (data.maxPage > 1)
      components.push({
        type: 1,
        components: [
          {
            type: 2,
            label: '次のページ',
            custom_id: 'inventory_next',
            style: 2,
          },
        ],
      });
    await interaction.reply({ embeds: [embed], ephemeral, components });
  },
};
