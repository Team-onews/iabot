import { i14a } from '../../configs/i14a.js';
import { messageCommand } from '../../types/index.js';

export const Command: messageCommand = {
  async run(message, args) {
    const { content } = message;
    const reply = await message.reply('apiの応答を待っています...');
    if (content.length === i14a.prefix.length + 2) {
      reply.edit('引数を指定してください。');
      await setTimeout(() => reply.delete(), 5000);
      return;
    }
    try {
      const result = await fetch('https://hiragana.i14a.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
        },
        body: args.slice(1).join(' '),
      });
      await reply.edit(`### 変換しました:\n${await result.text()}`);
    } catch (error) {
      await reply.edit(`### 変換に失敗しました:\n${error}`);
    }
  },
};
