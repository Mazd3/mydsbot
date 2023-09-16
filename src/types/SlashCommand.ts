import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export interface SlashCommand {
  data: SlashCommandBuilder
  autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
  run: (interaction: ChatInputCommandInteraction) => Promise<void>
}
