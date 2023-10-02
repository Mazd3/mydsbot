import { Interaction, Message } from 'discord.js'

export type GuildQueueMeta = {
  interaction: Interaction
  nowPlayingMessage: Message<boolean>
}
