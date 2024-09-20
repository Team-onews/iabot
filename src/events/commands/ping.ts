import { Command } from '../../types/index.js';

export const command: Command = {
  data: {
    name: 'ping',
    description: '現在のPing値を表示します。',
    description_localizations: {
      'en-US': 'Shows the current ping.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async interaction => {
    const start = Date.now();
    let wsPing = interaction.client.ws.ping.toString() + 'ms';
    if (wsPing === '-1ms') {
      wsPing = 'Calculating...';
    }
    await interaction.reply({
      ephemeral: true,
      embeds: [
        {
          author: {
            name: 'Ping',
            icon_url:
              'https://cdn.discordapp.com/emojis/1263268334804140113.webp?size=64&quality=lossless',
          },
          description: [
            `**Client websocket ping**: ${wsPing}`,
            '**Interaction delay**: Calculating...',
          ].join('\n'),
        },
      ],
    });
    const end = Date.now();
    await interaction.editReply({
      embeds: [
        {
          author: {
            name: 'Ping',
            icon_url:
              'https://cdn.discordapp.com/emojis/1263268334804140113.webp?size=64&quality=lossless',
          },
          description: [
            `**Client websocket ping**: ${wsPing}`,
            `**Interaction delay**: ${(await interaction.fetchReply()).createdTimestamp - interaction.createdTimestamp}(${end - start})ms`,
          ].join('\n'),
        },
      ],
    });
  },
};
