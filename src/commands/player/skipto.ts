import { SlashCommand } from '../../types/SlashCommand'
import { inVoiceChannel, sameVoiceChannel } from '../../utils/validation/voiceChannelValidator'
import { usePlayer, useQueue } from 'discord-player'
import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('skip_to')
    .setDescription('Skips to selected track')
    .addNumberOption((option) =>
      option.setName('track').setDescription('track').setRequired(true).setAutocomplete(true),
    ),
  autocomplete: async (interaction: AutocompleteInteraction) => {
    try {
      const returnData: ApplicationCommandOptionChoiceData<string | number>[] | { name: string; value: string }[] = []
      const queue = useQueue(interaction.guild!.id)
      if (queue) {
        queue.tracks.map((track, index) =>
          returnData.push({
            name: `${index} | ${track.author} - ${track.title}`.substring(0, 90),
            value: index.toString(),
          }),
        )
      }
      // TODO: add skip to another value(24+)
      await interaction.respond(returnData.slice(0, 24))
    } catch (error) {
      console.log(error)
    }
  },
  run: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })
    try {
      inVoiceChannel(interaction)
      sameVoiceChannel(interaction)

      const playerNode = usePlayer(interaction.guild!.id)
      const index = interaction.options.getNumber('track')
      if (playerNode && typeof index === 'number') {
        playerNode.skipTo(index)
        return void interaction.followUp({
          embeds: [
            new EmbedBuilder().setColor(0x0099ff).setAuthor({
              name: `“${playerNode.queue.currentTrack?.author} - ${playerNode.queue.currentTrack?.title}” skipped!`,
              iconURL: playerNode.queue.currentTrack!.thumbnail,
            }),
          ],
          ephemeral: true,
        })
      }
      return void interaction.followUp('No music is being played!')
    } catch (error) {
      console.log(error)
    }
  },
} as SlashCommand
