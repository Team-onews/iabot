/* modules */
import { messageCommand } from '../../types/index.js';
import { checkPerms } from '../../utils/utilities.js';

/* constants */
const e: string = 'error: failed to delete message';

/* main */
export const Command: messageCommand = {
  async run(message) {
    const {
      author: { username, id },
    } = message;
    if (!(await checkPerms(username, id, 'dev'))) {
      message.reply("**Hey!** Sorry, but you don't have required permission.");
      return;
    }
    try {
      const reference = await message.fetchReference();
      if (!reference) _throw();
      if (reference.author.id === '1210845970347335721') {
        message.reply('私の推しを汚さないで！！！😡😡😡😡😡😡');
        return;
      }
      if (reference.author.id !== message.client.user.id) {
        message.reply(
          '私のメッセージじゃないから消せないみたい...ごめんね？:face_holding_back_tears:'
        );
        return;
      }

      await reference.delete();
      message.delete();
    } catch {
      _throw();
    }
  },
};
function _throw() {
  throw new Error(e);
}
