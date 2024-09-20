import { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent } from 'discord.js';
import { createInventoryEmbed, getPageFromInventoryEmbedData } from '../../utils/gachaUtil.js';
import { ButtonInteraction } from '../../types/index.js';

export const Button: ButtonInteraction = {
  run: async function (interaction) {
    const _e = interaction.message.embeds[0] as APIEmbed;
    if (!_e) {
      await interaction.reply({
        content: '[ERR_NO_EMBEDS] インタラクションに失敗しました。埋め込みが見つかりません。',
        ephemeral: true,
      });
      return;
    }
    const data = getPageFromInventoryEmbedData(_e);
    if (!data) {
      await interaction.reply({
        content: '[ERR_UNKNOWN] インタラクションに失敗しました。内部エラーが発生しました。',
        ephemeral: true,
      });
      return;
    }
    if (_e.author?.name !== interaction.user.username) {
      await interaction.reply({
        content:
          '[ERR_NO_PERMISSION] インタラクションに失敗しました。インタラクションの作成者ではない可能性があります。',
        ephemeral: true,
      });
      return;
    }
    let { page, maxPage, type } = data;
    const embed = await createInventoryEmbed(interaction.user, type, page + 1);
    const components: APIActionRowComponent<APIMessageActionRowComponent> = {
      type: 1,
      components: [
        {
          type: 2,
          label: '前のページ',
          custom_id: 'inventory_back',
          style: 2,
        },
      ],
    };
    if (!(page + 1 === maxPage))
      components.components?.push({
        type: 2,
        label: '次のページ',
        custom_id: 'inventory_next',
        style: 2,
      });
    await interaction.update({ embeds: [embed], components: [components] });
  },
};
