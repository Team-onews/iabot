import { i14a } from '../../configs/i14a.js';
import { messageCommand } from '../../types/index.js';
import { sendDelete } from '../../utils/utilities.js';

export const Command: messageCommand = {
  async run(message, args, client) {
    const { author } = message;
    if (!client.user) return;
    if (!i14a.users.admin.includes(author.username || author.id)) {
      message.reply({
        embeds: [
          {
            title: 'Error',
            description: "Sorry, But you don't have required permission.",
            fields: [
              {
                name: 'Required Permission(bot)',
                value: 'Admin, Dev',
                inline: false,
              },
            ],
            footer: {
              text: `${client.user.username} • v${i14a.version}`,
              icon_url: `${client.user.displayAvatarURL()}`,
            },
          },
        ],
      });
      await message.delete().catch(console.log);
      return;
    }

    console.log('⊡ Clearing...');
    Promise.all([
      console.clear(),
      client.log(`${author.username} cleared console logs.`),
      sendDelete(message, 'Console logs are cleared'),
    ]);
  },
};
