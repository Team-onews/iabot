import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { Command } from '../../types/index.js';

const locales = {
  ja: '%s は奈落の底に落ちた\n%s を倒しました',
  en: '%s died\nKilled %s',
};

export const command: Command = {
  data: {
    name: 'kill',
    description: 'Kill the specified player.',
    type: 1,
    contexts: [0, 1, 2],
    options: [
      {
        name: 'player',
        name_localizations: {
          ja: 'プレイヤー',
        },
        description: '有効なプレイヤーを指定してください。',
        required: true,
        type: ApplicationCommandOptionType.String,
        max_length: 24,
        min_length: 1,
      },
      {
        name: 'locale',
        description: '出力のロケールを指定します。',
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: '日本語',
            value: 'ja',
          },
          {
            name: 'English',
            value: 'en',
          },
        ],
      },
      {
        name: 'ephemeral',
        description: 'Make the ephemeral response.',
        type: ApplicationCommandOptionType.Boolean,
        required: false,
      },
    ],
    integration_types: [0, 1],
  },
  run: async interaction => {
    const { options } = interaction;

    const ephemeral = options.getBoolean('ephemeral') ?? false;
    const player = options
      .getString('player', true)
      .replaceAll('@', '')
      .replaceAll('"', '')
      .replaceAll("'", '')
      .replaceAll('\\', '')
      .replaceAll('*', '');
    const locale = (options.getString('locale', true) ?? 'ja') as 'ja' | 'en';

    interaction.reply({
      content: locales[locale].replaceAll('%s', player),
      ephemeral,
    });
  },
};
