import { EmbedBuilder } from 'discord.js'
import { GuildQueue, Track } from 'discord-player'
import { GuildQueueMeta } from '../../types/GuildQueueMeta'

export default async (queue: GuildQueue<GuildQueueMeta>, track: Track) => {
  try {
    // queue.metadata.nowPlayingMessage ? await queue.metadata.nowPlayingMessage.delete() : null
    const metadata = queue.metadata
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setAuthor({ name: `${track.author} - ${track.title}`, url: track.url })
      .setThumbnail(track.thumbnail)
      .setFields({
        name: `duration: ${track.duration}`,
        value: `requested by: <@${metadata.interaction.user.id}>`,
      })
      .setFooter({ text: track.playlist ? `playlist: ${track.playlist.title}` : 'asd' })
    queue.metadata.nowPlayingMessage = await metadata.interaction.channel!.send({ embeds: [embed] })
  } catch (error) {}
}
