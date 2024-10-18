import {
  calculateInventoryPages,
  createInventoryEmbed,
  getUserInventory,
} from '../../utils/gachaUtil.js';
import { ButtonInteraction, MessageComponents } from '../../types/index.js';

export const Button: ButtonInteraction = {
  run: async function (interaction) {
    const _e = interaction.message.embeds[0];
    const data = _e.footer?.text.split(' ');
    if (!data) return;
    const type = data[0] as 'item' | 'character';
    const page = parseInt(data[1]) - 1;
    if (_e.author?.name !== interaction.user.username || !page || !type) return;
    const inv = (await getUserInventory(interaction.user.username, type)).inventory;
    const maxPage = await calculateInventoryPages(inv);
    const embed = await createInventoryEmbed(interaction.user, 'item', page);
    if (!(page === 1)) {
      await interaction.reply({
        content: '[ERR_UNKNOWN_PAGE] インタラクションに失敗しました',
        ephemeral: true,
      });
      return;
    }

    const components: MessageComponents = {
      type: 1,
      components: [],
    };
    if (page !== page - 1)
      components.components.push({
        type: 2,
        label: '前のページ',
        custom_id: 'inventory_back',
        style: 2,
      });
    if (page + 1 !== maxPage)
      components.components.push({
        type: 2,
        label: '次のページ',
        custom_id: 'inventory_next',
        style: 2,
      });
    await interaction.update({ embeds: [embed], components: [components] });
    1;
  },
};
