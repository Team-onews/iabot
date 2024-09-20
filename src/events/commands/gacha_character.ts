import { Command } from '../../types/index.js';
import { createCharacterEmbed, getGachaItem } from '../../utils/gachaUtil.js';

/* main */
export const command: Command = {
  data: {
    name: 'gacha_character',
    name_localizations: {
      ja: 'キャラクター情報',
      'en-US': 'character-info',
    },
    description: '指定したキャラクターの情報を表示します。',
    description_localizations: {
      'en-US': 'Display the information of the specified character.',
    },
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'character',
        name_localizations: {
          ja: 'キャラクター',
        },
        description: '表示したいキャラクターを選択してください',
        type: 3,
        required: true,
        autocomplete: true,
        // choices: character.map(i => ({ name: i.name, value: i.id })),
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
    const char = options.get('character');
    if (!char || char.value === 'null' || !char.value || !(typeof char.value === 'string')) {
      await interaction.reply({
        ephemeral: true,
        content: '[ERR_NO_SPECIFIED_ITEM_TYPE] Please specify an item.',
      });
      return;
    }

    const _character = await getGachaItem(char.value, 'character');
    if (!_character) {
      await interaction.reply({
        ephemeral: true,
        content: '[ERR_CHARACTER_NOT_FOUND] Character not found.',
      });
      return;
    }
    const embed = await createCharacterEmbed(_character, interaction.user);
    await interaction.reply({ embeds: [embed], ephemeral });
  },
};
