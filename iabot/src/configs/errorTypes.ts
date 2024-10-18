import { Collection } from 'discord.js';

export interface types {
  name: string;
  description: string;
  id: string;
  priority?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

const strings = [
  'Unknown',
  'UnknownPage',
  'UnknownType',
  'UnknownItemType',
  'NotImplemented',
  'NotEnoughItemsInInventory',
  'NoPermission',
  'NoItemsInCharacterInventory',
  'NoItemsInInventory',
  'NoEmbeds',
  'NoSpecifiedItemType',
  'NoSpecifiedUser',
  'GetEmbedFooterText',
  'CharacterNotFound',
  'ItemNotFound',
  'Rebuild',
  'TempDisabled',
  'ErrorCatch',
  'ErrorCatchAlternative',
] as const;

// eslint-disable-next-line no-unused-vars
const IDs: { [key in (typeof strings)[number]]: string } = {
  Unknown: 'ERR_UNKNOWN',
  UnknownPage: 'ERR_UNKNOWN_PAGE',
  UnknownType: 'ERR_UNKNOWN_TYPE',
  UnknownItemType: 'ERR_UNKNOWN_ITEM_TYPE',
  NotImplemented: 'ERR_NOT_IMPLEMENTED',
  NotEnoughItemsInInventory: 'ERR_NOT_ENOUGH_ITEMS_IN_INV',
  NoPermission: 'ERR_NO_PERMISSION',
  NoItemsInCharacterInventory: 'ERR_NO_ITEMS_IN_CINV',
  NoItemsInInventory: 'ERR_NO_ITEMS_IN_INV',
  NoEmbeds: 'ERR_NO_EMBEDS',
  NoSpecifiedItemType: 'ERR_NO_SPECIFIED_ITEM_TYPE',
  NoSpecifiedUser: 'ERR_NO_SPECIFIED_USER',
  GetEmbedFooterText: 'ERR_GET_EMBED_FOOTER_TEXT',
  CharacterNotFound: 'ERR_CHARACTER_NOT_FOUND',
  ItemNotFound: 'ERR_ITEM_NOT_FOUND',
  Rebuild: 'ERR_REBUILD',
  TempDisabled: 'ERR_TEMP_DISABLED',
  ErrorCatch: 'ERR_CATCH',
  ErrorCatchAlternative: 'ERR_CATCH_ALTERNATIVE',
};

// eslint-disable-next-line no-unused-vars
export const errors: { [key in (typeof strings)[number]]?: types } = {
  Unknown: {
    name: 'Unknown',
    description: '不明なエラー。',
    id: IDs['Unknown'],
    priority: 9,
  },
  UnknownPage: {
    name: 'UnknownPage',
    description: '存在しないページです。',
    id: IDs['UnknownPage'],
    priority: 5,
  },
  UnknownType: {
    name: 'UnknownType',
    description: '存在しないタイプです。',
    id: IDs['UnknownType'],
    priority: 5,
  },
  UnknownItemType: {
    name: 'UnknownItemType',
    description: '存在しないアイテムです。',
    id: IDs['UnknownItemType'],
    priority: 5,
  },
  NotImplemented: {
    name: 'NotImplemented',
    description: '未実装です。',
    id: IDs['NotImplemented'],
    priority: 0,
  },
  NotEnoughItemsInInventory: {
    name: 'NotEnoughItemsInInventory',
    description: '指定されたアイテムを必要数所持していません。',
    id: IDs['NotEnoughItemsInInventory'],
    priority: 0,
  },
  NoPermission: {
    name: 'NoPermission',
    description: 'あなたにはこの操作を行う権限がありません。',
    id: IDs['NoPermission'],
    priority: 0,
  },
  NoItemsInCharacterInventory: {
    name: 'NoItemsInCharacterInventory',
    description: '指定されたキャラクターを所持していません。',
    id: IDs['NoItemsInCharacterInventory'],
    priority: 0,
  },
  NoItemsInInventory: {
    name: 'NoItemsInInventory',
    description: '必要なアイテムを所持していません。',
    id: IDs['NoItemsInInventory'],
    priority: 0,
  },
  NoEmbeds: {
    name: 'NoEmbeds',
    description: '埋め込みがありません。',
    id: IDs['NoEmbeds'],
    priority: 5,
  },
  NoSpecifiedItemType: {
    name: 'NoSpecifiedItemType',
    description: 'アイテムが指定されていません。',
    id: IDs['NoSpecifiedItemType'],
    priority: 0,
  },
  NoSpecifiedUser: {
    name: 'NoSpecifiedUser',
    description: 'ユーザーが指定されていません。',
    id: IDs['NoSpecifiedUser'],
    priority: 0,
  },
  GetEmbedFooterText: {
    name: 'GetEmbedFooterText',
    description: '埋め込みのフッターの取得に失敗しました。',
    id: IDs['GetEmbedFooterText'],
    priority: 3,
  },
  CharacterNotFound: {
    name: 'CharacterNotFound',
    description: '指定されたキャラクターが見つかりませんでした。',
    id: IDs['CharacterNotFound'],
    priority: 0,
  },
  ItemNotFound: {
    name: 'ItemNotFound',
    description: '指定されたアイテムが見つかりませんでした。',
    id: IDs['ItemNotFound'],
    priority: 0,
  },
  Rebuild: {
    name: 'Rebuild',
    description: 'リビルドに失敗しました。',
    id: IDs['Rebuild'],
    priority: 9,
  },
  TempDisabled: {
    name: 'TempDisabled',
    description: '一時的に無効化されています。',
    id: IDs['TempDisabled'],
    priority: 0,
  },
  ErrorCatch: {
    name: 'ErrorCatch',
    description: 'エラーが発生しました。',
    id: IDs['ErrorCatch'],
    priority: 9,
  },
  ErrorCatchAlternative: {
    name: 'ErrorCatchAlternative',
    description: '代替のエラーメッセージを表示します。',
    id: IDs['ErrorCatchAlternative'],
    priority: 9,
  },
};

export const errorTypes = new Collection<string, types>();
strings.forEach(key => {
  if (!errors[key]) return;
  errorTypes.set(key, errors[key]);
});
