import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types/SlashCommand'
import { Playlist } from '../../models/Playlist'

export default {
  data: new SlashCommandBuilder() //
    .setName('playlists')
    .setDescription('View playlists'),

  run: async (interaction: ChatInputCommandInteraction) => {
    //
    const res: string[] = []

    await Playlist.find().then((playlists) => {
      playlists.forEach((playlist) => {
        console.log(playlist)
        res.push(playlist.title as string)
      })
    })

    interaction.reply(res.join(' '))
  },
} as SlashCommand
