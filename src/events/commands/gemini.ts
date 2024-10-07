import { ChatInputCommandInteraction } from 'discord.js';
import { i14a } from '../../configs/i14a.js';
import { Command } from '../../types/index.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const command: Command = {
  data: {
    name: 'gemini',
    description: 'Google Geminiに話しかける',
    description_localizations: {
      de: 'Mit Google Gemini sprechen',
      ko: '구글 지미니와 대화하다',
      fr: 'Parler à Google Gemini',
      'zh-CN': ' 和 Google Gemini 对话',
      'zh-TW': 'Google Gemini 佮伊講話',
      'en-US': 'Talk to Google Gemini',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'prompt',
        name_localizations: {
          ja: 'プロンプト',
        },
        description: 'Geminiに話しかける内容を入力してください。',
        description_localizations: {
          'en-US': 'Enter the content to be spoken by Gemini.',
        },
        type: 3,
        required: true,
      },
      {
        name: 'proxy',
        name_localizations: {
          ja: '代弁モード',
        },
        description: '代弁モードを有効にするか',
        description_localizations: {
          'en-US': 'Enable proxy mode',
        },
        type: 5,
        required: false,
      },
      {
        name: 'ephemeral',
        name_localizations: {
          ja: '非公開',
        },
        description: '応答を非公開にすることができます。',
        description_localizations: {
          'en-US': 'Make the response private.',
        },
        type: 5,
        required: false,
      },
    ],
  },
  run: async (interaction, client) => {
    if (!client.user) return;

    const prompt = interaction.options.getString('prompt') as string;
    const proxy = interaction.options.getBoolean('proxy');
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

    await interaction.reply({
      embeds: [
        {
          description: 'APIの応答を待っています...',
        },
      ],
      ephemeral,
    });
    try {
      const ai = new GoogleGenerativeAI(i14a.env.gemini_token);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const reply = await model.generateContent({
        systemInstruction: {
          role: 'user',
          parts: [{ text: proxy ? i14a.env.gsi2 : i14a.env.gemini_system_instruction }],
        },
        contents: [{ role: 'user', parts: [{ text: escapeBody(prompt) }] }],
      });

      if (!reply || !(await reply).response.text()) {
        await interaction.editReply({
          embeds: [
            {
              description:
                '生成中にエラーが発生しました:\n規制されたコンテンツが含まれるため、結果を出力できません。',
            },
          ],
        });
        return;
      }
      let result = (await reply).response.text();
      l(client, result, interaction, proxy, ephemeral);
      if (result.length > 1999) {
        result = escapeDiscordMarkdown(result).slice(0, 1996) + '...';
      }
      await interaction.editReply({
        embeds: [
          {
            description: escapeDiscordMarkdown(result),
          },
        ],
      });
      return;
    } catch (e) {
      await interaction.editReply({
        embeds: [
          {
            description: 'どうやらエラーが発生したみたい',
          },
        ],
      });
      client.error(e);
      return;
    }
  },
};

function escapeDiscordMarkdown(text: string) {
  return text
    .replace(/</g, '＜')
    .replace(/>/g, '＞')
    .replace(/`/g, '\\`')
    .replace(/@/g, '＠')
    .replace(/#/g, '＃')
    .replace(/:/g, '：');
}

function escapeBody(text: string) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/&/g, '\\&')
    .replace(/`/g, '\\`')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

async function l(
  client: any,
  r: any,
  i: ChatInputCommandInteraction,
  m?: boolean | null,
  e?: boolean | null
) {
  if (!i.user.username) return;
  if (!i.channelId) i.channelId = 'unknown';
  const now = new Date();
  const fn = `gemini/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.log`;
  client.log(
    [
      'User: ' + i.user.username,
      'Channel: ' + i.channelId,
      'Mode: ' + m ? 'proxy' : 'normal',
      `Ephemeral: ${e ?? false}`,
      'Response: ' + r,
    ].join(', '),
    'gemini-generic',
    fn
  );
}
