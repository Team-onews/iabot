import { Command } from '../../types/index.js';
import { createItemEmbed, getGachaItem } from '../../utils/gachaUtil.js';

/* main */
export const command: Command = {
  data: {
    name: 'gacha_item',
    name_localizations: {
      ja: 'アイテム情報',
      'en-US': 'item',
    },
    description: '指定したアイテムの情報を表示します。',
    description_localizations: {
      'en-US': 'Display the information of the specified item.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'item',
        name_localizations: {
          ja: 'アイテム',
        },
        description: '表示したいアイテムを選択してください',
        description_localizations: {
          'en-US': 'Select the item to display.',
        },
        type: 3,
        required: true,
        autocomplete: true,
      },
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
    const { options } = interaction;
    const ephemeral = options.getBoolean('ephemeral') ? false : true;
    const item = options.get('item');
    if (!item || item.value === 'null' || !item.value || !(typeof item.value === 'string')) {
      await interaction.reply({
        ephemeral: true,
        content: '[ERR_NO_SPECIFIED_ITEM_TYPE] Please specify an item.',
      });
      return;
    }

    const _item = await getGachaItem(item.value, 'item');
    if (!_item) {
      await interaction.reply({ ephemeral: true, content: '[ERR_ITEM_NOT_FOUND] Item not found.' });
      return;
    }
    const embed = await createItemEmbed(_item, interaction.user);
    await interaction.reply({ embeds: [embed], ephemeral });
  },
};
