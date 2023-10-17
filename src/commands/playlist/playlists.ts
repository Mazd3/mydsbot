import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { PlaylistService } from '../../services/playlistService'

export default {
  data: new SlashCommandBuilder() //
    .setName('playlists')
    .setDescription('View playlists'),

  run: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })

    const res1 = await PlaylistService.getTracks('clnoj74f00000aa80hg4mzgpz')
    const res2 = await PlaylistService.getTracks('clnoj79gh0001aa80qhliyjel')

    console.log(res1)
    console.log(res2)

    await interaction.editReply({
      embeds: [new EmbedBuilder().setAuthor({ name: 'Playlists' }).setDescription('dd')],
    })
  },
} as SlashCommand
