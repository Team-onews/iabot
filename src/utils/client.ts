/* events */
import {
  ClientUser,
  Collection,
  Client as Discord,
  GatewayIntentBits,
  Message,
  REST,
  DefaultWebSocketManagerOptions as WebSocketOptions,
} from 'discord.js';
import fs from 'fs';
import { i14a } from '../configs/i14a.js';

/* events */
import { ready } from '../events/handlers/client.js';
import { create } from '../events/handlers/message.js';
import { interaction } from '../events/handlers/interaction.js';
import { Command, messageCommand } from '../types/index.js';

/* main */
export class Client extends Discord {
  i14a = i14a;
  slashCommands = new Collection<string, Command>();
  textCommands = new Collection<string, messageCommand>();
  buttons = new Collection<string, any>();
  /* @ts-ignore */
  user!: ClientUser;

  constructor() {
    super({ intents: [getIntents()] });
    /* @ts-ignore */
    WebSocketOptions.identifyProperties.browser = 'Discord Android';
  }

  public async init() {
    if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
    if (!fs.existsSync('./logs/errors')) fs.mkdirSync('./logs/errors');

    if (!fs.existsSync('./dist'))
      throw new Error('Please run `npm run build` first. Bun is not supported.');

    await Promise.all([this._applyCommand(), this._getTextCommands(), this._getButtons()]);
    await this._registerEvents();
    await this.login(i14a.env.token);
  }

  private async _registerEvents() {
    this.on('ready', () => ready(this));
    this.on('messageCreate', e => create(e, this));
    this.on('interactionCreate', e => interaction(e, this));
    this.on('error', e => this.error(e));
  }

  private async _getCommands() {
    const files = fs
      .readdirSync(`${i14a.env.dist}/events/commands`, 'utf-8')
      .filter(file => file.endsWith('.js'));

    for (const file of files) {
      const { command: cmd } = await import(`../events/commands/${file}`);
      this.slashCommands.set(cmd.data.name, cmd);
    }
  }

  private async _getTextCommands() {
    const files = fs
      .readdirSync(`${i14a.env.dist}/events/messages`, 'utf-8')
      .filter(file => file.endsWith('.js'));

    for (const file of files) {
      const { Command: cmd } = await import(`../events/messages/${file}`);
      this.textCommands.set(file.replace('.js', ''), cmd);
    }
  }

  private async _getButtons() {
    const files = fs
      .readdirSync(`${i14a.env.dist}/events/buttons`, 'utf-8')
      .filter(file => file.endsWith('.js'));

    for (const file of files) {
      const { Button: btn } = await import(`../events/buttons/${file}`);
      this.buttons.set(file.replace('.js', ''), btn);
    }
  }

  private async _applyCommand() {
    await this._getCommands();
    await new REST({ version: '10' })
      .setToken(`${i14a.env.token}`)
      .put(`/applications/${i14a.env.clientId}/commands`, {
        headers: { 'Content-Type': 'application/json' },
        body: [...this.slashCommands.values()].map(cmd => cmd.data),
      })
      .catch(this.error);
  }

  public async updateCommands() {
    for (const cmd of this.slashCommands.values()) {
      await this.slashCommands.delete(cmd.data.name);
    }
    await this._getCommands();
    await this._applyCommand();
  }

  public async error(e: any) {
    console.error(e);
    const now = new Date();
    const fn = `errors/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.log`;
    console.error(
      [
        '============================\n',
        '[ error ] An error occurred.',
        'Error is written in: ',
        fn,
        '\n============================',
      ].join('\n')
    );
    write(String(e), 'error', fn);
  }

  public async sendAndDel(m: Message, text: string) {
    const r = await m.reply(text);
    setTimeout(() => {
      r.delete().catch(this.error);
      m.delete().catch(this.error);
    }, 5000);
  }

  public write(message: string, level?: string, logfile?: string) {
    write(message, level, logfile);
  }
}

function getIntents() {
  return [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ];
}
function getLogFileName(logfile?: string): string {
  let fn = './logs/' + (logfile ?? 'write');
  if (!fn.endsWith('.log')) fn += '.log';
  return fn;
}

export async function write(message: string, level?: string, logfile?: string) {
  const fn = getLogFileName(logfile);
  const now = new Date().toLocaleString();
  const milliseconds = new Date().getMilliseconds();
  const output = `[ ${now}:${milliseconds} ] [ ${level ?? 'info'} ] ${message}\n`;
  if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
  if (!fs.existsSync(fn)) {
    fs.writeFileSync(fn, output, 'utf8');
    return;
  }
  fs.appendFileSync(fn, output, 'utf8');
}
