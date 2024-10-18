export async function getChannel(client: any, id: string) {
  return (await client.channels.cache.get(id)) ?? undefined;
}
export async function getGuild(client: any, id: string) {
  return (await client.guilds.cache.get(id)) ?? undefined;
}
