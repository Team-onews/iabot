/* types */
import { Message as M } from 'discord.js';
import { Client as C } from '../../utils/client.js';
import { messageCommand } from '../../types/index.js';

/* modules */
import { i14a } from '../../configs/i14a.js';
import { checkPerms } from '../../utils/utilities.js';
import fs from 'fs';

/* main */
export async function create(message: M, client: C) {
  const { author, content } = message;
  if (author.bot || content.length >= 500) return;
  if (await checkPerms(author.username, author.id, 'ignore')) return;
  if (await deleteBannedMessage(message, client)) return;
  if (await zatsu(message)) return;
  if (!content.startsWith(i14a.prefix)) return;
  const args = content.slice(i14a.prefix.length).trim().split(/ +/);
  await execute(client, message, args);
}

async function execute(C: C, M: M, A: string[]) {
  const cmd = A[0];
  const cm = C.textCommands.get(cmd) as messageCommand;
  if (!cm) {
    C.sendAndDel(M, `不明なコマンド: ${i14a.prefix}${cmd}。 ${i14a.prefix}ls を確認してください。`);
    return;
  }
  cm.run(M, A, C);
}

async function deleteBannedMessage(m: M, c: C): Promise<boolean> {
  for (const w of i14a.env.bannedWord) {
    if (m.content.match(w)) {
      c.write(`Detected banned message: ${w}`);
      await m.delete().catch(console.log);
      return true;
    }
  }
  return false;
}

async function zatsu(m: M): Promise<boolean> {
  if (fs.existsSync('dist/utils/zatsu.js')) {
    // @ts-ignore
    const func = await import('../../utils/zatsu.js');
    if (await func.雑なファンクション(m)) return true;
  }
  return false;
}
