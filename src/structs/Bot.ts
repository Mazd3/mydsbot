import { Client, ClientOptions, GatewayIntentBits } from 'discord.js'
import config from '../config.json'
import Config from '../types/config.js'

export default class extends Client {
  config: Config = config

  constructor(options: ClientOptions) {
    super({
      ...options,
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
      ],
    })
  }

  start() {
    this.login(this.config.token)
  }
}
