import fs from 'fs';
import { i14a } from '../../configs/i14a.js';
import { messageCommand } from '../../types/index.js';

export const Command: messageCommand = {
  async run(message) {
    message.reply(
      ['All commands:', `\`\`\`${JSON.stringify(await getAllCommands())}\`\`\``].join('\n')
    );
  },
};
async function getAllCommands() {
  const files = fs
    .readdirSync(`${i14a.env.dist}/events/messages`, 'utf-8')
    .filter(file => file.endsWith('.js'));
  const commands = [];
  for (const file of files) {
    commands.push(file.replace('.js', ''));
  }
  return commands;
}
