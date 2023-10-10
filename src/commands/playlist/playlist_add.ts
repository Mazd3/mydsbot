import { AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { useMainPlayer } from 'discord-player'
import { SlashCommand } from '../../types/SlashCommand'
import { Playlist } from '../../models/Playlist'
import { ITrack } from 'models/Track'

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
      if (focusedValue.value) {
        const result = await Playlist.find({
          author: interaction.user.id,
          guild: interaction.guildId,
          title: { $regex: focusedValue.value, $options: 'i' },
        })
        result.map((playlist) => {
          returnData.push({ name: playlist.title as string, value: playlist.title as string })
        })
      } else {
        const result = await Playlist.find({
          author: interaction.user.id,
          guild: interaction.guildId,
        })
        result.map((playlist) => {
          returnData.push({ name: playlist.title as string, value: playlist.title as string })
        })
      }
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
    const playlistOption = interaction.options.getString('playlist')!
    const trackOption = interaction.options.getString('track')!
    const track = (await player.search(trackOption)).tracks[0]!

    const trackDTO: ITrack = {
      _id: track.id,
      title: track.title,
      author: track.author,
      url: track.url,
      duration: track.duration,
      thumbnail: track.thumbnail,
    }

    /* find playlist in db */

    Playlist.findOneAndUpdate({ title: playlistOption }, { $push: { tracks: trackDTO } })
      .then(async (res) => {
        //
        if (!res) {
          await interaction.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: 'There is no playlist with that name' })],
          })
        } else {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder().setAuthor({
                name: `“${track.author} - ${track.title}” added to “${playlistOption}”`,
                iconURL: track.thumbnail,
                url: track.url,
              }),
            ],
          })
        }
      })
      .catch(async (error) => {
        if (error instanceof Error) {
          await interaction.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: 'Something went wrong :(' })],
          })
        }
      })
  },
} as SlashCommand
