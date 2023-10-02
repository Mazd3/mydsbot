import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from 'discord.js'
export async function inVoiceChannel(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
    await interaction.followUp({
      embeds: [new EmbedBuilder().setColor(0xaa0000).setAuthor({ name: 'You are not in a voice channel!' })],
    })
    throw new Error('User not in voice channel.')
  }
}

export async function sameVoiceChannel(interaction: ChatInputCommandInteraction): Promise<void> {
  if (
    interaction.member instanceof GuildMember &&
    interaction.guild?.members.me?.voice.channelId &&
    interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
  ) {
    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(0xaa0000)
          .setAuthor({ name: 'You need to be in the same voice channel as me to perform this action.' }),
      ],
    })
    throw new Error('User not in the same voice channel as bot')
  }
}
