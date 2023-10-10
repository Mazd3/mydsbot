import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  GuildVoiceChannelResolvable,
  SlashCommandBuilder,
} from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { inVoiceChannel } from '../../utils/validation/voiceChannelValidator'
import { useMainPlayer, useQueue } from 'discord-player'
import { GuildQueueMeta } from '../../types/GuildQueueMeta'

export default {
  data: new SlashCommandBuilder() //
    .setName('play')
    .setDescription('play some track')
    .addStringOption((option) =>
      option.setName('query').setDescription('query').setRequired(true).setAutocomplete(true),
    ),

  autocomplete: async (interaction: AutocompleteInteraction) => {
    const query = interaction.options.getString('query')
    const returnData = []
    const player = useMainPlayer()!

    if (query) {
      const result = await player.search(query)
      if (result.playlist) {
        returnData.push({ name: result!.playlist.title.substring(0, 90) + ' | Playlist', value: result.playlist.url })
      }
      result!.tracks
        .slice(0, 8)
        .map((track) =>
          returnData.push({ name: `${track.author} - ${track.title}`.substring(0, 90), value: track.url }),
        )
    }
    await interaction.respond(returnData)
  },

  run: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })
    await inVoiceChannel(interaction)

    const player = useMainPlayer()!
    const query = interaction.options.getString('query')!
    const searchResult = await player.search(query)
    if (!searchResult) return void interaction.followUp('Track not found :(')
    const member = interaction.member as GuildMember
    const channel = member.voice.channel as GuildVoiceChannelResolvable

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

    queue.addTrack(searchResult.tracks)

    if (!queue.isPlaying()) {
      await queue.node.play()
    }

    if (searchResult.hasPlaylist()) {
      return void interaction.editReply({
        embeds: [
          new EmbedBuilder().setColor(0x0099ff).setAuthor({
            name: `Playlist “${searchResult.playlist!.title}” added to queue!`,
            iconURL: searchResult.playlist!.thumbnail,
            url: searchResult.playlist!.url,
          }),
        ],
      })
    } else {
      return void interaction.editReply({
        embeds: [
          new EmbedBuilder().setColor(0x0099ff).setAuthor({
            name: `Track “${searchResult.tracks[0]?.author} - ${searchResult.tracks[0]?.title}” added to queue!`,
            iconURL: searchResult.tracks[0]!.thumbnail,
            url: searchResult.tracks[0]!.url,
          }),
        ],
      })
    }
  },
} as SlashCommand
