import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { useQueue } from 'discord-player'

export default {
  data: new SlashCommandBuilder() //
    .setName('shuffle')
    .setDescription('Shuffle queue'),

  run: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })
    try {
      const queue = useQueue(interaction.guild!.id)
      queue?.tracks.shuffle()
      await interaction.followUp({
        embeds: [
          new EmbedBuilder().setColor(0x0099ff).setAuthor({
            name: `Queue shuffled!`,
          }),
        ],
      })
    } catch (error) {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder().setColor(0xaa0000).setAuthor({
            name: `Something went wrong!`,
          }),
        ],
      })
    }
  },
} as SlashCommand
