/* types */
import { APIEmbed as APIEmbedV10 } from 'discord-api-types/v10';
import { Embed, GachaInventoryItem, GachaItem } from '../types/index.js';
import { User, APIEmbed } from 'discord.js';

/* data */
import { _translation, character, item } from '../configs/gacha.js';
import { JsonDB } from './jsondb.js';

/* main functions */
export async function pullGacha(type: 'item' | 'character') {
  let itemType: GachaItem[];
  switch (type) {
    case 'item':
      itemType = item;
      break;
    case 'character':
      itemType = character;
      break;
    default:
      itemType = type;
      break;
  }

  let sum = 0;
  const weightedList = itemType.map(item => {
    sum += item.weight;
    return {
      item,
      weight: sum,
    };
  });

  const randomNum = Math.random() * sum;
  for (const item of weightedList) {
    if (randomNum <= item.weight) {
      return item.item;
    }
  }
}

export async function calculateInventoryPages(db: any[]) {
  return Math.ceil(db.length / 20);
}

export async function addCharacterEntry(characterId: string, username: string) {
  const { db, inventory } = await getUserInventory(username, 'character');
  let inventoryItem = inventory.find(i => i.id === characterId);
  if (inventoryItem) {
    inventoryItem.count++;
  } else {
    inventory.push({ id: characterId, count: 1 });
  }
  await db.set(inventory);
  return;
}

export async function addInventoryItem(itemId: string, username: string, count?: number) {
  if (!count) count = 1;
  const { db, inventory } = await getUserInventory(username, 'item');
  if (inventory) {
    let _targetItem = inventory.find(i => i.id === itemId) as GachaInventoryItem;
    if (_targetItem) {
      _targetItem.count += count;
    } else {
      inventory.push({ id: itemId, count: count });
    }
    await db.set(inventory);
  }

  return;
}

export async function removeInventoryItem(itemId: string, username: string, count?: number) {
  if (!count) count = 1;
  const { db, inventory } = await getUserInventory(username, 'item');

  let _targetItem = inventory.find(i => i.id === itemId);
  if (_targetItem && _targetItem.count >= count) {
    _targetItem.count -= count;
    await db.set(inventory);
    return true;
  }

  return false;
}

export async function createBaseGachaEmbed(item: GachaItem, user: User) {
  const embed: APIEmbed = {
    author: {
      name: user.username,
      icon_url: user.displayAvatarURL(),
    },
    fields: [
      {
        name: `${item.emoji ?? ':sparkles:'} ${item.name}`,
        value: `ID: ${item.id}`,
        inline: true,
      },
    ],
  };
  if (item.rarity.type === 'mc' || item.rarity.type === 'fn' || item.rarity.type === 'ys') {
    embed.fields?.push({
      name: 'レアリティ',
      value: _translation.rarity[item.rarity.rarity],
      inline: true,
    });
  } else if (item.rarity.type === 'sol' || item.rarity.type === 'other') {
    embed.fields?.push({
      name: 'レアリティ',
      value: item.rarity.rarity,
      inline: true,
    });
  }
  await embed.fields?.push({
    name: '元のゲーム',
    value: _translation.game[item.game],
    inline: true,
  });

  return embed;
}

export async function createCharacterEmbed(character: GachaItem, user: User) {
  const embed = await createBaseGachaEmbed(character, user);
  embed.title = 'キャラクター情報';
  const stackCount = await getItemStackFromCharacterInventory(user.username, character.id);
  if (stackCount > 0) {
    embed.fields?.push({
      name: '所持数',
      value: `${stackCount}体`,
    });
  } else {
    embed.fields?.push({
      name: '所持数',
      value: 'あなたはまだこのキャラクターを所持していません',
    });
  }
  return embed;
}

export async function createGachaEmbed(item: GachaItem, user: User, type: 'item' | 'character') {
  const embed = await createBaseGachaEmbed(item, user);
  embed.title = 'ガチャ結果';
  let stackCount = 0;
  if (type === 'item') stackCount = await getItemStackFromInventory(user.username, item.id);
  if (type === 'character')
    stackCount = await getItemStackFromCharacterInventory(user.username, item.id);
  if (stackCount > 0) {
    embed.fields?.push({
      name: '所持数',
      value: `${stackCount + 1}個`,
      inline: false,
    });
  } else {
    const _type = type === 'item' ? 'アイテム' : 'キャラクター';
    embed.fields?.push({
      name: '🥳 おめでとうございます！',
      value: `あなたは初めてこの${_type}を入手しました！`,
      inline: false,
    });
  }
  return embed;
}

