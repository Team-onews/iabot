import { Command } from '../../types/index.js';
import { addInventoryItem, getGachaItem } from '../../utils/gachaUtil.js';
import { checkPerms } from '../../utils/utilities.js';

/* main */
export const command: Command = {
  data: {
    name: 'gacha_give',
    name_localizations: {
      ja: 'アイテムを付与',
      'en-US': 'give-item',
    },
    description: 'ガチャのアイテムを付与します',
    description_localizations: {
      'en-US': 'Give an item to a user.',
    },
    type: 1,
    integration_types: [0],
    options: [
      {
        name: 'item',
        description: '取得するアイテムを選択します',
        description_localizations: {
          'en-US': 'Select an item to get.',
        },
        type: 3,
        required: true,
        autocomplete: true,
      },
      {
        name: 'user',
        description: 'アイテムを付与するユーザーを選択します',
        description_localizations: {
          'en-US': 'Select the user to give the item to.',
        },
        type: 6,
        required: true,
      },
      {
        name: 'count',
        description: 'アイテムの数を選択します。指定しなかった場合デフォルトの値が使用されます。',
        description_localizations: {
          'en-US': 'Select the number of items. If not specified, the default value is used.',
        },
        type: 4,
        required: false,
      },
    ],
  },
  run: async interaction => {
    const { options } = interaction;
    if (!(await checkPerms(interaction.user.username, interaction.user.id, 'admin'))) {
      await interaction.reply("**Hey!** Sorry, but you don't have required permission.");
      return;
    }
    const item = options.getString('item');
    const user = options.getUser('user');
    const count = options.getInteger('count');
    if (!user || user.bot || user.system) {
      await interaction.reply({
        ephemeral: true,
        content: '[ERR_NO_SPECIFIED_USER] 有効なユーザーを選択してください',
      });
      return;
    }
    if (!item || item === 'null' || !(typeof item === 'string')) {
      await interaction.reply({
        ephemeral: true,
        content: '[ERR_NO_SPECIFIED_ITEM_TYPE] アイテムを選択してください',
      });
      return;
    }

    const _item = await getGachaItem(item, 'item');
    if (!_item) {
      await interaction.reply({
        ephemeral: true,
        content: '[ERR_UNKNOWN_ITEM_TYPE] 不明なアイテム: ' + item + '.',
      });
      return;
    }

    await addInventoryItem(_item.id, user.username, count ?? _item.count);
    await interaction.reply({
      content: `${user.username} に ${_item.emoji ?? ':sparkles:'} ${_item.name} (${_item.id}) を ${count ?? _item.count ?? 1} 個付与しました。`,
    });
  },
};
