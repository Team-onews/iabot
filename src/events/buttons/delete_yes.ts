import { i14a } from '../../configs/i14a.js';
import { ButtonInteraction } from '../../types/index.js';
import { getUserInventory } from '../../utils/gachaUtil.js';
import { checkPerms } from '../../utils/utilities.js';

export const Button: ButtonInteraction = {
  run: async function (interaction) {
    const { message, user } = interaction;
    if (!(await checkPerms(user.username, user.id, 'admin'))) {
      await interaction.reply({
        content: "**Hey!** Sorry, but you don't have required permission.",
      });
      return;
    }
    const text = message.embeds[0].footer?.text;
    await message.edit({ content: '消去中...', embeds: [], components: [] });
    if (!text) {
      await interaction.reply('[ERR_GET_EMBED_FOOTER_TEXT] 内部エラーが発生しました。');
      return;
    }
    const { user: _u, type } = JSON.parse(text) as {
      user: string;
      type: 'character' | 'item' | 'all';
    };
    if (type === 'all') {
      (await getUserInventory(_u, 'character')).db.delete();
      (await getUserInventory(_u, 'item')).db.delete();
    }
    if (type === 'character') {
      (await getUserInventory(_u, 'character')).db.delete();
    }
    if (type === 'item') {
      (await getUserInventory(_u, 'item')).db.delete();
    }
    await interaction.deferUpdate();
    await message.edit({
      content: '消去しました',
      components: i14a.components.delete,
    });
  },
};
