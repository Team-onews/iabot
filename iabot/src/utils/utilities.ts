/* modules */
import { Message } from 'discord.js';
import { setTimeout as timeout } from 'timers/promises';
import { i14a } from '../configs/i14a.js';
import { Client } from './client.js';
import { client } from '../main.js';

/* main exports */
export async function sendDelete(message: Message, text: string) {
  const reply = await message.reply(text);
  await setTimeout(() => {
    reply.delete().catch(client.error);
    message.delete().catch(client.error);
  }, 5000);
}

export async function runChance(chance: number) {
  return Math.random() < chance;
}

export async function checkPerms(
  username: string,
  id: string,
  perm: 'ignore' | 'trust' | 'mod' | 'admin' | 'dev'
): Promise<boolean> {
  const { dev, admin, mod, trusted, ignored } = i14a.users;
  switch (perm) {
    case 'dev':
      return dev.includes(username || id);
    case 'admin':
      return admin.includes(username || id);
    case 'mod':
      return mod.includes(username || id);
    case 'trust':
      return trusted.includes(username || id);
    case 'ignore':
      return ignored.includes(username || id);
    default:
      return false;
  }
}

export async function setRPC(client: Client) {
  set(client, 'with Discord.js');
  await timeout(10000);
  set(client, `Version ${i14a.version}`);
  await timeout(10000);
  set(client, `Made by i14a`);
  await timeout(10000);
  set(client, 'forked from https://github.com/070ry/example-bot');
}

/* functions */
function set(client: Client, name: string) {
  client.user.setActivity({
    name: name,
    type: 4,
  });
}
