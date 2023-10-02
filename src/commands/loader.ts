import { Client, Collection, REST, Routes, SlashCommandBuilder } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { SlashCommand } from '../types/SlashCommand'

export default async (client: Client) => {
  const rest = new REST({ version: '10' }).setToken(client.token ?? '')
  const commandCategories = (await readdirSync(__dirname)).filter(
    (element) => !element.endsWith('.js') && !element.endsWith('.ts'),
  )

  const commands = new Collection<string, SlashCommand>()
  const data: SlashCommandBuilder[] = []

  for (const folder of commandCategories) {
    const commandFiles = readdirSync(join(__dirname, folder))

    for (const file of commandFiles) {
      const command = await import(join(__dirname, folder, file))
      commands.set(command.default.data.name, command.default)
      data.push(command.default.data)
    }
  }
  await rest.put(Routes.applicationCommands(client.user!.id), { body: data })

  return commands
}
