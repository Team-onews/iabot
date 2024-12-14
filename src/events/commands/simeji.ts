import axios from 'axios';
import { Command } from '../../types/index.js';
import 'dotenv/config';

/* main */
export const command: Command = {
  data: {
    name: 'simeji',
    name_localizations: {
      ja: 'simeji変換',
    },
    description: 'ゴミ',
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        type: 3,
        name: 'text',
        description: '変換する文字を入力(ひらがなのみ)',
        max_length: 16,
        min_length: 2,
        required: true,
      },
      {
        type: 5,
        name: 'ephemeral',
        description: '応答を非公開にする',
        required: false,
      },
    ],
  },
  run: async interaction => {
    const input = interaction.options.getString('text', true);
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
    const start = Date.now();
    const res = await simeji(input);
    if (!res) {
      interaction.reply({ content: '変換がありませんでした。', ephemeral: true });
      return;
    }

    const end = Date.now();
    interaction.reply({
      embeds: [
        {
          title: 'レスポンス',
          color: 0x2f3136,
          description: `${end - start}ms`,
          fields: res.map((w, i) => ({
            name: String(i + 1),
            value: `\`\`\`${w}\`\`\``,
            inline: true,
          })),
        },
      ],
      ephemeral,
    });
  },
};

async function simeji(pron: string) {
  const url = encodeURI(process.env.simeji + pron);
  if (!pron.match(/^[ぁ-んー]{2,}$/)) {
    console.error('Please input a valid hiragana pronounciation.');
    return;
  }
  const res = (await axios.get(url)).data as {
    data: [{ candidates: { word: string }[] }];
  };

  return res.data[0].candidates.slice(0, 10).map(c => c.word);
}
