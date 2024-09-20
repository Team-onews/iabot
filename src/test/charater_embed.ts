import { createCharacterEmbed, pullGacha } from '../utils/gachaUtil.js';
import { dummyUser } from './dummy_user.js';

(async () => {
  const i = await pullGacha('character');
  if (!i) throw new Error('test failed');
  const User: any = dummyUser;
  console.log(JSON.stringify(await createCharacterEmbed(i, User)));
})();
