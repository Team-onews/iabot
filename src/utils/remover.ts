/* modules */
import { client } from '../main.js';

/* main */
export async function remove(name: string) {
  if (!client.application) {
    throw new Error('Application not found');
  }
  console.info(`⊡ Deleting command ${name}...`);
  const command = await client.application.commands.fetch(name);
  if (!command) {
    throw new Error('Command not found');
  }
  await command.delete();
}

export async function removeFromList(name: string[]) {
  if (!client.application) {
    throw new Error('Application not found');
  }
  console.info(`⊡ Deleting commands...`);
  const commands = await client.application.commands.fetch();
  if (!commands) {
    throw new Error('Commands not found');
  }
  for await (const command of commands.values()) {
    if (name.includes(command.name)) {
      console.info(`⊡ Deleting command ${command.name}...`);
      await command.delete();
    }
  }
}

export async function removeAll() {
  if (!client.application) {
    throw new Error('Application not found');
  }
  console.info(`⊡ Deleting all application commands...`);

  const { commands } = await client.application;

  for await (const command of (await commands.fetch()).values()) {
    await command.delete();
  }
}
