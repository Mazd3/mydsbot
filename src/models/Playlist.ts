import { Schema, model, Document } from 'mongoose'
import { ITrack } from './Track'

export interface IPlaylist extends Document {
  title: string
  author: string
  guild: string
  tracks: ITrack[]
  description: string
  thumbnail: string
}

const PlaylistSchema: Schema = new Schema<IPlaylist>({
  title: String,
  author: String,
  guild: String,
  tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
  description: String,
  thumbnail: { type: String, default: null },
})

export const Playlist = model<IPlaylist>('Playlist', PlaylistSchema)
