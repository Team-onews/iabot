import { messageCommand } from '../../types/index.js';

/* main */
export const Command: messageCommand = {
  async run(message) {
    const { client } = message;
    const author = {
      name: 'Ping',
      icon_url:
        'https://cdn.discordapp.com/emojis/1263268334804140113.webp?size=64&quality=lossless',
    };
    const start = Date.now();
    const reply = await message.reply({
      embeds: [
        {
          author,
          description: [
            `**Client websocket ping**: ${client.ws.ping}ms`,
            '**message delay:** Calculating...',
          ].join('\n'),
        },
      ],
    });
    const end = Date.now();
    await reply
      .edit({
        embeds: [
          {
            author,
            description: [
              `**Client websocket ping: ${client.ws.ping}ms**`,
              `**message delay: ${end - start}ms**`,
            ].join('\n'),
          },
        ],
      })
      .catch(console.log);
  },
};
