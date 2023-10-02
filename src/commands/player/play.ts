import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  GuildVoiceChannelResolvable,
  SlashCommandBuilder,
} from 'discord.js'
import { SlashCommand } from '@/types/SlashCommand'
import { inVoiceChannel } from '@/utils/validation/voiceChannelValidator'
import { SearchQueryType, useMainPlayer } from 'discord-player'
import { GuildQueueMeta } from '@/types/GuildQueueMeta'

export default {
  data: new SlashCommandBuilder() //
    .setName('play')
    .setDescription('play some track')
    .addStringOption((option) =>
      option.setName('query').setDescription('query').setRequired(true).setAutocomplete(true),
    ),

  autocomplete: async (interaction: AutocompleteInteraction) => {
    try {
      const query = interaction.options.getString('query')
      const returnData = []
      if (query) {
        const result = await search(interaction)
        if (result!.playlist) {
          if (result!.playlist.title.length > 100) {
            result!.playlist.title = result!.playlist.title.substring(0, 90) + '..(truncated)..'
          }
          returnData.push({ name: result!.playlist.title + ' | Playlist', value: query })
        }
        result!.tracks
          .slice(0, 8)
          .map((track) =>
            returnData.push({ name: `${track.author} - ${track.title}`.substring(0, 90), value: track.url }),
          )
      }
      await interaction.respond(returnData)
    } catch (error) {
      console.log(error)
    }
  },

  run: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })

    try {
      await inVoiceChannel(interaction)
      const searchResult = await search(interaction)
      if (!searchResult) return void interaction.followUp('Track not found :(')
      const player = useMainPlayer()!
      const member = interaction.member as GuildMember
      const channel = member.voice.channel as GuildVoiceChannelResolvable
      await player.play(channel, searchResult, {
        requestedBy: interaction.user,
        nodeOptions: {
          metadata: { interaction } as GuildQueueMeta,
          bufferingTimeout: 15000,
          leaveOnStop: false,
          leaveOnStopCooldown: 5000,
          leaveOnEnd: false,
          leaveOnEndCooldown: 15000,
          leaveOnEmpty: false,
          leaveOnEmptyCooldown: 300000,
          skipOnNoStream: true,
        },
      })

      const resEmbed = new EmbedBuilder().setColor(0x0099ff).setAuthor({
        name: `“${searchResult.tracks[0].author} - ${searchResult.tracks[0].title}” added to queue!`,
        iconURL: searchResult.tracks[0].thumbnail,
        url: searchResult.tracks[0].url,
      })

      await interaction.followUp({ embeds: [resEmbed] })
    } catch (error) {
      if (error instanceof Error) console.error(error.message)
    }
  },
} as SlashCommand

async function search(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
  const player = useMainPlayer()!
  const query = interaction.options.getString('query')
  const source = interaction.options.getString('source') as SearchQueryType
  if (source && query) {
    return player.search(query, { searchEngine: source })
  }
  if (!source && query) {
    return player.search(query)
  }
}
