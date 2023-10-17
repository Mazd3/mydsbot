import { AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { PlaylistService } from '../../services/playlistService'

// import { ITrack } from 'models/Track'

export default {
  data: new SlashCommandBuilder() //
    .setName('playlist_remove')
    .setDescription('Remove track from playlist')
    .addStringOption((option) =>
      option.setName('playlist').setDescription('Playlist name').setRequired(true).setAutocomplete(true),
    )
    .addStringOption((option) =>
      option.setName('track').setDescription('Track URL or Name').setRequired(true).setAutocomplete(true),
    ),

  autocomplete: async (interaction: AutocompleteInteraction) => {
    //
    const focusedValue = interaction.options.getFocused(true)
    const returnData: { name: string; value: string }[] = []
    /* autocomplete playlist search
      search playlists in db */
    if (focusedValue.name === 'playlist') {
      const result = await PlaylistService.getByGuildId(interaction.guildId!)
      if (focusedValue.value) {
        const filteredResult = result.filter((playlist) => playlist.title.includes(focusedValue.value.toLowerCase()))
        filteredResult.slice(0, 8).map((playlist) => {
          returnData.push({ name: playlist.title, value: playlist.id })
        })
      } else {
        result.slice(0, 8).map((playlist) => {
          returnData.push({ name: playlist.title, value: playlist.id })
        })
      }
    }
    /* autocomplete track search
      search track in db */
    if (focusedValue.name === 'track') {
      const playlist = interaction.options.getString('playlist')
      if (!playlist) return
      const result = await PlaylistService.getTracks(playlist)
      if (result && focusedValue.value) {
        const filteredResult = result.filter((track) => {
          return `${track.author} - ${track.title}`.toLowerCase().includes(focusedValue.value.toLowerCase())
        })
        filteredResult.slice(0, 8).map((track) => {
          returnData.push({ name: `${track.author} - ${track.title}`, value: track.id })
        })
      } else {
        result.slice(0, 8).map((track) => {
          returnData.push({ name: `${track.author} - ${track.title}`, value: track.id })
        })
      }
    }
    await interaction.respond(returnData)
  },

  run: async (interaction: ChatInputCommandInteraction) => {
    //

    await interaction.deferReply({ ephemeral: true })
    const playlist = interaction.options.getString('playlist')!
    const track = interaction.options.getString('track')!

    const result = await PlaylistService.remove(playlist, track)!
    console.log(result)

    await interaction.editReply({
      embeds: [
        new EmbedBuilder().setAuthor({
          name: `track “${result[0]?.track.author} - ${result[0]?.track.title}” was removed!`,
        }),
      ],
    })
  },
} as SlashCommand
