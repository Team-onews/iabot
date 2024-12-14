import { messageCommand } from '../../types/index.js';

export const Command: messageCommand = {
  async run(message, args, client) {
    await message.reply(`Removing /${args[1]}`);

    if (!client.user) throw new Error('User not found');
    console.info(`Deleting ${args[1]}`);
    const commands = await client.application?.commands.fetch();
    if (commands) {
      await commands.get(args[1])?.delete();
    }
    return;
  },
};
