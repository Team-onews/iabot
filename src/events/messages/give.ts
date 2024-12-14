import { i14a } from '../../configs/i14a.js';
import { messageCommand } from '../../types/index.js';
import { addInventoryItem, getGachaItem } from '../../utils/gachaUtil.js';
import { checkPerms } from '../../utils/utilities.js';

/* main */
export const command: messageCommand = {
  name: 'give',
  run: async (message, args) => {
    if (!(await checkPerms(message.author.username, message.author.id, 'admin'))) {
      await message.reply(
        "[ERR_NO_PERMISSION] **Hey!** Sorry, but you don't have required permission."
      );
      return;
    }
    const item = args[0];
    const user = args[1];
    const count = parseInt(args[2]);
    if (!item || !user) {
      await message.reply({
        content: `Usage: ${i14a.prefix}give <item: string> <user: username> [count: number]`,
      });
      return;
    }
    if (!item || item === 'null' || !(typeof item === 'string')) {
      await message.reply({
        content: [
          '[ERR_NO_SPECIFIED_ITEM_TYPE] 有効なアイテムを選択してください。',
          '</gacha_item:1275010888126169145> を使用するとアイテムを検索できます。',
        ].join('\n'),
      });
      return;
    }

    const _item = await getGachaItem(item, 'item');
    if (!_item) {
      await message.reply({
        content: '[ERR_UNKNOWN_ITEM_TYPE] 不明なアイテム: ' + item + '.',
      });
      return;
    }

    await addInventoryItem(_item.id, message.author.username, count ?? _item.count);
    await message.reply({
      content: `${message.author.username} に ${_item.emoji ?? ':sparkles:'} ${_item.name} (${_item.id}) を ${count ?? _item.count ?? 1} 個付与しました。`,
    });
  },
};
