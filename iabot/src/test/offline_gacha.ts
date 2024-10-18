import { pullGacha, addInventoryItem, addCharacterEntry } from '../utils/gachaUtil.js';

(async () => {
  // console.log(process.argv);
  const type = process.argv[2] as 'item' | 'character';
  const count = Number(process.argv[3] ?? 1);
  if (type !== 'item' && type !== 'character') {
    throw new Error('Type must be i or c');
  }
  let loop = count;
  for (let i = 0; i < loop; i++) {
    const result = await pullGacha(type);
    if (!result) return;
    console.log(i + 1, result.id);
    // @ts-ignore
    if (type === 'item') await addInventoryItem(result.id, 'i14a');
    if (type === 'character') await addCharacterEntry(result.id, 'i14a');
  }
})();
