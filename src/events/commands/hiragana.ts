import { Command } from '../../types/index.js';

export const command: Command = {
  data: {
    name: 'hiragana',
    name_localizations: {
      ja: 'ひらがな',
    },
    description: 'convert to crazy hiragana',
    description_localizations: {
      ja: 'ひらがなに変換するAPIを使用できます。',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'input',
        name_localizations: {
          ja: '入力',
        },
        description: 'input text',
        description_localizations: {
          ja: '変換する文字列',
        },
        type: 3,
        required: true,
      },
      {
        name: 'ephemeral',
        name_localizations: {
          ja: '非公開',
        },
        description: 'ephemeral',
        description_localizations: {
          ja: '非公開にするか',
          'en-US': 'Change from public message to ephemeral message.',
        },
        type: 5,
        required: false,
      },
      {
        name: 'reversed',
        name_localizations: {
          ja: '逆変換',
        },
        description: '逆変換をするか',
        description_localizations: {
          'en-US': 'Reverse conversion',
        },
        type: 5,
        required: false,
      },
    ],
  },
  run: async interaction => {
    const { options } = interaction,
      input = options.getString('input') as string,
      ephemeral = (options.getBoolean('ephemeral') as boolean) ?? false,
      reversed = options.getBoolean('reversed') as boolean,
      url = reversed ? 'https://hiragana2.i14a.workers.dev' : 'https://hiragana.i14a.workers.dev';
    await interaction.reply({
      content: '<a:loading:1271076741749936179> apiの応答を待っています...',
      ephemeral,
    });
    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
        },
        body: input,
      });
      let r = await result.text();
      if (reversed) {
        r = [
          `\`\`\`${r.replace('\\', '\\\\').replace('`', '\\`')}\`\`\``,
          '-# :warning: 数字、特殊文字の逆変換はサポート対象外です。',
        ].join('\n');
      }
      if (r.length > 1999) r = r.slice(0, 1996) + '...';
      await interaction.editReply(r);
    } catch (e) {
      console.error(e);
    }
  },
};
