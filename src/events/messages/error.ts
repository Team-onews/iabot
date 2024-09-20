import { messageCommand } from '../../types/index.js';

export const Command: messageCommand = {
  async run(message) {
    const reply = await message.reply('意図的にエラーを発生させます。');
    await setTimeout(() => {
      reply.delete();
    }, 5000);
    throw new Error('Test Error');
  },
};
