import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { usePlayer } from 'discord-player'
import { SlashCommand } from '../../types/SlashCommand'
import { inVoiceChannel, sameVoiceChannel } from '../../utils/validation/voiceChannelValidator'

export default {
  data: new SlashCommandBuilder() //
    .setName('skip')
    .setDescription('Skip current track'),

  run: async (interaction: ChatInputCommandInteraction) => {
    //
    await interaction.deferReply({ ephemeral: true })

    try {
      inVoiceChannel(interaction)
      sameVoiceChannel(interaction)

      const playerNode = usePlayer(interaction.guild!.id)
      const currentTrack = playerNode?.queue.currentTrack

      if (!currentTrack) {
        return void interaction.followUp('No music is being played!')
      }

      //
      playerNode.skip()

      interaction.followUp({
        embeds: [
          new EmbedBuilder().setColor(0x0099ff).setAuthor({
            name: `“${currentTrack?.author} - ${currentTrack?.title}” skipped!`,
            iconURL: currentTrack!.thumbnail!,
          }),
        ],
        ephemeral: true,
      })
    } catch (error) {
      console.log(error)
    }
  },
} as SlashCommand
