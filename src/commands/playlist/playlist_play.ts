import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  GuildVoiceChannelResolvable,
  SlashCommandBuilder,
} from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { Playlist } from '../../models/Playlist'
import { Track, useMainPlayer, useQueue } from 'discord-player'
import { ITrack } from 'models/Track'
import { GuildQueueMeta } from 'types/GuildQueueMeta'

export default {
  //
  data: new SlashCommandBuilder() //
    .setName('playlist_play')
    .setDescription('Play selected playlist')
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
    const playlist = await Playlist.findOne({ title: title }, { tracks: 1 })
    const member = interaction.member as GuildMember
    const player = useMainPlayer()!
    const channel = member.voice.channel as GuildVoiceChannelResolvable

    if (!playlist)
      return void interaction.editReply({
        embeds: [new EmbedBuilder().setAuthor({ name: 'Playlist not found' })],
      })

    if (!playlist?.tracks.length)
      return void interaction.editReply({
        embeds: [new EmbedBuilder().setAuthor({ name: 'Playlist is empty' })],
      })

    const tracks: Track<ITrack>[] = []
    await playlist.tracks.forEach(async (track) => {
      tracks.push(new Track<ITrack>(player, track))
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
      embeds: [new EmbedBuilder().setAuthor({ name: `Playlist “${title}” selected!` })],
    })
  },
} as SlashCommand
