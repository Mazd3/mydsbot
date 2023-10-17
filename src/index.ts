import { GatewayIntentBits } from 'discord.js'
import Bot from './structures/Bot'
import { Player } from 'discord-player'
import loadEvents from './events/loader'
import 'dotenv/config'

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
  client.start()
}

start()

//   author: { name: 'DROELOE', url: null },
//   description: 'The Art Of Change',
//   thumbnail: 'https://i.scdn.co/image/ab67616d0000b27377a41c5f472cf7c934384135',
//   type: 'album',
//   source: 'spotify',
//   id: '2w5ieF6SZV9flk1gkOgzdK',
//   url: 'https://open.spotify.com/album/2w5ieF6SZV9flk1gkOgzdK',
//   title: 'The Art Of Change'
