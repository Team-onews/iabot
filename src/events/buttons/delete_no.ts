import { ButtonInteraction } from '../../types/index.js';
import { checkPerms } from '../../utils/utilities.js';

export const Button: ButtonInteraction = {
  run: async function (interaction, client) {
    if (!(await checkPerms(interaction.user.username, interaction.user.id, 'admin'))) {
      await interaction.reply({
        content: "**Hey!** Sorry, but you don't have required permission.",
      });
      return;
    }
    await interaction.deferUpdate();
    await interaction.message.edit({
      content: '操作は取り消されました。',
      embeds: [
        {
          title: '操作は取り消されました。',
          footer: { text: `${interaction.message.embeds[0].footer?.text}` },
        },
      ],
      components: client.i14a.components.delete,
    });
  },
};