export async function createItemEmbed(item: GachaItem, user: User) {
  const embed = await createBaseGachaEmbed(item, user);
  embed.title = 'アイテム情報';
  const stackCount = await getItemStackFromInventory(user.username, item.id);
  if (stackCount > 0) {
    embed.fields?.push({
      name: '所持数',
      value: `${stackCount}個`,
    });
  } else {
    embed.fields?.push({
      name: '所持数',
      value: 'あなたはまだこのアイテムを所持していません',
    });
  }
  return embed;
}

export async function createInventoryEmbed(user: User, type: 'item' | 'character', page?: number) {
  let { inventory } = await getUserInventory(user.username, type);
  const maxPage = Math.ceil(inventory.length / 20);
  const _page = page ? page : 1;
  const embed: APIEmbed = {
    author: {
      name: user.username,
      icon_url: user.displayAvatarURL(),
    },
    title: `インベントリ  ページ ${_page}/${maxPage}`,
    fields: [],
    footer: {
      text: `${type} ${_page} ${maxPage}`,
    },
  };

  let _p = (_page - 1) * 20;
  const _inventory = inventory.slice(_p, _p + 20);
  const ic = await (async () => {
    let ic = 0;
    for (let { count } of inventory) {
      if (!count) continue;
      ic += count;
    }
    return ic;
  })();
  for (let { id, count } of _inventory) {
    if (!count) count = 0;
    let _;
    if (type === 'item') _ = item.find(i => i.id === id);
    if (type === 'character') _ = character.find(i => i.id === id);
    if (_) {
      embed.fields?.push({
        name: `${_.emoji ?? ':sparkles:'} ${_.name}`,
        value: `個数: ${count}`,
      });
    }

    if (type === 'character') {
      embed.description = [
        `あなたは ${inventory.length} 種類のキャラクターを持っています。`,
        `所持しているキャラクターの総数は ${ic} 体です。`,
      ].join('\n');
    }
    if (type === 'item') {
      embed.description = [
        `あなたは ${inventory.length} 種類のアイテムを持っています。`,
        `所持しているアイテムの総数は ${ic} 個です。`,
      ].join('\n');
    }
  }
  return embed;
}

export function getPageFromInventoryEmbedData(
  embed: APIEmbed | Embed | APIEmbedV10
): undefined | { type: 'item' | 'character'; page: number; maxPage: number } {
  const footer = embed.footer?.text;
  if (!footer) return undefined;
  const data = footer.split(' ');
  if (!data) return undefined;
  return {
    type: data[0] as 'item' | 'character',
    page: parseInt(data[1]),
    maxPage: parseInt(data[2]),
  };
}

export async function getGachaItem(id: string, type: 'item' | 'character') {
  if (type === 'item') return item.find(i => i.id === id);
  if (type === 'character') return character.find(i => i.id === id);
}

export async function getItemStackFromInventory(username: string, id: string): Promise<number> {
  const { inventory } = await getUserInventory(username, 'item');
  if (inventory) {
    const _item = await inventory.find(i => i.id === id);
    if (_item) return _item.count;
  }
  return 0;
}

export async function getItemStackFromCharacterInventory(
  username: string,
  id: string
): Promise<number> {
  const { inventory } = await getUserInventory(username, 'character');
  if (inventory) {
    const _character = await inventory.find(i => i.id === id);
    if (_character) return _character.count;
  }
  return 0;
}

export async function getUserInventory(
  username: string,
  type: 'item' | 'character'
): Promise<{ db: JsonDB; inventory: GachaInventoryItem[] }> {
  if (type === 'item') {
    const db = await new JsonDB(`inventory/${username}.json`);
    if (!db.exists()) db.create();
    const inventory = await db.get();
    if (!inventory) return { db, inventory: [] };
    return { db, inventory };
  }
  if (type === 'character') {
    const db = await new JsonDB(`characters/${username}.json`);
    if (!db.exists()) db.create();
    const inventory = await db.get();
    if (!inventory) return { db, inventory: [] };
    return { db, inventory };
  } else return { db: new JsonDB(`inventory/${username}.json`), inventory: [] };
}
