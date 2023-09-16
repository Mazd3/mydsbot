import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import PlayerHandler from '../../handlers/playerHandler'

export default {
  data: new SlashCommandBuilder() //
    .setName('skip')
    .setDescription('Skip current track'),

  run: async (interaction: ChatInputCommandInteraction) => {
    await PlayerHandler.skip(interaction)
  },
} as SlashCommand
