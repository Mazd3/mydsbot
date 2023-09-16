import { Events, GatewayIntentBits, ActivityType } from 'discord.js'
import Bot from './structs/Bot'
import GlobalCommands from './structs/GlobalCommands'
import { Player } from 'discord-player'

// Create a new client instance
const client = new Bot({ intents: [GatewayIntentBits.Guilds] })
const player = new Player(client)

player.extractors.loadDefault()

const commands = new GlobalCommands()

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

// Log in to Discord with your client's token
client.start()

client.on(Events.ClientReady, () => {
  client.user?.setActivity(`I'm ready`, { type: ActivityType.Competing })
  commands.registerSlashCommands(client)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isAutocomplete()) {
    const command = await commands.get(interaction.commandName)!
    console.log('autocomplete')
    await command.autocomplete(interaction)
  }

  if (!interaction.isChatInputCommand()) return
  // console.log(commands)
  // console.log(interaction.commandName)

  if (interaction.isCommand()) {
    try {
      const command = await commands.get(interaction.commandName)!
      await command.run(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }
})
