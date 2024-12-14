import { Command } from '../../types/index.js';
import { translate } from '../../utils/utilities.js';

export const command: Command = {
  data: {
    name: 'reverse_translate',
    description: '日本語の逆翻訳をします。',
    description_localizations: {
      'en-US': 'Reverse translate text(Supported Japanese only).',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'text',
        description: 'text',
        type: 3,
        required: true,
      },
      {
        name: 'ephemeral',
        description: 'ephemeral',
        type: 5,
        required: false,
      },
    ],
  },
  run: async interaction => {
    const { user } = interaction;

    const text = interaction.options.getString('text', true);

    const translatedText = await translate(text, 'ja', 'en');
    if (!translatedText) {
      await interaction.reply({
        content: '翻訳できませんでした。',
        ephemeral: true,
      });
      return;
    }

    const reverseTranslatedText = await translate(translatedText, 'en', 'ja');

    if (!reverseTranslatedText) {
      await interaction.reply({
        content: '逆翻訳できませんでした。',
        ephemeral: true,
      });
      return;
    }

    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
    await interaction.reply({
      ephemeral,
      embeds: [
        {
          author: {
            name: user.username,
            icon_url: user.displayAvatarURL(),
          },
          color: 0x4285f4,
          description: reverseTranslatedText,
          footer: {
            text: '逆翻訳コマンド since v1.5 | Powered by Google Translate API',
          },
        },
      ],
    });
  },
};
