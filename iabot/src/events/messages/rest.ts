import { messageCommand } from '../../types/index.js';
import { checkPerms } from '../../utils/utilities.js';
import { REST } from 'discord.js';
import { i14a } from '../../configs/i14a.js';

export const Command: messageCommand = {
  name: 'exec',
  run: async (message, args) => {
    if (!(await checkPerms(message.author.username, message.author.id, 'dev'))) return;
    const reply = await message.reply('<a:loading:1271076741749936179> 実行中...');
    const apiVersion = args[1];
    const apiPath = args[2];
    const body = args[3] || null;
    console.log(`(iabot) ${process.cwd()}> ${apiPath}`);
    const response = await new REST({ version: apiVersion })
      .setToken(`${i14a.env.token}`)
      .put(`/${apiPath}`, {
        // headers: { 'Content-Type': 'application/json' },
        body: body,
      })
      // @ts-ignore
      .catch(message.client.error);
    await reply.edit(`\`\`\`json\n${response}\n\`\`\``);
  },
};
