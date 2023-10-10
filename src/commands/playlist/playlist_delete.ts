import { AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { Playlist } from '../../models/Playlist'

export default {
  //
  data: new SlashCommandBuilder() //
    .setName('playlist_delete')
    .setDescription('Delete selected playlist')
    .addStringOption((option) =>
      option.setName('title').setDescription('Playlist title').setRequired(true).setAutocomplete(true),
    ),

  autocomplete: async (interaction: AutocompleteInteraction) => {
    //
    const title = interaction.options.getString('title')
    const returnData: { name: string; value: string }[] = []

    /* autocomplete playlist search
        search playlists in db */

    if (title) {
      const result = await Playlist.find({
        author: interaction.user.id,
        guild: interaction.guildId,
        title: { $regex: title, $options: 'i' },
      })
      result.map((playlist) => {
        returnData.push({
          name: `${playlist.title} - ${playlist.description}` as string,
          value: playlist.title as string,
        })
      })
    } else {
      const result = await Playlist.find({
        author: interaction.user.id,
        guild: interaction.guildId,
      })
      result.map((playlist) => {
        returnData.push({
          name: `${playlist.title} - ${playlist.description}` as string,
          value: playlist.title as string,
        })
      })
    }

    await interaction.respond(returnData)
  },

  run: async (interaction: ChatInputCommandInteraction) => {
    //
    await interaction.deferReply({ ephemeral: true })

    const title = interaction.options.getString('title')
    const playlist = await Playlist.findOneAndDelete({ title: title })

    if (!playlist)
      return void interaction.editReply({
        embeds: [new EmbedBuilder().setAuthor({ name: 'Playlist not found' })],
      })

    return void interaction.editReply({
      embeds: [new EmbedBuilder().setAuthor({ name: `Playlist “${title}” deleted!` })],
    })
  },
} as SlashCommand
