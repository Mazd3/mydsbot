import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { PlaylistService } from '../../services/playlistService'

export default {
  data: new SlashCommandBuilder() //
    .setName('playlist_create')
    .setDescription('View playlists')
    .addStringOption((option) => option.setName('title').setDescription('Enter playlist name').setRequired(true))
    .addStringOption((option) => option.setName('description').setDescription('Enter playlist description')),

  run: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })

    const title = interaction.options.getString('title')!
    const author = interaction.user.id!
    const guild = interaction.guildId!

    const res = await PlaylistService.create({ title, author, guild })

    await interaction.editReply({
      embeds: [new EmbedBuilder().setAuthor({ name: `Playlist “${res.title}” created!` })],
    })
  },
} as SlashCommand
