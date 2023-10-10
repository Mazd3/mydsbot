import { Interaction } from 'discord.js'
import Bot from '../../structures/Bot'

export default async (interaction: Interaction, client: Bot) => {
  if (interaction.isAutocomplete()) {
    const command = await client.commands.get(interaction.commandName)!
    console.log('autocomplete')
    await command.autocomplete(interaction)
  }

  if (!interaction.isChatInputCommand()) return

  if (interaction.isCommand()) {
    try {
      const command = await client.commands.get(interaction.commandName)!
      await command.run(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }
}
