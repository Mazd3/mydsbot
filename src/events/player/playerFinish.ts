import { GuildQueue } from 'discord-player'
import { GuildQueueMeta } from '../../types/GuildQueueMeta'

export default async (queue: GuildQueue<GuildQueueMeta>) => {
  try {
    queue.metadata.nowPlayingMessage ? await queue.metadata.nowPlayingMessage.delete() : null
  } catch (error) {}
}
