import { SearchQueryType, SearchResult, useMainPlayer, usePlayer } from 'discord-player'
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  GuildVoiceChannelResolvable,
} from 'discord.js'

export default class PlayerHandler {
  static async play(interaction: ChatInputCommandInteraction | AutocompleteInteraction, searchResult: SearchResult) {
    const player = useMainPlayer()!
    const member = interaction.member as GuildMember
    const channel = member.voice.channel as GuildVoiceChannelResolvable
    await player.play(channel, searchResult, {
      nodeOptions: {
        metadata: interaction.channel,
        bufferingTimeout: 15000,
        leaveOnStop: true,
        leaveOnStopCooldown: 5000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 15000,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
        skipOnNoStream: true,
      },
    })
  }
  static async skip(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.editReply('You are not in a voice channel!')
    }

    if (
      interaction.guild?.members.me?.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    ) {
      return void interaction.editReply('You are not in my voice channel!')
    }

    const playerNode = usePlayer(interaction.guild!.id)

    if (!playerNode?.queue) {
      return void interaction.followUp('No music is being played!')
    }

    const currentTrack = playerNode.queue.currentTrack
    const success = playerNode.skip()
    await interaction.followUp({
      content: success ? `Skipped **${currentTrack}**!` : 'Something went wrong!',
    })
    return
  }

  static async search(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
    const player = useMainPlayer()!
    const query = interaction.options.getString('query')
    const source = interaction.options.getString('source') as SearchQueryType
    if (source && query) {
      const searchResult = await player.search(query, { searchEngine: source })
      return searchResult
    }
    if (!source && query) {
      const searchResult = await player.search(query)
      return searchResult
    }
  }
}
