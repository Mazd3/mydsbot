import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'

export default {
  data: new SlashCommandBuilder() //
    .setName('ping')
    .setDescription('ping.description'),

  run: async (interaction: ChatInputCommandInteraction) => {
    interaction.reply({ content: `pong! `, ephemeral: true }).catch(console.error)
  },
} as SlashCommand
