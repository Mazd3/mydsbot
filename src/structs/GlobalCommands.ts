import { Client, Collection, REST, Routes, SlashCommandBuilder } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { SlashCommand } from '../types/SlashCommand'

export default class GlobalCommands {
  //
  private commands: Collection<string, SlashCommand> = new Collection()
  private data: SlashCommandBuilder[] = []

  public get(name: string) {
    return this.commands.get(name)
  }

  public async registerSlashCommands(client: Client): Promise<void> {
    //
    const rest = new REST({ version: '10' }).setToken(client.token!) // idk what this is "!"
    const commandFolders = readdirSync(join(__dirname, '..', 'commands'))

    for (const folder of commandFolders) {
      const commandFiles = readdirSync(join(__dirname, '..', 'commands', folder))

      for (const file of commandFiles) {
        const command = await import(join(__dirname, '..', 'commands', folder, file))
        this.data.push(command.default.data)
        this.commands.set(command.default.data.name, command.default)
      }
    }

    await rest.put(Routes.applicationCommands(client.user!.id), { body: this.data })
  }
}
