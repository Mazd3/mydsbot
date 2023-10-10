import { ActivityType } from 'discord.js'
import Bot from '../../structures/Bot'

export const once = true

export default async (client: Bot) => {
  console.log(`Ready! Logged in as ${client.user!.tag}`)
  client.user?.setActivity(`I'm ready`, { type: ActivityType.Competing })
  client.loadCommands(client)
  console.log('Working!!')
}
