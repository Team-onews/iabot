import { messageCommand } from '../../types/index.js';

export const Command: messageCommand = {
  async run(message, args, client) {
    try {
      if (args[1]) {
        const user = await client.users.fetch(args[1]);

        if (user) {
          message.reply(
            `[${user.username}のアバター](${user.displayAvatarURL({ size: 512, extension: 'png' })})`
          );
        }
      } else {
        message.reply(
          `[あなたのアバター](${message.author.displayAvatarURL({ size: 512, extension: 'png' })})`
        );
      }
    } catch (error) {
      message.reply('指定されたユーザーは存在しません。');
      client.log('Error: ' + error, 'error');
      throw new Error(`${error}`);
    }
  },
};
