import { APIEmbed } from 'discord.js';
import { Command } from '../../types/index.js';
import os from 'node:os';

/* main */
export const command: Command = {
  data: {
    name: 'host',
    name_localizations: {
      ja: 'ホスト情報',
      'en-US': 'host',
    },
    description: '実行しているPCのホスト情報を表示します。',
    description_localizations: {
      'en-US': 'Display the host info of the running PC.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
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

    const embeds: APIEmbed[] = [
      {
        author: {
          name: interaction.user.username,
          icon_url: interaction.user.displayAvatarURL(),
        },
        title: 'ホスト情報',
        color: 0x00ffff,
        fields: [
          {
            name: 'Hostname',
            value: await os.hostname(),
          },
          {
            name: 'Running user',
            value: await os.userInfo().username,
          },
          {
            name: 'Host platform/Type',
            value: `${await os.platform()}, ${await os.type()} Release: ${await os.release()}`,
          },
          {
            name: 'Host architecture',
            value: await os.arch(),
          },
          {
            name: 'Uptime',
            value: getOSUptimeDuration(),
          },
          {
            name: 'Total memory',
            value: `${Math.trunc(((await os.totalmem()) / 1024 / 1024 / 1024) * 100) / 100}GB`,
          },
          {
            name: 'Free memory',
            value: `${Math.trunc(((await os.freemem()) / 1024 / 1024 / 1024) * 100) / 100}GB`,
          },
          {
            name: 'CPUs',
            value: `${await os.cpus().length}`,
          },
        ],
      },
    ];

    interaction.reply({ embeds, ephemeral });
  },
};
const getOSUptimeDuration = (): string => {
  const now = new Date();
  const startedAt = new Date(Date.now() - os.uptime() * 1000);
  const diff = now.getTime() - startedAt.getTime();
  return formatUptime(diff / 1000);
};
const formatUptime = (uptime: number): string => {
  const days = Math.floor(uptime / (24 * 3600));
  const hours = Math.floor((uptime % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
