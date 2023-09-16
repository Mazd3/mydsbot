import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import PlayerHandler from '../../handlers/playerHandler'

export default {
  data: new SlashCommandBuilder() //
    .setName('search')
    .setDescription('play some track')
    .addStringOption((option) => option.setName('query').setDescription('query').setRequired(true))
    .addStringOption((option) =>
      option
        .setName('source')
        .setDescription('source')
        .setChoices(
          { name: 'youtube', value: 'youtube' },
          { name: 'soundcloud', value: 'soundcloud' },
          { name: 'spotify', value: 'spotify' },
          { name: 'auto', value: 'auto' },
        )
        .setRequired(false),
    ),

  run: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })
    const res = await PlayerHandler.search(interaction)
    console.log(res)
    await interaction.followUp('searched')
  },
} as SlashCommand
