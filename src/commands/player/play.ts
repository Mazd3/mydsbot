import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import PlayerHandler from '../../handlers/playerHandler'

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
    if (query) {
      const result = await PlayerHandler.search(interaction)
      if (result!.playlist) {
        if (result!.playlist.title.length > 100) {
          result!.playlist.title = result!.playlist.title.substring(0, 90) + '..(truncated)..'
        }
        returnData.push({ name: result!.playlist.title + ' | Playlist', value: query })
      }
      result!.tracks
        .slice(0, 6)
        .map((track) =>
          returnData.push({ name: `${track.author} - ${track.title}`.substring(0, 90), value: track.url }),
        )
    }
    await interaction.respond(returnData)
  },

  run: async (interaction: ChatInputCommandInteraction) => {
    const SearchResult = await PlayerHandler.search(interaction)
    if (!SearchResult) return void interaction.followUp('Track not found :(')
    await PlayerHandler.play(interaction, SearchResult)
  },
} as SlashCommand
