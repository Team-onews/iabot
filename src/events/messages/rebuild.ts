import { client } from '../../main.js';
import { messageCommand } from '../../types/index.js';
import { rebuild } from '../../utils/rebuild.js';
import { restart } from '../../utils/restart.js';

export const Command: messageCommand = {
  async run(message) {
    const reply = await message.reply('<a:loading:1271076741749936179> Rebuilding...');
    await message.delete().catch(client.error);

    try {
      rebuild();
    } catch (e) {
      console.error(e);
      await reply.edit(`リビルド中にエラーが発生しました。詳しくはコンソールを確認してください。`);
      return;
    }
    reply.edit('Rebuild successfully! restarting...').catch(client.error);
    restart();
  },
};
