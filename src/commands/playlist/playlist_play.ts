import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  GuildVoiceChannelResolvable,
  SlashCommandBuilder,
} from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { PlaylistService } from '../../services/playlistService'
import { Track, useMainPlayer, useQueue } from 'discord-player'
import { GuildQueueMeta } from 'types/GuildQueueMeta'

export default {
  //
  data: new SlashCommandBuilder() //
    .setName('playlist_play')
    .setDescription('Play selected playlist')
    .addStringOption((option) =>
      option.setName('playlist').setDescription('pick playlist').setRequired(true).setAutocomplete(true),
    ),

  autocomplete: async (interaction: AutocompleteInteraction) => {
    //
    const title = interaction.options.getString('title')
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
    const result = await PlaylistService.getTracks(playlist)

    const member = interaction.member as GuildMember
    const player = useMainPlayer()!
    const channel = member.voice.channel as GuildVoiceChannelResolvable

    const tracks: Track[] = []
    result.forEach(async (track) => {
      tracks.push(new Track<Track>(player, track))
    })

    let queue = useQueue(channel)
    if (!queue) {
      queue = player.nodes.create(channel, {
        metadata: { interaction } as GuildQueueMeta,
        bufferingTimeout: 15000,
        leaveOnStop: false,
        leaveOnStopCooldown: 5000,
        leaveOnEnd: false,
        leaveOnEndCooldown: 15000,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
        skipOnNoStream: true,
      })
      await queue.connect(channel)
    }
    queue.addTrack(tracks)
    if (!queue.isPlaying()) {
      await queue.node.play()
    }
    return void interaction.editReply({
      embeds: [new EmbedBuilder().setAuthor({ name: `Playlist “some” selected!` })],
    })
  },
} as SlashCommand
