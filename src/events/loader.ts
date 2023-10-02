import Bot from '../structs/Bot'
import { join } from 'path'
import { PlayerEvents, useMainPlayer } from 'discord-player'
import { readdirSync } from 'fs'

export default async (client: Bot) => {
  const eventCategories = (await readdirSync(__dirname)).filter(
    (element) => !element.endsWith('.js') && !element.endsWith('.ts'),
  )
  for (const category of eventCategories) {
    const eventFiles = await readdirSync(join(__dirname, category))

    for (const eventFile of eventFiles) {
      const { once, default: execute } = await import(join(__dirname, category, eventFile))
      const eventName = eventFile.split('.')[0]

      if (category == 'player') {
        const player = useMainPlayer()!
        if (once) {
          // TODO: Fix eslint disable comment
          // eslint-disable-next-line
          player.events.once(eventName as keyof PlayerEvents, (...args: any[]) => {
            execute(...args, client)
          })
        } else {
          // TODO: Fix eslint disable comment
          // eslint-disable-next-line
          player.events.on(eventName as keyof PlayerEvents, (...args: any[]) => {
            execute(...args, client)
          })
        }
      }

      if (once) {
        client.once(eventName!, (...args) => {
          execute(...args, client)
        })
      } else {
        client.on(eventName!, (...args) => {
          execute(...args, client)
        })
      }
    }
  }
  return
}
