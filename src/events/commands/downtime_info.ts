import { Command } from '../../types/index.js';

/* main */
export const command: Command = {
  data: {
    name: 'downtime_info',
    name_localizations: {
      ja: 'ダウンタイム情報',
      'en-US': 'downtime-information',
    },
    description: 'Botの定期再起動に関する情報を表示します。',
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async interaction => {
    await interaction.reply({
      content: [
        '## Botの定期再起動に関する情報',
        'このbotは毎日4時半にダウンタイムを開始します。',
        'プロジェクト オーナーのPCが起動するまでbotは停止します。',
        'オーナーは毎日7時から10時まで寝ているので、その間までbotは起動しません。',
        '諸事情により、午前の内に起動することができないことにご留意してください。',
        '-# サポートが必要な際は、サポートサーバーにてお問い合わせください。 </support:1283313492157530195>',
      ].join('\n'),
      ephemeral: true,
    });
  },
};
