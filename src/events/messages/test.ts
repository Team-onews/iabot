import { messageCommand } from '../../types/index.js';

/* main */
export const Command: messageCommand = {
  async run(message) {
    message.reply({
      content: 'test',
      components: [
        {
          // @ts-ignore
          type: 16,
          id: '0',
          contentInventoryEntry: {
            id: '1283633476679241730',
            author_id: '1072283404722257950',
            author_type: 1,
            content_type: 1,
            traits: [
              {
                type: 2,
                duration_seconds: 435,
              },
              {
                type: 5,
                resurrected_last_played: '2024-08-07T03:41:45.666000+00:00',
              },
            ],
            extra: {
              type: 'played_game_extra',
              game_name: 'osu!',
              application_id: '367827983903490050',
              platform: 0,
            },
            participants: ['1072283404722257950'],
            ended_at: '2024-09-12T03:41:09.597000+00:00',
            started_at: '2024-09-12T03:33:54.597000+00:00',
          },
        },
      ],
    });
  },
};
