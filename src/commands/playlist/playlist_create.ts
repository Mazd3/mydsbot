import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { Playlist } from '../../models/Playlist'

export default {
  data: new SlashCommandBuilder() //
    .setName('playlist_create')
    .setDescription('View playlists')
    .addStringOption((option) => option.setName('title').setDescription('Enter playlist name').setRequired(true))
    .addStringOption((option) => option.setName('description').setDescription('Enter playlist description')),

  run: async (interaction: ChatInputCommandInteraction) => {
    //
    await interaction.deferReply({ ephemeral: true })

    const title = interaction.options.getString('title')
    const description = interaction.options.getString('description')

    Playlist.create({
      title: title,
      author: interaction.user.id,
      guild: interaction.guildId,
      tracks: [],
      description: description,
      thumbnail: null,
    })
      .then((playlist) => {
        console.log(playlist)
        interaction.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: `Playlist “${title}” created!` })] })
      })
      .catch((err) => {
        console.log(err)
        interaction.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: 'Something went wrong!' })] })
      })
  },
} as SlashCommand
