/* modules */
import { Message } from 'discord.js';
import { setTimeout as timeout } from 'timers/promises';
import { i14a } from '../configs/i14a.js';
import { Client } from './client.js';
import { client } from '../main.js';
import axios from 'axios';
import fs from 'fs';
import { LocalMessage } from '../types/index.js';

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
  set(client, 'forked from https://github.com/i14a-dsc/example-bot');
}

/* functions */
function set(client: Client, name: string) {
  client.user.setActivity({
    name: name,
    type: 4,
  });
}

export async function translate(ms: string, sL: string, tL: string) {
  try {
    const baseUrl = 'https://translate.googleapis.com/translate_a/single';
    let msg = ms;
    msg = msg.replace(/\n/g, '\\n');
    const response = await axios.get(
      baseUrl + `?client=gtx&sl=${sL}&tl=${tL}&dt=t&q=${encodeURI(msg)}`
    );
    const data = response.data;
    let translation = data[0][0][0];
    if (typeof translation !== 'string') {
      translation = String(translation);
    }
    return translation.replace(/\\n/g, '\n');
  } catch (error) {
    console.error('Translation error:', error);
    return 'Translate Failed(翻訳に失敗しました。)';
  }
}

export function backupMessages() {
  const messages = loadMessages();

  fs.writeFileSync(
    `./data/local-chat/backups/${new Date().toLocaleString('ja_JP', { timeZone: 'Asia/Tokyo' }).replace('/', '-')}.json`,
    JSON.stringify(messages)
  );
}

export function saveMessages(messages: LocalMessage[], ...args: LocalMessage[]) {
  messages.push(...args);
  fs.writeFileSync('./data/local-chat/messages.json', JSON.stringify(messages));
  return;
}

export function loadMessages(): LocalMessage[] {
  if (fs.existsSync('./data/local-chat/messages.json')) {
    return JSON.parse(fs.readFileSync('./data/local-chat/messages.json', 'utf-8'));
  }
  return [];
}
