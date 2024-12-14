import { client } from '../main.js';

export async function getChannel(id: string) {
  return (await client.channels.cache.get(id)) ?? undefined;
}
export async function getGuild(id: string) {
  return (await client.guilds.cache.get(id)) ?? undefined;
}
export async function getUser(id: string) {
  return (await client.users.cache.get(id)) ?? undefined;
}
export async function getMember(id: string, guildId: string) {
  const guild = await getGuild(guildId);
  if (!guild) return undefined;
  return guild.members.cache.get(id) ?? undefined;
}
export async function getRole(id: string, guildId: string) {
  const guild = await getGuild(guildId);
  if (!guild) return undefined;
  return guild.roles.cache.get(id) ?? undefined;
}
