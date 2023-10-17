import { AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { PlaylistService } from '../../services/playlistService'

export default {
  //
  data: new SlashCommandBuilder() //
    .setName('playlist_delete')
    .setDescription('Delete selected playlist')
    .addStringOption((option) =>
      option.setName('playlist').setDescription('Playlist title').setRequired(true).setAutocomplete(true),
    ),

  autocomplete: async (interaction: AutocompleteInteraction) => {
    //
    const title = interaction.options.getString('playlist')
    const returnData: { name: string; value: string }[] = []

    /* autocomplete playlist search
        search playlists in db */

    const result = await PlaylistService.getByGuildId(interaction.guildId!)
    if (title) {
      const filteredResult = result.filter((playlist) => playlist.title.includes(title.toLowerCase()))
      filteredResult.map((playlist) => {
        returnData.push({ name: playlist.title, value: playlist.id })
      })
    } else {
      result.map((playlist) => {
        returnData.push({ name: playlist.title, value: playlist.id })
      })
    }

    await interaction.respond(returnData)
  },
  run: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })
    const playlist = interaction.options.getString('playlist')!
    console.log(playlist)
    const result = await PlaylistService.delete(playlist)
    console.log(result)

    await interaction.editReply({
      embeds: [new EmbedBuilder().setAuthor({ name: `Playlist “${result[1].title}” deleted!` })],
    })
  },
} as SlashCommand
