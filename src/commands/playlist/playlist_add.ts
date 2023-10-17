import { AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { useMainPlayer } from 'discord-player'
import { SlashCommand } from '../../types/SlashCommand'
import { PlaylistService } from '../../services/playlistService'
import { Track } from '@prisma/client'

export default {
  data: new SlashCommandBuilder() //
    .setName('playlist_add')
    .setDescription('Add track to playlist')
    .addStringOption((option) =>
      option.setName('playlist').setDescription('Playlist name').setRequired(true).setAutocomplete(true),
    )
    .addStringOption((option) =>
      option.setName('track').setDescription('Track URL or Name').setRequired(true).setAutocomplete(true),
    ),

  autocomplete: async (interaction: AutocompleteInteraction) => {
    //

    const focusedValue = interaction.options.getFocused(true)
    const returnData = []

    /* autocomplete playlist search
    search playlists in db */
    if (focusedValue.name === 'playlist') {
      const result = await PlaylistService.getByGuildId(interaction.guildId!)
      if (focusedValue.value) {
        result.filter((playlist) => playlist.title.includes(focusedValue.value))
      }
      result.map((playlist) => {
        returnData.push({ name: playlist.title, value: playlist.id.toString() })
      })
    }

    /* autocomplete track search
    search track with player.search() */
    if (focusedValue.name === 'track' && focusedValue.value) {
      const player = useMainPlayer()!
      const result = await player.search(focusedValue.value)
      if (result.playlist) {
        returnData.push({ name: result.playlist.title.substring(0, 90) + ' | Playlist', value: result.playlist.url })
      }
      if (result.tracks) {
        result.tracks
          .slice(0, 8)
          .map((track) =>
            returnData.push({ name: `${track.author} - ${track.title}`.substring(0, 90), value: track.url }),
          )
      }
    }
    await interaction.respond(returnData)
  },

  run: async (interaction: ChatInputCommandInteraction) => {
    //
    await interaction.deferReply({ ephemeral: true })

    const player = useMainPlayer()!
    const playlistId = interaction.options.getString('playlist')!
    const trackOption = interaction.options.getString('track')!
    const track = (await player.search(trackOption)).tracks[0]! as unknown as Track

    const res = await PlaylistService.add(playlistId, track)

    await interaction.editReply({
      embeds: [
        new EmbedBuilder().setAuthor({
          name: `“${track.author} - ${track.title}” - added to - “${res.title}”`,
          iconURL: track.thumbnail,
          url: track.url,
        }),
      ],
    })
  },
} as SlashCommand
