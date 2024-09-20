import { ButtonInteraction } from '../../types/index.js';

export const Button: ButtonInteraction = {
  run: async function (interaction, client) {
    if (interaction.message.reference && interaction.channel) {
      const refId = interaction.message.reference.messageId;
      if (!refId) return;
      const ref = await interaction.channel.messages.fetch(refId);
      if (ref) await ref.delete().catch(client.error);
    }
    await interaction.message.delete().catch(client.error);
  },
};
