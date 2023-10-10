import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { SlashCommand } from '../../types/SlashCommand'
import { inVoiceChannel, sameVoiceChannel } from '../../utils/validation/voiceChannelValidator'

export default {
  data: new SlashCommandBuilder() //
    .setName('leave')
    .setDescription('Stop the music ant leave from the voice channel'),

  run: async (interaction: ChatInputCommandInteraction) => {
    //
    await interaction.deferReply({ ephemeral: true })

    inVoiceChannel(interaction)
    sameVoiceChannel(interaction)

    const queue = useQueue(interaction.guild!.id)

    if (!queue) return void interaction.followUp('No music is being played!')

    queue.delete()

    return void interaction.followUp({
      embeds: [new EmbedBuilder().setColor(0x0099ff).setAuthor({ name: `Music stopped!` })],
    })
  },
} as SlashCommand
