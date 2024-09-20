/* types */
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Collection,
  Interaction,
} from 'discord.js';

/* modules */
import { checkPerms } from '../../utils/utilities.js';
import { character, item } from '../../configs/gacha.js';
import { client } from '../../main.js';
import { i14a } from '../../configs/i14a.js';
import { Client } from '../../utils/client.js';
import { errorTypes } from '../../configs/errorTypes.js';

/* main */
export async function interaction(interaction: Interaction, client: Client) {
  const { slashCommands, buttons } = client;
  if (interaction.isChatInputCommand()) {
    try {
      chatInputCommand(interaction, slashCommands);
    } catch (e) {
      if (interaction.replied)
        await interaction.editReply({
          content: '[ERR_CATCH] エラーが発生しました。詳細はログを確認してください。',
        });
      else
        await interaction.reply({
          content:
            '[ERR_CATCH_ALTERNATIVE] エラーが発生しました。詳細はログを確認してください。',
          components: client.i14a.components.delete,
        });
      client.error(e);
      return;
    }
  }
  if (interaction.isStringSelectMenu()) {
    interaction.reply('[ERR_NOT_IMPLEMENTED] Not implemented yet');
  }
  if (interaction.isButton()) button(interaction, buttons);
  if (interaction.isAutocomplete()) {
    if (interaction.commandName === 'error_types') {
      const { options } = interaction;
      let value = options.get('error_type')?.value as string;
      value = value.toLowerCase();
      if (!value) {
        await interaction.respond([
          {
            name: '何らかの文字を入力して検索を開始できます。',
            value: 'null',
          },
        ]);
        return;
      }
      let matched = errorTypes
        .filter(e => e.id.toLowerCase().includes(value) || e.name.toLowerCase().includes(value))
        .map(e => ({
          name: `${e.name} (${e.id})`,
          value: e.name,
        }));
      if (!matched.length) {
        await interaction.respond([
          {
            name: '一致する既知のエラーが見つかりませんでした。',
            value: 'null',
          },
        ]);
        return;
      }
      if (matched.length > 25) matched = matched.slice(0, 25);
      await interaction.respond(matched);
    }
    if (interaction.commandName === 'gacha_character') {
      const { options } = interaction;
      let value = options.get('character')?.value as string;
      value = value.toLowerCase();
      if (!value) {
        await interaction.respond([
          {
            name: '何らかの文字を入力して検索を開始できます。',
            value: 'null',
          },
        ]);
        return;
      }
      let matched = character
        .filter(
          c =>
            (c.id.toLowerCase().includes(value) ||
              c.name.toLowerCase().includes(value) ||
              c.game.toLowerCase().includes(value)) &&
            !c.hidden
        )
        .map(c => ({
          name: c.name,
          value: c.id,
        }));
      if (!matched.length) {
        await interaction.respond([
          {
            name: 'キャラクターが見つかりませんでした。',
            value: 'null',
          },
        ]);
        return;
      }
      if (matched.length > 25) matched = matched.slice(0, 25);
      await interaction.respond(matched);
    }
    if (interaction.commandName === 'gacha_item' || interaction.commandName === 'gacha_give') {
      const { options } = interaction;
      let value = options.get('item')?.value as string;
      value = value.toLowerCase();
      if (!value) {
        await interaction.respond([
          {
            name: '何らかの文字を入力して検索を開始できます。',
            value: 'null',
          },
        ]);
        return;
      }
      let matched = item
        .filter(
          i =>
            (i.id.toLowerCase().includes(value) ||
              i.name.toLowerCase().includes(value) ||
              i.game.toLowerCase().includes(value)) &&
            !i.hidden
        )
        .map(i => ({
          name: i.name,
          value: i.id,
        }));
      if (!matched.length) {
        await interaction.respond([
          {
            name: 'アイテムが見つかりませんでした。',
            value: 'null',
          },
        ]);
        return;
      }
      if (matched.length > 25) matched = matched.slice(0, 25);
      await interaction.respond(matched);
    }
  }
}

async function chatInputCommand(
  interaction: ChatInputCommandInteraction,
  slashCommands: Collection<string, any>
) {
  const { commandName } = interaction;
  const command = slashCommands.get(commandName);
  if (!command) {
    await interaction.reply({
      content: '[ERR_NOT_FOUND] コマンドが見つかりませんでした。',
      ephemeral: true,
    });
    return;
  }
  try {
    log(interaction);
    await command.run(interaction, client);
  } catch (e) {
    console.error(e);
  }
}

async function button(interaction: ButtonInteraction, buttons: Collection<string, any>) {
  const button = buttons.get(interaction.customId);
  if (!button) return;
  try {
    log(interaction);
    await button.run(interaction, client);
  } catch (e) {
    console.error(e);
  }
}

async function log(interaction: Interaction) {
  const {
    user: { id, username },
  } = interaction;
  if (await checkPerms(username, id, 'dev')) return;
  if (
    interaction.isChatInputCommand() &&
    i14a.antiSpam.slashCommands.includes(interaction.commandName)
  ) {
    client.write(`/${interaction.commandName}`, username, 'slashCommand');
  }
  if (interaction.isButton() && i14a.antiSpam.buttons.includes(interaction.customId)) {
    client.write(`${interaction.customId}`, username, 'button');
  }
}
