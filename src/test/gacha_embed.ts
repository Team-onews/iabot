import { createGachaEmbed, pullGacha } from '../utils/gachaUtil.js';

(async () => {
  const i = await pullGacha('item');
  if (!i) throw new Error('test failed');
  const dummyUser = {
    username: 'i14a',
    displayAvatarURL() {
      return 'test';
    },
  };
  //@ts-ignore
  console.log(JSON.stringify(await createGachaEmbed(i, dummyUser, 'item')));
})();
