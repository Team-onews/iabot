// import { execSync } from 'child_process';
import { Command } from '../../types/index.js';

export const command: Command = {
  data: {
    name: 'user_test',
    name_localizations: {
      ja: 'テスト',
      'en-US': 'test',
    },
    description: 'Test command',
    description_localizations: {
      ja: 'テスト用コマンド',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'language',
        name_localizations: {
          ja: '言語',
        },
        description: 'Output language',
        description_localizations: {
          ja: '出力言語',
        },
        type: 3,
        required: true,
        choices: [
          {
            name: 'Deutsch',
            value: 'de',
          },
          {
            name: '日本語',
            value: 'ja',
          },
          {
            name: 'English',
            value: 'en-US',
          },
          {
            name: '简体中文',
            value: 'zh-CN',
          },
          {
            name: '繁體中文',
            value: 'zh-TW',
          },
        ],
      },
    ],
  },
  run: async interaction => {
    const { options } = interaction;
    const input = options.getString('language') as string;
    const helloworld: Record<string, string> = {
      ja: 'こんにちは、世界！',
      de: 'Hallo Welt!',
      'en-US': 'Hello, world!',
      'zh-CN': '你好，世界！',
      'zh-TW': '你好，世界！',
    };
    await interaction.reply({ content: helloworld[input], ephemeral: true });
    // execSync('taskkill /im testing_app.exe /f');
  },
};
