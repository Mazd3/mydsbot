import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { QueueRepeatMode, useQueue } from 'discord-player'
import { SlashCommand } from '@/types/SlashCommand'

export default {
  data: new SlashCommandBuilder() //
    .setName('loop')
    .setDescription('Pick loop mode')
    .addStringOption((option) =>
      option
        .setName('mode')
        .setDescription('Choose loop mode')
        .setRequired(true)
        .addChoices(
          { name: 'off', value: QueueRepeatMode.OFF.toString() },
          { name: 'track', value: QueueRepeatMode.TRACK.toString() },
          { name: 'queue', value: QueueRepeatMode.QUEUE.toString() },
          { name: 'autoplay', value: QueueRepeatMode.AUTOPLAY.toString() },
        ),
    ),

  run: async (interaction: ChatInputCommandInteraction) => {
    interaction.deferReply({ ephemeral: true })
    const queue = useQueue(interaction.guildId!)
    // TODO: rewrite followUp on Embeds
    if (queue) {
      switch (interaction.options.getString('mode')) {
        case '0': {
          queue.setRepeatMode(QueueRepeatMode.OFF)
          interaction.followUp('Loop mode is off')
          break
        }
        case '1': {
          queue.setRepeatMode(QueueRepeatMode.TRACK)
          interaction.followUp('Loop mode is track')
          break
        }
        case '2': {
          queue.setRepeatMode(QueueRepeatMode.QUEUE)
          interaction.followUp('Loop mode is queue')
          break
        }
        case '3': {
          queue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
          interaction.followUp('Loop mode is autoplay')
          break
        }
      }
    }
  },
} as SlashCommand
