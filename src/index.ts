import { GatewayIntentBits } from 'discord.js'
import Bot from './structures/Bot'
import { Player } from 'discord-player'
import loadEvents from './events/loader'
import 'dotenv/config'
import mongoose from 'mongoose'

// Create a new client instance
const client = new Bot({ intents: [GatewayIntentBits.Guilds] })
const player = new Player(client)

if (process.env['NODE_ENV'] === 'production') {
  process.on('unhandledRejection', (reason, promise) => {
    console.error(reason, promise)
  })
  process.on('uncaughtException', (err, origin) => {
    console.error(err, origin)
  })
}

async function start() {
  await player.extractors.loadDefault()
  await loadEvents(client)
  await mongoose
    .connect(process.env['MONGO_URI']!)
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((error) => {
      console.error(error)
    })
  client.start()
}

start()
