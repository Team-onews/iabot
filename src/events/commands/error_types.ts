import { APIEmbed } from 'discord.js';
import { errorTypes } from '../../configs/errorTypes.js';
import { Command } from '../../types/index.js';

/* main */
export const command: Command = {
  data: {
    name: 'error_types',
    name_localizations: {
      ja: 'エラー情報',
      'en-US': 'error-types',
    },
    description: '指定したエラーの詳細を表示します。',
    description_localizations: {
      'en-US': 'Show the details of the specified error.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'error_type',
        name_localizations: {
          ja: 'エラー名',
        },
        description: '表示したいエラーを入力してください。',
        type: 3,
        required: true,
        autocomplete: true,
      },
      {
        name: 'ephemeral',
        name_localizations: {
          ja: '公開するか',
        },
        description: 'ephemeral',
        description_localizations: {
          ja: '非表示のリプライから公開のリプライに変更できます。',
        },
        type: 5,
        required: false,
      },
    ],
  },
  run: async interaction => {
    const { options } = interaction;
    const ephemeral = options.getBoolean('ephemeral') ? false : true;
    const errorType = options.get('error_type');
    if (
      !errorType ||
      !errorType.value ||
      errorType.value === 'null' ||
      !(typeof errorType.value === 'string')
    ) {
      await interaction.reply({
        ephemeral: true,
        content: '[ERR_UNKNOWN_TYPE] Please specify an error.',
      });
      return;
    }

    const error = errorTypes.get(errorType.value);
    if (!error) {
      await interaction.reply({
        ephemeral: true,
        content: '[ERR_UNKNOWN_TYPE] Please specify an error.',
      });
      return;
    }
    const embeds: APIEmbed[] = [
      {
        author: {
          name: interaction.user.username,
          icon_url: interaction.user.displayAvatarURL(),
        },
        title: error.name,
        description: [`- ${error.description}`, `-# ID: ${error.id}`].join('\n'),
        fields: [],
      },
    ];

    if (error.priority) {
      embeds[0].fields?.push({
        name: 'Priority',
        value: `${error.priority}`,
        inline: true,
      });
    }
    interaction.reply({ embeds, ephemeral });
  },
};
