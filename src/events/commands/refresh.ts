import { Command } from '../../types/index.js';

/* main */
function getCommandData() {
  return {
    name: 'refresh',
    name_localizations: {
      ja: 'リフレッシュ',
    },
    description: '実行するとクライアント側でコマンドのキャッシュを再読み込みします。',
    description_localizations: {
      'en-US': 'Execute this command to refresh the command cache on the client side.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'random',
        description: Math.floor(Math.random() * 1000).toString(),
        type: 3,
        required: false,
        choices: [
          {
            name: 'random_cache',
            value: Math.floor(Math.random() * 1000).toString(),
          },
        ],
      },
    ],
  };
}

export const command: Command = {
  data: getCommandData(),
  run: async interaction => {
    await interaction.reply({
      content: [
        '既にキャッシュは最新です。',
        'Botを再起動するとこのコマンドは再生成されます。',
      ].join('\n'),
      ephemeral: true,
    });
    await interaction.client.application.commands.cache
      .get(interaction.commandId)
      ?.edit(getCommandData());
  },
};
