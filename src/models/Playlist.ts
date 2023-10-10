import { Schema, model } from 'mongoose'
import { ITrack, TrackSchema } from './Track'

interface IPlaylist {
  title: string
  author: string
  guild: string
  tracks: ITrack[]
  description: string
  thumbnail: string
}

const PlaylistSchema = new Schema<IPlaylist>({
  title: String,
  author: String,
  guild: String,
  tracks: [TrackSchema],
  description: String,
  thumbnail: { type: String, default: null },
})

const Playlist = model('Playlist', PlaylistSchema)

export { IPlaylist, Playlist, TrackSchema }
