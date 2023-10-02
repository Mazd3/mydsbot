import { GatewayIntentBits } from 'discord.js'
import Bot from './structs/Bot'
import { Player } from 'discord-player'
import loadEvents from './events/loader'

// Create a new client instance
const client = new Bot({ intents: [GatewayIntentBits.Guilds] })
const player = new Player(client)

player.extractors.loadDefault()
loadEvents(client).then(() => {
  client.start()
})
