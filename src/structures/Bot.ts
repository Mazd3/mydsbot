import { Client, ClientOptions, Collection, GatewayIntentBits } from 'discord.js'
import { SlashCommand } from '../types/SlashCommand'
import commandsLoader from '../commands/loader'

export default class extends Client {
  commands: Collection<string, SlashCommand> = new Collection()

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
    this.login(process.env['TOKEN'])
  }

  async loadCommands(client: Client) {
    this.commands = await commandsLoader(client)
  }
}
