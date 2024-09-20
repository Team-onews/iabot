/* data */
import { Command, MessageComponents } from '../../types/index.js';
import {
  addCharacterEntry,
  addInventoryItem,
  createGachaEmbed,
  getItemStackFromInventory,
  pullGacha,
  removeInventoryItem,
} from '../../utils/gachaUtil.js';

/* main */
export const command: Command = {
  data: {
    name: 'gacha',
    name_localizations: {
      ja: 'ガチャ',
    },
    description: 'ガチャを回します。',
    description_localizations: {
      'en-US': 'Pull a gacha.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'type',
        name_localizations: {
          ja: 'ガチャのタイプ',
        },
        description: '排出される物のタイプを選択します',
        description_localizations: {
          'en-US': 'Select the type of item to pull.',
        },
        type: 3,
        required: true,
        choices: [
          {
            name: 'item',
            name_localizations: {
              ja: 'アイテム',
            },
            value: 'item',
          },
          {
            name: 'character',
            name_localizations: {
              ja: 'キャラクター',
            },
            value: 'character',
          },
        ],
      },
      {
        name: 'ephemeral',
        name_localizations: {
          ja: '非公開',
          'en-US': 'ephemeral',
        },
        description: 'ephemeral',
        description_localizations: {
          ja: '非公開にするか',
          'en-US': 'Change from public message to ephemeral message.',
        },
        type: 5,
        required: false,
      },
    ],
  },
  run: async interaction => {
    const { user, options } = interaction;
    const ephemeral = options.getBoolean('ephemeral') ? true : false;
    const _type = options.getString('type') as 'item' | 'character';
    if (_type === 'character') {
      const tickets = await getItemStackFromInventory(user.username, 'ticket_character');
      if (!(tickets > 0)) {
        interaction.reply({
          ephemeral: true,
          content: "[ERR_NOT_ENOUGH_ITEMS_IN_INV] You don't have enough tickets.",
        });
        return;
      }
      await removeInventoryItem('ticket_character', user.username);
    }
    const item = await pullGacha(_type);
    if (!item) {
      interaction.reply({
        ephemeral: true,
        content: '[ERR_UNKNOWN]  Failed to pull gacha.',
      });
      return;
    }
    const embeds = [await createGachaEmbed(item, interaction.user, _type)];
    const components: MessageComponents[] = [
      {
        type: 1,
        components: [],
      },
    ];
    if (_type === 'item') {
      await addInventoryItem(item.id, user.username);
      components[0].components.push({
        custom_id: 'gacha',
        type: 2,
        label: 'もう一度回す',
        style: 1,
      });
    }
    if (_type === 'character') {
      await addCharacterEntry(item.id, user.username);
      components[0].components.push({
        custom_id: 'gacha_character',
        type: 2,
        label: 'もう一度回す',
        style: 1,
      });
    }
    interaction.reply({
      ephemeral,
      components,
      embeds,
      flags: [4096],
    });
  },
};
